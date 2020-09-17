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
                    v-model= "value"
                ></v-textarea>
              </v-col>
            </v-row>
          <!-- </v-container> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="addAnnotation()">Save</v-btn>
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
      rules: [v => v.length <= 500 || 'Max 500 characters'],
      value: '',
    }),
    // props: ['content', 'index'],
    computed: { 
      
      ...mapState('ipfs', [
            'textFile', 'content', 'index'
        ]) 
    },
    methods: {
        ...mapActions({
            putForResale: 'web3/putForResale',
        }),
        ...mapActions({
            uploadAnnotations: 'ipfs/uploadAnnotations',
        }),
        addAnnotation(){
            this.dialog = false
            console.log(this.value)
            console.log(this.index)
            this.uploadAnnotations({
              annotation: this.value, 
              content: this.content, 
              index: this.index
              })
            this.value= ''
        }
    } 
}
</script>

<style>

</style>