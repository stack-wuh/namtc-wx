<template>
  <section class="wrap">
    <div class="header">
      <p>{{list.title}}</p>
    </div>
    <div class="body">
      <img :src="list.img_url" alt="item-img">
      <p>标题：<span>{{list.title}}</span></p>
      <p>时长：<span>{{list.synopsis}}</span></p>
      <p>简介绍：<span>{{list.content}}</span></p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      list:[]
    };
  },
  created(){
    let list = Lockr.get('shopList')
    this.list = list.find(item=>{
      return item.id == this.$route.params.id
    })
    console.log(this.list)
  }
};
</script>

<style lang="less">
.wrap{
  padding:20px 20px;
  background-color: #f8f8f8;
  .header{
    padding-bottom:20px;
    text-align: center;
    font-size: 2em;
    border-bottom:1px solid #eee;
  }
  .body{
    margin-top:30px;
    img{
      width:100%;
    }
    p{
      margin:10px 0;
      font-size: 1.4em;
      color: #999;
      
      span{
        color: #333;
      }
    }
  }
}
</style>