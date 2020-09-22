<template>
<section class="container">
    <v-col>
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
        <!-- <div class="cards"> -->
        <v-layout row wrap >
            <v-flex class="cards" background-color = "#ECEFF1" xs12 sm6 md4 lg4 v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
              <div class="boxContainer">
                <v-card max-width="300" :elevation="20" class="ma-3" color = "">
                  <div class="image">
                    <Content v-bind:content="content"/>  
                  </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="middleButtons">
                        <v-btn
                        large
                        color="green"
                        @click="purchase(content)"
                        >
                        BUY
                        </v-btn> 
                        </div>
                    </v-card-actions>
                            <div class="middle">
                            <div class="text">
                                <h1><b>{{content.title}}</b></h1><br>
                                <b>Price: </b>{{content.price}} ETH<br>
                                <b>ISBN: </b>{{content.isbn}}<br>
                                <b>Author: </b>{{content.publisher}}<br>
                            </div>  
                            </div> 
                </v-card>
              </div>
            </v-flex>
        </v-layout>
        <!-- </div> -->
      </v-tab-item>
      <v-tab-item>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in resaleTokens" :key="resaleTokens.indexOf(content)">
              <div class="boxContainer">
                <v-card max-width="300" :elevation="20" class="ma-3" color = "">
                  <div class="image">
                    <ResaleToken v-bind:content="content"/>  
                  </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="middleButtons">
                        <v-btn
                        large
                        color="green"
                        @click="buyToken(content)"
                        >
                        BUY
                        </v-btn> 
                        </div>
                    </v-card-actions> 
                            <div class="middle-resale">
                            <div class="text">
                                <h1><b>{{content.title}}</b></h1><br>
                                <b>Resale Price: </b>{{content.resalePrice}} ETH<br>
                                <b>ISBN: </b>{{content.isbn}}<br>
                                <b>Copy Number: </b>{{content.copyNumber}}<br><br>
                                <!-- <b>Author: </b>{{content.publisher}}<br> -->
                            </div>  
                            </div> 
                </v-card>
              </div>
            </v-flex>
        </v-layout>
      </v-tab-item>
       <v-tab-item>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 class="cards" v-for="content in rentTokens" :key="rentTokens.indexOf(content)">
              <div class="boxContainer">
                <v-card max-width="300" :elevation="20" class="ma-3" color = "">
                  <div class="image">
                    <RentToken v-bind:content="content"/>  
                  </div>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <div class="middleButtons">
                        <v-btn
                        large
                        color="green"
                        @click="rentToken(content)"
                        >
                        RENT
                        </v-btn> 
                        </div>
                    </v-card-actions> 
                            <div class="middle">
                            <div class="text">
                                <h1><b>{{content.title}}</b></h1><br>
                                <b>Renting Price: </b>{{content.rentingPrice}} ETH<br>
                                <b>ISBN: </b>{{content.isbn}}<br>
                                <b>Copy Number: </b>{{content.copyNumber}}<br><br>
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
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('web3', [
            'collectableContent',
            'resaleTokens',
            'rentTokens'
        ])
    },
    methods: {
        ...mapActions('web3', [
            'getCollectables',
            'purchase',
            'buyToken',
            'rentToken'
        ]),
    },
    data () {
      return {
        tabs: null,
        titles: ['BUY FROM AUTHOR', 'BUY FROM OTHER READERS','RENT FROM OTHER READERS']
      }
    },
}
</script>

<style>
.cards {
  align-items: center;
  padding-block: 3%;
  padding-left: 6%;
}
.boxContainer {

  position: relative;
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
  top: 70%;
  bottom: -40%;
  left: 50%;
  height: 40%;
  width: 100%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.middle-resale {

  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 72%;
  bottom: -40%;
  left: 50%;
  height: 0%;
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

.boxContainer:hover .middle-resale {
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