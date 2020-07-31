<template>
  <v-col>{{ bucket }}</v-col>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    props: ['bucket'],
    methods: {
        ...mapActions('libp2p', [
            'subscribeToContent'
        ])
    },
    created() {
        this.subscribeToContent(this.bucket);
    } 
}
</script>

<style>

</style>