<template>
  <section class="wrap">
    <div :class="[isShowSwiper == 1 ? 'down_to_up' : isShowSwiper == 2 ? 'up_to_down' : '']" style="height:140px;">
      <swiper height="140px" dots-position="center" auto>
        <swiper-item v-for="(item,index) in banner" :key="index">
          <div @click="jumpToOther(5,item)" class="swiper-item">
            <img :src="item.img" class="item-img">
            <span class="item-title">{{item.title}}</span>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <nav class="top-nav">
      <div>
        <span @click="changeCategory(1)" v-bind:class="{'active':category === 1}">精选</span>
        <span @click="changeCategory(2)" v-bind:class="{'active':category === 2}">关注</span>
      </div>
      <img @click="jumpToOther(3)" src="../../../static/img/icon-search@2x.png" alt="search" class="icon-search">
    </nav>
    <scroll ref="wrapper" :class="{'h80':isShowSwiper != 2}" :data="article" :pulldown="pulldown" @pulldown="fetchData">
      <div class="content" ref="content" @touchstart="touchStart" @touchend="touchEnd">
        <section  v-if="category == 1" class="item-list " v-for="(item,index) in list" :key="index">
          <div class="item-top" v-if="subIndex == 0" v-for="(subItem,subIndex) in item" :key="subIndex">
            <span class="title" v-if="subItem.type=='文章'" >【专题{{subItem.type}}】</span>
            <span class="title" v-else>【{{subItem.type}}交流】</span>
            <span @click="jumpToOther(2,subItem.type)" class="btn-more">查看更多
              <img src="../../../static/imgs/icon-arrow-right.png" alt="icon-arrow-right">
            </span>
          </div>
          <article @click="jumpToOther(4,subItem)"  v-for="(subItem) in item" >
              <span class="icon">
                  <img v-if="parseInt(subItem.is_roof)" src="../../../static/imgs/icon-roof.png" alt="roof">
                  <img v-if="parseInt(subItem.is_choice)" src="../../../static/imgs/icon-choose.png" alt="choose">
              </span>
              <p class="article-title">{{subItem.title}}</p>
              <p class="acticle-desc" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">{{subItem.content}}</p>
              <p v-if="subItem.img" class="item-img-box">
                <img :src="subItem.img" alt="">
              </p>
              <div class="btn-list">
                <span><img src="../../../static/imgs/icon-visite.png" alt="icon_visite"> {{subItem.browse}}</span>
                <span><img src="../../../static/imgs/icon-ok-default.png" alt="icon_ok"> {{subItem.praised}}</span>
                <span><img src="../../../static/imgs/icon-like.png" alt="icon_like"> {{subItem.follower}}</span>
                <span><img src="../../../static/imgs/icon-message.png" alt="icon_message"> {{subItem.count}}</span>
              </div>  
         </article>               
        </section>
        <section v-if="category == 2" class="item-list" v-for="(item,index) in list" :key="index">
          <div class="item-top" v-if="subIndex == 0" v-for="(subItem,subIndex) in item" :key="subIndex">
            <span class="title" v-if="subItem.type=='文章'" >【专题{{subItem.type}}】</span>
            <span class="title" v-else>【{{subItem.type}}交流】</span>
            <span @click="jumpToOther(2,subItem.type)" class="btn-more">查看更多
              <img src="../../../static/imgs/icon-arrow-right.png" alt="icon-arrow-right">
            </span>
          </div>
          <article @click="jumpToOther(4,subItem)"  v-for="(subItem) in item" >
              <span class="icon">
                  <img v-if="parseInt(subItem.is_roof)" src="../../../static/imgs/icon-roof.png" alt="roof">
                  <img v-if="parseInt(subItem.is_choice)" src="../../../static/imgs/icon-choose.png" alt="choose">
              </span>
              <p class="article-title">{{subItem.title}}</p>
              <p class="acticle-desc" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">{{subItem.content}}</p>
              <p v-if="subItem.img" class="item-img-box">
                <img :src="subItem.img" alt="">
              </p>
              <div class="btn-list">
                <span><img src="../../../static/imgs/icon-visite.png" alt="icon_visite"> {{subItem.browse}}</span>
                <span><img src="../../../static/imgs/icon-ok-default.png" alt="icon_ok"> {{subItem.praised}}</span>
                <span><img src="../../../static/imgs/icon-like.png" alt="icon_like"> {{subItem.follower}}</span>
                <span><img src="../../../static/imgs/icon-message.png" alt="icon_message"> {{subItem.count}}</span>
              </div>  
         </article>          
        </section>
        <div v-if="isShowMore"><p class="btn-next" @click="loadMore">加载更多</p></div>
        <div v-if="!isShowMore"><load-more :show-loading="false" :tip="('没有更多啦')"></load-more></div>
      </div>
    </scroll>
    <div class="circly default">
      <span  @click="jumpToOther(1)">问卷<br>调查</span>
    </div>
    <bottom class="nav"></bottom>
    <loading v-model="showLoading" :text="textLoading"></loading>
  </section>
</template>
<script>
import { Tab, TabItem, Loading, LoadMore,Swiper,SwiperItem } from "vux";
import Bottom from "../common/bottom";
import scroll from "../common/scroll";
export default {
  components: {
    Tab,
    TabItem,
    Bottom,
    Loading,
    LoadMore,
    scroll,
    Swiper,
    SwiperItem
  },
  data() {
    return {
      category: 1,
      list: [],
      page: 1,
      showMore: false,
      article: [],
      newArticle:[],
      question: [],
      isShow: true,
      showLoading: false,
      textLoading: "加载中...",
      isShowMore: false,
      pulldown: true,
      pullup:true,
      isactive:false,
      startY:0,
      endY:0,
      banner:[],
      isShowSwiper:-1, 
    };
  },
  methods: {
    touchEnd(e){
      if(e.changedTouches.length == 1){
        this.endY = e.changedTouches[0].clientY
      }
      if(this.startY != this.endY){
        this.isactive = true
      }else{
        this.isactive = false
      }
      if(this.startY < 100 && this.endY>150 && this.endY > this.startY){
        this.isShowSwiper = 2
      }
      if(this.startY != this.endY && this.startY>150){
        this.isShowSwiper = 1
      }
    },
    touchStart(e){
      if(e.touches.length == 1){
        this.startY = e.touches[0].clientY
      }
    },
    loadMore(){
      if(this.isShowMore){
        this.page++
        this.fetchData()
      }
    },
    fetchData() {
      console.log('is ok')
      let _url = "";
      this.showLoading = true;
      _url = this.category == 1 ? "Index/indexCho" : "Index/indexFol";
      this.apiPost(_url, { page: this.page }).then(res => {
        this.showLoading = false;
        this.banner = res.banner
        if(res.list){
          this.article = this.article.concat(res.list)
          this.newArticle = []
          this.question = []
          this.article.map(item=>{
            if(item.sub_name){
              this.newArticle.push(item)
            }else{
              this.question.push(item)
            }
          })
          this.list = [this.newArticle,this.question]
          if(res.list.length == 10){
            this.isShowMore = true
          }else{
            this.isShowMore = false
          }
        }
      });
    },

    changeCategory(type) {
      this.category = type;
      this.article = [];
      this.newArticle = []
      this.question = []
      this.page = 1
      this.fetchData();
    },

    jumpToOther(type, data) {
      let path = "";
      if (type === 1) {
        path = "question/list";
      } else if (type === 2) {
        if (data === "问题") path = "question";
        else path = "article";
      } else if (type === 3) {
        path = "index/search";
      } else if (type === 4) {
        if (data.type === "问题") path = "question/detail/" + data.id;
        else path = "article/detail/" + data.id;
      }else if(type == 5){
        path = 'index/carousle/' + data.id
      }
      router.push(path);
    },
    getFolloerClassify() {
      this.apiPost("INdex/followClassify");
    }
  },
  mounted() {
    this.fetchData();
    this.getFolloerClassify()
  }
};
</script>

<style scoped>
@keyframes up_to_down {
  from{
    transform: translateY(-140px);
    height:0;
  }
  to{
    transform: translateY(0);
    height:140px;
  }
}
@keyframes down_to_up{
  from{
    transform: translateY(0);
    height:140px;
  }
  to{
    transform: translateY(-140px);
    height:0;
  }
}
.down_to_up{
  animation: down_to_up .5s forwards linear;
}
.up_to_down{
  animation: up_to_down .5s forwards linear;
}
.h80{
  height:83% !important;
}
.item-img-box{
  width: 100%;
  text-align: center;
  overflow: hidden;
}
.item-img-box img{
  width:90%;
  height:140px;
}
.swiper-item{ 
  position: relative;
}
.swiper-item .item-img{
  width: 100%;
  height:140px;
}
.swiper-item .item-title{
  position: absolute;
  bottom:20px;
  left:15px;
  font-size: 20px;
  color: #fff;
}
.wrapper{
  /* height:83%; */
  height:60%;
  overflow: hidden;
}
.scroller {
  position: relative;
  top: 43px !important;
}
.tab-list {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 10000;
}
.icon-search {
  margin-right: 1em;
}
.top-nav {
  /* position: fixed; */
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 44px;
  font-size: 1.6em;
  color: #969696;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  z-index: 10000;
}
.top-nav div{
  flex:1;
  display: flex;
  padding:0 2em 0 4em;
  justify-content: space-around;
  box-sizing: border-box;
}
.top-nav span {
  display: inline-block;
  width: 35px;
  height: 44px;
  text-align: center;
  line-height: 44px;
}
.active{
  border-bottom:1px solid;
}
.item-list {
  margin-bottom: 0.7em;
  box-sizing: border-box;
  font-size: 1.4em;
  background-color: #f9f9f9;
  z-index: 1000;
}
.item-list:first-of-type{
  border-top:none;
}
.item-list .item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.7em 1em;
  background-color: #fff;
  box-sizing: border-box;
}
.item-list .item-top span:last-of-type{
  display: flex;
  align-items: center;
  font-size: .8em;
}
.item-list .title {
  font-family: 'PingFangSC-Semibold';
  font-size: 1em !important;
}
.item-list .item-top span:first-of-type {
  font-size: 1.2em;
}
.item-list article {
  width: 100%;
  height: 100%;
  /* padding: 1.2em 1em; */
  box-sizing: border-box;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
}
.item-list article:last-of-type{
  margin-bottom:0;
}
.item-list article p:first-of-type {
  font-size: 1.2em;
  font-weight: 600;
}
.item-list article .icon {
  float: right;
  margin-right:1em;
  margin-top:1.2em;
}
.item-list .article-title{
  margin-top:1em;
  padding-left:1em;
}
.acticle-desc{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top: 0.5em;
  margin-bottom:.5em;
  padding:0 1.2em;
  line-height: 1.5;
  box-sizing: border-box;
  color: #999;
  -webkit-box-orient: vertical;  
}
.item-list .btn-list {
  display: flex;
  justify-content: space-between;
  border-top:1px solid #e6e6e6;
  padding:.8em 1em;
}
.circly {
  position: fixed;
  right:0%;
  top: 77%;
  width: 6em;
  height: 6em;
  text-align: center;
  vertical-align: middle;
  padding-top: 1.5em;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: -2px 0 0.5em #e4e4e4, 0 -2px 0.5em #e4e4e4, 2px 0 #e4e4e4,
    0 2px #e4e4e4;
  z-index: 1000;
}
@keyframes trans_to_left{
  from{
    right:0;
    background-color: #fff;
    color: #1BBD9C;
  }
  to{
    right:-12%;
    color: #fff;
    background-color: #1BBD9C;
  }
}
@keyframes trans_to_right {
  from{
    right:-12%;
    color: #fff;
    background-color: #1BBD9C;
  }
  to{
    right:0;
    background-color: #fff;
    color: #1BBD9C;    
  }
}
.trans-to-left{
  animation: trans_to_left 1s ease forwards;
}
.trans-to-right{
  animation: trans_to_right 1s ease forwards;
}
.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 1000;
}
.center {
  margin: 5px 0;
  text-align: center;
}
.btn-list span {
  display: flex;
  align-items: center;
  color: #b5b8ba;
}
.btn-list span img {
  margin-right: 0.3em;
}
.btn-more{
  color: #1BBD9C;
}
article{
  margin-bottom:1em;
}
</style>
