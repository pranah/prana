<template>

  <v-row>
    <v-col><v-btn small outlined color="#0779e4" to="/publisher">as an author</v-btn></v-col>
    <v-spacer/>
    <v-col><v-btn small outlined color="#0779e4" to="/collector">as a reader</v-btn></v-col>
  </v-row>
 
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    computed: {
 
    },
}
</script>

<style>

</style>