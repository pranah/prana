<template>
  <section class="container">
    <div>
      <!-- <img class="logo" height="70" src="~/assets/pranaFinalLogo.svg" alt="logo"> -->
      <!-- <h1 class="title">
        WELCOME
      </h1> -->
        <Welcome v-if="currentAccount != null"/>
              <Login v-else />   
            <p class="subtitle"> 
            eBook Publishing Using NFTs <br> <br>

            An eBook publishing platform where each copy of each title are represented by NFTs,<br>
             thereby making them unique to enable new behaviors for the readers and giving them more <br>freedom over the content they own.
           
              </p>
              <p class = 'tag'>(MetaMask needs to be connected to Ropsten Test Network)</p>
      </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('web3', [
      'currentAccount'
    ])
  },
}
</script>

<style>
  .container {
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
   background-color: #ECEFF1;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
  display: block;
  font-weight: 300;
  font-size: 200px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 26px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.tag{
  color: #526488;

}
</style>