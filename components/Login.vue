<template>
  <div>
    <v-btn color="success" @click="metaMaskConnected()">Connect MetaMask</v-btn>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations([
      'metaMaskConnected'
    ])
  }
}
</script>

<style>

</style>