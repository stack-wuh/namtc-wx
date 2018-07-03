<template>
  <section class="wrap">
    <div class="warp-top">
      <h4 class="top-title">{{list.title}}</h4>
      <p>{{list.add_time}}</p>
    </div>
    <article class="item-detail" v-html="list.content"></article>
  </section>
</template>

<script>
  export default{
    data(){
      return{
        list : []
      }
    },
    methods:{
      fetchData(e){
        this.apiPost('Index/datumDetail',{id:e}).then(res=>{
          this.list = res
        })
      },
    },
    created(){
      this.fetchData(this.$route.params.id)
    }
  }
</script>

<style scoped>
.warp-top{
  padding:5px 10px;
  background-color: #fff;
}
.item-detail{
  width:100%;
  margin-top:20px;
  padding:10px;
  font-size:1.5em;
  background-color: #fff;
  box-sizing: border-box;
}
.top-title{
  font-size: 1.9em;
  font-family: 'PingFangSC-Semibold';
}
.top-title + p{
  margin-top:10px;
  color: #B5B5B5;
}
</style>
