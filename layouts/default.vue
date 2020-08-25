<template>
    <div>
    <Navbar />
    <nuxt/>
  </div>
  
</template>

<script>
import Navbar from '@/components/Navbar'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      miniVariant: false,
      title: 'Prana',
      peerCount: 'LibP2P Peers: ' + this
    }
  },
  components: {
    Navbar
  },
  methods: {
      ...mapActions({
        fetchProvider: 'web3/fetchProvider',
        getAccount: 'web3/getAccount',
      })
  },
  created() {
    this.fetchProvider();
    this.getAccount();
  },
  async fetch() {
  }
  
}
</script>
<style >

</style>
