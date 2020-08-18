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
                    min="1000000000000" 
                    max="9999999999999" 
                    required
                    label="ISBN"
                    v-model="content.isbn"
                />
                

                <v-text-field 
                    type="number"
                    min="0" 
                    max="999999" 
                    required
                    label="Price in ETH"
                    v-model="content.price"
                />
                <v-text-field 
                    type="number"
                    min="0" 
                    max="999999" 
                    required
                    label="Creator's Cut (Your cut in percentage of any secondary transactions)"
                    v-model="content.transactionCut"
                />
                <v-file-input
                accept=".jpg, .png"
                placeholder="Cover Image"
                label="File"
                v-model="image"
                v-on:change="imageUpload()"
                ></v-file-input>

                <v-file-input
                accept=".txt, .rtf, .pdf"
                placeholder="Content to Publish"
                label="File"
                v-model="file"
                v-on:change="fileUpload()"
                ></v-file-input>
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
            image: null,
            file: null,
            isbn: 0,
            price: 0,
            transactionCut: 0
        },
        file: null,
        image: null,
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
        },
        imageUpload(){
            var reader = new FileReader()
            reader.readAsArrayBuffer(this.image);
            reader.onloadend = () => {
            this.content.image = Buffer(reader.result)
            console.log(this.content.image)
            }
        }
    },
}
</script>

<style>
    .publishForm {margin: 5%;}
</style>