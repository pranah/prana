<template>
  <div>
    <v-btn small outlined v-if="isMetaMaskProvided==true" color="#0779e4" @click="initEth()">Connect MetaMask</v-btn>
    <v-btn small outlined v-else color="#0779e4">Please Install MetaMask</v-btn>    
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