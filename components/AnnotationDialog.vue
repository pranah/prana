<template>
    <div>

    <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Add annotation
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline"></span>
        </v-card-title>
        <v-card-text>
          <!-- <v-container> -->
            <v-row>
              <v-col cols="12">
                <v-textarea
                    background-color="amber lighten-4"
                    color="orange orange-darken-4"
                    label="Add annotation"
                    :rules="rules"
                    :value="value"
                ></v-textarea>
              </v-col>
            </v-row>
          <!-- </v-container> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    <!-- <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        
        <v-btn
        small
        color="blue"
          v-bind="attrs"
          v-on="on"
        >
          Add annotation
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
          <v-btn  color="blue darken-1" text @click="forSale()">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row> -->
      
    </div>    
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    data: () => ({
      dialog: false,
      resalePrice: null,
      rules: [v => v.length <= 500 || 'Max 500 characters'],
      value: 'Hello!',
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