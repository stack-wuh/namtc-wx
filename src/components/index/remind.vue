<template>
  <section class="wrap">
    <!-- <scroller class="scroller" ref="my_scroller" :noDataText='notext' :on-refresh="refresh" :on-infinite="infinite">
      <div v-if="list.length > 0 && type ==='criticism'" class="item-list" v-for="(item,index) in list" :key="index"
          @click="routerTo(item.id,item.type)">
        <div class="list-first">
          <img :src="item.wx_pic" alt="avatar" class="avatar">
          <span>{{item.nickname}}</span>
          <span>回复了你的评论</span>
        </div>
        <div>{{item.sub_time}}</div>
        <div>
          <p class="item-detail">{{item.criticism}}</p>
        </div>
        <div>
          <p>{{item.reply}}</p>
        </div>
      </div>
      <div v-if="list.length > 0 && type ==='laud'" class="item-list" v-for="(item,index) in list" :key="index" @click="routerTo(item.id,item.type)">
        <div class="list-first">
          <img :src="item.wx_pic" alt="avatar" class="avatar">
          <span>{{item.nickname}}</span>
          <span>赞了你的评论</span>
        </div>
        <div>{{item.add_time}}</div>
        <div>
          <p>{{item.title}}</p>
        </div>
      </div>
      <load-more :show-loading="isShowLoading" :tip="('没有更多啦...')"></load-more>
    </scroller> -->

    <scroll ref="wrapper" class="wrapper" :pulldown="pulldown" @pulldown='_fetchData'>
      <div class="content">
        <div v-if="list.length > 0 && type ==='criticism'" class="item-list" v-for="(item,index) in list" :key="index"
          @click="routerTo(item.id,item.type)">
        <div class="list-first">
          <img :src="item.wx_pic" alt="avatar" class="avatar">
          <span>{{item.nickname}}</span>
          <span>回复了你的评论</span>
        </div>
        <div>{{item.sub_time}}</div>
        <div>
          <p class="item-detail">{{item.criticism}}</p>
        </div>
        <div>
          <p>{{item.reply}}</p>
        </div>
      </div>
      <div v-if="list.length > 0 && type ==='laud'" class="item-list" v-for="(item,index) in list" :key="index" @click="routerTo(item.id,item.type)">
        <div class="list-first">
          <img :src="item.wx_pic" alt="avatar" class="avatar">
          <span>{{item.nickname}}</span>
          <span>赞了你的评论</span>
        </div>
        <div>{{item.add_time}}</div>
        <div>
          <p>{{item.title}}</p>
        </div>
      </div>
      <div v-if="isShowMore"><p class="btn-next" @click="_loadMore">加载更多</p></div>
      <load-more v-show="!isShowMore" :show-loading="isShowLoading" :tip="('没有更多啦')"></load-more>
      </div>
    </scroll>

    <loading v-model="isShowLoading" :text="textLoading"></loading>

  </section>
</template>

<script>
  import Scroll from '../common/scroll'
  import {LoadMore,Loading} from 'vux'
  import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

  export default {
    components: {
      LoadMore,
      Loading,
      Scroll
    },
    data() {
      return {
        page: 1,
        list: [],
        isShowLoading: true,
        isMoreShow: true,
        type: '',
        showMore:false,
        isRefresh:false,
        notext:'',
        pulldown:false,
        isShowMore:false,
        textLoading:'加载中...'

      }
    },
    methods: {
      _loadMore(){
        if(this.isShowMore){
          this.page++
          this._fetchData()
        }
      },
      _fetchData(){
        this.isShowLoading = true
        let _url = ''
        _url = this.type == 'laud' ? 'Index/praised' : 'Index/commented'
        this.apiPost(_url,{page:this.page}).then(res=>{
          this.isShowLoading = false
          if(res){
            this.list = this.list.concat(res)
            if(res.length == 10){
              this.isShowMore = true
            }else{
              this.isShowMore = false
            }
          }else{
            this.isShowMore = false
          }
        })
      },
      //获取数据
      fetchData(){
        this.isShowLoading = true
        let _url = ''
        _url = this.type == 'laud' ? 'Index/praised' : 'Index/commented'
        this.apiPost(_url,{page:this.page}).then(res=>{
          this.isShowLoading = false
          let newList = []
          newList = res ? res : []
          if(this.isRefresh){
            if(newList.length > 0){
              this.list.unshift(...newList)
              this.isRefresh = false
            }else{
              this.$refs.my_scroller.finishPullToRefresh()
            }
          }else{
            this.list = this.list.concat(newList)
          }
          if(newList){
            if(newList.length == 10){
              this.showMore = true
            }else{
              this.showMore = false
            }
          }
        })
      },
      //上拉刷新
      refresh(done){
        if(this.page == 1){
          this.$refs.my_scroller.finishPullToRefresh()
          return
        }
        this.page++
        this.fetchData()
        done()
      },
      //下拉加载
      infinite(done){
        if(this.showMore){
          this.page++
          this.fetchData()
          done()
        }else{
           this.$refs.my_scroller.finishInfinite(1)
           done()
        }
      },
      getPraised() {
        this.apiPost('Index/praised', {page: this.page}).then(res => {
          this.list = res ? res : [];
          this.isShowLoading = false
        })
      },
      getCommented() {
        this.apiPost('Index/commented', {page: this.page}).then(res => {
          this.list = res ? res : [];
          this.isShowLoading = false
        })
      },
      routerTo(id, type) {
        if (type === "article")
          router.push('/article/detail/' + id);
        else
          router.push('/question/detail/' + id)
      },
    },
    created() {
      this.type = Lockr.get('router_type');
      this._fetchData()
      // this.fetchData()
      // if (this.type === "laud") {
      //   this.getPraised();
      // } else if (this.type === "criticism") {
      //   this.getCommented();
      // }
    }
  } 
</script>

<style scoped>
.wrapper{
  width: 100%;
  height:100%;
  overflow: hidden;
  box-sizing: border-box;
}
.scroller{
  position: relative;
}
  .avatar {
    width: 2em;
    height: 2em;
    border-radius: 50%;
  }
  .item-list {
    margin-bottom: 1em;
    padding: .5em 1em;
    border: 1px solid #e4e4e4;
    background-color: #fff;
  }
  .item-list .list-first {
    display: flex;
    align-items: center;
  }
  .item-list .list-first span:first-of-type {
    margin-left: 1em;
    font-size: 1.6em;
    font-weight: 600;
  }
  .item-list .list-first span:last-of-type {
    font-size: 1.5em;
    margin-left: 1em;
    color: #b7bbbb;
  }
  .item-list div:nth-child(2) {
    font-size: 1.2em;
    margin: .5em 0;
    color: #b7bbbb;
  }
  .item-list div:last-of-type {
    padding: .5em;
    font-size: 1.5em;
    color: #989898;
    background-color: #f2f2f2;
  }
  .item-detail{
    margin:.5em 0;
  }
</style>
