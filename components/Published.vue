<template>
    <v-row>
        <v-col>       
            <h3>Published Work: {{ publishedContent.length }}</h3>
            <v-btn color="green" @click="myPublished()">Refresh List</v-btn>
            <v-list v-for="content in publishedContent" :key="publishedContent.indexOf(content)">
                <v-list-item>
                    <Content v-bind:content="content"/>
                </v-list-item>
            </v-list>
        </v-col>
    </v-row>    
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState("fleek",[
            'publishedContent'
        ])
    },
    methods: {
        ...mapActions('web3', [
            'myPublished'
        ])
    }
}
</script>

<style>

</style>