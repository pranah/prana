import ipfsAPI from 'ipfs-api'
import ipfs from '../util/ipfs'
import Vue from 'vue';
import pipe from 'it-pipe'
if (process.server) {
    const fs = require('fs');
    // some code with fs
  }


export default {
    state: () => ({
        textFile: null
    }),
    mutations: {
        getFile: (state, file) => {
            state.textFile = file
            console.log(typeof(state.textFile))
            console.log('getFile')
        }
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
        requestContent: async({state, commit, dispatch}, hash) => {
            let textFile
            let ipfsPath = `https://ipfs.io/ipfs/${hash}`
            console.log(ipfsPath);
                ipfs.cat(hash, function(err, res) {
                  if(err || !res) return console.error("ipfs cat error", err, res);
                  if(res.readable) {
                    console.error('unhandled: cat result is a pipe', res);
                  } else {
                    console.log(res)
                    textFile = res.toString()
                    commit('getFile', textFile)

                    // console.log(Buffer(res))
                    // let json = JSON.stringify(res)
                    // console.log(json)
                    // let bufferOriginal = Buffer.from(JSON.parse(json).data);
                    // console.log(bufferOriginal) 
                    // console.log(bufferOriginal.toString('utf8'))
                  }
                })
            
  

        
        }  
    }
}