<template>
  <section class="wrap">
    <div class="search-box">
      <x-input title="search" class="input" v-model="keyword" @on-enter="gainData">
        <img @click="gainData" slot="label" src="../../../static/img/search.png" alt="search" class="icon-search">
      </x-input>
    </div>
    <div class="list-item" v-for="item in list" @click="routeTo(item.id)">
      <div>
        <div>
          <h4>{{item.title}}</h4>
          <span class="icon">
            <img v-if="parseInt(item.is_roof)" src="../../../static/imgs/icon-roof.png" alt="roof" height="20">
            <img v-if="parseInt(item.is_choice)" src="../../../static/imgs/icon-choose.png" alt="choose" height="20">
          </span>
        </div>
        <p class="art" v-html="item.text_content" style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;"></p>
        <div class="img-box" v-show="item.img_content">
          <img v-for="items in item.img_content" :src="items" class="detail-img">
        </div>
        <div v-show="item.audio_content">
          <audio :src="item.audio_content">
            您的浏览器不支持 audio 标签。
          </audio>
        </div>
        <div v-show="item.video_content">
          <video :src="item.video_content" controls class="video">
            您的浏览器不支持 video 标签。
          </video>
        </div>
      </div>
      <div class="btn-list">
        <span><img src="../../../static/imgs/icon-visite.png" alt="icon_visite"> {{item.browse}}</span>
        <span><img src="../../../static/imgs/icon-ok-default.png" alt="icon_ok"> {{item.praised}}</span>
        <span><img src="../../../static/imgs/icon-like.png" alt="icon_like"> {{item.follower}}</span>
        <span><img src="../../../static/imgs/icon-message.png" alt="icon_message"> {{item.count}}</span>
      </div>
    </div>
    <load-more :show-loading="isShowLoading" :tip="('没有更多啦')"></load-more>
  </section>
</template>

<script>
  import {XInput,LoadMore} from "vux";

  export default {
    components: {
      XInput,
      LoadMore
    },
    data() {
      return {
        page: 1,
        list: [],
        keyword:'',
        isShowLoading:true
      };
    },
    created() {
      this.gainData();
    },
    methods: {

      gainData() {
        this.isShowLoading = true
        this.apiPost('Index/question', {page: this.page,keyword:this.keyword}).then(result => {
          this.isShowLoading = false
          this.list = result;
        })
      },
      routeTo(id){
        router.push('/question/detail/' + id)
      },
    }
  };
</script>

<style scoped>
  .icon-add {
    width: 26px;
    height: 26px;
  }
  .search-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5em 1em;
    background-color: #f1f1f1;
  }
  .input {
    flex: 1;
    height: 2.5em;
    margin-right: 1em;
    border-radius: 2em;
    background-color: #fff;
    box-sizing: border-box;
    border: 1px solid #d7d7d7;
  }
  .list-item {
    margin-bottom: 10px;
    background-color: #fff;
  }
  .list-item > div:first-of-type {
    padding: 20px 20px 10px 20px;
  }
  .list-item div:first-of-type div:first-of-type {
    display: flex;
    justify-content: space-between;
    font-size: 1.8em;
  }
  .list-item p {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-top:1em;
  margin-bottom:.5em;
  font-size:1.5em;
  line-height: 1.5;
  box-sizing: border-box;
  color: #999;
  }
  .detail-img {
    width: 100px;
    height: 100px;
    margin-right: 10px;
  }
  .img-box {
    display: flex;
    flex-flow: wrap;
    height: 100px;
    margin-top: 10px;
    overflow: hidden;
  }
  .btn-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    font-size:1.4em;
    border-top: 1px solid #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
  }
  .btn-list span {
    display: flex;
    align-items: center;
    color: #999;
  }
  .btn-list img{
    margin-right:.3em;
  }
  .icon{
    display: flex;
    padding-top: .5%;
  }
  .video{
    width:300px;
    height:200px;
    margin-left:calc((100% - 300px)/2);
  }
</style>
