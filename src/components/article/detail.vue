<template>
  <section class="wrap">
    <div v-if="info">
      <div class="item-top">
        <div>
          <h4 class="article-title">{{info.title}}</h4>
          <span class="icon">
          <img v-if="parseInt(info.is_choice)" src="../../../static/imgs/icon-choose.png" alt="title"
               style="margin-left:10px;height: 20px;">
          <img v-if="parseInt(info.is_roof)" src="../../../static/imgs/icon-roof.png" alt="title"
               style="margin-left:10px;height: 20px;">
        </span>
        </div>
      </div>
      <div class="user_time">
        <div class="user_time_d">
          <p>{{info.add_time}}</p>
          <div class="user_time_box" @click="routerTo(info.user.id)">
            <img v-if="info.user" :src="info.user.wx_pic" alt="avatar" class="icon-avatar">
            <span v-if="info.user">{{info.user.nickname}}</span>
          </div>
          <span v-if="info.user" class="fll" @click="follow(1,info.user.id)">
            {{info.user.is_follow ? '已关注' : '+关注'}}
          </span>
        </div>
      </div>
      <article ref="article" class="item-detail" v-html="info.content"></article>
      <div class="item-bottom" v-show="!isShowBottom">
        <x-input placeholder="请输入" @on-focus="isShowBottom = true" v-model="text_content" @on-enter="addNotes">
          <img @click="isShowBottom = true" slot="label" src="../../../static/img/write.png" alt="write" class="icon-write">
        </x-input>
        <img src="../../../static/img/note.png" alt="note" class="icon-note"
             @click="note"><span>{{info.criticism_count}}</span>
        <img src="../../../static/img/lighten_like.png" alt="like" class="icon-like" v-if="info.is_follow"
             @click="follow(2)">
        <img src="../../../static/img/like.png" alt="like" class="icon-like" v-else @click="follow(2)">
        <span>{{info.follower}}</span>
        <img src="../../../static/img/lighten_ok.png" alt="ok" class="icon-ok" v-if="info.is_praised"
             @click="praised()">
        <img src="../../../static/img/ok.png" alt="ok" class="icon-ok" v-else @click="praised()">
        <span>{{info.praised}}</span>
        <img @click="handleShare" src="../../../static/img/icon-share@2x.png" alt="share" class="icon-share">
      </div>
      <div v-bind:class="[img_content.length == 0 ? 'item-textarea-empty item-bottom':'item-textarea item-bottom']" v-show="isShowBottom">
        <div>
          <textarea v-on:blur="isShowBottom = false" v-model="text_content" class="my-textarea" placeholder="请输入内容"></textarea>
          <div class="msg-img-list" v-show="img_content.length>0"> 
            <img @touchstart="handelStart" @touchend="handleEnd(index,$event)" :src="item" alt="" v-for="(item,index) in img_content" :key="index">
          </div>
        </div>
        <div>
          <img src="../../../static/img/icon-camera@2x.png" alt="icon-camera">
          <vue-core-image-upload text=''  @imageuploaded="imageUpload" class="btn-upload" :crop="false" :url="uploadPath"></vue-core-image-upload>              
          <span @click="cancelSub">取消</span>
          <span @click="addNotes">发表</span>
        </div>
      </div>
      <div class="empty"></div>
    </div>
    <loading :show="isShowLoading" :text="textLoading"></loading>

    <div v-transfer-dom>
      <confirm confirm-text="充值会员"
               cancel-text="付费"
               @on-confirm="VIP"
               v-model="isShow"
               @on-cancel="pay_"
               title="提示">
        <div class="confirm-form">
          <p>需要付费或充值会员</p>
        </div>
      </confirm>
    </div>
    
    <div @click="isShareShow = false" v-show="isShareShow" class="bg_share"></div>
  </section>
</template>

<script>
  const dateFormat = n => {
    n = n.toString();
    return n[1] ? n : '0' + n
  };
  import {Previewer,Cell,Group,XInput,XTextarea , XButton, Confirm, TransferDomDirective as TransferDom,Loading} from 'vux'
  import VueCoreImageUpload from 'vue-core-image-upload'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Confirm,
      XButton,
      Loading,
      XTextarea ,
      Group,
      Cell,
      VueCoreImageUpload,
      Previewer      
    },
    data() {
      return {
        criticism: [],
        id: '',
        text_content: '',
        img_content:[],
        info: {},
        isShow: false,
        isShowLoading:true,
        textLoading:'加载中...',
        isShareShow:false,
        shareImgPath:'',
        isShowBottom:false,
        uploadPath:PATH + 'Upload/uploadImg',  
        startY:0,  
        endY:0,    
      }
    },
    methods: {
      handleEnd(index,e){
        if(e.changedTouches.length == 1){
          this.endY = e.changedTouches[0].clientY
        }   
        if(this.startY > this.endY){
            this.img_content.splice(index,1)
        }
     },
      handelStart(e){
        if(e.touches.length == 1){
          this.startY = e.touches[0].clientY
        }
        this.$vux.toast.text('上滑图片删除')
      },
      cancelSub(){
        this.isShowBottom = false
        this.text_content = ''
        this.img_content = []
      },
      //上传图片
      imageUpload(res){
        this.isShowLoading = true
        if(res.error == 0){
          setTimeout(()=>{
            this.isShowLoading = false
            this.$vux.toast.text('上传成功')
            this.img_content.push(res.msg)
          },1000)
        }else{
          this.$vux.toast.text('上传失败')
        }
      },      
      //分享
      handleShare() {
        let _this = this
        this.isShareShow = true
        wx.ready(function () {
          let shareData = {
            title:_this.info.title,
            link:location.href.split('#')[0],
            imgUrl:_this.shareImgPath,
            desc:_this.info.title,
            success:function(){
                _this.isShareShow = false
                _this.apiPost('Index/sharing',{type:1,id:_this.id})
            },
            cancel:function(){
              _this.isShareShow = false
            }          
          }
          wx.onMenuShareTimeline(shareData)
          wx.onMenuShareAppMessage(shareData)
          wx.onMenuShareQQ(shareData)
          wx.onMenuShareQZone(shareData)
        })
      },
      //写留言
      addNotes() {
        let data = {
          parent_id: this.id,
          type: 1,
          text_content: this.text_content,
          img_content:this.img_content.toString()
        };
        if (!this.text_content) {
          this.$vux.toast.text('评论内容不能为空', 'middle');
          return
        }
        this.apiPost('Index/subCriticism', data).then(res => {
          let msg = '';
          if (res.error === 0) {
            this.$vux.toast.text('评论成功', 'middle');
            this.isShowBottom = false
            this.text_content = ''
            this.img_content = []
          } else {
            this.$vux.toast.text(res.msg, 'middle');
          }
          this.fetchData();
        })
      },
      fetchData() {
        this.isShowLoading = true
        this.apiPost('Index/articleDetail', {id: this.id}).then(res => {
          this.isShowLoading = false
          if (!res.error) {
            this.info = res.info;
            this.criticism = res.criticism;
          }
        })
      },
      follow(type, id) {
        let fid = this.id;
        if (type === 1) {
          this.apiPost('Index/followUser', {uid: id}).then(res => {
            this.$vux.toast.text(res.msg, 'middle');
            this.fetchData()
          })
        } else {
          this.apiPost('Index/followArticle', {article_id: fid}).then(res => {
            this.$vux.toast.text(res.msg, 'middle');
            this.fetchData();
          })
        }
      },
      praised() {
        this.apiPost('Index/thumbsArticle', {article_id: this.id}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          this.fetchData()
        });
      },
      note() {
        Lockr.set('criticism', this.criticism);
        router.push('/article/list');
      },
      routerTo(uid) {
        this.$router.push('/article/user/' + uid);
      },
      payment() {
        this.apiPost('Index/articlePayment', {id: this.id}).then(res => {
          this.isShow = res;
        })
      },
      VIP() {
        router.push('/index/vip');
      },
      pay_() {
        Lockr.set('wx_pay', {type: "article", id: this.id});
        setTimeout(() => {
          router.push('/pay')
        })
      },
    },
    created() {
      this.id = this.$route.params.id;
      this.payment();
      this.fetchData();
    },
    updated(){
      let elem = this.$refs.article
      let imgs = elem.querySelectorAll('img')
      if(imgs){
        this.shareImgPath = imgs[0].src
        for(var k in imgs){
          imgs[k].style="width:100%;margin:0 auto;"
        }
      }else{
        this.shareImgPath = window.imgUrl
      }
    },
  }
</script>

<style scoped>
  img[alt="icon-camera"]{
    width:22px;
  }
  .icon-write {
    width: 1.6em;
    height: 1.6em;
    margin-right: .8em;
  }
  .fll {
    display: inline-block;
    padding: .1em .3em;
    margin-left:1em;
    color: #1bbd9c;
    border: #1bbd9c solid .1em;
  }
  .icon-note {
    width: 1.6em;
    height: 1.6em;
  }
  .icon-like {
    width: 1.6em;
    height: 1.6em;
  }
  .icon-ok {
    width: 1.6em;
    height: 1.6em;
  }
  .item-top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: .8em 1.4em;
    background-color: #fff;
    box-sizing: border-box;
  }
  .item-top > div {
    display: flex;
    justify-content: space-between;
    font-size: 1.8em;
  }
  .item-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2em 1.8em;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    border-top: 1px solid #e6e6e6;
    background-color: #fff;
  }
  .item-bottom span {
    color: #666;
  }
  .item-detail {
    height: 100%;
    width:100%;
    padding: 20px 15px;
    font-size: 1.5em;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
  }
  .icon {
    display: flex;
    margin-top: 0.5%;
  }
  .user_time {
    display: flex;
    align-items: center;
    background-color: #fff;
  }
  .user_time p {
    flex:1;
    color: #b5b5b5;
  }
  .user_time .user_time_d {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width:100%;
    padding:0 1.4em;
  }
  .user_time .icon-avatar {
    height: 30px;
    margin-right:.3em;
    border-radius: 50%;
  }
  .user_time_box{
    display: flex;
    align-items: center;
  }
  .item-textarea{
    height:240px;
    border-top:1px solid #e6e6e6;
  }
  .item-textarea-empty{
    height:170px;
    color: red;
    border-top:1px solid #e6e6e6;
  }
  .msg-img-list{
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
    flex-flow: nowrap row;
    margin-bottom:.3em;
    padding:0 .3em;
    overflow: hidden;
    border:1px solid #e6e6e6;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  .msg-img-list img{
    width: 40px;
    height:60px;
    margin-right:.5em;
  }
</style>

<style lang="less" scoped>
 .item-textarea ,
 .item-textarea-empty{
   display: flex;
   flex-flow: column nowrap;
    justify-content: flex-start;
   background-color: #fff;
   div{
     width:100%;
     font-size: 1.2em;
     box-sizing: border-box;
     .my-textarea{
       width:100%;
       height:100px;
       padding:.5em;
       margin-bottom:.7em;
       font-size: 1.2em;
       outline:none;
       border:none;
       background-color: #f9f9f9;
       box-sizing: border-box;
     }
   }
  .btn-upload{
    position: absolute;
    width:20px;
    height:20px;
  }   
  div:last-of-type{
    display: flex;
    align-items: center;
    justify-content: space-between;
    span{
      display: inline;
      padding:.3em .7em;
      color: #fff;
      background-color: #1BBD9C;
    }
    span:first-of-type{
      color: #333;
      border:1px solid #e4e4e4;
      background-color: #fff;
      margin-left:52%;
    }
  }
 }
</style>
