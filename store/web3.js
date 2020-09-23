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
        rentTokens: [],
        rentedTokens: [],

        isMetaMaskProvided: Boolean,
        currentAccount: null,
        web3: null,
        pranaContract: null,
        pranaAddress: pranaJson.networks['3'].address,
        pranaAbi: pranaJson.abi,
        pranahelperContract: null,
        pranahelperAddress: pranahelperJson.networks['3'].address,
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
            console.log(state.publishedContent)
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
        rentTokens: (state, token) => {
            state.rentTokens.push(token)
            console.log('rentTokens')
            console.log(state.rentTokens)
        },
        myRentedTokens: (state, token) => {
            state.rentedTokens.push(token)
            console.log('myRentedTokens')
            console.log(state.rentedTokens)
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
        removeMyToken: (state, tokenId) => {
            for(let i=0; i<state.collectedContent.length; i++){
                if(state.collectedContent[i].tokenId === tokenId){
                    state.collectedContent.splice(i, 1)
                }
            }
        },
        updateAnnotations: (state, data) => {
            console.log(state.collectedContent[data.index].annotations)
            state.collectedContent[data.index].annotations = data.annotations
            state.collectedContent[data.index].annotationHash = data.annotationHash
            console.log(state.collectedContent[data.index].annotations)
        }
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
            dispatch('getRentTokens')
            dispatch('myRentedTokens')

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
            let price = state.web3.utils.toWei(toPublish.content.price, 'ether')
            await state.pranaContract.methods.publishBook(
                toPublish.bookHash,
                toPublish.content.isbn,
                price,
                toPublish.metadataHash,
                toPublish.content.transactionCut
            ).send({ from: state.currentAccount, gas : 6000000 })
            .on('BookPublished', (event) => {
                console.log(event)
            }).then((receipt) => {
                console.log(receipt)
                dispatch('myPublished')
                dispatch('getCollectables')
            }).catch(err => console.log(err))
        },
        myPublished: async ({state, commit, dispatch}) => {
            await state.pranaContract.getPastEvents('BookPublished',{
                filter:{publisher:state.currentAccount},
                fromBlock:0,
                toBlock:'latest'
            },(err, events)=>{
                let isbn, price, publisher, metadataHash, transactionCut, title, imageHash, bookHash, bookContent
                let contentList = []
                for(let i=0; i<events.length; i++){
                    state.pranaContract.methods.viewMyBookDetails(events[i].returnValues.isbn)
                    .call({ from: state.currentAccount})
                    .then((content) => {
                        metadataHash = events[i].returnValues.bookCoverAndDetails 

                        //action to get metadata from ipfs
                        dispatch('ipfs/getMetadata', metadataHash, { root: true })
                        .then(res1 => {
                            bookHash = content[0]

                            //action to get book content from ipfs
                            dispatch('ipfs/getBookContent', bookHash, { root: true })
                            .then(res2 => {
                                if(res2.readable) {
                                    console.error('unhandled: cat result is a pipe', res2);
                                } 
                                else {
                                    const metadata = JSON.parse(res1.toString())
                                    title = metadata.title
                                    imageHash = metadata.imageHash
                                    metadataHash = events[i].returnValues.bookCoverAndDetails
                                    bookHash = content[0]
                                    bookContent = res2.toString()
                                    isbn = events[i].returnValues.isbn
                                    publisher = events[i].returnValues.publisher
                                    price = state.web3.utils.fromWei(events[i].returnValues.price, 'ether')
                                    transactionCut = events[i].returnValues.transactionCut
                                    contentList.push({isbn, publisher, price, transactionCut, metadataHash, title, imageHash, bookHash, bookContent})
                                }
                            })   
                        })
                        // contentList.push({isbn, publisher, price, transactionCut, metadataHash, bookHash});
                    })
                }
                commit('publishedContent', contentList)
            });
        },
        getCollectables: async ({state, commit, dispatch}) => {
            await state.pranaContract.getPastEvents('BookPublished', {
                fromBlock: 0,
                toBlock: 'latest'
            }).then(events => {
                let isbn, price, publisher, metadataHash, transactionCut, title, imageHash
                let contentList = []
                for(let i=0; i<events.length; i++){
                    metadataHash = events[i].returnValues.bookCoverAndDetails 
                    dispatch('ipfs/getMetadata', metadataHash, { root: true })
                    .then(res => {
                        // console.log(res)
                        const metadata = JSON.parse(res.toString())
                        title = metadata.title
                        imageHash = metadata.imageHash
                        isbn = events[i].returnValues.isbn
                        publisher = events[i].returnValues.publisher
                        price = state.web3.utils.fromWei(events[i].returnValues.price, 'ether')
                        transactionCut = events[i].returnValues.transactionCut
                        metadataHash = events[i].returnValues.bookCoverAndDetails
                        
                        contentList.push({isbn, publisher, price, transactionCut, metadataHash, title, imageHash});
                    })
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
        //Giveaway books to friends
        giveaway: async ({state, commit},payload) => {
            let address = payload.address
            let tokenId = payload.tokenId
            console.log(address)
            console.log(tokenId)

            let owner = state.currentAccount;
            //contract call to safe transfer token from
            await state.pranaContract.methods.safeTransferFrom(owner,address,tokenId)
            .send({ from: state.currentAccount, gas : 6000000 })
            .on('transactionHash', (hash) => {
                console.log("Successfully gaveaway")
                console.log(hash)
                commit('removeMyToken', tokenId)
                })
            .catch(err => {console.log(err);})
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
        pushMyToken: async({state, commit, dispatch}, tokenId) => {
            let isbn, 
            metadata, metadataHash, title, imageHash, 
            annotationHash, annotations, 
            bookHash, bookContent, copyNumber, 
            resalePrice, isUpForResale, 
            rentedAtBlock, rentingPrice, isUpForRenting 

            //contract call to get the token details
            await state.pranaContract.methods.viewTokenDetails(tokenId)
            .call({ from: state.currentAccount})
            .then((content) => {
                console.log('content')
                console.log(content)

                //contract call to get the renting details
                state.pranaContract.methods.viewRentingTokenDetails(tokenId)
                .call({ from: state.currentAccount})
                .then((rentdata) => {
                    console.log('rentdata')
                    console.log(rentdata)

                    metadataHash = content[1]

                    //action to get metadata from ipfs
                    dispatch('ipfs/getMetadata', metadataHash, { root: true })
                    .then(res1 => {

                        //contract call to get the annotationHash
                        state.pranaContract.methods.tokenURI(tokenId)
                        .call({ from: state.currentAccount})
                        .then((uriHash) => {
                            console.log('URIhash')
                            console.log(uriHash)

                            rentedAtBlock = rentdata[3]
                            let currentBlock
                            state.web3.eth.getBlockNumber().then(block => {
                                currentBlock = block
                                console.log('rentedAtBlock')
                                console.log(rentedAtBlock)
                                console.log('currentBlock')
                                console.log(currentBlock)

                                if(currentBlock > rentedAtBlock+100){

                                    //contract call to get the encrypted cid of a tokenId
                                    state.pranaContract.methods.consumeContent(tokenId)
                                    .call({ from: state.currentAccount})
                                    .then((hash) => {
                                        bookHash = hash
                                        console.log(`EncryptedCID of tokenid ${tokenId}: ${bookHash}`)
    
                                        //action to get book content from ipfs
                                        dispatch('ipfs/getBookContent', bookHash, { root: true })
                                        .then(res2 => {
    
                                            if(res2.readable) {
                                                console.error('unhandled: cat result is a pipe', res2);
                                            } 
                                            else {
                                                if(uriHash.length>0){
                                                    //action to get Annotations from ipfs
                                                    dispatch('ipfs/getAnnotations', uriHash, { root: true })
                                                    .then(arr => {
                                                        annotations = JSON.parse(arr.toString())
                                                        annotationHash = uriHash
                                                        metadata = JSON.parse(res1.toString())
                                                        title = metadata.title
                                                        imageHash = metadata.imageHash
                                                        bookContent = res2.toString()
                                                        isbn = content[0]
                                                        copyNumber = content[2]
                                                        resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                                                        isUpForResale = content[4]
                                                        rentedAtBlock = rentdata[3]
                                                        rentingPrice = rentdata[4]
                                                        isUpForRenting = rentdata[5]
                                                        commit('collectContent', {tokenId, isbn, 
                                                            metadataHash, title, imageHash, 
                                                            annotationHash, annotations, 
                                                            bookHash, bookContent, copyNumber, 
                                                            resalePrice, isUpForResale, 
                                                            rentedAtBlock, rentingPrice, isUpForRenting 
                                                        })
                                                        
                                                    })
                                                }
                                                else {
                                                    annotations = []
                                                    annotationHash = ''
                                                    const metadata = JSON.parse(res1.toString())
                                                    title = metadata.title
                                                    imageHash = metadata.imageHash
                                                    bookContent = res2.toString()
                                                    isbn = content[0]
                                                    copyNumber = content[2]
                                                    resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                                                    isUpForResale = content[4]
                                                    rentedAtBlock = rentdata[3]
                                                    rentingPrice = rentdata[4]
                                                    isUpForRenting = rentdata[5]
                                                    commit('collectContent', {tokenId, isbn, 
                                                        metadataHash, title, imageHash, 
                                                        annotationHash, annotations, 
                                                        bookHash, bookContent, copyNumber, 
                                                        resalePrice, isUpForResale, 
                                                        rentedAtBlock, rentingPrice, isUpForRenting 
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                                else{
                                    if(uriHash.length>0){
                                        //action to get Annotations from ipfs
                                        dispatch('ipfs/getAnnotations', uriHash, { root: true })
                                        .then(arr => {
                                            annotations = JSON.parse(arr.toString())
                                            annotationHash = uriHash
                                            metadata = JSON.parse(res1.toString())
                                            title = metadata.title
                                            imageHash = metadata.imageHash
                                            bookContent = null
                                            isbn = content[0]
                                            copyNumber = content[2]
                                            resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                                            isUpForResale = content[4]
                                            rentedAtBlock = rentdata[3]
                                            rentingPrice = rentdata[4]
                                            isUpForRenting = rentdata[5]
                                            commit('collectContent', {tokenId, isbn, 
                                                metadataHash, title, imageHash, 
                                                annotationHash, annotations, 
                                                bookHash, bookContent, copyNumber, 
                                                resalePrice, isUpForResale, 
                                                rentedAtBlock, rentingPrice, isUpForRenting 
                                            })
                                            
                                        })
                                    }
                                    else {
                                        annotations = []
                                        annotationHash = ''
                                        const metadata = JSON.parse(res1.toString())
                                        title = metadata.title
                                        imageHash = metadata.imageHash
                                        bookContent = null
                                        isbn = content[0]
                                        copyNumber = content[2]
                                        resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                                        isUpForResale = content[4]
                                        rentedAtBlock = rentdata[3]
                                        rentingPrice = rentdata[4]
                                        isUpForRenting = rentdata[5]
                                        commit('collectContent', {tokenId, isbn, 
                                            metadataHash, title, imageHash, 
                                            annotationHash, annotations, 
                                            bookHash, bookContent, copyNumber, 
                                            resalePrice, isUpForResale, 
                                            rentedAtBlock, rentingPrice, isUpForRenting 
                                        })
                                    }
                                }
                            })
   
                        })
                    })
                })
            })
        },
        
        //to put a token for resale
        putForResale: async({state, commit, dispatch}, resaleData) => {
            console.log(resaleData)
            let resalePrice = state.web3.utils.toWei(resaleData.resalePrice, 'ether')
            let tokenId = resaleData.tokenId
            await state.pranaContract.methods.putTokenForSale(resalePrice, tokenId)
            .send({ from: state.currentAccount, gas : 6000000 })
            .then((receipt) => {
                console.log('receipt')
                console.log(receipt)
                console.log('executing putforresale action...')
                dispatch('pushResaleToken', tokenId)
                console.log(tokenId)
                commit('removeMyToken', tokenId)
                dispatch('pushMyToken', tokenId)
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
            let isbn, metadataHash, title, imageHash, copyNumber, resalePrice, isUpForResale

            //contract call to get the token details of a tokenId
            state.pranaContract.methods.viewTokenDetails(tokenId)
            .call({ from: state.currentAccount})
            .then((content) => {
                console.log(`Book details of resale tokenid ${tokenId}:`)
                console.log(content)
                metadataHash = content[1]

                dispatch('ipfs/getMetadata', metadataHash, { root: true })
                .then(res => {
                    // console.log(res)
                    const metadata = JSON.parse(res.toString())
                    title = metadata.title
                    imageHash = metadata.imageHash
                    isbn = content[0]
                    copyNumber = content[2]
                    resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                    isUpForResale = content[4]
                    let rentingPrice = null
                    let isUpForRenting = null
                    commit('resaleTokens', {tokenId, isbn, metadataHash, title, imageHash, copyNumber, resalePrice, isUpForResale, rentingPrice, isUpForRenting})
                })   
            })
        },
        buyToken: async({state, commit, dispatch}, content) => {
            let resalePrice = content.resalePrice
            let tokenId = content.tokenId
            //contract call to buy a token
            await state.pranahelperContract.methods.buyTokenFromPrana(tokenId)
            .send({ from: state.currentAccount, gas: 6000000, value: state.web3.utils.toWei(resalePrice, 'ether') })
            .on('transactionHash', (hash) => {
                console.log("Transaction Successful!")
                console.log(hash)
                })
            .then(receipt => {
                console.log(receipt);
                //error
                let tokenId = receipt.events.Transfer.returnValues.tokenId
                dispatch('pushMyToken', tokenId)
            }).catch(err => {console.log(err);})
        },
        //to put a token for rent
        putForRent: async({state, commit, dispatch}, rentData) => {
            // putForRent: async({state, commit, dispatch}) => {
            console.log(rentData)
            let rentingPrice = state.web3.utils.toWei(rentData.rentingPrice, 'ether')
            let tokenId = rentData.tokenId
            console.log(rentingPrice);

            // let rentingPrice = state.web3.utils.toWei(0.5, 'ether')
            // let tokenId = 0
            await state.pranaContract.methods.putForRent(rentingPrice, tokenId)
            .send({ from: state.currentAccount, gas : 6000000 })
            .then((receipt) => {
                console.log('receipt')
                console.log(receipt)
                console.log('executing putforrent action...')
                dispatch('pushRentToken', tokenId)
                console.log(tokenId)
                commit('removeMyToken', tokenId)
                dispatch('pushMyToken', tokenId)
            }).catch(err => console.log(err))
        },
        //to get the tokens which are put for renting
        getRentTokens: async({state, commit, dispatch}) => {
            let tokenCount
            //contract call to get the number of rent tokens 
            await state.pranaContract.methods.numberofTokensForRenting()
            .call({from: state.currentAccount})
            .then(count => {
                tokenCount = count
                console.log(`Number of tokens put for renting: ${tokenCount}`)
            })
            .catch((err) => {
                console.error(err);
            })
            for(let i=0; i<tokenCount; i++){
                //contract call to get the rent tokenId at index i
                await state.pranaContract.methods.tokenForRentingAtIndex(i)
                .call({ from: state.currentAccount})
                .then((tokenId) => {
                    dispatch('pushRentToken', tokenId)
                })
                .catch((err) => {
                    console.error(err)
                })
            }
        },
        //to push a token to the rentTokens array
        pushRentToken: async({state, commit, dispatch}, tokenId) => {
            console.log('executing pushRentToken action...')
            let isbn, metadataHash, title, imageHash, copyNumber, resalePrice, isUpForResale, rentingPrice, isUpForRenting

            //contract call to get the token details of a tokenId
            state.pranaContract.methods.viewRentingTokenDetails(tokenId)
            .call({ from: state.currentAccount})
            .then((content) => {
                console.log(`Book details of rent tokenid ${tokenId}:`)
                console.log(content)
                metadataHash = content[1]

                dispatch('ipfs/getMetadata', metadataHash, { root: true })
                .then(res => {
                    // console.log(res)
                    const metadata = JSON.parse(res.toString())
                    title = metadata.title
                    imageHash = metadata.imageHash
                    isbn = content[0]
                    copyNumber = content[2]
                    resalePrice = null
                    isUpForResale = null
                    rentingPrice = state.web3.utils.fromWei(content[4], 'ether')
                    isUpForRenting = content[5]
                    commit('rentTokens', {tokenId, isbn, metadataHash, title, imageHash, copyNumber, resalePrice, isUpForResale, rentingPrice, isUpForRenting})
                })   
            })
        },
        //to rent a token
        rentToken: async({state, commit, dispatch}, content) => {
            let rentingPrice = content.rentingPrice
            let tokenId = content.tokenId
            //contract call to rent a token
            console.log(rentingPrice);
            await state.pranaContract.methods.rentToken(tokenId)
            .send({ from: state.currentAccount, gas: 6000000, value: state.web3.utils.toWei(rentingPrice, 'ether') })
            .on('transactionHash', (hash) => {
                console.log("Transaction Successful!")
                console.log(hash)
                })
            .then(receipt => {
                console.log(receipt);
                //error
                let tokenId = receipt.events.TokenRented.returnValues.tokenId
                console.log(tokenId)
                dispatch('pushMyRentedToken', tokenId)
            }).catch(err => {console.log(err);})
        },
        // pushes token data of all the tokens rented by an address to rentedTokens array
        myRentedTokens: async({state, commit, dispatch}) => {
            let tokenCount
            //contract call to get the number of rented tokens owned by an address
            await state.pranaContract.methods.numberOfRentedTokens(state.currentAccount)
            .call({from: state.currentAccount})
            .then(count => {
                tokenCount = count
                console.log(`Number of rented tokens: ${tokenCount}`)
            })
            .catch((err) => {
                console.error(err);
            })
            for(let i=0; i<tokenCount; i++){
                //contract call to get the rented tokenId at index i
                await state.pranaContract.methods.tokenOfRenteeByIndex(state.currentAccount, i)
                .call({ from: state.currentAccount})
                .then((tokenId) => {
                    console.log(tokenId)
                    dispatch('pushMyRentedToken', tokenId)
                })
                .catch((err) => {
                    console.error(err)
                })
            }   
        },

        pushMyRentedToken: async({state, commit, dispatch}, tokenId) => {
            let isbn, 
                    metadata, metadataHash, title, imageHash, 
                    annotationHash, annotations, 
                    bookHash, bookContent, copyNumber, 
                    resalePrice, isUpForResale, 
                    rentedAtBlock, rentingPrice, isUpForRenting 

            //contract call to get the renting details
            await state.pranaContract.methods.viewRentingTokenDetails(tokenId)
            .call({ from: state.currentAccount})
            .then((rentdata) => {
                console.log(`Book details of rented tokenid ${tokenId}:`)
                console.log(rentdata)

                rentedAtBlock = rentdata[3]
                let currentBlock
                state.web3.eth.getBlockNumber()
                .then(block => {
                    currentBlock = block
                    console.log("currentBlock")
                    console.log(currentBlock)

                    if(currentBlock - rentedAtBlock < 100){

                        //contract call to get the token details
                        state.pranaContract.methods.viewTokenDetails(tokenId)
                        .call({ from: state.currentAccount})
                        .then((content) => {
                            console.log('content')
                            console.log(content)

                            //contract call to get the encrypted cid of a tokenId
                            state.pranaContract.methods.consumeContent(tokenId)
                            .call({ from: state.currentAccount})
                            .then((hash) => {
                                bookHash = hash
                                console.log(`EncryptedCID of tokenid ${tokenId}: ${bookHash}`)

                                metadataHash = content[1]

                                //action to get metadata from ipfs
                                dispatch('ipfs/getMetadata', metadataHash, { root: true })
                                .then(res1 => {
                                    console.log(res1)

                                    //action to get book content from ipfs
                                    dispatch('ipfs/getBookContent', bookHash, { root: true })
                                    .then(res2 => {
                                    console.log(res2)

                                        if(res2.readable) {
                                            console.error('unhandled: cat result is a pipe', res2);
                                        } 
                                        else {
                                            //contract call to get the annotationHash
                                            state.pranaContract.methods.tokenURI(tokenId)
                                            .call({ from: state.currentAccount})
                                            .then((hash) => {
                                                console.log('URIhash')
                                                console.log(hash)
                                                
                                                if(hash.length>0){
                                                    //action to get Annotations from ipfs
                                                    dispatch('ipfs/getAnnotations', hash, { root: true })
                                                    .then(arr => {
                                                        console.log(arr)
                                                        annotations = JSON.parse(arr.toString())
                                                        annotationHash = hash
                                                        metadata = JSON.parse(res1.toString())
                                                        title = metadata.title
                                                        imageHash = metadata.imageHash
                                                        bookContent = res2.toString()
                                                        isbn = content[0]
                                                        copyNumber = content[2]
                                                        resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                                                        isUpForResale = content[4]
                                                        rentedAtBlock = rentdata[3]
                                                        rentingPrice = state.web3.utils.fromWei(rentdata[4], 'ether')
                                                        isUpForRenting = rentdata[5]
                                                        commit('myRentedTokens', {tokenId, isbn, 
                                                            metadataHash, title, imageHash, 
                                                            annotationHash, annotations, 
                                                            bookHash, bookContent, copyNumber, 
                                                            resalePrice, isUpForResale, 
                                                            rentedAtBlock, rentingPrice, isUpForRenting 
                                                        })
                                                        
                                                    })
                                                }
                                                else {
                                                    annotations = []
                                                    annotationHash = ''
                                                    const metadata = JSON.parse(res1.toString())
                                                    title = metadata.title
                                                    imageHash = metadata.imageHash
                                                    bookContent = res2.toString()
                                                    isbn = content[0]
                                                    copyNumber = content[2]
                                                    resalePrice = state.web3.utils.fromWei(content[3], 'ether')
                                                    isUpForResale = content[4]
                                                    rentedAtBlock = rentdata[3]
                                                    rentingPrice = state.web3.utils.fromWei(rentdata[4], 'ether')
                                                    isUpForRenting = rentdata[5]
                                                    commit('myRentedTokens', {tokenId, isbn, 
                                                        metadataHash, title, imageHash, 
                                                        annotationHash, annotations, 
                                                        bookHash, bookContent, copyNumber, 
                                                        resalePrice, isUpForResale, 
                                                        rentedAtBlock, rentingPrice, isUpForRenting 
                                                    })
                                                }
                                            })
                                        }
                                    })   
                                }) 

                            })
                        })
                    }
                })
                
            })
        },

        setAnnotationHash: async({state, commit, dispatch}, data) => {
            let index = data.index
            let annotationHash = data.annotationHash
            let tokenId = data.tokenId

            //contract call to set the annotation Hash
            state.pranaContract.methods.setTokenURI(tokenId, annotationHash)
            .send({ from: state.currentAccount, gas : 6000000 })
            .then((receipt) => {
                console.log('setAnnotationHash receipt')
                console.log(receipt)
                
                //action to get Annotations from ipfs
                dispatch('ipfs/getAnnotations', annotationHash, { root: true })
                .then(arr => {
                    console.log(arr)
                    let annotations = JSON.parse(arr.toString())
                    console.log(annotations)
                    commit('updateAnnotations', {index, annotations, annotationHash})
                })
            }).catch(err => console.log(err))
        },

        // getAnnotationHash: async({state, commit, dispatch}, data) => {

        //     //contract call to get the annotation Hash
        //     state.pranaContract.methods.tokenURI(tokenId)
        //     .call({ from: state.currentAccount})
        //     .then((hash) => {
        //         console.log('AnnotationHash')
        //         console.log(hash)
                
        //         // if(hash.length>0){
        //         //     //action to get Annotations from ipfs
        //         //     dispatch('ipfs/getAnnotations', hash, { root: true })
        //         //     .then(arr => {})
        //         // }
        //     }).catch(err => console.log(err))
        // },

    }
}