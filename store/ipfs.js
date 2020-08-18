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
            let bookHash, imgHash, metadataHash
            //uploading book content to ipfs
            await ipfs.files.add(content.file, (err, files) => {
                if (err) { throw err }
                console.log(files)
                bookHash = files[0].hash
                //uploading book cover image to ipfs
                ipfs.files.add(content.image, (err, files) => {
                    if (err) { throw err }
                    console.log(files)
                    imgHash = files[0].hash
                    console.log(bookHash)
                    console.log(imgHash)
                    const metadata = JSON.stringify({
                        title: content.title,
                        imageHash: imgHash
                    })
                    console.log(metadata)
                    let metadataBuffer = Buffer.from(metadata)
                    console.log(metadataBuffer)
                    let temp = JSON.parse(metadataBuffer.toString())
                    console.log(temp)
                    ipfs.files.add(metadataBuffer, (err, files) => {
                        if (err) { throw err }
                        console.log(files)
                        metadataHash = files[0].hash
                        console.log(metadataHash)
                        dispatch('web3/publish', {content, bookHash, metadataHash}, { root: true })
                    })
                })
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
        },
        getContent: async({state, commit, dispatch}, bookHash) => {
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
                }
            })
        },
        getMetadata: async({state, commit, dispatch}, metadataHash) => {
            // let metadata
            // let ipfsPath = `https://ipfs.io/ipfs/${metadataHash}`
            // console.log(ipfsPath);
                // await ipfs.cat(metadataHash, function(err, res) {
                //   if(err || !res) return console.error("ipfs cat error", err, res);
                //   if(res.readable) {
                //     console.error('unhandled: cat result is a pipe', res);
                //   } else {
                //     console.log(res)
                //     metadata = JSON.parse(res.toString())
                //     console.log(metadata)
                //     console.log(metadata.title)
                //     console.log(metadata.image)
                //     return {title: metadata.title, imgHash: metadata.image}
                //     // commit('getFile', metadata)
                //   }
                // })
                return ipfs.cat(metadataHash)
        },
    }
}