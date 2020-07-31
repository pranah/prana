<template>
    <v-col>
        <h3>Collectable Works</h3>
        <v-btn color="green" @click="getCollectables()">Get Collectables</v-btn>
        <v-list v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
            <v-list-item>
                <v-row>
                    <Content v-bind:content="content"/>                        
                    <v-col>
                        <v-btn color="green" @click="purchase(content)">Buy</v-btn>
                        <!-- <v-btn color="green" @click="purchase(content.returnValues.isbn,content.returnValues.price)">Buy</v-btn> -->
                    </v-col>
                </v-row>                    
            </v-list-item>
        </v-list>
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