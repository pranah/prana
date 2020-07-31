<template>
    <v-col>
        <h3>Personal Collection</h3>
        <v-list v-for="content in collectedContent" :key="collectedContent.indexOf(content)">
            <v-list-item>
                <v-row>
                    <v-col>
                        <span>{{ content.tokenId }}</span>    
                    </v-col>  
                    <MyCopy v-bind:bucket="content.bucket"/>                 
                    <v-col>
                        <v-btn color="green" @click="signMessage(content.bucket)">Download</v-btn>
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
            'collectedContent'
        ])
    },
    methods: {
        ...mapActions('libp2p', [
            'requestContentKey'
        ]),
        ...mapActions('web3', [
            'signMessage'
        ])
    }
}
</script>

<style>

</style>