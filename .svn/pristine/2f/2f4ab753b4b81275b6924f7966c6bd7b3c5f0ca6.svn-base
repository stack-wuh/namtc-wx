<template>
  <div class="container">
    <div class="item-top">
      <div class="item-detail">
        <div>
          <p class="img-box">
            <img :src="info.wx_pic" alt="avatar" class="icon-avatar">
            <img v-show="isTeacher" src="../../../static/imgs/icon-ident.png" alt="icon-ident" style="z-index:1000 !important;">
            <img v-show="info.is_vip" src="../../../static/imgs/icon-vip.png" alt="icon-vip" style="z-index:100;">
          </p>
          <div>
            <p>{{info.nickname}}</p>
            <p @click="jumpToOther(5)">{{info.integral}}积分</p>
          </div>
          <span @click="jumpToOther(6)">{{info.identification?'已认证':'未认证'}}</span>
        </div>
        <div>
          <span @click="jumpToOther(1)">{{info.laud}} 获赞</span>
          <span @click="jumpToOther(2)">{{info.follower}} 粉丝</span>
          <span @click="jumpToOther(3)">{{info.follow}} 关注</span>
        </div>
      </div>
      <div>
        <span v-if="info.is_vip === false" @click="jumpToOther(4)">开通会员</span>
        <span v-else @click="jumpToOther(4)">{{info.vip_type}}</span>
      </div>
    </div>
    <div style="height:174px;"></div>
    <nav>
      <span :class="active===4?'active':''" @click="changeNavBar(4)" v-if="isTeacher">资料</span>
      <span :class="active===1?'active':''" @click="changeNavBar(1)" v-else>帖子</span>
      <span :class="active===2?'active':''" @click="changeNavBar(2)">评论</span>
      <span :class="active===3?'active':''" @click="changeNavBar(3)">问题</span>
    </nav>
    <scroll class="wrapper" ref="wrapper" :pulldown="pulldown" @pulldown="fetchData">
      <!-- <div class="content1">
        <div v-show="active===4" v-for="item in noteList" class="item-list" @click="routeTo(item.id,4)">
          <p class="title">{{item.title}}</p>
          <div class="item-list-an">
            <span>{{item.add_time}}</span>
          </div>
        </div>
      </div> -->
      <div class="content1">
        <div v-show="active===1" v-for="(item,index) in noteList" class="item-list" @click="routeTo(item.id,1)">
          <p class="title">{{item.title}}</p>
          <div class="item-list-an">
            <span>{{item.add_time}}</span>
            <div class="item-btn-list">
              <img src="../../../static/img/note.png" alt="note" class="icon-note">
              <span>{{item.count}}</span>
              <img src="../../../static/img/like.png" alt="like" class="icon-like">
              <span>{{item.follower}}</span>
            </div>
          </div>
        </div>
        <div v-show="active===2" class="item-list" v-for="(item,index1) in criticismList"
             @click="routeTo(item.id,2,item.type)">
          <div class="item-list-top">
            <img :src="item.wx_pic || '../../../static/img/admin.jpg'" alt="avatar" class="icon-avatar-small">
            <span>{{item.nickname}}</span>
            <img src="../../../static/img/ok.png" alt="ok" class="icon-ok">{{item.praised}}
          </div>
          <p class="title">{{item.title}}</p>
          <p>{{item.sub_time}}</p>
          <p class="content">{{item.text_content}}</p>
        </div>
        <div v-show="active===3" v-for="(item,index2) in questionList" class="item-list" @click="routeTo(item.id,3)">
          <p class="title">{{item.title}}</p>
          <div class="item-list-an">
            <span>{{item.add_time}}</span>
            <div class="item-btn-list">
              <img src="../../../static/img/note.png" alt="note" class="icon-note">
              <span>{{item.answer}}</span>
              <img src="../../../static/img/like.png" alt="like" class="icon-like">
              <span>{{item.follower}}</span>
            </div>
          </div>
        </div>
        <div v-if="isShowMore"><p class="btn-next" @click="loadMore">加载更多</p></div>
        <div v-if="!isShowMore">
          <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>
        </div>
      </div>
    </scroll>
    <bottom class="btm-nav"></bottom>
    <loading v-show="isLoading" text="加载中..."></loading>
  </div>

</template>

<script>
  import Bottom from '../common/bottom'
  import scroll from '../common/scroll'
  import {Loading, LoadMore} from 'vux'

  export default {
    components: {
      LoadMore,
      Loading,
      scroll
    },
    data() {
      return {
        list: [],
        info: {},
        type: 1,
        page: 1,
        active: 1,
        noteList: [],
        questionList: [],
        criticismList: [],
        showMore: false,
        pulldown: false,
        isShowMore: false,
        isLoading: false,
        isTeacher: false,
      }
    },
    methods: {
      changeNavBar(type) {
        this.noteList = []
        this.criticismList = []
        this.questionList = []
        this.page = 1
        this.fetchData(type)
      },
      loadMore() {
        if (this.isShowMore) {
          this.page++
          this.fetchData(this.active)
        }
      },
      //获取数据
      fetchData(active = 1) {
        let type = ''
        this.isLoading = true
        this.active = active
        if (this.active == 1) {
          type = 'note'
        } else if (this.active == 2) {
          type = 'criticism'
        } else if (this.active == 3) {
          type = 'question'
        } else if (this.active == 4) {
          type = 'note'
        }
        this.apiPost('Index/myInfo', {type: type, page: this.page}).then(res => {
          this.isLoading = false
          this.info = res
          if (res.note) {
            if (res.note.length == 10) {
              this.isShowMore = true
            } else {
              this.isShowMore = false
            }
            this.noteList = this.noteList.concat(res.note)
          }
          if (res.question) {
            if (res.question.length == 10) {
              this.isShowMore = true
            } else {
              this.isShowMore = false
            }
            this.questionList = this.questionList.concat(res.question)
          }
          if (res.criticism) {
            if (res.criticism.length == 10) {
              this.isShowMore = true
            } else {
              this.isShowMore = false
            }
            this.criticismList = this.criticismList.concat(res.criticism)
          }
        })
      },

      //路由跳转
      routeTo(id, foo, type) {
        if (foo === 1) {
          router.push('/article/detail/' + id);
        } else if (foo === 2) {
          if (type === 'article') {
            router.push('/article/detail/' + id);
          } else {
            router.push('/question/detail/' + id);
          }
        } else if (foo === 3) {
          router.push('/question/detail/' + id);
        } else if (foo === 4) {
          router.push('/message/datumDetail/' + id);
        }
      },

      jumpToOther(type) {
        let _router = '';
        if (type === 1) {
          Lockr.set('router_type', 'laud');
          _router = '/index/remind'
        } else if (type === 2) {
          _router = '/index/floower';
          Lockr.set('floow_type', 1);
        } else if (type === 3) {
          _router = '/index/floower';
          Lockr.set('floow_type', 2);
        } else if (type === 4) {
          _router = '/index/vip'
        } else if (type === 5) {
          _router = '/integral'
        } else if (type === 6) {
          _router = '/user/center';
        } else if (type === 7) {
          _router = 'message'
        }
        this.$router.push(_router)
      }
    },
    created() {
      this.isTeacher = Lockr.get('isTeacher');
      if (this.isTeacher) {
        this.active = 4;
        this.fetchData(4);
      } else
        this.fetchData()
    },
  }
</script>


<style scoped>
  .wrapper {
    height: calc(100% - 280px);
    overflow: hidden;
    /* border:1px solid red; */
  }
  .icon-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .item-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 175px;
    border-bottom: 1px solid #f9f9f9;
    box-sizing: border-box;
    z-index: 10000;
  }
  .icon-ok {
    /* width: 18px;
    height: 23px; */
    transform: scale3d(.7, .7, .7);
  }
  .icon-avatar-small {
    width: 1.6em;
    height: 1.6em;
    border-radius: 50%;
  }
  .item-detail {
    height: 130px;
    padding: 20px 20px 20px 20px;
    font-size: 1.8em;
    color: #fff;
    background-color: #1cc8a0;
    box-sizing: border-box;
  }
  .item-detail > div:first-of-type {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item-detail > div:first-of-type > div {
    margin-left: -100px;
  }
  .item-detail > div:first-of-type div p:last-of-type {
    font-size: .8em;
    color: #b5e3d4;
  }
  .item-detail > div:first-of-type span {
    font-size: .9em;
    color: #b5e3d4;
  }
  .item-detail > div:last-of-type {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .item-detail + div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px 10px 38px;
    font-size: 1.6em;
    color: #00bd97;
    background-color: #fff;
    box-sizing: border-box;
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 34px;
    margin-top: 10px;
    color: #999;
    font-size: 1.4em;
    border-bottom: 1px solid #e4e4e4;
    background-color: #fff;
    z-index: 10000;
  }
  nav span {
    display: inline-block;
    height: 34px;
    padding: 0 10px;
    font-size: 16px;
    line-height: 34px;
  }
  .active {
    border-bottom: 1px solid;
  }
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 1000;
  }
  .bottom-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #b3b3b3;
  }
  .bottom-list span {
    flex: 1;
  }
  .bottom-list div {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
  .bottom-list div:last-of-type {
    margin-right: 20px;
  }
  .img-box {
    position: relative;
  }
  .img-box img:first-of-type ~ img {
    position: absolute;
    bottom: 5px;
    right: 0;
    z-index: 10000;
  }
  .item-list-an {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px auto;
  }
  .item-list-an .item-btn-list {
    display: flex;
    align-items: center;
    color: #b5b8ba;
  }
  .icon-note {
    width: 1.6em;
    height: 1.6em;
    margin-right: .4em;
  }
  .icon-like {
    width: 1.6em;
    height: 1.6em;
    margin-left: 1em;
    margin-right: .4em;
  }
  .item-list {
    margin-bottom: 15px;
    padding: 15px 20px 10px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .item-list-top {
    display: flex;
    align-items: center;
    color: #999;
  }
  .item-list-top span {
    flex: 1;
    margin-left: 10px;
  }
  .item-list .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin: 10px auto;
    font-size: 1.5em;
  }
  .item-list .content {
    padding: 5px 10px;
    color: #989898;
    background-color: #f2f2f2;
  }
  .btm-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
  }
</style>