<template>
  <section class="wrap">
    <!-- <search class="my-search" v-model="keyword" @on-enter="searchData" @on-submit="searchData" @on-cancel="jumpToIndex" :auto-scroll-top-top="true"></search> -->
    <div class="search-nav">
      <div class="my-input-item">
        <x-input class="my-input" v-model="keyword" @on-enter="searchData">
          <img src="../../../static/img/icon-search.png" alt="" slot="label" style="margin-right:10px;">
        </x-input>
      </div>
      <span @click="jumpToIndex">取消</span>
    </div>
    <div style="height:50px;"></div>
    <!--搜索前-->
    <section class="detail" v-if="!isShow">
      <div class="item-list">
        <p class="item-title">热门搜索</p>
        <div class="sub-item-list">
          <span @click="handleSearch(item)" v-for="(item,index) in hotSearch" :key="index">{{item}}</span>
        </div>
      </div>
      <div class="item-list" v-if="isShowHistory">
        <p class="item-title">搜索历史</p>
        <ul>
          <li v-for="(item,index) in searchHistory" :key="index">
            <img src="../../../static/img/clock.png" alt="history" class="icon-clock">
            <span @click="handleSearch(item)">{{item}}</span>
          </li>         
        </ul>
      </div>
      <div class="btn-area" v-if="isShowHistory">
        <span class="btn-clear" @click="clearHistory">清除搜索历史</span>
      </div>
    </section>

    <!--搜索结果-->
    <section class="detail1" v-if="isShow" style="height:100%;">
          <!--有搜索结果-->
          <div @click="jumpToOther(item)" v-if="isEmpyt" class="item-list1" v-for="(item,index) in search" :key="index">
            <h5 v-html="item.title.replace(keyword,`<span style='color:#1BBD9C'>${keyword}</span>`)"></h5>
            <div class="item-detail">
              <p>标题: {{item.title}}</p>
              <p class="btn-list">
                <span><img src="../../../static/imgs/icon-visite.png" alt="icon_visite"> {{item.browse}}</span>
                <span><img src="../../../static/imgs/icon-like.png" alt="icon_like"> {{item.follower}}</span>
                <span><img src="../../../static/imgs/icon-message.png" alt="icon_message"> {{item.criticism_count || item.answer_count || 0}}</span>
              </p>
            </div>
          </div>          
          <!--没有搜索结果-->
          <div v-if="!isEmpyt" class="item-list-message1">
            <p>没有找到相关信息</p>
            <p>请换一个关键词试试吧</p>
          </div>
    </section>
    <loading v-model="isShowLoading" ></loading>
  </section>
</template>

<script>
  import {XInput,XButton,Group,Search,Loading} from 'vux'
  export default{
    components:{
      XInput,
      XButton,
      Group,
      Search,
      Loading
    },
    data(){
      return{
        isShow:false,
        isEmpyt:true,
        keyword:'',
        search:[],
        hotSearch:[],
        searchHistory:[],
        isShowLoading:false,  
        isShowHistory:false,
      }
    },
    methods:{

      jumpToIndex(){
        this.$router.push('index')
      },
      //历史搜索
      handleSearch(data){
        this.keyword = data
        this.searchData()
      },

      //搜索跳转
      jumpToOther(data){
        this.$router.push('/article/detail/'+data.id)
      },
      jumpToIndex(){
        this.$router.push('/index')
      },
      //清除搜索历史
      clearHistory(){
        Lockr.set('search','')
        this.searchHistory = []
      },

      //热搜
      hotSearchData(){
        this.isShowLoading = true
        this.apiPost('Index/hotSearch').then(res=>{
          this.isShowLoading = false
          this.hotSearch = res
        })
      },
      //普通搜索
      searchData(){
        this.isShowLoading = true
        if(this.keyword){
          this.isShow = true
        }else {
          this.isShow = false
          this.isShowLoading = false
          return
        }
        this.apiPost('Index/search',{keyword:this.keyword}).then(res=>{
          this.isShowLoading = false
          Lockr.sadd('search',this.keyword)
          if(!res){
            this.isEmpyt = false
          }else{
            this.search = res
            this.isEmpyt = true
          }  
        })
      },
    },
    created(){
      this.hotSearchData()
      this.$nextTick(()=>{
        this.searchHistory = Lockr.get('search')
        if(this.searchHistory.length == 0){
          this.isShowHistory = false
        }else{
          this.isShowHistory = true
        }
      })
    }
  }
</script>


<style scoped>
.wrap{
  background-color: #f9f9f9;
}
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:.5em 1em 1em 1em;
  background-color: #F1F1F1;
}
.search-box .top-title{
  margin-top:10px;
}
.input{
  flex:1;
  height:2.5em;
  margin-right:1em;
  border-radius: 2em;
  background-color: #fff;
  box-sizing: border-box;
  border:1px solid #D7D7D7;
}
.detail{
  background-color: #f9f9f9;
}
.item-list{
  padding-top:1em;
  margin-bottom:1em;
  border:1px solid #e6e6e6;
  background-color: #fff;
}
.item-list p{
  margin-bottom:.7em;
  color: #C4C2C4;
}
.item-list:first-of-type > div{
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  flex-flow: wrap;
}
.item-list:first-of-type > div span{
  display: inline-block;
  min-width:2em;
  padding:.3em 1.3em;
  margin-right:1em;
  margin-bottom:.5em;
  text-align: center;
  font-size: 1.4em;
  color: #8A8889;
  border-radius: 20px;
  border:1px solid #DFDFDF;
}
.item-list ul li{
  display: flex;
  align-items:center;
  height:2em;
  padding-bottom:.7em;
  padding-left:1em;
  font-size: 1.3em;
  color:#A3A1A2;
}
.item-list ul li img{
  margin-right:.7em;
}
.btn-area{
  text-align:center;
}
.btn-clear{
  margin:0 auto;
  color: #999;
}
.detail1{
  /* height:100%; */
  background-color: #fff;
}
.detail-img{
  width:37px;
  height:37px;
  margin-right:1.6em;
  border-radius: 50%;
}
.item-list1 h5{
  margin-bottom:.5em;
  font-size: 1.6em;
}
.item-list1{
  padding:1em 1em .5em 1em;
  box-sizing: border-box;
  border-bottom:1px solid #F2F2F2;
}
.item-list1 > div p{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:2;
  overflow: hidden;
  font-size: 1.4em;
}
.item-list1:first-of-type{
  /* margin-top:3.5em; */
}
.item-list-message1{
  display: flex;
  flex-direction: column;
  align-items: center;
  height:100%;
  justify-content: center;
}
.item-list-message1 p{
  align-self: center;
  color: #989898;
}
.default{
  margin-right:.4em;
}
.item-detail{
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: flex-start
}
.item-detail .btn-list{
  display: flex;
  align-items: center;
  width:100%;
  margin-top:.5em;
  box-sizing: border-box;
}
.item-detail .btn-list span{
  display: flex;
  align-items: center;
  margin-right:1em;
  color: #999;
}
.item-detail .btn-list img{
  margin-right:.3em;
}
.item-title{
  padding-bottom:.7em;
  padding-left:1em;
  font-size: 1.4em;
  color: #646464 !important;
  border-bottom:1px solid #e6e6e6;
}
.sub-item-list{
  padding-left:1em;
}
</style>

<style lang="less">
.my-search{
  .weui-search-bar__cancel-btn{
    text-decoration-line: none;
    color: #1BBD9C;
    font-size: 1.4em;
  }

}
  .search-nav{
    display: flex;
    align-items: center;
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:50px;
    padding:.5em 1em;
    background-color: #f9f9f9;
    box-sizing: border-box;
    z-index: 10000 !important;
    .my-input-item{
      flex:1;
      height:35px;
      background-color: #fff;
      border-radius: 20px;
    }
    span{
      margin-left:.5em;
      font-size: 1.4em;
      color: #1BBD9C;
    }
  }
</style>
