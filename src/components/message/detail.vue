<template>
  <section class="wrap">
    <div class="item-detail">
      <p class="item-title title-center">{{list.title}}</p>
      <p class="title-center">{{list.sub_time}}</p>
      <article class="item-content" v-html="list.content" ref="article-content"></article>
    </div>
  </section>
</template>

<script>
  export default{
    data(){
      return{
        list:[]
      }
    },
    created(){
      this.list = Lockr.get('notice').find(item=>{
        return item.id == this.$route.params.id
      })
    }
  }
</script>

<style scoped>
.wrap{
  padding:20px;
}
.item-detail{
  height: 100%;
}
.item-title{
  font-size: 1.8em;
}
.item-title + p{
  padding-bottom:28px;
  color: #9C9C9C;
  font-size: 1.2em;
  border-bottom:1px solid #e6e6e6;
}
.title-center{
  text-align: center;
}
.item-content{
  margin-top:25px;
  padding-bottom:20px;
  color: #9C9C9C;
  font-size: 1.5em !important;
  line-height:20px;
}
</style>
