<template>
<section class="wrap">
  <section class="first" v-if="active == index" v-for="(item,index) in list" 
        v-bind:class="[index%6 == 0?'first':index%6 == 1 ? 'second':index%6 ==2 ?'third' 
          :index%6 == 3? 'four' : index%6 == 5 ? 'five' : 'six']" :key="index">
    <section class="wrap-out">
      <section class="wrap-in">
        <p @click="jumpToOther">跳过<p>
        <p>完成操作知识以便于为您提供更合适的内容</p>
        <div class="wrap-detail">
          <p>{{item.question}}</p>
          <div class="wrap-list">
            <span @click="chooseItem(list1,index,index1,item)" v-for="(list1,index1) in item.option"
                 v-bind:class="{'choose':list1.choose}" :key="index1">{{list1.option}}</span>
          </div>
        </div>
      </section>
    </section>
  </section>
</section>
</template>

<script>
  export default{
    data(){
      return{
        active:0,
        imgUrl:'../../../static/imgs/bg_loading3.png',
        list:[],
        question:[]
      }
    },
    methods:{
      jumpToOther(){
        this.$router.push('/index')
      },
      //选项
      chooseItem(data,index,index1,item){
        let isShow = false
        this.question.push(item.option[index1].id)
        if(this.active == this.list.length-1){
          this.active = this.list.length-1
          this.apiPost('Index/subGuide',{data:this.question}).then(res=>{
              this.$router.push('/index')
          })
        }else{
          this.active++
        }
        if(data.choose){
          isShow = false
        }else{
          isShow = true
        }
        // this.question.push({question:item.question,option:data.option})
        this.$set(this.list[index].option[index1],'choose',isShow)
      },
      
      fetchData(){
        this.apiPost('Index/guide').then(res=>{
          this.list = res
        })
      }

    },
    created(){
      this.fetchData()
    } 
  }
</script>

<style scoped>
.wrap{
  height:100%;
}
.first{
  height:100%;
  background:url('../../../static/imgs/bg_loading1.png');
  background-size: 100% 100%;
}
.second{
  height:100%;
  background:url('../../../static/imgs/bg_loading2.png');
  background-size: 100% 100%;
}
.third{
  height:100%;
  background:url('../../../static/imgs/bg_loading3.png');
  background-size: 100% 100%;  
}
.four{
  height:100%;
  background:url('../../../static/imgs/bg_loading4.png'); 
  background-size: 100% 100%;

}
.five{
  height:100%;
  background:url('../../../static/imgs/bg_loading5.png');
  background-size: 100% 100%;  
}
.six{
  height:100%;
  background:url('../../../static/imgs/bg_loading6.png');
  background-size: 100% 100%;  
}
 .wrap-out{
  width:100%;
  height:100%;
  background: rgba(0,0,0,.4);
  box-sizing: border-box;
}
 .wrap-in{
  width:100%;
  height:100%;
  padding:20px;
  font-size:1.6em;
  color: #fff;
  box-sizing: border-box;
  }
 .wrap-in > p:first-child{
  text-align: right;
}
 .wrap-in > p:first-child ~ p{
  margin-top:78px;
  text-align:center;
}
 .wrap-detail{
  margin-top:24px;
  background:rgba(0,0,0,.5);
  box-sizing: border-box;
}
 .wrap-detail p{
  height:44px;
  padding-left:20px;
  line-height:44px;
  border-bottom:1px solid #fff;
}
 .wrap-list{
  display: flex;
  justify-content:flex-start;
  align-items: center;
  flex-flow: wrap;
  width:100%;
  padding:1.2em;
  padding-right:0;
  padding-left:0;
  box-sizing: border-box;
}
 .wrap-list span{
  display: inline-block;
  width:33%;
  height:3em;
  padding:.1em .5em;
  margin-top:1em;
  margin:1em .5em 0 .5em;
  margin-left:7%;
  margin-right:5%;
  text-align: center;
  font-size:.9em;
  line-height: 2.8em;
  border:1px solid #fff;
  border-radius: 11px;
  box-sizing: border-box;
}
.choose{
  color: #1bbd9c !important;
  border-color: #1BBD9C !important;
}
</style>
