<template>
<section class="container">
    <v-row justify="center">
        <v-col>       
            <h3>Published Works : {{ publishedContent.length }}</h3>
            <v-layout row wrap>
                <v-flex xs12 sm6 md4 lg4 v-for="content in publishedContent" :key="publishedContent.indexOf(content)">
                    <div class="boxContainer">
                    <v-card  max-width="300" :elevation="20" class="ma-3" color = "">
                        <div class="image">
                        <Content v-bind:content="content"/> 
                        </div>
                        <v-card-actions>
                            <!-- <v-spacer></v-spacer> -->
                            <v-row justify="center">
                            <div class="middleButtons">
                            <nuxt-link to="/readPage">
                            <v-btn large color="green" @click="requestFile(content, publishedContent.indexOf(content))" >Read</v-btn>
                            </nuxt-link>
                            </div>
                            <div class="middle">
                            <div class="text">
                                <h1><b>{{content.title}}</b></h1><br>
                                <b>Price: </b>{{content.price}} ETH
                                <b>ISBN: </b>{{content.isbn}}<br>
                                <b>Author: </b>{{content.publisher}}<br>
                            </div>  
                            </div>
                        </v-row>
                        </v-card-actions>
                    </v-card>
                    </div>
                </v-flex>
            </v-layout>
        </v-col>
    </v-row>    
</section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
    data: () => ({
        fileRequested: false,
        dialog: false,
    }),
    computed: {
        ...mapState("web3",[
            'publishedContent'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])
    },
    methods: {
        ...mapActions({
            signMessage: 'web3/signMessage',
            putForResale: 'web3/putForResale',
            requestContent: 'ipfs/requestContent'
        }),
        ...mapMutations({
            getFile: 'ipfs/getFile'
        }),
        requestFile(content, index){
            console.log(content)
            console.log(index)
            // this.requestContent(content.bookHash)
            this.getFile({content, index})
        }
    }
}
</script>

<style>
/* a {  text-decoration: none} */
.container {
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
   background-color: #ECEFF1;
}
.boxContainer {

  position: relative;
  width: 60%;
}

.image {

  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: .5s ease;
  backface-visibility:visible;
}

.middle {

  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 87.5%;
  bottom: -20%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.middleButtons {
  
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.boxContainer:hover .image {
  opacity: 0.3;
}

.boxContainer:hover .middle {
  opacity: 4;
}

.boxContainer:hover .middleButtons {
  opacity: 4;
}

.text {
  background-color: #4CAF50;
  color: white;
  font-size: 14px;
  /* width: 95%; */
  padding: 6px 16px;
}

</style>
                            <!-- <v-dialog v-model="dialog" scrollable max-width="600px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="blue"
                                    dark
                                    small
                                    outlined
                                    v-bind="attrs"
                                    v-on="on"
                                    
                                    >
                                    Read
                                    </v-btn>
                                </template>
                                <v-card>
                                <File v-bind:textFile="content.bookContent" />
                                    
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn small outlined color="blue darken-1" text @click="dialog = false">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog> -->