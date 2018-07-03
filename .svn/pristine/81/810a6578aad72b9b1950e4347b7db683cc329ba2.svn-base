<template>
  <section class="father">
    <scroll class="wrapper" ref="wrapper" :pulldown="pulldown" @pulldown="fetchData">
      <div class="content">
        <div class="item-list" v-for="(item,index) in list" :key="index">
          <div @click="jumpToOther(item)">
            <div class="item-list-top">
              <h4 class="article-title">{{item.title}}</h4>
              <div class="icon">
                <img v-if="parseInt(item.is_choice)" src="../../../static/imgs/icon-choose.png" alt="choose" class="icon-title">
                <img v-if="parseInt(item.is_roof)" src="../../../static/imgs/icon-roof.png" alt="roof" class="icon-title">
              </div>
            </div>
            <div>
              <p class="item-list-detail" style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">{{item.content}}</p>
            </div>
          </div>
          <div class="btn-list">
            <span><img src="../../../static/imgs/icon-visite.png" alt="icon_visite"> {{item.browse}}</span>
            <span><img src="../../../static/imgs/icon-ok-default.png" alt="icon_ok"> {{item.praised}}</span>
            <span><img src="../../../static/imgs/icon-like.png" alt="icon_like"> {{item.follower}}</span>
            <span><img src="../../../static/imgs/icon-message.png" alt="icon_message">{{item.criticism_count}}</span>
          </div>
        </div>
        
        <div v-if="isShowMore"><p class="btn-next" @click="loadMore">加载更多</p></div>
        <div v-if="!isShowMore"><load-more :show-loading="showLoadingMore" :tip="('没有更多啦')"></load-more></div>
      </div>
    </scroll>
    <loading v-model="showLoading" :text="textLoading" v-show="isShowMore"></loading>
  </section>
</template>

<script>
import {Loading,LoadMore} from 'vux'
import scroll from '../common/scroll'
  export default {
    components: {
      Loading,
      LoadMore,
      scroll
    },
    data() {
      return {
        list: [],
        showMore: true,
        page: 1,
        showLoadingMore:true,
        showLoading: false,
        textLoading: '加载中...',
        isShowMore:true,
        isRefresh:false,
        pulldown:false,
      }
    },
    methods: {
      loadMore(){
        if(this.isShowMore){
          this.page++
          this.fetchData()
        }
      },

      //获取数据
      fetchData(){
        this.showLoadingMore = true
        this.apiPost('Index/article',{page:this.page}).then(res=>{
            this.showLoadingMore = false
            if(res){
              this.list = this.list.concat(res)
              if(res.length == 10){
                this.isShowMore = true
              }else{
                this.isShowMore = false
              }
            }
        })
      },
     
      jumpToOther(elem) {
        this.$router.push('/article/detail/' + elem.id)
      },

    },
    created(){
      this.fetchData()
    },
  }
</script>

<style scoped>
  .scroller{
    position: relative;

  }
  .center {
    margin: 5px 0;
    text-align: center;
  }
  .item-list {
    margin-bottom: 1em;
    background-color: #fff;
  }
  .item-list > div:first-of-type {
    padding: 1.6em 1em;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
  }
  .item-list-top {
    display: flex;
    justify-content: space-between;
  }
  .item-list-top h4 {
    font-size: 1.7em;
  }
  .item-list-top + div {
    margin-top: 1.2em;
    color: #b5b8ba;
  }
  .item-list-top .icon {
    display: flex;
    margin-top: 1%;
  }
  .item-list-detail {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: 1.4em;
    color: #999;
  }
  .btn-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 1.4em 2em;
    font-size:1.3em;
    border-bottom: 1px solid #ebebeb;
    box-sizing: border-box;
  }
  .btn-list span {
    display: flex;
    align-items: center;
    color: #b5b8ba;
  }
  .btn-list > span > img{
    margin-right:.3em;
  }
  img[alt="choose"]{
    margin-left:5px;
    margin-right:5px;
  }
  .wrapper{
    height:100%;
    overflow: hidden;
  }
</style>
