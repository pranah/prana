import Web3 from 'web3';
import contractJson from "../contract/build/contracts/prana.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Vue from 'vue';
var sigUtil = require('eth-sig-util')
import ethUtil from 'ethereumjs-util'

export default {
    state: () => ({
        isMetaMaskProvided: Boolean,
        currentAccount: null,
        web3: null,
        pranaContract: null,
        contractAddress: contractJson.networks['5777'].address,
        contractAbi: contractJson.abi,
    }),
    mutations: {
        setWeb3: (state, provider) => {
            state.web3 = provider;
            console.log(state.web3);
        },
        setContract: (state, contract) => {
            Vue.set(state, 'pranaContract', contract);
            console.log(state.pranaContract);
        },
        fetchedProvider: (state, isMetaMask) => {
            state.isMetaMaskProvided = isMetaMask
        },
        updateAccountDetails: (state, account) => {
            console.log('updateAccountDetails mutation is executing...')
            state.currentAccount = account
            console.log(state.currentAccount)
        },
    },
    actions: {
        fetchProvider: async ({state, dispatch, commit}) => {
            detectEthereumProvider().then(res => {
                commit('fetchedProvider', res.isMetaMask)   
                if(res.isMetaMask==true) { 
                    const provider = new Web3(res);
                    commit('setWeb3', provider);
                    const contract = new state.web3.eth.Contract(state.contractAbi, state.contractAddress);       
                    commit('setContract', contract);
                } 
            });
        },
        getAccount: async ({commit, dispatch}) => {
            const accounts = await ethereum.enable()
            await commit('updateAccountDetails', accounts[0])
            dispatch('myCollection');
            dispatch('myPublished');
        },
        initEth: async({commit, dispatch}) => {
            if (window.ethereum) {        
                dispatch('getAccount')
            } else {
              // Non-dapp browsers…
              console.log('Please install MetaMask');
            }
        },
        publish: async ({state, dispatch}, toPublish) => {
            const bucketAdresses = toPublish.bucket.getAddressesList();
            await state.pranaContract.methods.publishBook(
                bucketAdresses[0].slice(-116),
                toPublish.content.isbn,
                toPublish.content.price,
                toPublish.content.title,
                1 // Transacation cut
            ).send({ from: state.currentAccount, gas : 6000000 })
            .on('BookPublished', (event) => {
                console.log(event)
            }).then((receipt) => {
                console.log(receipt)
                dispatch('myPublished')
            }).catch(err => console.log(err))
        },
        myPublished: async ({state, commit}) => {
            await state.pranaContract.getPastEvents('BookPublished',{
                filter:{publisher:state.currentAccount},
                fromBlock:0,
                toBlock:'latest'
            },(err,events)=>{
                commit('fleek/publishedContent', events, { root: true })
            });
        },
        getCollectables: async ({state, commit}) => {
            await state.pranaContract.getPastEvents('BookPublished', {
                fromBlock: 0,
                toBlock: 'latest'
            }).then(res => {
                commit('fleek/collectableContent', res, {root: true})
            }).catch(err => {console.log(err);})
        },
        purchase: async ({state, dispatch},content) => {
            let price = content.returnValues.price
            let isbn = content.returnValues.isbn
            await state.pranaContract.methods.directPurchase(isbn)
            // .send({from: state.currentAccount, gas: 6000000})
            .send({ from: state.currentAccount, gas: 6000000, value: state.web3.utils.toWei(price, 'ether') })
            .on('transactionHash', (hash) => {
                console.log("Minting is Successful !")
                console.log(hash)
                })
            .then(receipt => {
                console.log(receipt);
                let tokenId = receipt.events.Transfer.returnValues.tokenId
                dispatch('myCollection')
            }).catch(err => {console.log(err);})
        },
        myCollection: async({state, commit}) => {
            let tokenCount
            let tokenId
            await state.pranaContract.methods.balanceOf(state.currentAccount)
                .call({from: state.currentAccount})
                .then(count => {
                    tokenCount = count
                    console.log(`Number of tokens: ${tokenCount}`)
                })
                .catch((err) => {
                    console.error(err);
                });

            for(let i=0; i<tokenCount; i++){

                state.pranaContract.methods.tokenOfOwnerByIndex(state.currentAccount, i)
                .call({ from: state.currentAccount})
                .then((id) => {
                tokenId = id
                state.pranaContract.methods.consumeContent(id)
                .call({ from: state.currentAccount})
                .then((hash) => {
                    commit('fleek/collectContent', {tokenId: id, bucket: hash}, {root: true})
                    console.log(`EncryptedCID of tokenid ${id}: ${hash}`);
                })
                })
                .catch((err) => {
                    console.error(err);
                });

            }   
        },
        signMessage: ({state, dispatch}, signThis) => {
            state.web3.eth.getBlock("latest")
            .then(block => {
                state.web3.eth.personal.sign(block.hash, state.currentAccount)
                .then(sig => {
                    const content = {
                        bucket: signThis,
                        signature: sig,
                        block: block.number
                    }
                    dispatch('libp2p/requestContentKey', content, {root: true})        
                });
            });            
        },
        verifySig: ({state, dispatch}, verifyThis) => {
            state.web3.eth.getBlock("latest")
            .then(block => {
                // If the signature is greater than 20blocks, ~5min, ignore
                if(block.number - verifyThis.block <= 20) {
                    state.web3.eth.personal.ecRecover(
                        verifyThis.bucket, 
                        verifyThis.sig
                    ).then(from => {
                        const verifyOwner = {
                            owner: from,
                            content: verifyThis.bucket,
                            requester: verifyThis.requester
                        }
                        dispatch('verifyOwner', verifyOwner)
                    })
                }
            })
            
        },
        verifyOwner: async ({state, dispatch}, verifyOwner) => {
            let tokenCount;
            let tokenId;
            let owned = false;
            await state.pranaContract.methods.balanceOf(verifyOwner.owner)
            .call({from: state.currentAccount})
            .then(count => {
                tokenCount = count
            })
            .catch((err) => {
                console.error(err);
            });

            for (let i=0; i<=tokenCount; i++){
                state.pranaContract.methods.tokenOfOwnerByIndex(state.currentAccount, i)
                .call({ from: state.currentAccount})
                .then((id) => {
                    tokenId = id
                    state.pranaContract.methods.consumeContent(id)
                    .call({ from: state.currentAccount})
                    .then((hash) => {
                        if(hash == verifyOwner.content) {
                            owned = true;                    
                        }
                        if(i+1 >= tokenCount && owned == true) {
                            state.pranaContract.methods.viewTokenDetails(tokenId).call({from: state.currentAccount})
                            .then(details => {
                                dispatch('fleek/shareBucket', {bucket: details[1], requester: verifyOwner.requester}, {root: true});    
                            })
                        }
                    })
                })
                .catch((err) => {
                    console.error(err);
                });

            } 
        }
    }
}