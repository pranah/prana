<template>
  <v-container class = "main">
    <v-row>
              <v-col>
                <v-btn small outlined x-large color="blue" to="/publisher">interact as an author</v-btn>
              </v-col>
              <v-col

            >
                <v-btn small outlined x-large color="blue" to="/collector">interact as a reader</v-btn> 
                </v-col>
        </v-row>
  </v-container>
</template>



<script>
import { mapActions, mapState } from 'vuex'
export default {
    computed: {
 
    },
}
</script>

<style>
.main{
  background-color: #ECEFF1;
}

</style>