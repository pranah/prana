import Libp2p from 'libp2p'
import Websockets from 'libp2p-websockets'
import WebRTCStar from 'libp2p-webrtc-star'
import { NOISE } from 'libp2p-noise'
import Secio from 'libp2p-secio'
import Mplex from 'libp2p-mplex'
import Boostrap from 'libp2p-bootstrap'
import Gossipsub from 'libp2p-gossipsub';

export default {
    state: () => ({
        p2pNode: null,
        // p2pPubSub: null,
    }),
    mutations: {
        syncNode: (state, _libp2p) => {
            state.p2pNode = null;
            state.p2pNode = _libp2p;
        },
    },
    actions: {
        initLibP2P: async ({ commit }) => {
            const libp2p = await Libp2p.create({
            addresses: {
                listen: [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
                ]
            },
            modules: {
                transport: [Websockets, WebRTCStar],
                connEncryption: [NOISE, Secio],
                streamMuxer: [Mplex],
                peerDiscovery: [Boostrap],
                pubsub: Gossipsub
            },
            config: {
                peerDiscovery: {
                bootstrap: {
                    enabled: true,
                    list: [
                    '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
                    '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
                    '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
                    '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
                    '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
                    '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64'
                    ]
                }
                }
            }
            })
            console.log(libp2p);
            commit('syncNode', libp2p)
            console.log(`libp2p id is ${libp2p.peerId.toB58String()}`);
            
            // Listen for new peers
            libp2p.on('peer:discovery', (peerId) => {
                commit('syncNode', libp2p)
                console.log(`Found peer ${peerId.toB58String()}`)
            })
    
            // Listen for new connections to peers
            libp2p.connectionManager.on('peer:connect', (connection) => {
                commit('syncNode', libp2p)
                libp2p.pubsub.publish("onlineCheckIn1", Buffer.from('LibP2P Node Checking In!'))
                console.log(`Connected to ${connection.remotePeer.toB58String()}`)
            })
    
            // Listen for peers disconnecting
            libp2p.connectionManager.on('peer:disconnect', (connection) => {
                commit('syncNode', libp2p)           
                console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
            })

            await libp2p.start()

        },
        subscribeToContent: async ({state, dispatch}, content) => {
            await state.p2pNode.pubsub.subscribe(content, (msg) => {
                if(msg.from != state.p2pNode.peerId.toB58String()) {
                    const verifyThis = {
                        bucket: content,
                        sig: msg.data.toString()
                    }
                    dispatch('web3/verifySig', verifyThis, {root: true});
                }
            })
        },
        requestContentKey: ({state}, content) => {
            state.p2pNode.pubsub.publish(content.bucket, Buffer.from(content.signature))
        },
    }
}