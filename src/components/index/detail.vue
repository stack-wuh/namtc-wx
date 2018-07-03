<template>
    <section class="father">
      <div class="search-box">
        <x-input title="search" class="input">
          <img slot="label" src="../../../static/img/search.png" alt="search" class="icon-search">
        </x-input>
        <x-button mini class="cancel" >取消</x-button>
      </div>
      <!--搜索有结果-->
      <section class="detail">
          <div v-if="!isEmpyt" class="item-list" v-for="item in 4">
            <h5><span class="default">关键词</span>是什么意思?</h5>
            <div>
              <img src="../../../static/img/avatar.jpg" alt="img" class="detail-img">
              <p>这里是一段测试的信息水水水水水水水水水水水水水水水水水水水 水水水水水水水水水水水水水水水水水水水</p>
            </div>
          </div>
          <div v-if="isEmpyt" class="item-list-message">
            <p>没有找到相关的商品信息</p>
            <p>请换一个关键词试试吧</p>
          </div>
      </section>
  </section>
</template>

<script>
  import {XInput} from 'vux'
  export default{
    components:{
      XInput
    },
    data(){
      return{
        isEmpyt:true
      }
    }
  }
</script>

<style scoped>
.search-box{
  position: fixed;
  top:0;
  left:0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
  padding:.5em 1em;
  box-sizing: border-box;
  background-color: #F1F1F1;
}
.input{
  flex:1;
  height:2.5em;
  margin-right:1em;
  border-radius: 2em;
  background-color: #fff;
  box-sizing: border-box;
  border:1px solid #D7D7D7;
}
.cancel{
  color: #1BBD9C;
}
.detail{
  margin-top:3.4em;
  height:100%;
  background-color: #fff;
}
.detail-img{
  width:37px;
  height:37px;
  margin-right:1.6em;
  border-radius: 50%;
}
.item-list h5{
  margin-bottom:1.6em;
}
.item-list{
  padding:1.6em;
  border-bottom:1px solid #F2F2F2;
}
.item-list > div{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-list > div p{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;
  overflow: hidden;
}
.item-list-message{
  display: flex;
  flex-direction: column;
  align-items: center;
  height:calc(100% - 40px);
  justify-content: center;
}
.item-list-message p{
  align-self: center;
  color: #989898;
}
</style>
