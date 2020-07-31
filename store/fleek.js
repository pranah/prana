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
            state.publishedContent = contentList;
        },
        collectContent: (state, content) => {
            state.collectContent = []
            state.collectedContent.push(content);
        },
        collectableContent: (state, content) => {
            state.collectableContent = content;
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
        getContent: async ({}, content) => {
            console.log(content.title);
            const bucket = content.title;
            
            const dirRes = await state().client.listDirectories({
                bucket,
            });
            
            const entriesList = dirRes.getEntriesList();
            
            const openFileRes = await state().client.openFile({
                bucket,
                path: entriesList[0].getPath(),
            });
            
            const location = openFileRes.getLocation();
            console.log(location); // "/path/to/the/copied/file"
        },
    }
}