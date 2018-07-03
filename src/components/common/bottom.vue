<template>
  <section class="nav">
    <div class="show-msg "  v-bind:class="[active == 2 ? 'trans-to-up' : '']">
      <section class="item-top">
        <span></span>
        <h3>发布</h3>
        <img src="../../../static/imgs/icon-close.png" alt="close" class="icon-close" @click="active = 1">
      </section>
      <div class="btm-btn-list">
        <p @click="jumpToNav(true)">
          <img src="../../../static/imgs/icon-question2x.png" alt="question1" class="icon-qeustion1">
          <span v-if="!isTeacher">问题</span>
          <span v-else>资料</span>
        </p>
        <p @click="jumpToNav(false)">
          <img src="../../../static/imgs/icon-note2x.png" alt="public" class="icon-public">
          <span>帖子</span>
        </p>
      </div>
    </div>
    <div class="bottom-nav-list">
      <div class="nav-list-item" @click="jumpToOther(index,item)" v-for="(item,index) in tab" :key="index">
        <img v-if="activeUrl !== item.pathUrl" v-bind:src="item.default" alt="tabImg" >
        <img v-else v-bind:src="item.imgUrl" alt="tabImg" >
        <span name="item-name" v-bind:class="{active:activeUrl == item.pathUrl}">{{item.name}}</span>
        <sup class="sup" v-show="item.badge"></sup>
      </div>
    </div>

  </section>
</template>

<script>
import { Tabbar, TabbarItem } from "vux"

const path  = '../../'

export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      tab:[
        {
          name:'首页',
          imgUrl:path + 'static/img/icon-home-active.png',
          default:path + 'static/img/icon-home-default.png',
          pathUrl:'/index',
          badge:false
        },
        {
          name:'发布',
          imgUrl:path + 'static/img/icon-publish-active.png',
          default:path + 'static/img/icon-publish-default.png',
          pathUrl:'/quzi/edit',
          badge:false
        },
        {
          name:'消息',
          imgUrl:path + 'static/img/icon-msg-active.png',
          default:path + 'static/img/icon-msg-default.png',
          pathUrl:'/message/index',
          badge:false
        },
        {
          name:'我的',
          imgUrl:path + 'static/img/icon-user-active.png',
          default:path + 'static/img/icon-user-default.png',
          pathUrl:'/user',
          badge:false
        }
      ],
      defaultValue:0,
      active:0,
      seen:{},
      isTeacher:false,
      activeUrl:''
    };
  },
  methods:{
    jumpToOther(index,data){
      if(this.$route.path == this.tab[index].pathUrl){
        _g.shallowRefresh(this.$route.name)
      }else{ 
        if(this.tab[index].name === '发布'){
          this.activeUrl =  this.active == 2 ? location.href.split('#')[1] : '/quzi/edit'
          this.active = this.active == 2 ? 1 : 2
        }else{
          this.$router.push(this.tab[index].pathUrl)
        }
      }
    },

    jumpToNav(isTure){
      if(isTure){
        if(!this.isTeacher){
          this.$router.push('/quzi/edit/1')
        }else{
          this.$router.push('/quzi/edit/3')
        }
      }else{
        this.$router.push('/quzi/edit/2')
      }
    },

  },
  created(){
    //消息提醒
    this.apiPost('Index/tips').then(res=>{
      this.tab.map(item=>{
        if(item.name == '消息'){
          item.badge = res
        }
      })
    })

    //是否老师
    this.apiPost('Index/isTeacher').then(res=>{
      Lockr.set('isTeacher',res)
      this.isTeacher = res
    })

    this.activeUrl = location.href.split('#')[1]
  }
};
</script>

<style scoped>
.item-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width:100%;
}
.item-top h3{
  flex:1;
  padding-top:2em;
  padding-left:2.4em;
  text-align: center;
}
.bottom-nav-list {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 54px;
  padding:.5em 0;
  box-sizing: border-box;
  border-top: 1px solid #e6e6e6;
  background-color: #fff;
  z-index:10000 !important;
}
.bottom-nav-list .nav-list-item {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  color: #999;
}
.sup{
  position: absolute;
  right:0;
  top:0;
  width:.7em;
  height:.7em;
  text-align: center;
  line-height:1.5em;
  font-size: 1em;
  color: #fff;
  border-radius: 50%;
  background-color: #F74C31;
}
span[name="item-name"]{
  margin-top:.4em;
}
img[alt="tabImg"]{
  width:20px;
  height:20px;
}
.btm-btn-list p{  
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1BBD9C;
}
.btm-btn-list p img{
  width:5em;
  margin-bottom:20px;
}
.show-msg{
  position: absolute;
  top:100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  padding-bottom:4em;
  background-color: #fff;  
  border-top:1px solid #e6e6e6;
  /* z-index: 10000; */
}
@keyframes trans_to_top{
  from {
    top:100px;
  }
  to{
    top:-250px;
  }
}
.trans-to-up{
  animation: trans_to_top 1s ease forwards;
}
.show-msg div{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width:100%;
  height:100px; 
  margin-top:50px;
  color: #666;
  font-size: 1.4em;
  background-color: #fff;
}

.show-msg h3{
  font-size: 1.8em;
  font-weight:400;
  color: #ccc;
}
.active{
  font-weight:normal
}
</style>
