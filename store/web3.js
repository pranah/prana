import Web3 from 'web3';
import pranaJson from "../contract/build/contracts/prana.json";
import pranahelperJson from "../contract/build/contracts/pranaHelper.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Vue from 'vue';
var sigUtil = require('eth-sig-util')
import ethUtil from 'ethereumjs-util'

export default {
    state: () => ({
        collectorPageSwitch: false,
        publisherPageSwitch: false,
        publishedContent: [],
        collectedContent: [],
        collectableContent: [],
        resaleTokens: [],

        isMetaMaskProvided: Boolean,
        currentAccount: null,
        web3: null,
        pranaContract: null,
        pranaAddress: pranaJson.networks['5777'].address,
        pranaAbi: pranaJson.abi,
        pranahelperContract: null,
        pranahelperAddress: pranahelperJson.networks['5777'].address,
        pranahelperAbi: pranahelperJson.abi,
    }),
    mutations: {
        publisherPageSwitchFlip: (state, page) => {
            state.publisherPageSwitch = page;
        },
        collectorPageSwitchFlip: (state, page) => {
            state.collectorPageSwitch = page;
        },
        publishedContent: (state, contentList) => {
            state.publishedContent = contentList
        },
        collectableContent: (state, contentList) => {
            state.collectableContent = contentList
        },
        collectContent: (state, token) => {
            state.collectedContent.push(token)
            console.log(state.collectedContent)
        },
        resaleTokens: (state, token) => {
            state.resaleTokens.push(token)
            console.log('resaleTokens')
            console.log(state.resaleTokens)
        },
        loadingContent: (state, content) => {
            state.collectedContent[state.collectedContent.indexOf(content)].loadingContent = !state.collectedContent[state.collectedContent.indexOf(content)].loadingContent
        },
        setWeb3: (state, provider) => {
            state.web3 = provider;
            console.log(state.web3);
        },
        setContract: (state, contracts) => {
            Vue.set(state, 'pranaContract', contracts.pranaContract);
            Vue.set(state, 'pranahelperContract', contracts.pranahelperContract);
            console.log(state.pranaContract);
            console.log(state.pranahelperContract);
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
                    const pranaContract = new state.web3.eth.Contract(state.pranaAbi, state.pranaAddress);       
                    const pranahelperContract = new state.web3.eth.Contract(state.pranahelperAbi, state.pranahelperAddress);       
                    commit('setContract', {pranaContract, pranahelperContract});
                } 
            });
        },
        //getting account details
        getAccount: async ({commit, dispatch}) => {
            const accounts = await ethereum.enable()
            await commit('updateAccountDetails', accounts[0])
            dispatch('myPublished')
            dispatch('myCollection')
            dispatch('getCollectables')
            dispatch('getResaleTokens')

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
            // const bucketAdresses = toPublish.bucket.getAddressesList();
            await state.pranaContract.methods.publishBook(
                toPublish.hash,
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
                dispatch('getCollectables')
            }).catch(err => console.log(err))
        },
        myPublished: async ({state, commit}) => {
            await state.pranaContract.getPastEvents('BookPublished',{
                filter:{publisher:state.currentAccount},
                fromBlock:0,
                toBlock:'latest'
            },(err, events)=>{
                let isbn, price, publisher, metadata, transactionCut, bucketHash
                let contentList = []
                for(let i=0; i<events.length; i++){
                    isbn = events[i].returnValues.isbn
                    price = events[i].returnValues.price
                    publisher = events[i].returnValues.publisher
                    metadata = events[i].returnValues.bookCoverAndDetails
                    transactionCut = events[i].returnValues.transactionCut
                    state.pranaContract.methods.viewBookDetails(isbn)
                    .call({ from: state.currentAccount})
                    .then((content) => {
                        bucketHash = content[0]
                    })
                    contentList.push({isbn, publisher, price, transactionCut, metadata, bucketHash});
                }
                commit('publishedContent', contentList)
            });
        },
        getCollectables: async ({state, commit}) => {
            await state.pranaContract.getPastEvents('BookPublished', {
                fromBlock: 0,
                toBlock: 'latest'
            }).then(events => {
                let isbn, price, publisher, metadata, transactionCut
                let contentList = []
                for(let i=0; i<events.length; i++){
                    isbn = events[i].returnValues.isbn
                    price = events[i].returnValues.price
                    publisher = events[i].returnValues.publisher
                    metadata = events[i].returnValues.bookCoverAndDetails
                    transactionCut = events[i].returnValues.transactionCut
                    contentList.push({isbn, publisher, price, transactionCut, metadata});
                }
                commit('collectableContent', contentList)
            }).catch(err => {console.log(err);})
        },
        //mints a new token and pushes the tokendata to collectedContent array
        purchase: async ({state, dispatch},content) => {
            let price = content.price
            let isbn = content.isbn
            //contract call to mint a new token
            await state.pranaContract.methods.directPurchase(isbn)
            .send({ from: state.currentAccount, gas: 6000000, value: state.web3.utils.toWei(price, 'ether') })
            .on('transactionHash', (hash) => {
                console.log("Minting is Successful !")
                console.log(hash)
                })
            .then(receipt => {
                console.log(receipt);
                let tokenId = receipt.events.Transfer.returnValues.tokenId
                dispatch('pushMyToken', tokenId)
            }).catch(err => {console.log(err);})
        },
        //pushes token data of all the tokens owned by an address to collectedContent array
        myCollection: async({state, commit, dispatch}) => {
            let tokenCount
            //contract call to get the number of tokens owned by an address
            await state.pranaContract.methods.balanceOf(state.currentAccount)
            .call({from: state.currentAccount})
            .then(count => {
                tokenCount = count
                console.log(`Number of tokens: ${tokenCount}`)
            })
            .catch((err) => {
                console.error(err);
            })
            for(let i=0; i<tokenCount; i++){
                //contract call to get the tokenId at index i
                await state.pranaContract.methods.tokenOfOwnerByIndex(state.currentAccount, i)
                .call({ from: state.currentAccount})
                .then((tokenId) => {
                    dispatch('pushMyToken', tokenId)
                })
                .catch((err) => {
                    console.error(err)
                })
            }   
        },
        //pushes the token details of a tokenId to collectedContent array
        pushMyToken: async({state, commit}, tokenId) => {
            let hash
            //contract call to get the encrypted cid of a tokenId
            await state.pranaContract.methods.consumeContent(tokenId)
            .call({ from: state.currentAccount})
            .then((bookHash) => {
                hash = bookHash
                console.log(`EncryptedCID of tokenid ${tokenId}: ${hash}`)
            })
            //contract call to get the token details of a tokenId
            await state.pranaContract.methods.viewTokenDetails(tokenId)
            .call({ from: state.currentAccount})
            .then((content) => {
                let isbn = content[0]
                let metadata = content[1]
                let copyNumber = content[2]
                let resalePrice = content[3]
                let isUpForResale = content[4]
                const loadingContent = false
                const pathToFile = String
                commit('collectContent', {tokenId, hash, isbn, metadata, copyNumber, resalePrice, isUpForResale, loadingContent, pathToFile})
            })          
        },
        signMessage: ({state, dispatch, commit}, signThis) => {
            state.web3.eth.getBlock("latest")
            .then(block => {
                state.web3.eth.personal.sign(block.hash, state.currentAccount)
                .then(sig => {
                    const content = {
                        hash: signThis.hash,
                        signature: sig,
                        block: block.number,
                        tokenId: signThis.tokenId
                    }
                    commit('loadingContent', signThis)
                    // dispatch('libp2p/requestContentKey', content, {root: true})        
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
                            requester: verifyThis.requester,
                            tokenId: verifyThis.tokenId
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
                                // dispatch('fleek/shareBucket', {bucket: details[1], requester: verifyOwner.requester, tokenId: verifyOwner.tokenId}, {root: true});    
                            })
                        }
                    })
                })
                .catch((err) => {
                    console.error(err);
                });
            } 
        },
        //to put a token for resale
        putForResale: async({state, commit, dispatch}, resaleData) => {
            let resalePrice = resaleData.resalePrice
            let tokenId = resaleData.tokenId
            await state.pranaContract.methods.putTokenForSale(resalePrice, tokenId)
            .send({ from: state.currentAccount, gas : 6000000 })
            .on('TokenForSale', (event) => {
                console.log('TokenForSale')
                console.log(event)
            }).then((receipt) => {
                console.log('receipt')
                console.log(receipt)
            console.log('executing putforresale action...')
                dispatch('pushResaleToken', tokenId)
                console.log(tokenId)
                // commit('fleek/removeMyToken', tokenId)
                // .then( dispatch('pushMyToken', tokenId))
            }).catch(err => console.log(err))
        },

        getResaleTokens: async({state, commit, dispatch}) => {
            let tokenCount
            //contract call to get the number of resale tokens 
            await state.pranaContract.methods.numberofTokensForResale()
            .call({from: state.currentAccount})
            .then(count => {
                tokenCount = count
                console.log(`Number of resale tokens: ${tokenCount}`)
            })
            .catch((err) => {
                console.error(err);
            })
            for(let i=0; i<tokenCount; i++){
                //contract call to get the resale tokenId at index i
                await state.pranaContract.methods.tokenForResaleAtIndex(i)
                .call({ from: state.currentAccount})
                .then((tokenId) => {
                    dispatch('pushResaleToken', tokenId)
                })
                .catch((err) => {
                    console.error(err)
                })
            }
        },
        pushResaleToken: async({state, commit, dispatch}, tokenId) => {
            console.log('executing pushResaleToken action...')
            //contract call to get the token details of a tokenId
            state.pranaContract.methods.viewTokenDetails(tokenId)
            .call({ from: state.currentAccount})
            .then((content) => {
                console.log(`Book details of resale tokenid ${tokenId}:`)
                console.log(content)
                let isbn = content[0]
                let metadata = content[1]
                let copyNumber = content[2]
                let resalePrice = content[3]
                let isUpForResale = content[4]
                commit('resaleTokens', {tokenId, isbn, metadata, copyNumber, resalePrice, isUpForResale})
            })
        }

    }
}