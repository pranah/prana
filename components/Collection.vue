<template>
<section class="container">
    <v-col>
        <h3>Personal Collection</h3>
        <v-tabs
          v-model="tabs"
          centered
          grow
         >
          <v-tab
            v-for="title in titles"
            :key="titles.indexOf(title)"
          >
            {{title}}
          </v-tab>
        </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectedContent" :key="collectedContent.indexOf(content)">
                <div class="boxContainer">
                <v-card max-width="300" :elevation="20" class="ma-3" color = "">
                    <div class="image">
                    <MyCopy v-bind:content="content"/> 
                    </div>
                    <v-card-actions>
                        <div class="middleButtons">
                        <v-row justify="center">
                        <v-col align-self="center">
                        <v-row justify="center">
                            
                            <nuxt-link to="/readPage">
                            <v-btn large color="green" @click="requestFile(content, collectedContent.indexOf(content))" >Read</v-btn>
                            </nuxt-link>
                           
                        </v-row>
                        </v-col>
           
                        <v-col>
                        <v-row justify="center">
                        <ResaleDialog v-bind:content="content"/>
                        </v-row>
                        </v-col>
                        
                        <v-col>
                        <v-row justify="center">
                        <RentDialog v-bind:content="content"/>
                        </v-row>
                        </v-col>

                        <v-col>
                        <v-row justify="center">
                        <GiveawayDialog v-bind:content="content"/>
                        </v-row>
                        </v-col>
                        </v-row>
                         </div>
                    </v-card-actions>
                </v-card>
                </div>
            </v-flex>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in rentedTokens" :key="rentedTokens.indexOf(content)">
              <div class="boxContainer">
                <v-card max-width="300" :elevation="20" class="ma-3" color = "">
                  <div class="image">
                    <RentToken v-bind:content="content"/>  
                  </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="middleButtons">
                        <!-- <v-btn
                        large
                        color="green"
                        @click="requestFile(content, rentedTokens.indexOf(content))"
                        >
                        READ
                        </v-btn>  -->
                        <nuxt-link to="/readPage">
                        <v-btn large color="green" @click="requestFile(content, rentedTokens.indexOf(content))" >Read</v-btn>
                        </nuxt-link>
                        </div>
                    </v-card-actions> 
                            <div class="middle">
                            <div class="text">
                                <h1><b>{{content.title}}</b></h1><br>
                                <!-- <b>Price: </b>{{content.rentingPrice}} ETH<br> -->
                                <b>Copy Number: </b>{{content.copyNumber}}<br>
                                <b>ISBN: </b>{{content.isbn}}<br><br>
                            </div>  
                            </div> 
                </v-card>
              </div>
            </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs-items>
    </v-col>  
</section>      
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    data: () => ({
        dialog: false,
        tabs: null,
        titles: ['MY BOOKS', 'RENTED BOOKS']
    }),
    computed: {
        ...mapState('web3', [
            'collectedContent',
            'rentedTokens'
        ] ),
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
a {  text-decoration: none}

.container{
    background-color: #ECEFF1;
}

.boxContainer {

  position: absolute;
  width: 50%;
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
  align-items: center;
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

<!-- <v-dialog v-model="dialog" fullscreen scrollable max-width="600px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                    color="blue"
                                    dark
                                    small
                                    outlined
                                    v-bind="attrs"
                                    v-on="on"
                                    @click = 'requestFile(content.bookHash)'
                                    >
                                    Read
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn small outlined color="blue darken-1" text @click="dialog = false">Close</v-btn>
                                    </v-card-actions>
                                <File v-bind:textFile="textFile" />    
                                <File v-bind:textFile="content.bookContent" />    
                                </v-card>
                            </v-dialog> -->
                            <!-- <v-btn small outlined color="blue" @click="requestFile(content.bookHash)" to="/readPage">Read</v-btn> -->