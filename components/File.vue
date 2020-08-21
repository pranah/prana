<template>
    
      <div>
        <pre>
          {{textFile}}
        </pre>
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