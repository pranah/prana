<template>
    <v-col>
        <h3>Collectable Works</h3>
        <v-btn color="green" @click="getCollectables()">Get Collectables</v-btn>
        <!-- <v-list v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
            <v-list-item>
                <v-row>
                    <Content v-bind:content="content"/>                        
                    <v-col>
                        <v-btn color="green" @click="purchase(content)">Buy</v-btn>
                        <v-btn color="green" @click="purchase(content.returnValues.isbn,content.returnValues.price)">Buy</v-btn>
                    </v-col>
                </v-row>                    
            </v-list-item>
        </v-list> -->
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg3 v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
                <v-card max-width="344" class="ma-3">
                    <Content v-bind:content="content"/>  
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        outlined
                        small
                        color="green"
                        @click="purchase(content)"
                        >
                        Collect
                        </v-btn> 
                    </v-card-actions> 
                </v-card>
            </v-flex>
        </v-layout>

    </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    computed: {
        ...mapState('fleek', [
            'collectableContent'
        ])
    },
    methods: {
        ...mapActions('web3', [
            'getCollectables',
            'purchase'
        ]),
    }
}
</script>

<style>

</style>