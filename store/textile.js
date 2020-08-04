import { createPow } from "@textile/powergate-client"
// import fs from 'fs'
import fs from 'fs'

export default {
    // strict: false,
    state: () => ({
        pow: null,
        ffsToken: null
        
    }),
    mutations: {
        initPowergate: (state, data) => {
            state.pow = data.pow;
            console.log(state.pow)
            state.ffsToken = data.token
            console.log(state.ffsToken)
            state.pow.setToken(state.ffsToken)
        },
        // setFFS: (state, ffsToken) => {
        //     state.ffsToken = ffsToken;
        //     console.log(state.ffsToken)
        //     state.pow.setToken(state.ffsToken)
        // },
        
          
    },
    actions: {
        initPowergate: async({state, commit, dispatch}) => {
            const host = "http://0.0.0.0:6002"
            const pow = createPow({ host })
            const {token} = await pow.ffs.create() 
            console.log(token)
            commit('initPowergate', {pow, token})
            dispatch('ffsData')
        },
        ffsData: async({state, commit}) => {
            const { status, messagesList } = await state.pow.health.check()
            const {peersList} = await state.pow.net.peers()
            console.log('peersList')
            console.log(peersList)

            // get wallet addresses associated with your FFS instance
            const { addrsList } = await state.pow.ffs.addrs()
            console.log('addrsList')
            console.log(addrsList)


            // create a new address associated with your ffs instance
            // const { addr } = await state.pow.ffs.newAddr("my new addr")
            // console.log(addr)


            // get general info about your ffs instance
            const { info } = await state.pow.ffs.info()
            console.log('ffs info')
            console.log(info)
            console.log(fs)



            // cache data in IPFS in preparation to store it using FFS
            // if (typeof fs.readFileSync === 'function') {
                // const buffer = fs.readFile(`/Users/user/Desktop/mala.png`)
                // const { cid } = await state.pow.ffs.stage(buffer)
            //     }
            // else{
            //     console.log('readFileSync Error')
            // }
            

            // // store the data in FFS using the default storage configuration
            // const { jobId } = await pow.ffs.pushStorageConfig(cid)

            // // watch the FFS job status to see the storage process progressing
            // const jobsCancel = pow.ffs.watchJobs((job) => {
            //     if (job.status === JobStatus.JOB_STATUS_CANCELED) {
            //     console.log("job canceled")
            //     } else if (job.status === JobStatus.JOB_STATUS_FAILED) {
            //     console.log("job failed")
            //     } else if (job.status === JobStatus.JOB_STATUS_SUCCESS) {
            //     console.log("job success!")
            //     }
            // }, jobId)

            // // watch all FFS events for a cid
            // const logsCancel = pow.ffs.watchLogs((logEvent) => {
            //     console.log(`received event for cid ${logEvent.cid}`)
            // }, cid)

            // // get the current desired storage configuration for a cid (this configuration may not be realized yet)
            // const { config } = await pow.ffs.getStorageConfig(cid)

            // // get the current actual storage configuration for a cid
            // const { cidInfo } = await pow.ffs.show(cid)

            // // retrieve data from FFS by cid
            // const bytes = await pow.ffs.get(cid)

            // // send FIL from an address managed by your FFS instance to any other address
            // await pow.ffs.sendFil(addrsList[0].addr, "<some other address>", 1000)
        },

        

    }
}