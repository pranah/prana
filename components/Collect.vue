<template>
    <v-col>
        <h3>Collectable Works</h3>
        <v-layout row wrap>
            <v-flex xs12 sm6 md4 lg4 v-for="content in collectableContent" :key="collectableContent.indexOf(content)">
                <v-card max-width="344" class="ma-3" color = "grey darken-3">
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