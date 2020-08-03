import { SpaceClient } from '@fleekhq/space-client';

export default {
    // strict: false,
    state: () => ({
        collectorPageSwitch: false,
        publisherPageSwitch: false,
        client: null,
        publishedContent: [],
        collectedContent: [],
        collectableContent: [],
        resaleTokens: [],
    }),
    mutations: {
        initSpaceClient: (state, client) => {
            state.client = client;
        },
        publisherPageSwitchFlip: (state, page) => {
            state.publisherPageSwitch = page;
        },
        collectorPageSwitchFlip: (state, page) => {
            state.collectorPageSwitch = page;
        },
        publishedContent: (state, contentList) => {
            state.publishedContent = contentList
        },
        collectableContent: (state, contentList) => {
            state.collectableContent = contentList
        },
        collectContent: (state, token) => {
            state.collectedContent.push(token)
            console.log(state.collectedContent)
        },
        resaleTokens: (state, token) => {
            state.resaleTokens.push(token)
            console.log(state.resaleTokens)
        },
        loadingContent: (state, content) => {
            state.collectedContent[state.collectedContent.indexOf(content)].loadingContent = !state.collectedContent[state.collectedContent.indexOf(content)].loadingContent
        },
        
    },
    actions: {
        initSpaceClient: ({state, commit}) => {
            const client = new SpaceClient({
                url: `http://localhost:9998`
            });
            commit('initSpaceClient', client);
        },
        publish: ({ state, commit, dispatch }, content) => {
            console.log(content);
            state.client
            .createBucket({ slug: content.title})
            .then((res) => {
                const stream = state.client.addItems({
                bucket: content.title,
                targetPath: '/', // path in the bucket to be saved
                sourcePaths: [content.file]
                });
            
                stream.on('data', (data) => {
                console.log('data: ', data);
                });
            
                stream.on('error', (error) => {
                console.error('error: ', error);
                });
            
                stream.on('end', () => {
                    state.client
                    .shareBucket({ bucket: content.title })
                    .then((res) => {
                        const bucket = res.getThreadinfo();
                        dispatch('web3/publish', {content, bucket}, { root: true });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                });
            })
            .catch((err) => {
                if(err.message == "Http response at 400 or 500 level"){
                console.log("Please connect a Space Daemon Instance");
                } else {
                console.error(err);
                }
            });
        },
        getContent: async ({state}, received) => { 
            const bucket = received.bucketName;     
            const dirRes = await state.client.listDirectories({
                bucket,
            });
            const entriesList = dirRes.getEntriesList();

            const openFileRes = await state.client.openFile({
                bucket,
                path: entriesList[0].getPath(),
            });
            const location = openFileRes.getLocation();
            const index = state.collectedContent.findIndex(function(content) {
                return content.tokenId == received.tokenId
            })
            state.collectedContent[index].pathToFile = location
            state.collectedContent[index].loadingContent = false
        },
        shareBucket: ({state, dispatch}, bucket) => {
            state.client.shareBucket({ bucket: bucket.bucket })
            .then((res) => {
                const threadInfo = res.getThreadinfo();
                const sharedBucket = JSON.stringify({
                    key: threadInfo.getKey(),
                    addresses: threadInfo.getAddressesList(),
                    title: bucket.bucket,
                    tokenId: bucket.tokenId
                })
                dispatch('libp2p/sendSharedBucket', {requester: bucket.requester, package: sharedBucket}, {root: true})
            })
            .catch((err) => {
              console.error(err);
            });
        },
        joinBucket: ({state, dispatch}, thread) => {
            state.client
            .joinBucket({
                bucket: thread.title,
                threadInfo: {
                    key: thread.key,
                    addresses: thread.addresses,
                }
            })
            .then((res) => {
                dispatch('getContent', {bucketName: thread.title, tokenId: thread.tokenId})
            })
            .catch((err) => {
                if(err.code == 2) {
                    // bucket already added
                    dispatch('getContent', {bucketName: thread.title, tokenId: thread.tokenId})
                } else {
                    console.error(err);
                }
            });
        },

    }
}