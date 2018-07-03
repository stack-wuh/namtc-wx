<template>
  <section class="wrap">
    <div class="top-fixed">
      <div class="item-top">
        <span>{{integral}}</span>
        <span @click="jumpToOther(1,item.id)" style="color: #1bbd9c">积分记录</span>
      </div>
      <nav class="nav-list">
        <span :class="active===1?'active':''" @click="active=1">可兑换</span>
        <span :class="active===2?'active':''" @click="active=2">已兑换</span>
      </nav>
    </div>
    <div class=" item-list">
      <div class="item-detail" v-for="(item,index) in shop" v-if="active ===1" :key="index">
        <div @click="jumpToOther(2,item.id)" name="img-box" >
          <img :src="item.img_url" alt="shop" class="shop">
        </div>
        <span class="item-list-title" >{{item.title}}</span>
        <p class="item-list-detail">{{item.synopsis}}</p>
        <span class="i_span">{{item.required_integral}}积分</span>
        <span style="color: #1bbd9c" @click="trade(item)">兑换</span>

      </div>           
      <div class="item-detail" v-for="(item,index) in consume" v-if="active ===2" :key="index">
        <div name="img-box">
          <img :src="item.img_url" alt="shop" class="shop">
        </div>
        <span class="item-list-title">{{item.title}}</span>
        <p class="item-list-detail">{{item.synopsis}}</p>
        <span class="i_span">{{item.required_integral}}积分</span>
        <span style="color: blue" v-if="parseInt(item.status)">已兑换</span>
        <span style="color: red" v-else>未处理</span>
      </div>
    </div>

        <div class="form-modal" v-show="isShowInfo">
          <div class="form-area">
            <div class="form-item">
              <span>请填写收货信息</span>
              <img @click="isShowInfo = false" src="../../../static/imgs/icon-close.png"  />
            </div>
            <div class="form-item" >
              <label for="name">收货人姓名:</label>
              <input id="name" class="my-input" placeholder="请输入收货人姓名" v-model="userInfo.receiver" />
            </div>
            <div class="form-item" >
              <label for="address">收货人地址:</label>
              <input id="address" class="my-input" placeholder="请输入收货人地址" v-model="userInfo.address" />
            </div>  
            <div class="form-item">
              <span @click="submit" class="btn">确定</span>
            </div>    
          </div>
        </div>
  </section>
</template>

<script>
import {Confirm,TransferDomDirective as TransferDom} from 'vux'

const userInfo = {
  receiver:'',
  address:''
}
  export default {
    directives:{
      TransferDom
    },
    components:{
      Confirm
    },
    data() {
      return {
        integral: 0,
        shop: [],
        consume: [],
        active: 1,
        isShowInfo:false,
        userInfo:userInfo,
        isSend:false,
        data:{}
      }
    },
    methods: {
      jumpToOther(type,id) {
        type == 1 && this.$router.push('/message')
        type == 2 && this.$router.push('/inte/detail/'+id)
      },
      getData() {
        this.apiPost('Index/integral').then(res => {
          this.consume = res.consume;
          this.shop = res.shop;
          this.integral = res.integral;
          Lockr.set('shopList',res.shop)
        })
      },

      submit(){
        let result = true
        this.isSend = true
        for(var k in this.userInfo){
          if(this.userInfo[k] == ''){
              this.$vux.toast.text('请填写收货信息','middle')
              result = false
          }
        }
         result && this.trade(this.data)
      },
      trade(data) {
        this.data = data
        let info = {}
        info.id = data.id
        info = Object.assign(info,this.userInfo)
        if(data.need_address == 1){
          this.isShowInfo = true
        }else{
          this.isSend = true
        }
        if(this.isSend){
          this.apiPost('Index/trade', info).then(res => {
            this.$vux.toast.text(res.msg, 'middle');
            this.getData();
            setTimeout(() => {
              this.isShowInfo = false
              for(var k in this.userInfo){
                this.userInfo[k] = ''
              } 
            });
          })
        }
      },
    },
    created() {
      this.getData();
    },
  }
</script>

<style scoped>
  .top-fixed {
    height: 12em;
    z-index: 1000;
  }
  .item-top {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: .5em 0;
    font-size: 3em;
    box-sizing: border-box;
    background-color: #f9f9f9;
    z-index: 1000;
  }
  .item-top span:last-of-type {
    margin-top: .5em;
    font-size: .5em;
  }
  nav {
    position: fixed;
    top: 9em;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    width: 100%;
    padding: 1.5em 0 0 0;
    background-color: #fff;
    border-top: 1px solid #e4e4e4;
    border-bottom: 1px solid #e4e4e4;
    z-index: 1000;
  }
  nav span {
    display: inline-block;
    width: 8em;
    padding-bottom: .5em;
    font-size: 1.4em;
    text-align: center;
    color: #a9a9a9;
  }
  .active {
    border-bottom: 1px solid  !important;
  }
  .item-list {
    display: flex;
    flex-flow: wrap;
    justify-content: space-between;
    width:100%;
    /* height:100%; */
    padding: 1em 1em;
    margin-top:2em;
    box-sizing: border-box;
  }
  .shop {
    width: 10.8em;
    height: 10.8em;
  }
  .item-list .item-detail {
    /* flex:.5; */
    display: flex;
    flex-direction: column;
    align-items: center;
    width:50%;
    margin-bottom:1.6em;
  }
  .item-list .item-detail span:first-of-type {
    margin: .5em 0;
  }
  .item-list .item-detail .i_span {
    color: #f06912;
  }
  .item-list-title{
    display: inline-block;
    width:100%;
    /* min-height:30px; */
    padding:0 .3em;
    font-weight: bold;
    box-sizing: border-box;
  }
  .item-list-detail{
    width:100%;
    padding:0 .3em;
    text-align:center;
    box-sizing: border-box;
  }
  div[name="img-box"]{
    display: flex;
    align-items: center;
    justify-content: center;
    width:10.8em;
    height:10.8em;
    overflow: hidden;
  }
</style>

<style lang="less" scoped>
  .form-modal{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    background-color:rgba(0,0,0,.5);
    z-index:1000 !important;
    
    .form-area{
      position:relative;
      top:25%;
      width:90%;
      height:220px;
      padding:10px 20px;
      margin:0 auto;
      border-radius:10px;
      background-color:#fff;
      box-sizing:border-box;
      .form-item{
        display:flex;
        align-items:center;
        margin-bottom:10px;
        label{
          width:80px;
          font-size:1.5em;
        }
        input{
          flex:1;
          height:30px;
          padding:0 10px;
          margin-left:10px;
          outline:none;
          border:none;
          border-radius:5px;
          border:1px solid #eee;
        }
        .btn{
          display:inline-block;
          width:100%;
          height:40px;
          font-size:1.5em;
          line-height:40px;
          text-align:center;
          color:#fff;
          border-radius:5px;
          background-color:#1BBD9C;
        }
      }
      .form-item:first-of-type{
        position:relative;
        padding-top:0;
        margin-bottom:10px;
        font-size:1.6em;
        color:#333;

        span{
          display:block;
          width:100%;
          line-height:40px;
          text-align:center;
        }
        img{
          position:absolute;
          right:-25px;
          top:-15px;
          margin-bottom:20px;
        }
      }
      .form-item:last-of-type{
        margin-top:30px;
      }
    }
  }
</style>