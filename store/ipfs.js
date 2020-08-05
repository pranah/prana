// import ipfsClient from 'ipfs-http-client'
import ipfsAPI from 'ipfs-api'
import ipfs from '../util/ipfs'
import Vue from 'vue';


export default {
    state: () => ({
    }),
    mutations: {
        
    },
    actions: {
        publish: async({state, commit, dispatch}, content) => {
            console.log(content)
            let hash
            await ipfs.files.add(content.file, (err, files) => {
                if (err) { throw err }
                console.log(files)
                hash = files[0].hash
                dispatch('web3/publish', {content, hash}, { root: true })
            })
        },
        requestContent: async({state, commit, dispatch}, content) => {
            let ipfsPath = 'https://ipfs.io/ipfs/'+ content.hash
            console.log(ipfsPath)
        }  
    }
}