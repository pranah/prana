<template>
    <div>
    <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        
        <v-btn
        v-if = "content.isUpForResale === false && content.isUpForRenting == false"
        large
        color="green"
          v-bind="attrs"
          v-on="on"
        >
          PUT FOR RENT
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="rentingPrice" label="Renting Price" type="number" min = '0' required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn  color="blue darken-1" text @click="forRent()">PUT FOR RENT</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
      
    </div>    
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data: () => ({
      dialog: false,
      rentingPrice: null
    }),
    props: ['content'],
    computed: { 
    },
    methods: {
        ...mapActions({
            putForRent: 'web3/putForRent',
        }),
        forRent(){
            this.dialog = false
            console.log(this.rentingPrice)
            console.log(this.content.tokenId)
            this.putForRent({rentingPrice: this.rentingPrice, tokenId: this.content.tokenId})
        }
    } 
}
</script>

<style>

</style>