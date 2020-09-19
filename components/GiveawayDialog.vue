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
         GIVE AWAY
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field placeholder="Address to giveaway" v-model="address" label="Address"  min = '0' required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn  color="blue darken-1" text @click="giveaway({address,tokenId: content.tokenId})">GIVE AWAY</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
      
    </div>    
</template>





<script>
import { mapActions } from 'vuex'

  export default {
    props: ['content'],
    data: () => ({
        dialog: false,
        address : null
    }),
    // data () {
    //   return {
    //     dialog: false,
    //   }
    // },
    methods: {
        ...mapActions('web3',['giveaway'
        ]),
  }
  }
</script>