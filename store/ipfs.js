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
        textFile: null,
        content: null
    }),
    mutations: {
        getFile: (state, content) => {
            state.textFile = content.bookContent
            state.content = content
            // console.log(state.textFile)
            console.log(state.content)
            console.log('getFile')
        },
        clearBookContent: (state) => {
            state.textFile = null
            state.content = null
            console.log(state.textFile)
            console.log(state.content)
            console.log('clearBookContent')
        },
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
                    //uploading metadata to ipfs
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
                  }
                })
        },
        getBookContent: async({state, commit, dispatch}, bookHash) => {
            return ipfs.cat(bookHash)
            // let textFile
            // let ipfsPath = `https://ipfs.io/ipfs/${hash}`
            // console.log(ipfsPath);
            // ipfs.cat(hash, function(err, res) {
            //     if(err || !res) return console.error("ipfs cat error", err, res);
            //     if(res.readable) {
            //     console.error('unhandled: cat result is a pipe', res);
            //     } else {
            //     console.log(res)
            //     textFile = res.toString()
            //     commit('getFile', textFile)
            //     }
            // })
        },
        getMetadata: async({state, commit, dispatch}, metadataHash) => {
                return ipfs.cat(metadataHash)
        },
        uploadAnnotations: async({state, commit, dispatch}, data) => {
            const annotations = [
                {
                note: 'annotation1',
                from: '1x000'
                },
                {
                    note: 'annotation2',
                    from: '2x000'
                },
                {
                    note: 'annotation3',
                    from: '3x000'
                },
            ]
            console.log(annotations)
            let annotationsBuffer = Buffer.from(JSON.stringify(annotations))
            console.log(annotationsBuffer)
            let temp = JSON.parse(annotationsBuffer.toString())
            console.log(temp)
            //uploading annotations to ipfs
            ipfs.files.add(annotationsBuffer, (err, res) => {
                if (err) { throw err }
                console.log(res)
                let annotationsHash = res[0].hash
                console.log(annotationsHash)
                // dispatch('web3/publish', {content, bookHash, metadataHash}, { root: true })
            })
        
        },
        getAnnotations: async({state, commit, dispatch}, annotationHash) => {
            return ipfs.cat(annotationHash)
        },
    }
}