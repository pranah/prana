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
            //could add more properties if needed
            let isbn
            let price
            let publisher
            let metadata
            let transactionCut
            for(let i=0; i<contentList.length; i++){
                isbn = contentList[i].returnValues.isbn
                price = contentList[i].returnValues.price
                publisher = contentList[i].returnValues.publisher
                metadata = contentList[i].returnValues.bookCoverAndDetails
                transactionCut = contentList[i].returnValues.transactionCut
                state.publishedContent.push({isbn, publisher, price, transactionCut, metadata});
            }
        },
        collectContent: (state, token) => {
            let tokenId = token.tokenId
            let bucket = token.bucket
            let isbn = token.content[0]
            let metadata = token.content[1]
            let copyNumber = token.content[2]
            let isUpForResale = token.content[3]
            state.collectedContent.push({tokenId, bucket, isbn, metadata, copyNumber, isUpForResale})
            console.log(state.collectedContent)
        },
        collectableContent: (state, contentList) => {
            //could add more properties if needed
            let isbn
            let price
            let publisher
            let metadata
            let transactionCut
            for(let i=0; i<contentList.length; i++){
                isbn = contentList[i].returnValues.isbn
                price = contentList[i].returnValues.price
                publisher = contentList[i].returnValues.publisher
                metadata = contentList[i].returnValues.bookCoverAndDetails
                transactionCut = contentList[i].returnValues.transactionCut
                state.collectableContent.push({isbn, publisher, price, transactionCut, metadata});
            }
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
        getContent: async ({state}, title) => { 
            const bucket = title;           
            const dirRes = await state.client.listDirectories({
                bucket,
            });
            const entriesList = dirRes.getEntriesList();

            const openFileRes = await state.client.openFile({
                bucket,
                path: entriesList[0].getPath(),
            });
            console.log(openFileRes);
            const location = openFileRes.getLocation();
            console.log(location); // "/path/to/the/copied/file"
        },
        shareBucket: ({state, dispatch}, bucket) => {
            state.client.shareBucket({ bucket: bucket.bucket })
            .then((res) => {
                const threadInfo = res.getThreadinfo();
                const sharedBucket = JSON.stringify({
                    key: threadInfo.getKey(),
                    addresses: threadInfo.getAddressesList(),
                    title: bucket.bucket
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
                dispatch('getContent', thread.title)
            })
            .catch((err) => {
                if(err.code == 2) {
                    // bucket already added
                    dispatch('getContent', thread.title)
                } else {
                    console.error(err);
                }
            });
        },

    }
}