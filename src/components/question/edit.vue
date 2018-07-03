<template>
  <section class="wrap">
    <!--引导页-->
    <section class="first" v-if="active == 0" v-bind:class="{'next-current':active == 1}" @touchstart="startMove" @touchend="endMove">
      <div class="first-area">
        <p>{{myInfo.title}}</p>
        <article class="first-detail">
          {{myInfo.describe}}
        </article>
        <img @click="active++" src="../../../static/imgs/icon-arrow-down.png" alt="icon-arrow-down"
             class="icon-arrow-down">
      </div>
    </section>
    <!--题目主体-->
    <section class="item-list" v-if="length>0"  v-for="(item,index) in newList" :key="index">
      <div>
        <p v-show="active == index + 1" class="item-list-title">{{myInfo.title}}</p>
        <p v-show="active == index + 1" class="item-list-detail">{{myInfo.describe}}</p>
      </div>
      <div v-if="newList[0].length>0" v-show="newList[0][0].type == 1 && active == index + 1">
        <group  v-for="(list,listIndex) in newList[0]" :key="listIndex" :title="list.title">
            <checklist @on-change="handleChange" :max=1 :options="list.option" v-model="question[0][listIndex]"></checklist>
        </group>
      </div>
      <div v-if="newList[1].length>0" v-show="newList[1][0].type == 2 && active == index + 1">
        <group v-for="(list,listIndex) in newList[1]" :key="listIndex" :title="list.title">
          <checklist :min=1  @on-change="handleChange" :options="list.option" v-model="question[1][listIndex]"></checklist>
        </group>
      </div>
      <div v-if="newList[2].length>0" v-show="newList[2][0].type == 3 && active == index + 1">
        <group v-for="(list,listIndex) in newList[2]" :key="listIndex" :title="list.title">
          <x-textarea :height="200" placeholder="请填写内容" v-model="question[2][listIndex]"></x-textarea>
        </group>
      </div>
      <div v-if="newList[3].length>0" v-show="newList[3][0].type == 4 && active == index + 1">
          <div v-for="(list,listIndex) in  newList[3]" :key="listIndex">
            <p class="martix-title">{{list.title}}</p>
            <group v-for="(subList,subIndex) in list.label" :key="subIndex" :title="subList">
                <checklist @on-change="handleChange"  :max=1 :options="list.option" v-model="question[3][listIndex][subIndex]"></checklist>
            </group>
          </div>
      </div>
    </section>
    <load-more v-if="length == 0 && active > 0" :show-loading="false" :tip="('没有更多啦')"></load-more>
    <!--提交-->
    <div class="btn-list" v-show="active > 0 && length>0">
      <!-- <span @click="active--" class="btn btn-prev">上一页</span> -->
      <!-- <span v-if="active<length" @click="active++" class="btn btn-next1">下一页</span> -->
      <!-- <span v-else @click="_submit" class="btn btn-next1">提交</span> -->
      <span @click="_submit" class="btn btn-next1">提交</span>
    </div>
  </section>
</template>

<script>
import {Radio, Group, XTextarea, Checklist,LoadMore} from 'vux'
import { setTimeout } from 'timers';

  export default {
    components: {
      Radio,
      Group,
      XTextarea,
      Checklist,
      LoadMore
    },
    data() {
      return {
        newList:[],
        active: 1,
        option1: [
          '企业文化及远景',
          '工作环境',
          '团队合作精神',
          '员工沟通',
          '绩效考核',
          '薪酬与福利',
        ],
        choose1: [1],
        discrible: '',
        choose2: [1],
        option2: [
          {name: '标题1', list: [{key: '1', value: 'manyi'}, {key: '2', value: 'yiban'}, {key: '3', value: 'haixing'}]},
          {name: '标题2', list: [{key: '1', value: 'man1yi'}, {key: '2', value: 'yi1ban'}, {key: '3', value: 'haix1ing'}]}
        ],
        list: [],
        myInfo: {},
        question: [[], [], [], []],
        length: '',
        startY:0,
        endY:0
      }
    },
    methods: {  
      endMove(e){
        if(e.changedTouches.length == 1){
          this.endY = e.changedTouches[0].clientY
        }   
        if(this.startY - this.endY > 100){
          this.active++
        }

      },
      startMove(e){
        if(e.touches.length == 1){
          this.startY = e.touches[0].clientY
        }
      },

      _dataFormat(data){
        let only = data.filter(item=>{
            return item.type == 1
        })
        let double = data.filter(item=>{
          if(item.type == 2){
           let option = item.option.map((list,index)=>{
              return {key:list.id,value:list.option}
            })
           return {id:item.id,title:item.title,option:option,type:item.type}
          }
        })
        let text = data.filter(item=>{
          return item.type == 3
        })
        let matrix  = data.filter(item=>{
          if(item.type == 4){
           let option = item.option.map((list,index)=>{
              return {key:list.id,value:list.option}
            })
          return {id: item.id, title: item.title, option: option, type: item.type, label: item.label}
          }
        })

        only = only.map(item=>{
          let option = item.option.map(list=>{
            return {key:list.id,value:list.option}
          }) 
          return {id:item.id,title:item.title+'【单选】',option:option,type:item.type}
        });

        double = double.map(item=>{
          let option = item.option.map(list=>{
            return {key:list.id,value:list.option}
          })
          return {id:item.id,title:item.title+'【多选】',option:option,type:item.type}
        });

        text = text.map(item=>{
          return {id:item.id,title:item.title+'【问答】',type:item.type}
        });

        matrix = matrix.map(item=>{
          let option = item.option.map((list, index) => {
              return {key: list.id, value: list.option}
            })
            return {id: item.id, title: item.title+'【矩阵】', option: option, type: item.type, label: item.label}
        });

        for(var i=0;i<matrix.length;i++){
          this.question[3][i] = new Array()
        }
        return [only,double,text,matrix]

      },
      //上传问卷
      _submit(){
       let result = true,
            msg = ''
       let answer =  this.question.map((item,index)=>{
           let answer = item.map((list,listIndex)=>{
              if(index == 0){
                list = list.toString()
                if(list === ''){
                  result = false
                  msg = "请完成所有单选题之后提交"
                }
              }else if(index == 1){
                if(list.length == 0){
                  result = false
                  msg = '请完成所有多选题之后提交'
                }
              }else if(index == 2){
                if(!list){
                  result = false
                  msg = '请完成所有问答题之后提交'
                }
              }else if(index == 3){
                list = list.toString().split(',')
                list.forEach(sublist=>{
                  if(sublist == ''){
                    result = false
                    msg = '请完成所有矩阵题之后提交'
                  }
                })
              }
              return {answer:list}
            })
            return answer
        })
       let arr = this.newList.map((item,index)=>{
          return item.map(list=>{
            return {questions_id:list.id,type:list.type}
          })
        })
        let data = [...answer[0],...answer[1],...answer[2],...answer[3]]
        let detail = [...arr[0],...arr[1],...arr[2],...arr[3]]
        let _list = []
        data.forEach((item,index)=>{
          detail.forEach((list,listIndex)=>{
            let obj = {}
            if(index == listIndex){
              obj = Object.assign(item,list)
              _list.push(obj)
            }
          })
        })
        if(result){
          this.apiPost('Index/subQuestionnaire',_list).then(res=>{
            if (res.error === 0) {
              this.$vux.toast.show({
                text: '提交成功',
                type: "text",
                width: '20em'
              });
              this.$router.push('/index');
            } else {
              this.$vux.toast.show({
                text: res.msg,
                type: "text",
                width: '20em'
              });
              setTimeout(()=>{
                location.reload()
              },1000)
            }
          })
        }else{
          this.$vux.toast.show({
            text:msg,
            type:'text',
            width:'10em'
          })
        }
      },
      //转换数据格式
      dataFormat(data) {
        return data.map((item, index) => {
          if (item.type == 1 || item.type == 2) {
            let option = item.option.map((list, index) => {
              return {key: list.id, value: list.option}
            })
            return {id: item.id, title: item.title, option: option, type: item.type}
          }
          if (item.type == 3) {
            return item
          }
          if (item.type == 4) {
            let option = item.option.map((list, index) => {
              return {key: list.id, value: list.option}
            })
            return {id: item.id, title: item.title, option: option, type: item.type, label: item.label}
          }
        })
      },
      submit() {
        let arr = []
        for (var i = 0; i < this.list.length; i++) {
          arr.push(Lockr.get('questionList' + i))
        }
        let newList = []
        newList = this.list.filter(item => {
          return item.type == 3
        })
        this.question[2] = this.question[2].filter(item => {
          return item
        })
        arr.push({questions_id: newList[0].id, type: 3, answer: this.question[2].toString()})
        arr = arr.filter(item => {
          return item
        })
        for (var i = 0; i < arr.length; i++) {
          if (!arr[i].answer) {
            this.$vux.toast.show({
              text: '请完成所有题目后提交',
              type: 'text',
              width: '20em'
            })
            return
          }
        }
        return
        this.apiPost('Index/subQuestionnaire', arr).then(res => {
          if (res.error === 0) {
            this.$vux.toast.show({
              text: '提交成功',
              type: "text",
              width: '10em'
            });
            this.$router.push('/index');
            setTimeout(() => {
              for (let i = 0; i < 10; i++) {
                Lockr.rm('questionList' + i)
              }
            }, 1000)

          } else {
            this.$vux.toast.show({
              text: res.msg,
              type: "text",
              width: '10em'
            });
          }
        })
      },
      handleChange(value, label) {
        this.list.forEach((item, index) => {
          let obj = {
            questions_id: item.id,
            type: item.type
          }
          if (this.active - 1 == index) {
            if (item.type == 1) {
              obj.answer = value.toString()
              Lockr.set('questionList' + index, obj)
            }
            if (item.type == 2) {
              obj.answer = value
              Lockr.set('questionList' + index, obj)
            }
            if (item.type == 3) {
              obj.answer = ''
              Lockr.set('questionList' + index, obj)
            }
            if (item.type == 4) {
              obj.answer = this.question[3].toString().split(',')
              Lockr.set('questionList' + index, obj)
            }
          }
        })
      },
      handleChangeActive(isNext, data) {
        if (isNext) {
          this.active = this.active++ == this.list.length ? this.list.length : this.active
        } else {
          this.active = this.active-- == 0 ? 0 : this.active
        }
      },
      //获取问卷详情
      getQuestionDetail() {
        this.apiPost('Index/questionnaireDetail', {id: this.$route.params.id}).then(res => {
          this.list = res.list
          this.myInfo = res
          this.list = this.dataFormat(res.list)
          this.newList = this._dataFormat(res.list)
          this.length = Number.parseInt(this.newList.length)
          this.newList.forEach((item,index)=>{
            if(item.length == 0){
              this.length -- 
            }
          })
        })
      }
    },
    created() {
      this.getQuestionDetail()
    }
  }
</script>

<style scoped>
  .first {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    background: url('../../../static/imgs/bg_question.png') no-repeat;
    background-size: 100% 100%;
    transition: all .5s ease;
  }
  .first-area {
    position: absolute;
    bottom: 0;
    width: 337px;
    height: 326px;
    margin-left:calc((100% - 337px)/2);
    color: #fff;
    font-size: 2em;
    background: RGBA(28, 200, 160, .8);
  }
  .first-area p {
    padding-top: 40px;
    padding-bottom: 30px;
    font-size: 30px;
    text-align: center;
  }
  .first-area article {
    width: 250px;
    height: 159px;
    margin: 0 auto;
    line-height: 34px;
    text-align: center;
  }
  @-webkit-keyframes downToUp {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: 50px;
      opacity: 1;
    }
  }
  @keyframes downToUp {
    from {
      transform: translateY(0);
      opacity: 0;
      visibility: hidden;
    }
    to {
      transform: translateY(10px);
      opacity: 1;
      visibility: visible;
    }
  }
  .icon-arrow-down {
    margin-left: calc(100% - 180px);
    margin-top: 5px;
    animation: downToUp 2s infinite;
  }
  .page-before {
    transform: translate3d(0, -100%, 0);
  }
  .page-after {
    transform: translate3d(0, 100%, 0)
  }
  .second-title {
    margin: 20px 20px 0 20px;
    font-size: 1.8em;
  }
  .btn-list {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80px;
    padding-bottom:40px;
    box-sizing: border-box;
  }
  .btn {
    display: inline-block;
    width: 300px;
    height: 30px;
    margin:0 auto;
    margin-top:20px;
    margin-bottom:40px;
    /* margin:2em 2em 3em 2em ; */
    font-size: 1.4em;
    text-align: center;
    line-height: 30px;
    color: #333;
    border: 1px solid #e6e6e6;
  }
  .btn-next1 {     
    color:#fff;
    background-color: #1cc8a0;
    border: 1px solid #1cc8a0;
  }
  .third-detail {
    font-size: 1.4em;
    box-sizing: border-box;
  }
  .weui-textarea {
    padding: 10px;
  }
  .martix-title{
    margin:1em;
    color:#999;
  }
  @keyframes trans_down_page{
    from{
      top:0;
      opacity:1
    }
    to{
      top:-100%;
      opacity:0
    }
  }
  .next-current{
    animation:trans_down_page .5s ease forwrads;
  }
  .item-list-title,
  .item-list-detail{
    padding:.3em 1em;
    padding-right:0;
    font-size:1.3em
  }
  .item-list-title{
    font-size:1.5em;
  }
</style>
