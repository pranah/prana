<template>
    <v-row>
        <v-col>  
            <h3>Publish Work</h3>
            <v-form>
                <v-text-field 
                    required
                    label="Title"
                    v-model="content.title"
                />
                <v-text-field 
                    required
                    label="Content to Publish"
                    v-model="content.file"
                />
                <v-btn color="success" @click="publish(content)">Publish</v-btn>
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
            file: ''
        }
    }),
    computed: {
        ...mapState([
            
        ])
    },
    methods: {
        ...mapActions([
            'publish'
        ])
    },
}
</script>

<style>

</style>