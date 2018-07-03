<template>
  <section class="wrap">
    <div class="wrap-top">
      <div @click="jumpToOther(1)">
        <img src="../../../static/imgs/icon-ok.png" alt="ok" class="icon-ok-default">
        <Badge class="badge" v-show="seen.praised_seen"></Badge>
        <span>赞</span>
      </div>
      <div @click="jumpToOther(2)">
        <img src="../../../static/imgs/icon-content.png" alt="content" class="icon-content-default">
        <span>评论</span>
        <Badge class="badge" v-show="seen.reply_seen"></Badge>
      </div>
      <div @click="jumpToOther(3)">
        <img src="../../../static/imgs/icon-focus.png" alt="content" class="icon-focus-default">
        <span>关注</span>
      </div>
      <div @click="jumpToOther(7)">
        <img src="../../../static/imgs/icon-fans.png" alt="content" class="icon-question-default">
        <span>粉丝</span>
      </div>
    </div>
    <div style="height:105px;"></div>
    <div class="carousle" v-show="noticeList.length>0" >
      <p class="second-title">通知</p>
      <swiper v-if="noticeList.length > 0" loop auto height="60px" :show-dots="false">
        <swiper-item class="swiper-list-item" v-for="(item,index) in noticeList" :key="index">
          <div class="box-list">
            <div class="list-item" @click="jumpToOther(5,item.id)">
              <p>{{item.title}}</p>
              <p>{{item.sub_time}}</p>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <p class="notice-msg" v-else>暂无通知</p>
    </div>
    <div style="height:100px;" v-show="noticeList.length>0" ></div>
    <div>
      <nav>
        <span :class="active===1?'active':''" @click="active = 1">动态</span>
        <span :class="active===2?'active':''" @click="openDatum">资料</span>
      </nav>
    </div>
    <scroll ref="wrapper"  v-bind:class="[noticeList.length > 0  ? 'wrapper1' : 'wrapper']" :pulldown="pulldown"
            @pulldown="fetchData">
      <div class="content">
        <div class="item-list" v-if="active == 1" v-for="(item,index) in myInfo" :key="index">
          <p v-if="index == 0">
            <span class="my-state">我的成就</span>
            <span>已打败<b>{{item.ranking}}%</b>的用户</span>
            <img src="../../../static/img/icon-share@2x.png" alt="icon-share" @click="shareToOther">
          </p>
          <p v-else class="item-other-title">
            <span><img :src="item.wx_pic" alt="icon-avatar">{{item.nickname}}</span>
            <span>已打败<b>{{item.ranking}}%</b>的用户</span>
          </p>
          <div class="card-list">
            <p><span>{{item.praised}}</span><br><span>获赞</span></p>
            <p><span>{{item.follower}}</span><br><span>粉丝</span></p>
            <p><span>{{item.question}}</span><br><span>提问</span></p>
            <p><span>{{item.article}}</span><br><span>发帖</span></p>
          </div>
        </div>     
        <div class="notice-list" v-if="active == 2" v-for="(item,index) in datum" :key="index">
          <!-- <p class="item-other-title"><span><img :src="item.wx_pic" alt="icon-avatar"></span>{{item.nickname}}</p> -->
          <p class="item-title">{{item.title}}</p>
          <p class="item-detail">
            <span><img :src="item.wx_pic" alt="icon-avatar">{{item.nickname}} &nbsp;&nbsp;{{item.add_time}}</span>
          </p>
          <p class="item-btn-list" @click="jumpToOther(8,item.id)">
            <span style="padding-left:10px;">查看详情</span>
            <img style="margin-right:10px;" src="../../../static/imgs/icon-arrow-right.png" alt="icon-arrow-right">
          </p>
        </div>
        <div v-if="active == 1">
          <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>
        </div>
        <div v-else>
          <div v-if="!isShowMore">
            <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>
          </div>
          <div v-if="isShowMore"><p class="btn-next" @click="loadMore">加载更多</p></div>
        </div>
      </div>
    </scroll>
    <div class="empty"></div>
    <bottom class="bottom-nav"></bottom>
    <loading v-model="isShowLoading" :text='textLoading'></loading>

    <div class="bg_share" @click="isShowShare = false" v-show="isShowShare"></div>
    <!-- <img @click="isShowShare = false" v-show="isShowShare" src="../../../static/imgs/bg_share.png" alt="bg_share" > -->
  </section>
</template>

<script>
  import Bottom from '../common/bottom'
  import scroll from '../common/scroll'
  import {Badge, Loading, Tab, TabItem, Card, Swiper, SwiperItem, LoadMore} from 'vux'

  export default {
    components: {
      Bottom,
      Badge,
      Loading,
      Tab,
      TabItem,
      Card,
      Swiper,
      SwiperItem,
      LoadMore,
      scroll
    },
    data() {
      return {
        info: [],
        page: 1,
        isShow: false,
        isShowLoading: false,
        textLoading: '加载中...',
        msgShow: false,
        index1: 0,
        questionList: [],
        myInfo: [],
        datum: [],
        achievement: [],
        seen: {},
        active: 1,
        noticeList: [],
        showMore: false,
        isRefresh: false,
        pulldown: false,
        isShowMore: false,
        isShowShare: false
      }
    },
    methods: {
      loadMore() {
        if (this.isShowMore) {
          this.page++
          this.fetchData()
        }
      },
      openDatum() {
        this.active = 2;
        this.datum = [];
        this.fetchData();
      },
      fetchData() {
        this.isShowLoading = true
        this.apiPost("Index/message", {page: this.page}).then(res => {
          this.isShowLoading = false
          this.noticeList = res.notice
          Lockr.set('notice', res.notice)
          this.myInfo = res.achievement
          this.seen = res.seen
          if (this.active == 2) {
            if (res.datum) {
              this.datum = this.datum.concat(res.datum)
              if (res.datum.length == 10) {
                this.showMore = true
                this.isShowMore = true
              } else {
                this.showMore = false
                this.isShowMore = false
              }
            }
          }
        })
      },
      //分享
      shareToOther() {
        let _this = this
        this.isShowShare = true
        let shareData = {
          title: '快来查看我的成就,PK一下吧!!!',
          link: location.href.split('#')[0],
          imgUrl: _this.myInfo[0].wx_pic,
          success: function () {
            _this.apiPost('Index/sharing', {type: 3})
            _this.isShowShare = false
          },
          cancel: function () {
            _this.isShowShare = false
          }
        }
        wx.ready(function () {
          wx.onMenuShareTimeline(shareData)
          wx.onMenuShareAppMessage(shareData)
          wx.onMenuShareQQ(shareData)
          wx.onMenuShareQZone(shareData)
        })
      },
      //获取通知
      getArticleList() {
        this.apiPost('Index/message').then(res => {
          this.list = res.notice;
          this.seen = res.seen;
          this.myInfo = res.achievement
          this.myInfo = res.achievement
        })
      },
      //获取问卷列表
      getQuestionList() {
        this.apiPost('Index/questionnaire').then(res => {
          this.questionList = res
        })
      },
      //切换导航栏
      switchTabItem(index) {
        this.index1 = index
        this.datum = []
      },
      jumpToOther(type, id) {
        let _router = '';
        if (type == 1) {
          _router = '/index/remind';
          Lockr.set('router_type', 'laud');
        } else if (type == 2) {
          _router = '/index/remind';
          Lockr.set('router_type', 'criticism');
        } else if (type == 3) {
          _router = '/index/floower'
        } else if (type == 4) {
          _router = '/question/detail'
        } else if (type == 5) {
          _router = '/message/detail/' + id
        } else if (type == 6) {
          _router = '/question/edit/' + id
        } else if (type == 7) {
          _router = '/index/floower'
        } else if (type == 8) {
          _router = '/message/datumDetail/' + id
        }
        this.$router.push(_router)
      }
    },
    mounted() {
      this.fetchData()
    }
  }
</script>

<style scoped>
  .wrapper {
    height: calc(100% - 210px);
    overflow: hidden;
  }
  .wrapper1 {
    height: calc(100% - 310px);
  }
  .wrap-top {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: .8em 1.4em;
    font-size: 1.4em;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 10000;
  }
  .wrap-top div {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }
  .wrap-top div span {
    margin-top: 6px;
    color: #999;
  }
  .wrap-top img {
    width: 4em;
    height: 4em;
  }
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 1000;
  }
  .badge {
    position: absolute;
    right: -4px;
    top: -8px;
  }
  .title-center {
    margin: 10px 0;
    text-align: center;
  }
  .item-detail {
    display:flex;
    padding: 15px 10px 0 10px;
  }
  .item-detail p:first-of-type {
    font-size: 1.8em;
  }
  .item-detail-last {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    height: 50px;
    overflow: hidden;
    margin: 18px 0 25px 0;
    color: #969696;
  }
  .item-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 10px 0 10px;
    color: #1cc8a0;
    line-height: 44px;
    border-top: 1px solid #e6e6e6;
  }
  .second-title {
    padding: 10px 20px;
    color: #999;
    font-size: 1.2em;
    background-color: #f3f3f3;
  }
  .box-list {
    width: 100%;
    height: 90px;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
  }
  .list-item {
    display: inline-block;
    height: 70px;
    text-align: center;
  }
  .list-item p {
    margin: 10px 0;
  }
  .list-item p {
    padding: 0 10px;
    text-align: left;
  }
  .item-list {
    padding: 0 1em;
    margin-bottom: 15px;
    font-size: 1.3em;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    border-top: none;
  }
  .item-list > p:first-of-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .item-list > p:first-of-type b {
    color: #1cc8a0;
    font-size: 1.3em;
  }
  .item-list > p:first-of-type span:last-of-type {
    flex: 1;
    text-align: right;
    color: #ccc;
    font-size: .8em;
  }
  .card-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;
    margin-top: 0;
    text-align: center;
  }
  .card-list p span:first-of-type {
    font-size: 1.4em;
  }
  .card-list p span:last-of-type {
    font-size: 1em;
    color: #ccc;
  }
  .card-list + p {
    padding-right: 10px;
    text-align: right;
    line-height: 30px;
    border-top: 1px solid #e4e4e4;
    border-bottom: none;
    color: #1cc8a0;
  }
  .carousle {
    position: fixed;
    width: 100%;
    height: 90px;
    background-color: #fff;
    font-size: 1.2em;
    z-index: 1000;
    box-sizing: border-box;
  }
  .notice-list {
    /* margin:0 10px 20px 10px; */
    /* padding:10px; */
    margin-bottom: 15px;
    border: 1px solid #e4e4e4;
    border-top: none;
    background-color: #fff;
  }
  .notice-list p {
    padding: 5px 10px;
  }
  .notice-list p:last-of-type {
    padding: 15px 0;
  }
  .notice-list .item-title {
    font-size: 1.6em;
  }
  .notice-list .item-detail {
    display:flex;
    margin: 0;
    padding: 5px 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    /* margin:10px 0; */
  }
  .notice-list .item-detail span{
    display:flex;
    flex-flow:row nowrap;
    align-items:center;

  }
  .notice-list .item-btn-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e4e4e4;
    height: 20px;
    padding-top: 5px;
    box-sizing:border-box;
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 34px;
    margin-top: 10px;
    color: #999;
    border-bottom: 1px solid #e4e4e4;
    background-color: #fff;
  }
  nav span {
    display: inline-block;
    height: 34px;
    padding: 0 10px;
    font-size: 1.6em;
    line-height: 34px;
  }
  .active {
    border-bottom: 1px solid;
  }
  .swiper-list-item {
    float: left;
    width: 100%;
    height: 50px;
  }
  img[alt="icon-avatar"] {
    width: 20px;
    height: 20px;
    margin-right: .7em;
    border-radius: 50%;
  }
  .item-other-title {
    display: flex;
    align-items: center;
  }
  .item-other-title span {
    display: flex;
    align-items: center;
  }
  .item-other-title span:last-of-type {
    flex: 1;
    justify-content: flex-end;
  }
  .notice-msg {
    margin-top: 5%;
    margin-left: 1.6em;
    color: #333;
    font-size: 1.2em;
  }
  .my-state {
    font-size: 1.1em;
    font-weight: bold;
  }
  img[alt="icon-share"] {
    height: 2em;
    width: 2em;
    margin-right: -1em;
    transform: scale3d(.7, .7, .7);
  }

</style>
