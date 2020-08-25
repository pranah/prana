<template>
  <div>
    <v-btn small outlined x-large v-if="isMetaMaskProvided==true" color="blue" @click="initEth()">Sign In</v-btn>
    <v-btn small outlined x-large v-else color="blue">Please Install MetaMask</v-btn>    
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('web3',[
      'isMetaMaskProvided',
      'web3',
      'prana'
    ])
  },
  methods: {
    ...mapActions('web3',[
      'initEth'
    ])
  }
}
</script>

<style>

</style>