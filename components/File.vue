<template>
    
      <div>
        <!-- <v-card-title>Book Content</v-card-title>
        <v-divider></v-divider> -->
        <!-- <v-card-text style="height: 300px;"> -->
            <pre>
          {{textFile}}
          </pre>
        <!-- </v-card-text> -->
        <!-- <v-divider></v-divider> -->
    </div>
        

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    // props: ['textFile'],
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])
    },
   
}
</script>

<style>

</style>