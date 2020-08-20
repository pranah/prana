<template>
  <v-row justify="center">
    <v-btn
    v-if = "content.isUpForResale === false"
      outlined 
      small
      color="blue" 
      dark
      @click.stop="dialog = true"
    >
      Giveaway
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Enter address</v-card-title>

        <v-form class="giveaway">

                <v-text-field 
                    required
                    label="address"
                    placeholder="Address to giveaway"
                    v-model="address"
                />
                <v-btn small outlined color="#0779e4" @click="dialog = false">Cancel</v-btn>
                <v-btn small outlined color="#0779e4" @click="giveaway({address,tokenId: content.tokenId})">Giveaway</v-btn>
            </v-form>


      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

  export default {
    props: ['content'],
    data: () => ({
        dialog: false,
        address : ""
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