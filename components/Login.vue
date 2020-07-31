<template>
  <div>
    <!-- <v-btn color="green" @click="metaMaskConnect()">Connect MetaMask</v-btn> -->
    <v-btn v-if="isMetaMaskProvided==true" color="green" @click="initEth()">Connect MetaMask</v-btn>
    <v-btn v-else color="green">Please Install MetaMask</v-btn>    
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