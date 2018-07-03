<template>
<div>
<!--问题-->
<section class="wrap" v-if="type == 1">
      <div class="form-detail">
          <group>
            <x-input @on-change="getQuestionList" @on-blur="showQuestionList = false" @on-focus="onFocus" v-model="message.title" placeholder="请输入问题" :height="30"></x-input>
            <x-textarea @on-focus="onTextFocues" v-model="message.text_content" 
                name="discription" placeholder="问题描述" :height='message.img_content.length == 0 ? 200 : 100' :row="8">
            </x-textarea>
            
            <div class="img-list" v-show="message.img_content.length > 0 " v-if="toggleShow">
              <div class="img-box" v-for="(item,index) in message.img_content" :key="index">
                  <div name="img-box"><img :src="item" alt="img-list" :key="index"><sup @click="delItem(3,index)">X</sup></div>
              </div>
            </div>
            
            <div class="audio-list" v-show="message.audio_content.length > 0 " v-if="toggleShow">
              <p name="audio-item" v-for="(item,index) in message.audio_content" :key="index">音频文件 -- {{index+1}} <span name="delbtn" @click="delItem(1,index)">删除</span></p>
            </div>
            
            <div class="video-list" v-show="message.video_content.length > 0 " v-if="toggleShow">
               <p name="audio-item" v-for="(item,index) in message.video_content" :key="index">视频文件 -- {{index+1}} <span name="delbtn" @click="delItem(2,index)">删除</span></p>
            </div>        
          </group>

          <!--问题列表-->
          <scroll v-show="showQuestionList && message.title" class="wrapper" ref="wrapper" :data="questionList" :pulldown="pulldown" @pulldown="getQuestionList">
              <div class="contarner">
                <div @click="jumptoDetail(item.id)" v-if="questionList.length>0" class="scroll-item-list" v-for="(item,index) in questionList" :key="index">
                    <h5 class="item-title">{{item.title}}</h5>
                    <p class="item-detail">
                      <span> <img src="../../../static/imgs/icon-visite.png" alt="icon_visite">
                        {{item.browse}}</span>
                      <span><img src="../../../static/imgs/icon-like.png" alt="icon_like">
                        {{item.praised}}</span>
                      <span><img src="../../../static/imgs/icon-message.png" alt="icon_message">
                        {{item.count}}</span>
                    </p>                                                                                                                                                                                  
                </div>                          
                <load-more :show-loading="false" :tip="('没有更多啦')"></load-more>                                  
              </div>
          </scroll>
      <!--选择分类-->
      <div class="classfify-box">
            <popup-picker title="分类" :data="newClassifyList" v-model="option2" :columns="1" @on-change="classifyChange"></popup-picker>
      </div>
      
        <!--底部按钮栏-->
      <div class="btm-nav">
          <span class="img-btn-list">
            <span class="img-item-box" v-if="message.audio_content.length == 0" v-show="message.video_content.length == 0" >
              <img src="../../../static/img/icon-camera@2x.png" alt="camera" class="icon-camera" />
              <vue-core-image-upload text="" @imageuploaded="imageUpload" class="btn btn-upload" :crop="false" :url="uploadPath"></vue-core-image-upload>
            </span>
            <img v-if="message.audio_content.length == 0" v-show="message.img_content.length == 0" @click="chooseVideo"  src="../../../static/img/icon-vedio@2x.png" alt="video" class="icon-video">
            <img v-if="message.video_content.length == 0" v-show="message.img_content.length == 0 " @click="audioIsShow = true,isBtnShow=false" src="../../../static/img/icon-radio@2x.png" alt="audio" class="icon-audio">           
          </span>
          <span class="btn-ok" @click="closeOther">完成</span>
      </div>

      <!--提交视频-->
      <form  enctype="multipart/form-data"  name="fileinfo" method="post" style="display:none;">
        <label>上传视频</label>
        <input @change="uploadVideo"  type="file" name="file" id="file">
      </form>
      <!--提交表单-->
      <div class="msg-box" v-if="toastShow">
        <div :class="[isShowLocation ? 'form-box' : 'form-box no-location']">
            <div class="my-group-item my-group-top">
              <span>信息确认</span>
              <img @click="toastShow = false" src="../../../static/imgs/icon-close.png" alt="icon-close" class="icon-close">
            </div>
            <div class="my-group-item">
              <span>船舶IMO编号</span>
               <input class="my-input" v-model="detailInfo.number" placeholder='请输入内容,例如：0101001' />
              <!-- <x-input class="my-input"  placeholder="请输入内容,例如: 0101001" v-model="detailInfo.number" /> -->
            </div>
            <div class="my-group-item">
              <span>船舶管理公司</span>
              <!-- <x-input  placeholder="请输入内容,例如：测试公司" v-model="detailInfo.company" /> -->
              <input class="my-input" v-model="detailInfo.company" placeholder='请输入内容,例如: 测试公司' />
            </div>
            <div class="my-group-item">
              <span>职务</span>
              <popup-picker class="my-popur-picker"  :data="list" v-model="option1" :columns='1'></popup-picker>
            </div>
            <div class="my-group-item" v-if="isShowLocation">
              <span>地理位置</span>
              <div><span>经度: {{detailInfo.longitude}}</span> <span>纬度: {{detailInfo.latitude}}</span></div>
            </div>
            <div class="my-group-item my-group-btn">
              <span @click="submit(1)">确定</span>
            </div>
        </div>
      </div>

      <loading v-model="isShowLoading" :text="textLoading" :width="10"></loading>
      <!-- v-show="audioBoxShow" -->
      <div class="audio-box" @click="wxendAudio(1)" v-show="audioBoxShow">
        <p >录音中,点击停止录音...</p>
      </div>
      
      <!--录音功能-->
      <div v-transfer-dom>
        <confirm v-model="audioIsShow" :title="('是否开始录音?')" 
            @on-cancel="audioIsShow = false"
            @on-confirm="wxstartAudio"></confirm>
      </div>

      <!--上传录音-->
      <div v-transfer-dom>
        <confirm v-model="isUploadAudio" :title="('是否上传录音?')"
          @on-cancel="uploadAudio = false,audioBoxShow=false"
          @on-confirm="wxendAudio(2)"></confirm>
      </div>

      <!--是否获取地理位置-->
      <div v-transfer-dom>
        <confirm v-model="isShowLongitu" :title="('提示')" @on-cancel="handleClickHideLocation" @on-confirm="handleClickShowLocation">
          <p>是否上传当前位置信息?</p>
        </confirm>
      </div>

    </div>
</section>

<!--帖子-->
  <section class="wrap" v-if="type == 2 || type == 3">
      <group>
        <x-input v-if="type == 2" placeholder="请输入帖子标题" v-model="article.title"></x-input>
        <x-input v-if="type == 3" placeholder="请输入资料标题" v-model="article.title"></x-input>
      </group>
      <quill-editor class="content" ref="contentEditor" v-model="article.content" @change="onEditorChange($event)" :options="options"></quill-editor>
      <!-- <x-button @click.native="submit(type)" class="btn-submit">提交</x-button> -->
      <span @click="submit(type)" class="btn-submit">提交</span>
      <!--资料富文本上传视频-->
      <input type="file"  ref="textUpload" @change="uploadTextVideo" id="textUploadVideo"  style="display:none">
  </section>
</div> 

</template>

<script>

const message = {
  title:'',
  text_content:'',
  video_content:[],
  img_content:[],
  audio_content:[],
  classify_id:''
}
const detailInfo = {
          number:'',
        company :'',
        post:'',
        latitude:'',
        longitude:''
}
const article = {
  title:'',
  content:''
}
const toolbar = [
  ['bold', 'italic'], ['image','video','strike'],['underline','link'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
  ['blockquote', 'code-block'],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{'color':[]},{'background':[]}]
]
const options = {
  debug:'info',
  modules:{
    toolbar:toolbar
  },
  placeholder:'请输入内容',
  readOnly:false,
  theme:'snow'
}
import {
  XTextarea,
  Group,
  XInput,
  Search,
  Loading,
  Confirm,
  Selector,
  XButton,
  Picker,
  Cell,
  PopupPicker,
  TransferDomDirective as TransferDom,
  LoadMore
} from "vux";
import Scroll from '../../components/common/scroll'
import VueQuillEditor from 'vue-quill-editor'
import {quillRedefine} from 'vue-quill-editor-upload'
import VueCoreImageUpload from 'vue-core-image-upload'
export default {
  directives:{
    TransferDom
  },
  components: {
    XInput,
    Group,
    XTextarea,
    Search,
    Loading,
    Confirm,
    Selector,
    XButton,
    Picker,
    PopupPicker,    
    Cell,
    quillRedefine,
    VueCoreImageUpload,
    Scroll,
    LoadMore
  },
  data() {
    return {
      isShow: false,
      toggleShow:true,
      active: 0,
      search: false,
      params: "请选择",
      toastShow: false,
      option1:['请选择'],
      job:'请选择',
      pickerShow:false,
      list:[],
      type:1,
      message:message,
      article:article,
      options:options,
      buble:{},
      detailInfo:detailInfo,
      uploadPath:PATH + 'Upload/uploadImg',
      audioIsShow:false,
      audioBoxShow:false,
      isUploadAudio:false,
      isStartVoice:false,
      isBtnShow:false,
      isShowLoading:false,
      textLoading:'上传中...',
      addRange:[],
      uploadType:'',
      audioPath:'',
      classifyList:[],
      newClassifyList:[],
      classify:'',
      option2:['请选择'],
      classify_id:'',
      isClassifyShow:false,
      pulldown:true,
      questionList:[],
      showQuestionList:false,
      isShowLongitu:false,
      isShowLocation:false
    };
  },
  computed:{
    editor(){
      return this.$refs.contentEditor.quill
    },
  },
  methods: {
    handleClickHideLocation(){
      this.isShowLocation = false
      setTimeout(()=>{
        this.toastShow = true
      })
    },
    handleClickShowLocation(){
      this.isShowLocation = true
      this.getParams()
      setTimeout(()=>{
        this.toastShow = true
      })
    },

    //单击问题跳转到问题详情
    jumptoDetail(e){
      this.$router.push('/question/detail/'+e)
    },
    //获取问题列表
    getQuestionList(){
      this.showQuestionList = true
      this.apiPost('Index/question').then(res=>{
        let newList = []
        res.map(item=>{
          if(item.title.match(this.message.title)){
            newList.push(item)
          }
        })
        this.questionList = newList
        if(this.questionList.length == 0){
          this.showQuestionList = false
        }
      })
    },
    closeOther(){
      // this.toastShow = false
      if(!this.toastShow){
        this.isShowLongitu = true
      }
      this.search = true
      this.audioIsShow = false
      this.isStartVoice = false
    },
    classifyChange(val){
     this.option2 = val
     let obj = this.classifyList.find(item=>{
        return item.classify_name == val
      })
      this.classify_id = obj.id
    },
    //获取分类列表
    getClassifyList(){
         this.apiPost('Index/classify').then(res=>{
          this.classifyList = res 
          this.newClassifyList = this.classifyList.map(item=>{
            return {name:item.classify_name,value:item.classify_name}
          })
        })     
    },
    //删除文件
    delItem(data,index){
      data = data == 1 ? message.audio_content : 
              data == 2 ? message.video_content : message.img_content
      data.splice(index,1)
    },
    uploadVideo(){
      this.changeShow('file')
    },
    chooseVideo(){
      var elem = document.getElementById('file')
      elem.click()
    },
    changeShow(elem){
      let _this = this  
      var file = document.getElementById(elem).files[0]
      if(file.type =='video/mp4' || file.type == 'video/quicktime'){
        _this.isShowLoading = true
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e){
          _this.uploadScaleImg = e.target.result
          _this.apiPost('Upload/uploadBase64',{data:this.result}).then(res=>{
            setTimeout(()=>{
              if(res.error == 0){
                  _this.textLoading = '上传成功'
                  setTimeout(()=>{
                    _this.isShowLoading = false
                  },1000)
                  message.video_content = []
                  message.video_content.push(res.msg)
                  if(_this.type == 3 || _this.type == 2){
                    _this.uploadSuccess(res.msg)
                  }
                }else{
                  _this.textLoading = '上传失败，请稍后重试'
                  setTimeout(() => {
                    _this.isShowLoading = false
                  }, 1000);
                }
            },5000)
          })
        }
      }else{
        this.$vux.toast.text('请选择视频文件','middle')
      }
    },
    wxstartAudio(){  //开始录音
      wx.startRecord()
      this.isStartVoice = true
      this.audioBoxShow = true
      clearTimeout(timer)
      let timer = setTimeout(()=>{
          this.wxendAudio(1)
      },59000)      
    },
    wxendAudio(type){ //结束录音
        let _this = this
        this.isBtnShow = true
        this.isUploadAudio = true
        if(type == 1){
          setTimeout(()=>{
            wx.stopRecord({
              success:function(res){  
                _this.audioPath = res.localId
              }
            })
          })
        }else if (type == 2){
          _this.uploadAudio()
        }
    },
    //上传语音
    uploadAudio(){
      let _this = this
      this.audioBoxShow = false
      message.audio_content = []      
      wx.uploadVoice({
        localId:this.audioPath,
        isShowProgressTips:1,
        success:function(res){
          var serverId = res.serverId
          _this.apiPost('Upload/uploadWxServer',{media_id:serverId}).then(res=>{
            _this.$vux.toast.text(serverId,'middle')
            if(res.error == 0){
              _this.$vux.toast.text('上传成功','middle')
              message.audio_content.push(res.msg)
            }else{
              _this.$vux.toast.text('上传失败','middle')
            }
          })
        }
      })
      return
      wx.uploadVoice({
        localId:path,
        isShowProgressTips:1,
        success:function(res){
          _this.downloadAudio(res.serverId)
        },
        error:function(){
          _this.$vux.toast.text('上传失败','middle')
        }
      })
    },
    //下载语音
    downloadAudio(serverId){
      let _this = this
      wx.downloadVoice({
        serverId:serverId.toString(),
        isShowPregressTips:1,
        success:function(res){
          console.log(res)
          return
          _this.apiPost('Upload/uploadWxServer',{media_id:serverId}).then(res=>{
            console.log(res,'is upload to localhost server')
            if(res.error === 0)
               message.audio_content.push(res.msg)
               console.log(message.audio_content)
          })

        }
      })
    },
    //上传图片
    imageUpload(res){
      this.isShowLoading = true
      if(res.error == 0){
        setTimeout(()=>{
          this.isShowLoading = false
          this.$vux.toast.text('上传成功')
          message.img_content.push(res.msg)
        },1000)
 
      }else{
        this.$vux.toast.text('上传失败')
      }
    },
    changeActive(){
      if(message.title != '' && this.params != ''){
        this.toastShow = true
      }else{
        this.$vux.toast.text('请填写必填项之后发布','middle')
      }
    },
    //上传成功之后将图片插入编辑器文本中
    uploadSuccess(url){
      if(url != null && url.length > 0){
        this.addRange = this.$refs.contentEditor.quill.getSelection()
        url = url.indexOf('http') !== -1 ? url : 'http' + url
        this.$refs.contentEditor.quill.insertEmbed(this.addRange !== null ? this.addRange.index : 0,this.uploadType,url,VueQuillEditor.sources)
      }
    },
    //点击视频图标触发事件
    videoHandeler(state){
      this.addRange = this.$refs.contentEditor.quill.getSelection()
      if(state){
        let fileInput = document.getElementById('textUploadVideo')
        fileInput.click()
      }
      this.uploadType = 'video'
    },
    //富文本上传视频
    uploadTextVideo(){
      this.changeShow('textUploadVideo')
    },
    //富文本change
    onEditorChange(e){
      let elem = this.$refs.contentEditor
    },
    //获取地理位置参数
    getParams(){
      let _this = this
      this.apiPost('User/jsParam').then(res=>{
          wx.getLocation({
            type: 'wgs84', 
            success: function (res) {
              _this.detailInfo.latitude = res.latitude
              _this.detailInfo.longitude = res.longitude

              _this.detailInfo.latitude = _this.detailInfo.latitude.toFixed(3)
              _this.detailInfo.longitude = _this.detailInfo.longitude.toFixed(3)
            }
          });
      })
    },
    //获取职务
    fetchData(){
      this.apiPost('Index/post').then(res=>{
        this.list = res[0].post
        this.list = this.list.map(item=>{
            return {name:item,value:item}
          })
      })
    },
    cancel(){
      this.job = '请选择'
      this.pickerShow = false
    },
    change(val){
      this.job = val[0]  ? val[0] :'请选择'
    },
    onFocus() {
      this.isShow = true
      this.search = false
    },
    onTextFocues() {
      this.search = false;
    },
    jumpToOther() {
      this.$router.push("/quzi/list");
    },
    //发布
    submit(type) {
      let _url = '',
          data = null ,
          _this = this,
          result = true,
          msg = '请填写必填项之后提交'
      if(type == 1){
        _url = 'Index/subQuestion'
        this.detailInfo.post = this.option1.toString()
        message.classify_id = this.classify_id
        message.img_content =  message.img_content.toString()
        message.audio_content = message.audio_content.toString()
        message.video_content = message.video_content.toString()
        message.classify_id = message.classify_id.toString()
        data = {
          data:message,
          info:this.detailInfo
        }
        if(message.title=='' || message.classify_id==''){
          result = false
        }
        if(data.info.number == ''){
          result = false
        }
        if(data.info.company == ''){
          result = false
        }
        if(data.info.post == ''){
          result = false
        }
      }else if(type == 2){
        _url = 'Index/addArticle'
        for(var key in article){
          if(article[key] == ''){
            result = false
          }
        }
        data = article
      }else if(type == 3){
        _url = 'Index/subDatum'
        for(var key in article){
          if(article[key] == ''){
            result = false
          }
        }
        data = article
      }
      if(result){
        this.apiPost(_url,data).then(res=>{
          _this.$vux.toast.text(data)
          if(res.error == 0){
            this.$vux.toast.text('发布成功','middle')
            this.toastShow = false
            this.toggleShow = false
            
            setTimeout(()=>{
              location.reload()
            },1000)
          }else{
            this.$vux.toast.text('发布失败，请稍后重试','middle')
            return
          }
          this.$router.push('/index')
        })
      }else{
        this.toastShow = false
        this.$vux.toast.text('请填写必填项后提交','middle')
      }
    }
  },
  created(){
    this.fetchData()
    this.getClassifyList()
    // this.getQuestionList()
    this.$nextTick(()=>{
      // this.getParams()
    })
    setTimeout(()=>{
      //为视频图标绑定事件
      this.$refs.contentEditor.quill.getModule('toolbar').addHandler('video',this.videoHandeler)
    })
    this.buble = Lockr.get('cor')
    //富文本图片上传
    this.options = quillRedefine({
      uploadConfig:{
        action: window.PATH + 'Upload/uploadImg',
        res:(res)=>{
          return res.msg
        },
      },
      methods:'POST',
      name:'img',
      toolOptions:toolbar,
      placeholder:'请输入内容',
    })

  },
  activated() {
    this.type = this.$route.params.id
    this.showQuestionList = false
  }
};

</script>

<style scoped>
.my-input{
  flex:1;
  height:30px;
  padding-right:15px;
  color:#999;
  font-size:1.4em;
  border:none;
  outline:none;
  text-align:right !important;
}
.wrap{
  height:100%;
}
.form-detail {
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  z-index: -1000;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
  padding: 10px 20px;
  background-color: #f2f2f2;
}
.icon-edit {
  margin-right: 10px;
}
.btm-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  background-color: #f2f2f2;
  box-sizing: border-box;
  z-index:1000 !important;
}
.icon-photo {
  margin-left: 10px;
}
.btn-ok {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1.4em;
}
.search {
  position: fixed;
  /* bottom: 50px; */
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  font-size: 1.2em;
  box-sizing: border-box;
}
.search > div {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 40px;
  color: #999;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}
.search .btn-submit {
  width: 220px;
  height: 30px;
  padding: 5px 10px;
  margin-bottom: 1em;
  margin-left:calc(50% - 120px);
  line-height: 30px;
  border-radius: 5px;
  font-size: 1.3em;
  text-align: center;
  color: #fff;
  background-color: #1bbd9c;
}
.msg-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  /* z-index:100 !important; */
}
.no-location{
  height:calc(300px - 48px) !important;
}
.msg-box .detail-box{
  width:335px;
  margin:0 auto;
  padding:0 0 1em 0;
  margin-top:calc(100% - 275px);
  border-radius: 10px;
  border:1px solid #e4e4e4;
  background-color: #fff;
}
.group-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height:40px;
  padding:0 10px;
  border:1px solid #eee;
}
.group-item:first-of-type{
  justify-content: space-between;
  margin-left:calc(100% - 300px);
  font-size: 1.5em;
  border:none;
}
.group-item:last-of-type{
  margin-top:20px;
}
.btn-area p {
  width:100%;
  text-align: center;
  color: #1bbd9c;
}
.picker-box{
  width:90%;
  margin-left:5%;
  background-color: rgb(255,255,255);
}
.picker-box p{
  display: flex;
  justify-content: space-around;
  border-top-left-radius: 11px;
  border-top-right-radius: 11px;
  background-color: #fff;
  height:30px;
}
.picker-box p span{
  display: inline-block;
  line-height:30px;
  color: #1bbd9c;
}
#editor{
  width:100%;
  height:100px;
}
.content{
  height:calc(100% - 200px);
}
.btn-submit{
  display:block;
  position: relative;
  bottom:-5em;
  left:calc((100% - 335px)/2);
  width:335px;
  height:44px;
  text-align: center;
  line-height:44px;
  font-size: 1.6em;
  color: #fff;
  background-color: #1bbd9c;
}
.img-list{
  display: flex;
  justify-content: flex-start;
  flex-flow: wrap;
  height:150px;
}
.img-item{
  width:60px;
  height:60px;
  margin-right:10px;
  margin-top:10px;
  overflow: hidden;
}
.btn-upload{
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}
.img-item-box{  
  display: inline-block;
  position: relative;
  width:30px;
  overflow: hidden;
}
div[name="img-box"]{
  position: relative;
  width:70px;
  height:70px;
  margin-right:20px;
  border:1px solid red;
  /* overflow: hidden; */
}
div[name="img-box"] sup{
  position: absolute;
  top:-10px;
  right:-10px;
  display: inline-block;
  width:1.3em;
  height:1.3em;
  text-align: center;
  border-radius: 50%;
  color:#fff;
  background-color: red;
}
.audio-btn{
  display:inline-block;
  width:22px;
}

.audio-box{ 
  position: fixed;
  left:0;
  bottom:0;
  right:0;
  top:0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
  background:url('../../../static/img/recording.gif') center center no-repeat ;
  background-color: rgba(0,0,0,.5);
  color: #fff;
  z-index: 1000;
}
.audio-box p{
  margin-bottom:calc(50% + 50px);
  font-size: 1.4em;
}
img[alt="audio"]{
  margin-left:10px;
}
.img-btn-list{
  display: flex;
  align-items: center;
}
p[name="audio-item"]{
  padding:0 1.3em;
  font-size: .8em;
}
span[name="delbtn"]{
  color: red;
  margin-left:.5em;
}
img[alt="img-list"]{
  width:70px;
  height:70px;
}
div.item-top{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
div.item-top span{
  flex:1;
  margin-left:3em;
  text-align:center;
}
.my-input{
  font-size: 13px;
}
.my-group{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
  height:3.4em;
  margin:1em 0;
  padding:1em 1.5em;
  border-top:1px solid #e4e4e4;
  border-bottom:1px solid #e4e4e4;
  box-sizing: border-box;
}

.buble{
  display: flex;
  flex-flow: column ;
}
.classfify-box{
  padding:10px 15px;
  font-size: 1.4em;
  color: #757575;
  /* z-index: 10000 !important; */
}
.classfify-box p {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.classfify-box p span:nth-child(2){
  color: #333;
}
img[alt='camera']
{
  width:22px;
  height:18px;
}
img[alt='video']{
  width:25px;
  margin-left:1em;
}
img[alt='audio']{
  width:18px;
  height:22px;
  margin-left:1.6em;
}
</style>


<style lang="less" scoped>
.msg-box{
  display: flex;
  align-items: center;
  justify-content: center;
  .form-box{
    width:90%;
    height:300px;
    border-radius: 10px;
    background-color: #fff;
    .my-group-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height:40px;
      padding:.3em 1em;
      border-bottom:1px solid #e6e6e6;
      .my-popur-picker{
        font-size: 1.4em;
      }
      span{
        width:6.5em;
        font-size: 1.4em;
      }
    }
    .my-group-item:nth-child(5){
      div{
        span{
          color: #757575;
        }
      }
    }
    .my-group-item:last-of-type{
      border-bottom:none;
      color: #1BBD9C;
      span{
        margin-top:1.2em;
      }
    }
    .my-group-top{
      span{
        flex:1;
        margin-left:calc(50% - 35px);
        font-size: 1.6em;
        text-align:center;
      }
    }
    .my-group-btn{
      width:100%;
      text-align: center;
      font-size: 1.2em;
      box-sizing: border-box;
      span{
        margin:0 auto;
      }
    }
  }
  .vux-cell-box:not(:first-child):before{
    border:none;
  }
  .weui-cell:before{
    border:none !important;
  }
  .weui-cell{
    font-size: 1.4em;
  }
}
.wrapper{
  position: fixed;
  top:65px;
  left:0;
  width:100%;
  height:calc(100% - 20);
  box-sizing: border-box;
  background-color: #fff;
  z-index: 1000;
  overflow: hidden;
  .scroll-item-list{
    padding:10px;
    border-bottom:1px solid #e6e6e6;
    background-color: #fff;
    .item-title{
      display: -webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
      font-family: '微软雅黑';
      font-size: 1.6em;
      font-weight: normal;
      color: #333;
      overflow: hidden;
    }
    .item-detail{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top:10px;
      color: #b5b8ba;
      span{
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
