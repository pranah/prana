<template>
    <article ref="el">
      <div class="content">
        <pre v-if = "textFile" class="fileFormat">
          {{textFile}}
        </pre>
    </div>
    </article>    

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'file',
    mounted () {
        this.$el.addEventListener('scroll', function() {
            let scrollTop = this.$el.scrollTop;
            let p_height = this.$el.clientHeight;
            let c_height = this.$el.scrollHeight;
            
            let scrollPercent = (scrollTop) / (c_height - p_height);
            let scrollPercentRounded = Math.round(scrollPercent*100);
            
            this.$emit('progressUpdate', scrollPercentRounded);
        }.bind(this));
    },
    // props: ['textFile'],
    computed: {
        ...mapState('web3', [
            'currentAccount'
        ]),
        ...mapState('ipfs', [
            'textFile'
        ])
    },
   
}
</script>

<style>
    /* .fileFormat {
        text-align: initial;
    } */
    article {
        width: 100%;
        flex: 1 1 100%;
        max-height: calc(90vh - 120px);
        background-color: #FFF;
        overflow: scroll;
    }
    article .content {
        padding: 25px;
    }
</style>