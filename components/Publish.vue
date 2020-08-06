<template>
    <v-row>
        <v-col>  
            <h3>Publish Work</h3>
            <v-form class="publishForm">
                <v-text-field 
                    required
                    label="Title"
                    v-model="content.title"
                />
                <!-- <v-text-field 
                    required
                    label="Content to Publish (file path)"
                    v-model="content.file"
                /> -->
                <v-text-field 
                    type="number" 
                    min="0" 
                    max="9999999999999" 
                    required
                    label="ISBN"
                    v-model="content.isbn"
                />
                <v-file-input
                accept=".txt, .rtf, .pdf"
                placeholder="Content to Publish"
                label="File"
                v-model="file"
                v-on:change="fileUpload()"
                ></v-file-input>

                <v-text-field 
                    type="number"
                    min="0" 
                    max="999999" 
                    required
                    label="Price in ETH"
                    v-model="content.price"
                />
                <!-- <v-btn small outlined color="blue" @click="publish(content)">Publish</v-btn> -->
                <v-btn small outlined color="blue" @click="publish(content)">Publish</v-btn>
            </v-form>
        </v-col>
    </v-row>    
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data: () => ({
        content: {
            title: '',
            file: null,
            isbn: 0,
            price: 0,
            transactionCut: 0
        },
        file: null
    }),
    computed: {
        ...mapState('fleek',[
            'client'
        ]),
        ...mapState('web3', [
            'prana'
        ]),
    },
    methods: {
        ...mapActions('ipfs',[
            'publish'
        ]),
        fileUpload(){
            var reader = new FileReader()
            reader.readAsArrayBuffer(this.file);
            reader.onloadend = () => {
            this.content.file = Buffer(reader.result)
            console.log(this.content.file)
            }
        }
    },
}
</script>

<style>
    .publishForm {margin: 5%;}
</style>