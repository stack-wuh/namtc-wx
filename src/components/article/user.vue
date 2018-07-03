<template>
  <section class="wrap">
    <div class="item-top">
      <div>
        <img :src="info.wx_pic" alt="avatar" class="icon-avatar">
        <span>{{info.nickname}}</span>
        <span @click="follow()">{{info.is_follow? '已关注':'+关注'}}</span>
      </div>
      <div>
        <span>{{info.laud}}获赞</span>
        <span>{{info.follower}}粉丝</span>
        <span>{{info.follow}}关注</span>
      </div>
    </div>
    <nav>
      <span :class="active==1?'active':''" @click="activeChange(1)">帖子</span>
      <span :class="active==2?'active':''" @click="activeChange(2)">评论</span>
      <span :class="active==3?'active':''" @click="activeChange(3)">问题</span>
    </nav>
    <!-- <div v-show="active===1 && false" v-for="item in note_list" class="item-list" @click="routeTo(item.id,1)">
      <p class="title">{{item.title}}</p>
      <div class="item-list-an">
        <span style="margin-right: 14em;">{{item.add_time}}</span>
        <img src="../../../static/img/note.png" alt="note" class="icon-note">
        <span style="margin-right: 1em">{{item.count}}</span>
        <img src="../../../static/img/like.png" alt="like" class="icon-like">
        <span>{{item.follower}}</span>
      </div>
    </div>
    <div class="item-list" v-for="item in criticism_list" v-show="active===2" @click="routeTo(item.id,2,item.type)">
      <div class="item-list-top">
        <img :src="item.wx_pic || '../../../static/img/admin.jpg'" alt="avatar" class="icon-avatar-small">
        <span>{{item.nickname}}</span>
        <img src="../../../static/img/ok.png" alt="ok" class="icon-ok">{{item.praised}}
      </div>
      <p class="title">{{item.title}}</p>
      <p>{{item.sub_time}}</p>
      <p class="content">{{item.text_content}}</p>
    </div>
    <div v-show="active===3" v-for="item in question_list" class="item-list">
      <p class="title">{{item.title}}</p>
      <div class="item-list-an">
        <span style="margin-right: 14em;">{{item.add_time}}</span>
        <img src="../../../static/img/note.png" alt="note" class="icon-note">
        <span style="margin-right: 1em">{{item.answer}}</span>
        <img src="../../../static/img/like.png" alt="like" class="icon-like">
        <span>{{item.follower}}</span>
      </div>
    </div> -->

    <scroll ref="wrapper" class="wrapper" :pulldown="pulldown" @pulldown="fetchData">
      <div class="content">
        <div v-show="active == 1" v-for="item in note_list" class="item-list" @click="routeTo(item.id,1)">
          <p class="title">{{item.title}}</p>
          <div class="item-list-an">
            <span>{{item.add_time}}</span>
              <div class="bottom-list">
                <img src="../../../static/img/note.png" alt="note" class="icon-note">
                <span >{{item.count}}</span>
              <!-- </div>
              <div> -->
                <img src="../../../static/img/like.png" alt="like" class="icon-like">
                <span>{{item.follower}}</span>
              </div>
          </div>
        </div>
        <div v-show="active == 2" class="item-list" v-for="item in criticism_list"  @click="routeTo(item.id,2,item.type)">
          <div class="item-list-top">
            <img :src="item.wx_pic || '../../../static/img/admin.jpg'" alt="avatar" class="icon-avatar-small">
            <span>{{item.nickname}}</span>
            <img src="../../../static/img/ok.png" alt="ok" class="icon-ok">{{item.praised}}
          </div>
          <p class="title">{{item.title}}</p>
          <p>{{item.sub_time}}</p>
          <p class="content">{{item.text_content}}</p>
        </div>
        <div v-show="active == 3" v-for="item in question_list" class="item-list">
          <p class="title">{{item.title}}</p>
          <div class="item-list-an">
            <span style="margin-right: 14em;">{{item.add_time}}</span>
            <img src="../../../static/img/note.png" alt="note" class="icon-note">
            <span style="margin-right: 1em">{{item.answer}}</span>
            <img src="../../../static/img/like.png" alt="like" class="icon-like">
            <span>{{item.follower}}</span>
          </div>
        </div> 
        <div v-if="isShowMore"><p class="btn-next" @click="loadMore">加载更多</p></div>
        <div v-if="!isShowMore">
          <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>
        </div>
      </div>
    </scroll>
  </section>
</template>

<script>
import scroll from '../common/scroll'
import {LoadMore} from 'vux'
  export default {
    components:{
      scroll,
      LoadMore
    },
    data() {
      return {
        uid: 0,
        info: {},
        active: 1,
        criticism_list: [],
        question_list: [],
        note_list: [],
        isFollow:false,
        page:1,
        pulldown:false,
        isShowMore:false,
      }
    },
    created() {
      this.uid = this.$route.params.uid;
      this.fetchData();
    },
    methods: { 
      activeChange(type){
        this.active = type
        this.criticism_list = []
        this.note_list = []
        this.question_list = []
        this.page = 1
        this.fetchData(type)
      },
      loadMore(){
        if(this.isShowMore){
          this.page++
          this.fetchData(this.active)
        }
      },
      fetchData(type=1) {
        let classify = ''
        classify = type == 1 ? 'note' :type == 2 ? 'criticism' : 'question'
        this.apiPost('Index/myInfo', {uid: this.uid,type:classify,page:this.page}).then(res => {
          this.info = res;
          if(res.criticism){
            if(res.criticism.length == 10){
              this.isShowMore = true
            }else{
              this.isShowMore = false
            }
            this.criticism_list = this.criticism_list.concat(res.criticism)
          }
          if(res.question){
            if(res.question.length == 10){
              this.isShowMore = true
            }else{
              this.isShowMore = false
            }
            this.question_list = this.question_list.concat(res.question)
          }
          if(res.note){
            if(res.note.length == 10){
              this.isShowMore = true
            }else{
              this.isShowMore = false
            }
            this.note_list = this.note_list.concat(res.note)
          }
          // this.criticism_list = res.criticism;
          // this.question_list = res.question;
          // this.note_list = res.note;
        });
      },
      routeTo(id, foo, type) {
        if (foo === 1) {
          router.push('/article/detail/' + id);
        } else if (foo === 2) {
          if (type === 'article') {
            router.push('/article/detail/' + id);
          } else {
            router.push('/question/detail/' + id);
          }
        }
      },
      follow() {
        this.apiPost('Index/followUser', {uid: this.uid}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          if(res.msg === '关注成功'){ 
            this.isFollow = true
          }else{
            this.isFollow = false
          }
        })
      },
    }
  }
</script>

<style scoped>
  .wrapper{
    height:calc(100% - 180px);
    overflow:hidden;
  }
  .item-list-an {
    display: flex;
    justify-content:space-between;
    align-items: center;
    margin: 5px auto;
    font-size:1.1em;
  }
  .icon-note {
    width: 1.6em;
    height: 1.6em;
    margin-right:.3em;
  }
  .icon-like {
    width: 1.6em;
    height: 1.6em;
    margin-left:.5em;
    margin-right:.3em;
  }
  .icon-avatar {
    width: 4.2em;
    height: 4.2em;
    border-radius: 50%;
  }
  .icon-avatar-small {
    width: 1.6em;
    height: 1.6em;
    border-radius: 50%;
  }
  .icon-ok {
    width: 18px;
    height: 23px;
  }
  .item-top {
    height: 134px;
    padding: 1.8em;
    background-color: #fff;
    box-sizing: border-box;
  }
  .item-top div:first-of-type {
    display: flex;
    align-items: center;
  }
  .item-top div:first-of-type span:first-of-type {
    flex: 1;
    margin-left: .8em;
    font-size: 1.8em;
    color: #242424;
  }
  .item-top div:first-of-type span:last-of-type {
    display: inline-block;
    padding: .3em .8em;
    color: #1abca9;
    border: 1px solid #1abca9;
  }
  .item-top div:last-of-type {
    display: flex;
    justify-content: space-between;
    margin-top: 1.4em;
    font-size: 1.8em;
  }
  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 34px;
    margin-top: 10px;
    font-size:1.4em;
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }
  nav span {
    display: inline-block;
    width: 80px;
    height: 35px;
    text-align: center;
    color: #999;
    line-height: 35px;
    border-bottom: 1px solid #eee;
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
  .bottom-list{
    display:flex;
    align-items:center;
    color:#999;
    font-size:1.1em;
  }
</style>
