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
        requestContent: async({state, commit, dispatch}, hash) => {
            console.log('requestContent...')
            let ipfsPath = `https://ipfs.io/ipfs/${hash}`
            console.log(ipfsPath)

            // ipfs.files.cat(hash, function (err, stream) {
            //     console.log("Received stream for file '" + rootHash + "/" +
            //       fileName + "'")
            //     if (err) return callback(err)
            //     stream.on('data', function (chunk) {
            //       console.log("Received " + chunk.length + " bytes for file '" +
            //         rootHash + "/" + fileName + "'")
            //       bufView.set(chunk, offs)
            //       offs += chunk.length
            //     });
            //     stream.on('error', function (err) {
            //       callback(err, null)
            //     });
            //     stream.on('end', function () {
            //       callback(null, resBuf)
            //     });
            //   })

                ipfs.cat(hash, { buffer: true }, function(err, res) {
                  if(err || !res) return console.error("ipfs cat error", err, res);
                  if(res.readable) {
                    console.error('unhandled: cat result is a pipe', res);
                  } else {
                    console.log(res)
                    console.log(res.toString())
                  }
                });
            
            // const chunks = []
            // for await (const chunk of ipfs.cat(hash)) {
            //   chunks.push(chunk)
            // }
            // console.log(Buffer.concat(chunks).toString())
        }  
    }
}