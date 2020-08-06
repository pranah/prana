<template>
    
      <div>
        <v-card-title>Select Country</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          {{textFile}}
        </v-card-text>
        <v-divider></v-divider>
    </div>
        

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    props: ['textFile'],
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        
    },
   
}
</script>

<style>

</style>