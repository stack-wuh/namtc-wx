<template>
  <section class="wrap">
    <div style="position:relative;top:0;left:0;width:100%;height:50px">
    <search @result-click="resultClick"
    @on-change="getResult"
    :results="results"
    v-model="keyword"
    auto-fixed
    position="relative"
    auto-scroll-to-top
    @on-focus="onFocus"
    @on-cancel="onCancel"
    @on-submit="onSubmit"
    ref="search"></search>
    </div>
        <div class="item-list" v-if="list.length > 0" v-for="(item,index) in list" :key="index">
            <div>
              <h3>{{item.classify_name}}</h3>
              <span>0关注 0 问题</span>
            </div>
            <span @click="jumpToOther(item)">选择</span>
        </div>
        <div  v-if="list.length == 0" style="margin-top:60px;">
          <p class="center">没有更多啦</p>
        </div>
    <loading v-model="showLoading" :text="textLoading"></loading>
  </section>

</template>

<script>
  import {Search ,Scroller,Loading} from 'vux'
  const pullupConfig = {
    content:'上拉加载更多...',
    upContent:'上拉加载更多..',
    autoRefresh:false,
    loadingContent:'加载中...'
  }
  export default{
    components:{
      Search,
      Scroller,
      Loading
    },
    data(){
      return{
        keyword:'',
        results:[],
        list:[],
        page:1,
        isShow:false,
        scrollerStatus:{
          pullupStatus:'default'
        },
        pullupConfig:pullupConfig,
        showLoading:false,
        textLoading:'加载中...',
        msgShow:false,
        searchList:[]
      }
    },
    methods:{
      getResult(val){
        console.log(val)
      },
      resultClick(e){
        console.log(e)
      },
      onFocus(){
        this.$refs.search.setFocus() 
        this.list = []

      },
      jumpToOther(item){
        Lockr.set('classify',item)
        this.$router.push('/quzi/edit/1')
      },
      onCancel(){
        this.keyword = ''
        this.fetchData()
      },
      onSubmit(){
        this.$refs.search.setBlur()
        this.fetchData()
      },
      fetchData(){
        this.apiPost('Index/classify',{keyword:this.keyword}).then(res=>{
          this.list = res ? res :[]
        })
      }
    },
    mounted(){
      this.fetchData()
    }
  }
</script>

<style scoped>

.item-list{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height:50px;
  line-height:40px;
  padding-left:20px;
  padding-right:20px;
  border-bottom:1px solid #e6e6e6;
  background-color: #fff;
}
.item-list > div{
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  height:100%;
}
.item-list > div > span{
  margin-left:10px;
}
.item-list > span{
  display: inline-block;
  width:50px;
  height:20px;
  text-align: center;
  line-height:20px;
  color:#1BBC9C;
  border:1px solid #1BBC9C;
}
</style>
