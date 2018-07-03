<template>
  <section class="wrap">
    <nav v-if="list.length>0">
      <span class="active">评论</span>
    </nav>
    <div class="item-list" v-for="(item,index) in list" :key="index">
      <div class="item-list-top">
        <div class="first-item">
          <img :src="item.wx_pic" alt="avatar" class="icon-avatar-small">
          <span style="color: #1bbd9c" @click="openUser(item.uid)">{{item.nickname}}</span>
        </div>
        <div class="last-item">
          <img src="../../../static/img/lighten_ok.png" alt="like" class="icon-like" v-if="item.is_praised"
              @click="follow(item.id)">
          <img src="../../../static/img/ok.png" alt="like" class="icon-like" v-else @click="follow(item.id)">
          <span>{{item.count}}</span>
          <img slot="label" src="../../../static/imgs/icon-edit.png" alt="write" class="icon-write" @click="openWrite(item.id)">
        </div>
      </div>
      <p class="item-content">{{item.text_content}}</p>
      <div v-show="item.img_content" class="item-img-box">
        <img :src="item1.msrc" alt="i"  v-for="(item1,subindex) in item.img_content" @click="changeShow(subindex,index)" :key="subindex">
        <div v-transfer-dom >
          <previewer ref="previewer" :list="item.img_content" ></previewer>
        </div>      
      </div>
      <p class="time">{{item.sub_time}}</p>
      <div v-show="item.child" class="com">
        <p class="item-detail" v-for="(item2,index) in item.child" :key="index">
          <span class="name">&nbsp;{{item2.nickname}}：</span>
          <span class="msg-detail">{{item2.text_content}}</span>
        </p>
      </div>
    </div>
    <!-- <Group v-show="show" class="my-input">
      <x-input ref="input" placeholder="请输入" @on-focus="isShowText = true;show=false" v-model="text_content" @on-enter="addNotes" class="input" @on-blur="show = false">
        <img @click="isShowText = true;show=false" slot="label" src="../../../static/img/write.png" alt="write" class="icon-writ">
      </x-input>
    </Group> -->
    <div class="my-textarea" v-show="isShowText">
        <div>
          <textarea v-model="text_content" class="text-input" cols="20" rows="10" placeholder="请输入内容"></textarea>
        </div>
        <p>
          <span @click="isShowText = false ,show = false">取消</span>
          <span @click="addNotes">确定</span>
        </p>
    </div>
    <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>
  </section>
</template>

<script>
  import {XInput, Group,LoadMore,Previewer,TransferDom} from 'vux'
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';

  export default {
    directives:{
      TransferDom
    },
    components: {
      XInput,
      Group,
      LoadMore,
      Previewer
    },
    data() {
      return {
        list: [],
        newList:[],
        text_content: "",
        show: false,
        pid: '',
        imgList:[
          {
            msrc:'../../../static/img/avatar.jpg',
            src:'../../../static/img/avatar.jpg'
          }
        ],
        isShowText:false
      }
    },
    created() {
        let newList = Lockr.get('criticism')
        newList.map(item=>{
          if(item.img_content){
              item.img_content = item.img_content.map(list=>{
              return {msrc:list,src:list}
            })
          }
        })
        this.list = newList
    },
    methods: {
      changeShow(imgIndex,arrIndex){
        let elem = this.$refs.previewer
        elem.forEach((item,subIndex)=>{
          if(subIndex == arrIndex)
          item.show(imgIndex)
        })
      },
      addNotes() {
        if (this.pid) {
          let data = {
            parent_id: this.pid,
            type: 2,
            text_content: this.text_content
          };
          if (!this.text_content) {
            this.$vux.toast.text('评论内容不能为空', 'middle');
            return
          }
          this.apiPost('Index/subCriticism', data).then(res => {
            let msg = '';
            if (res.error === 0) {
              this.$vux.toast.text('评论成功', 'middle');
              this.isShowText = false
              this.text_content = '';
              this.sort(this.pid)
            } else {
              this.$vux.toast.text(res.msg, 'middle');
            }
          })
        }
      },
      openUser(uid) {
        this.$router.push('/article/user/' + uid);
      },
      openWrite(id) {
        this.show = true;
        this.text_content = '';
        this.isShowText = true
        this.pid = id;
        setTimeout(() => {
          // this.isShowText = false
          // this.$refs.input.focus();
        }, 0);
      },
      sort(id) {
        this.apiPost('Index/subreView', {id: id}).then(res => {
          this.list.map(item=>{
            if(item.id == res.id){
              item.is_praised = res.is_praised
              item.child = res.child
            }
          })      
        })
      },
      follow(id) {
        this.apiPost('Index/articleLikes', {criticism_id: id}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          if (res.error === 0) {
            this.sort(id)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .icon-writ {
    width: 1.2em;
    height: 1.2em;
  }
  .icon-write {
    width: 1.6em;
    height: 1.6em;
    margin-left: 2em;
  }
  .icon-like {
    width: 1.6em;
    height: 1.6em;
    margin-right:.3em;
    /* margin-left: 15em;
    margin-right: .1em; */
  }
  .item-list-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item-list-top .first-item{
    display: flex;
    align-items:center;
  }
  .item-list-top .last-item{
    display: flex;
    align-items:center;
  }
  .item-content{
    margin:10px 0;
    font-size: 1.4em;
  }
  .icon-avatar-small {
    width: 1.6em;
    height: 1.6em;
    border-radius: 50%;
  }
  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 34px;
    margin-top: 10px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }
  nav span {
    display: inline-block;
    width: 90%;
    height: 35px;
    text-align: left;
    font-size: 1.4em;
    color: #999;
    line-height: 35px;
    border-bottom: 1px solid #eee;
  }
  .item-list {
    margin-bottom: 10px;
    padding: 15px 20px 10px 20px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .item-list .time {
    font-size: 1.3em;
    color: #b3b3b3;
  }

  .item-list .com {
    margin-top: 10px;
    color: #989898;
    background-color: #f2f2f2;
  }
  .item-list .com p {
    display: flex;
    flex-flow: nowrap;
    align-items: center;
    padding: 1px;
  }
  .input {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    text-indent: 1em;
    box-sizing: border-box;
  }
  .item-list .msg-detail {
    flex:1;
    display: inline-block;
    font-size: 1.4em;
  }
  .item-list .name {
    display: inline-block;
    min-width: 30px;
    color: #1bbd9c;
  }
  img[alt='avatar']{
    margin-right:.3em;
  }
  .item-detail{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .item-img-box{
    width:100%;
    height:100px;
    padding:0;
    background-color: #f9f9f9;
    margin-bottom:.3em;
    overflow: hidden;
    box-sizing: border-box;
  }
  .item-img-box img{
    width:100px;
    height:100px;
    margin-right:.5em;
  }
  .my-textarea{
    position: fixed;
    bottom:0;
    left:0;
    width:100%;
    height:170px;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 1000 !important;
  }
  .my-textarea > div{
    width:100%;
    padding:10px;
    box-sizing: border-box;
  }
  .my-textarea .text-input{
    width:100%;
    height:100px;
    padding:10px 0 0 10px;
    outline: none;
    border:none;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  .my-textarea p {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding:0 10px;
  }
  .my-textarea p span{
    display: inline-block;
    margin:0 10px;
    padding:.3em .5em;
  }
  .my-textarea p span:first-of-type{
    border:1px solid #e4e4e4;
  }
  .my-textarea p span + span{
    background-color: #1bbd9c;
    color: #fff;
  }
</style>
