<template>
  <section class="wrap">
    <p class="title">{{info.title}}</p>
    <p class="time">{{info.time}}</p>
    <article class="article" v-html="info.content"></article>
  </section>
</template>


<script>
export default {
  data(){
    return{
      info:{}
    }
  },
  methods:{
    fetchData(){
      this.apiPost('Index/bannerDetail',{id:this.$route.params.id})
        .then(res=>{
          this.info = res
        })
    }
  },
  created(){
    this.fetchData()
  }
}
</script>


<style scoped>
.title{
  padding: 10px 0 0 0 ;
  text-align: center;
  font-size: 20px;
  color: #333;
}
.time{
  font-size: 14px;
  color: #999;
  text-align: center;
}
article.article{
  height:calc(100% - 70px);
  padding:10px;
}
</style>
