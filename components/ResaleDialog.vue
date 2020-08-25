<template>
    <div>
    <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        
        <v-btn
        v-if = "content.isUpForResale === false"
        small
        outlined
        color="blue"
          v-bind="attrs"
          v-on="on"
        >
          PUT FOR SALE
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="resalePrice" label="Resale Price" type="number" min = '0' required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn  color="blue darken-1" text @click="forSale()">PUT FOR SALE</v-btn>
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
      resalePrice: null
    }),
    props: ['content'],
    computed: { 
    },
    methods: {
        ...mapActions({
            putForResale: 'web3/putForResale',
        }),
        forSale(){
            this.dialog = false
            console.log(this.resalePrice)
            console.log(this.content.tokenId)
            this.putForResale({resalePrice: this.resalePrice, tokenId: this.content.tokenId})
        }
    } 
}
</script>

<style>

</style>