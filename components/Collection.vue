<template>
    <v-col>
        <h3>Personal Collection</h3>
        <v-list v-for="content in collectedContent" :key="collectedContent.indexOf(content)">
            <v-list-item>
                <v-row> 
                    <MyCopy v-bind:content="content"/>                 
                    <v-col>
                        <p v-if="content.loadingContent==true">Loading</p>
                        <v-btn v-else small outlined color="green" @click="signMessage(content)">Download</v-btn>
                        <v-btn 
                        v-if = "content.isUpForResale === false"
                        small 
                        outlined 
                        color="green" 
                        @click="putForResale({resalePrice: 2, tokenId: content.tokenId})">Put for Sale</v-btn>
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
            'collectedContent',
        ])
    },
    methods: {
        ...mapActions('web3', [
            'signMessage',
            'putForResale'
        ])
    }
}
</script>

<style>

</style>