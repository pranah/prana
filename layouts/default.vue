<template>
  <v-app >
    <div class = "main">
    <Navbar />
    <nuxt class = "main"/>
  </div>
  </v-app>
 
  
</template>

<script>
import Navbar from '@/components/Navbar'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      links: [
        { to: '/', name: 'Home' },
        { to: '/collector', name: 'Reader' },
        { to: '/publisher', name: 'Author' },
        { to: '/about', name: 'About' },
      ],
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
  .main{
background-color: #ECEFF1;
/* height: 100vh; */
}

</style>
