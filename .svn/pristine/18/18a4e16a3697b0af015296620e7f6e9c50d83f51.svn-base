<template>
  <section class="wrap">
    <scroll class="wrapper" ref="wrapper">
      <div class="content">
    <div class="item-top">
      <h4>{{info.title}}</h4>
      <div class="label-list">
        <span class="label">{{info.classify_name}}</span>
      </div>
      <div class="user-detail">
        <img :src="info.wx_pic" alt="avatar" class="icon-avatar-mini">
        <span @click="openUser(info.uid)">{{info.nickname}}</span>
        <span>{{info.add_time}}</span>
        <span v-show="info.is_my"></span>
        <!-- <span v-show="!info.is_my" class="btm-state" @click="follow(info.uid)" v-if="info.is_follow" style="background-color:#1BBD9C;color:#fff;">已关注</span> -->
        <!-- <span v-show="!info.is_my" class="btm-state" v-else @click="follow(info.uid)">未关注</span> -->
      </div>
    </div>
    <div class="item-detail">
      <p>{{info.text_content}}</p>
      <div class="img-box image-box" v-show="info.img_content">
        <img @click="show(index)" v-for="(item,index) in info.img_content" :src="item.msrc" alt="detail-img" class="detail-img" :key="index">
      </div>
      <div v-transfer-dom >
          <previewer :list="option1" ref="previewer"></previewer> 
      </div>
      <div class="img-box video-box" v-show="info.video_content">
        <video @click="handlePause" class="video" @playing="listenPlaying" @ended="ListenEnded" ref="myVideo" :src="info.video_content" controls poster="../../../static/img/avatar.jpg">
          您的浏览器不支持 video 标签。
        </video>
        <img @click="handlePlay" v-if="!isPlayed"  src="../../../static/imgs/icon-play.png" alt="icon-play" class="icon-control">
        <img @click="handlePlay" v-if="ispaused" src="../../../static/imgs/icon-pause.png" alt="icon-pause" class="icon-control">
      </div>
      <div class="img-box audio-box" v-show="info.audio_content">
        <audio class="audio" :src="info.audio_content"  controls preload>
          您的浏览器不支持 audio 标签。
        </audio>
      </div>
    </div>  
    <div class="btn-list">
      <span v-bind:class="{'active':type === 1}" @click="type=1">回答列表</span>
      <span v-bind:class="{'active':type === 2}" @click="teacher_">授权教师解答</span>
    </div>

    <div class="item-list-box">
      <!--回答列表-->
      <div class="item-list" v-for="(item,index) in userList" v-if="type === 1" :key="index">
        <div class="item-list-top">
          <div>
            <img :src="item.wx_pic" alt="avatar" class="icon-avatar-mini">
            <span @click="openUser(item.uid)">{{item.nickname}}</span>
          </div>
          <div style="display: flex;margin-right: 0.3em">
            {{item.praised_count}}
            <span @click="praised(item.id)" style="margin-left: 5px;">
              <img src="../../../static/img/ok.png" alt="ok" class="icon-ok-mini" v-if="!item.is_praised">
              <img src="../../../static/img/lighten_ok.png" alt="" class="icon-ok-mini" v-else>
            </span>
          </div>
        </div>
        <p class="item-list-detail">{{item.text_content}}</p>
        <div v-show = "item.img_content" class="img-box-list">
          <img :src="items.msrc" alt="avatar" class="icon-avatar" @click="changeShow(subindex,index)" v-for="(items,subindex) in item.img_content" :key="subindex">
          <div v-transfer-dom >
            <previewer ref="answerPrev" :list="item.img_content" ></previewer>
          </div>
        </div>
        <span class="art">{{item.sub_time}}</span>
      </div>
      <!--教师解答-->
      <div class="item-teac item-list" v-if="type === 2" v-for="(item,index) in teacher_list" :key="index">
        <div class="item-list-top">
          <div>
            <img :src="item.wx_pic" alt="avatar" class="icon-avatar-mini">
            <img src="../../../static/img/icon-crown.png" alt="icon-crown">
            <span>{{item.nickname}}</span>
          </div>
          <div style="display: flex;margin-right: 0.3em">
            {{item.praised_count}}
            <span @click="praised(item.id)" style="margin-left: 5px;">
            <img src="../../../static/img/ok.png" alt="ok" class="icon-ok-mini" v-if="!item.is_praised">
            <img src="../../../static/img/lighten_ok.png" alt="" class="icon-ok-mini" v-else>
            </span>
          </div>
        </div>
        <p class="item-list-detail">{{item.text_content}}</p>
        <div v-if="item.img_content">
          <img :src="items" alt="avatar" class="icon-avatar" v-for="items in item.img_content">
        </div>
        <span class="art">{{item.sub_time}}</span>
      </div>
    </div>

    <!--弹窗-->
      <div v-transfer-dom @click="handleClick">
        <confirm confirm-text="充值会员"
                cancel-text="付费"
                @on-confirm="VIP"
                v-model="isShow"
                @on-cancel="pay_"
                title="提示">
          <div>
           <!-- <img class="btn-close" src="../../../static/imgs/icon-close.png" alt="icon-close"> -->
            <p>专业答案需要付费或充值会员</p>
          </div>
        </confirm>
      </div>
      </div>
    </scroll>
        <!--回答-->
        
    <group class="bottom-nav" v-show="isIconShare">
      <x-input @on-focus="isIconShare=false"  placeholder="回答" @on-enter="subAnswer" v-model="text_content">
        <img @click="isIconShare = false" slot="label" src="../../../static/img/write.png" alt="write" class="icon-write" />
      </x-input>
      <img v-show="isIconShare" @click="handleShare" src="../../../static/img/icon-share@2x.png" alt="share" class="icon-share" />
      <img v-show="info.is_follow == false" @click="handleLike" src="../../../static/img/like.png" alt="like">
      <img v-show="info.is_follow == true" @click="handleLike" src="../../../static/img/lighten_like.png" alt="like">
    </group>
    <div class="my-item-bottom bottom-nav" v-show="!isIconShare">
        <div>
          <textarea v-on:blur="isIconShare = true" v-model="text_content" class="my-textarea" placeholder="请输入内容"></textarea>
          <div class="uplaod-img-box-list" v-show="img_content.length>0">
            <img  @touchstart="handelStart" @touchend="handleEnd(index,$event)" :src="item" alt="" v-for="(item,index) in img_content" :key="index">
          </div>
        </div>
        <div>
          <img src="../../../static/img/icon-camera@2x.png" alt="icon-camera">
          <vue-core-image-upload text=''  @imageuploaded="imageUpload" class="btn-upload" :crop="false" :url="uploadPath"></vue-core-image-upload>              
          <span @click="cancelSub">取消</span>
          <span @click="subAnswer">发表</span>
        </div>
    </div>
    <div class="bg_share" @click="isShowShare = false" v-show="isShowShare"></div>
    <loading :show="isShowLoading" :text='textLoading'></loading>
  </section>
</template>

<script>
  import {Loading,XInput, Group, XButton, Confirm, Previewer, TransferDomDirective as TransferDom} from 'vux'
  import scroll from '../common/scroll'
  import VueCoreImageUpload from 'vue-core-image-upload'
  const myVideo = {}
  export default {
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Confirm,
      XButton,
      Previewer,
      Group,
      scroll,
      Loading,
      VueCoreImageUpload   
    },
    data() {
      return {
        type: 1,
        isShow: false,
        info: {},
        teacher_list: [],
        userList: [],
        pay: false,
        text_content: '',
        id: '',
        isShowShare:false,
        isIconShare:true,
        isPlayed:false,
        myVideo:myVideo,
        ispaused:false,
        option1:[
          {
            src:'http://www.forum.com/uploads/image/5af02c297b6ea.png'
          },
          {
            src:'http://www.forum.com/uploads/image/5af02c297b6ea.png'
          }
        ],
        uploadPath:PATH + 'Upload/uploadImg',  
        img_content:[],   
        isShowLoading:false,
        textLoading:'上传中...'  ,
        startY:0,
        endY:0,
        isFollow:true
      }
    },
    methods: {
      openUser(uid){
        this.$router.push('/article/user/' + uid)
      },
      //点击收藏
      handleLike(){
        // this.info.is_follow = !this.info.is_follow
        let data = {
          question_id:this.info.id
        }
        this.apiPost('Index/followQuestion',data).then(res=>{
          this.$vux.toast.text(res.msg)
          if(res.msg === '关注成功'){
            this.info.is_follow = true
          }else{
            this.info.is_follow = false
          }
        })
      },
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

      changeShow(imgIndex,arrIndex){
        let elem = this.$refs.answerPrev
        elem.forEach((item,index)=>{
          if(arrIndex == index)
          item.show(imgIndex)
        })
      },
      cancelSub(){
        this.isIconShare = true
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
      handleClick(){
        this.isShow = false
      },
      //监听播放事件
      listenPlaying(){
        this.isPlayed = true
        this.ispaused = false
      },
      //监听停止播放
      ListenEnded(){
        this.myVideo.style = 'background-color:#333;'
        this.myVideo.controls = false
        this.isPlayed = false
        this.ispaused = true
      },
      // //点击播放
      handlePlay(){
        this.isPlayed = true
        this.ispaused = false
        this.myVideo.poster = ''
        this.myVideo.controls = true
        this.myVideo.style = ""
        setTimeout(()=>{
          this.myVideo.play()
        })
      },
      // //点击暂停
      handlePause(){
        this.isPlayed = false
        this.ispaused = true
        this.myVideo.controls = true
        this.myVideo.style = 'background-color:#333;'
        setTimeout(()=>{
          this.myVideo.pause()
        })
      },

      //画缩略图
      drawImg(){
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let height = this.myVideo.videoHeight ,
            width = this.myVideo.videoWidth
        ctx.drawImage(this.myVideo,0,0,height,width)
        let imgData = canvas.toDataURL('image/png')
        this.myVideo.poster = imgData
      },
      show(index){
        this.$refs.previewer.show(index)
      },
      fetchData() {
        this.apiPost('Index/questionDetail', {id: this.id}).then(res => {
          this.info = res.info;
          this.pay = res.answer.pay;
          this.teacher_list = res.answer.teacher;
          this.userList = res.answer.user;
          if(res.info.img_content){
            this.option1 = res.info.img_content.map(item=>{
              return {msrc:item,src:item}
            })
            this.info.img_content = this.option1
          }
          this.userList.forEach(item=>{
            if(item.img_content)
            item.img_content = item.img_content.map(list=>{
             return {msrc:list,src:list} 
            })
          })
        })
      },
      follow(id) {
        this.apiPost('Index/followUser', {uid: id}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          this.fetchData()
        })
      },
      teacher_() {
        if (this.pay) {
          this.isShow = true;
        } else {
          this.type = 2
        }
      },
      VIP() {
        router.push('/index/vip');
      },
      pay_() {
        Lockr.set('wx_pay', {type: "answer", id: this.id});
        setTimeout(() => {
          router.push('/pay')
        })
      },
      subAnswer() {
        let data = {
          parent_id: this.id,
          type: 1,
          text_content: this.text_content,
          img_content:this.img_content.toString()
        };
        if (!this.text_content) {
          this.$vux.toast.text('评论内容不能为空', 'middle');
          return false
        }
        this.apiPost('Index/subAnswer', data).then(res => {
          let msg = '';
          if (res.error === 0) {
            this.$vux.toast.text('回答成功', 'middle');
            this.text_content = ''
            this.img_content = [] 
            this.isIconShare = true
          } else {
            this.$vux.toast.text(res.msg, 'middle');
          }
          this.fetchData();
        })
      },
      praised(id) {
        this.apiPost('Index/answerLikes', {answer_id: id}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          if (res.error === 0) {
            this.fetchData();
          }
        })
      },
      handleShare() {
        let _this = this
        this.isShowShare = true
        let type = '' , dataUrl='' ,imgUrl= ''
        if(this.info.img_content){
          type = 'link'
          imgUrl = this.info.img_content[0].src
        }else if(this.info.video_content){
          type = 'video'
          dataUrl = this.info.video_content.toString()
        }else if(this.info.audio_content){
          type = 'music'
          dataUrl = this.info.audio_content.toString()
        }
        wx.ready(function () {
          let shareData = {
            title: _this.info.title,
            type:type,
            imgUrl:imgUrl,
            dataUrl:dataUrl,
            link: location.href.split('#')[0],
            // imgUrl: 'http://oa.namtc.com.cn//forum/bbs/public/uploads/image/5add3783ec8a9.jpg',
            success:function(){
                _this.apiPost('Index/sharing',{type:2,id:_this.id})
                _this.isShowShare = false
            },
            cancel:function(){
              _this.isShowShare = false
            }
          }
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareQQ(shareData);
          wx.onMenuShareQZone(shareData)
        })
      }
    },
    created() {
      this.id = this.$route.params.id;
      this.fetchData()
      this.$nextTick(()=>{
        this.myVideo = this.$refs.myVideo
        this.myVideo.controls = false
        this.myVideo.style="background-color:#333;"
        this.drawImg()
      })
    }
  }
</script>

<style scoped>
img[alt='icon-camera']{
  width:22px;
}
.wrapper{
  height:calc(100% - 40px);
  overflow: hidden;
}
  .icon-write {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
  .icon-ok-mini {
    width: 15px;
    height: 15px;
    margin-right: 0;
  }
  .item-top {
    padding: 20px 18px;
    background-color: #fff;
    box-sizing: border-box;
    align-items: center;
  }
  .icon-avatar {
    width: 9em;
  }
  .item-top h4 {
    font-size: 1.8em;
  }
  .label-list {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  .label {
    display: inline-block;
    width: 80px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    color: #fdffff;
    background-color: #1cc8a0;
  }
  .user-detail {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
  }
  .user-detail span:first-of-type {
    /* margin-left: -70px; */
    margin-left:.3em;
    margin-right:.7em;
    font-size: 1.4em;
    color: #ccc;
  }
  .user-detail span:first-of-type + span {
    /* margin-left: -50px; */
    font-size: 1.2em;
    color: #b3b3b3;
  }
  .user-detail span.btm-state {
    display: inline-block;
    width: 50px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    color: #1abc9b;
    border: 1px solid #1abc9b;
  }
  .item-detail {
    margin-top: 10px;
    padding: 20px 20px 15px 20px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .item-detail > p {
    font-size: 1.4em;
    line-height: 23px;
    color: #292929;
  }
  .detail-img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .img-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-flow: nowrap;
    height: 100%;
    margin-top: 10px;
    padding:1em .5em;
    box-sizing: border-box;
    overflow: hidden;
  }
  .image-box{
    display: block;
    width:100%;
    white-space: nowrap;
  }
  .btn-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 34px;
    margin-top: 10px;
    font-size:1.4em;
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  .btn-list span {
    display: inline-block;
    height: 100%;
    padding: 0 10px;
    line-height: 34px;
    color: #999;
    border-bottom: 1px solid #eee;
  }
  .item-list-detail {
    /*display: -webkit-box;*/
    /*-webkit-box-orient: vertical;*/
    /*-webkit-line-clamp: 2;*/
    /*overflow: hidden;*/
    margin: 18px 0;
    font-size: 1.4em;
    color: #666;
    line-height: 21px;
  }
  .item-list {
    margin-bottom: 10px;
    padding: 15px 20px 20px 20px;
    background-color: #fff;
  }
  .item-list .item-list-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item-list .item-list-top > div{
    position: relative;

  }
  img[alt="icon-crown"]{
    position: absolute;
    top:-10px;
    left:0;
    width:21px;
  }
  .item-list .item-list-top img {
    margin-right: 10px;
  }
  .item-list .item-list-top > div {
    display: flex;
    align-items: center;
    font-size: 1.4em;
  }
  .item-list .item-list-top > span {
    font-size: 1.2em;
    color: #ccc;
  }
  .bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #e6e6e6;
  }
  .item-list-box {
    width: 100%;
    height: 100%;
    z-index: 10000;
  }
  img[alt="share"]{
    position: absolute;
    right:2em;
    top:25%;
  }
  .video-box{
    position: relative;
  }
  .video {
    /* width:90%;
    height:90%; */
    width:300px;
    height:200px;
    margin-left:5%;
  }
  .audio-box{
    width:100%;
    height:0;
    padding:5em 0;
  }
  .bottom-nav{
    position: fixed;
    left: 0;
    bottom:0;
    width:100%;
    box-sizing: border-box;
  }
  .icon-control{
    position: absolute;
    top:calc(50% - 30px);
    left:calc(50% - 30px);
    z-index: 10000;
  }
  .img-box-list{
    width:100%;
    height:100px;
    margin-bottom:.3em;
    background-color: #f9f9f9;
    overflow: hidden;
    box-sizing: border-box;
  }
  .img-box-list img{
    width:100px;
    height:100px;
    margin-right:.3em;
  }
  .art{
    font-size: 1.3em;
  }
  .uplaod-img-box-list{
    display: flex;
    align-items: center;
    justify-content: flex-start !important;
    width:100%;
    height:100px;
    overflow: hidden;
  }
  .uplaod-img-box-list img{
    width:50px;
    height:100px;
  }
  img[alt="like"]{
    position: absolute;
    right:60px;
    bottom:10px;
    width:25px;
  }
</style>

<style lang="less" scoped>
 .my-item-bottom{
   display: flex;
   flex-flow: column nowrap;
   justify-content: flex-start;
  //  height:150px;
   padding: 1em 1em 1.5em 1em;
   border-top:1px solid #e6e6e6;
   background-color: #fff;
   box-sizing: border-box;
   div{
     width:100%;
     font-size: 1.2em;
     box-sizing: border-box;
     .my-textarea{
       width:100%;
       height:100px;
       padding:.5em;
       margin-bottom:1em;
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
