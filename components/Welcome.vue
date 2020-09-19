<template>
  <div class="container">
       <div class="buttons">
    <v-row>
              <v-col>
                <v-btn  outlined x-large color="blue" to="/publisher">interact as an author</v-btn>
              </v-col>
              <v-col>
                <v-btn  outlined x-large color="blue" to="/collector">interact as a reader</v-btn> 
                </v-col>
    </v-row>
      </div>
  </div>
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