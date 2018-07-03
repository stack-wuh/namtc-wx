<template>
  <section class="wrap">
        <div @click="jumpToOther(item)" class="item-list" v-for="(item,index) in list" :key="index">
          <p>{{item.title}}</p>
          <p>描述: {{item.describe}}</p>
          <p>奖励积分: {{item.integral}}  &nbsp;&nbsp;发起时间: {{item.sub_time}}</p>
        </div>    
            
    <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>
    <loading v-model="showLoading" :text="textLoading"></loading>
  </section>
</template>

<script>
import {Loading,LoadMore} from 'vux'
  export default{
    components:{
      Loading,
      LoadMore
    },
    data(){
      return{
        list:[],
        page:1,
        isShow:false,
        showLoading:false,
        textLoading:'加载中...',
        msgShow:false,
      }
    },
    methods:{
      jumpToOther(e){
        this.$router.push('/question/edit/'+e.id)
      },
      fetchData(){
        this.apiPost('Index/questionnaire').then(res=>{
          this.list = res ? res : []
        })
      }
    },

    mounted(){
      this.fetchData()
    }
  }
</script>

<style scoped>
.item-list{
  margin-bottom:10px;
  padding:10px 20px;
  background-color: #fff;
  border-top:1px solid #e6e6e6;
  border-bottom:1px solid #e6e6e6;
  box-sizing: border-box;
}
.item-list:first-of-type{
  border-top:none;
}
.item-list p:first-of-type{
  margin-bottom:10px;
  font-size: 1.6em;
  color: #363636;
}
.item-list p:first-of-type ~ p{
  font-size: 1.2em;
  color: #969696;
}
.item-list p:last-of-type{
  margin-top:.5em;
}
</style>
