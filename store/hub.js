import { Buckets, PushPathResult, KeyInfo } from '@textile/hub'
import { Libp2pCryptoIdentity } from '@textile/threads-core'

export default {
    // strict: false,
    state: () => ({
        keyInfo: KeyInfo,
        identity: null,
        bucketKey: null,
        buckets: null,

        metadata: [],
        photos: [],
        isLoading: true,
        isDragActive: false,
        index: {
        author: '',
        date: 0,
        paths: []
    }

        
    }),
    mutations: {
        setIdentity: (state, identity) => {
            state.identity = identity
            console.log(state.identity)
          },
        setBucketKey: (state, data) => {
            state.bucketKey = data.bucketKey
            state.buckets = data.buckets
            console.log(state.bucketKey)
            console.log(state.buckets)
          },
    },
    actions: {
        getIdentity: async({state, commit}) => {
            try {
              let storedIdent = localStorage.getItem("identity")
              if (storedIdent === null) {
                throw new Error('No identity')
              }
              const restored = Libp2pCryptoIdentity.fromString(storedIdent)
              console.log('restored')
              console.log(restored)
              commit('setIdentity', restored)
            }
            catch (e) {
              /**
               * If any error, create a new identity.
               */
              try {
                const identity = await Libp2pCryptoIdentity.fromRandom()
                const identityString = identity.toString()
                localStorage.setItem("identity", identityString)
                commit('setIdentity', identity)
                console.log('identity')
                console.log(identity)
              } 
              catch (err) {
                console.log(err.message)
              }
            }
        },
        getBucketKey: async ({state, commit}) => {
            if (!state.identity) {
              throw new Error('Identity not set')
            }
            const buckets = await Buckets.withKeyInfo(state.keyInfo)
            // Authorize the user and your insecure keys with getToken
            await buckets.getToken(state.identity)
        
            const root = await buckets.open('io.textile.dropzone')
            if (!root) {
              throw new Error('Failed to open bucket')
            }
            console.log('buckets')
            console.log(buckets)
            console.log('root.key')
            console.log(root.key)
            commit('setBucketKey', {buckets: buckets, bucketKey: root.key});
        }
        
        },

        

    }
