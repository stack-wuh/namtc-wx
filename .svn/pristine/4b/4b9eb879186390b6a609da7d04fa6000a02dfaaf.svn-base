import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import _g from './assets/js/global.js'
import Lockr from 'lockr'
import wx from 'weixin-js-sdk'
import '../src/assets/css/base.css'
import Bottom from '../src/components/common/bottom'
import store from '../src/vuex/store'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import VueScroller from 'vue-scroller'

import {AjaxPlugin, AlertPlugin, ToastPlugin, ConfirmPlugin} from 'vux'
import apiMethods from '../src/assets/js/http'

Vue.prototype.apiPost = apiMethods.methods.apiPost;

Vue.config.productionTip = false;

Vue.use(AlertPlugin);
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);
Vue.use(VueQuillEditor);
Vue.use(VueScroller);
Vue.use(AjaxPlugin);

Vue.component('bottom', Bottom);

window.router = router;
window._g = _g;
window.axios = axios;
window.store = store;
window.Lockr = Lockr;
window.wx = wx;
window.PATH = "/api/";
// window.PATH = "index.php/mobile/";

const link = location.href.split('#')[0];
window.imgUrl = 'http://bbs.namtc.com.cn/favicon.ico'
router.beforeEach((to, from, next) => {
  axios.post(PATH + 'User/jsParam').then(res => {
    let code = {
      debug: false,
      jsApiList: [
        'getLocation', //获取用户地理位置
        'onMenuShareTimeline', //分享到朋友圈
        'onMenuShareAppMessage', // 分享到朋友
        'onMenuShareQQ', //分享到QQ
        'onMenuShareQZone', //分享到QQ空间
        'chooseImage',  //选择照片
        'previewImage', //预览照片
        'uploadImage', //上传照片
        'downloadImage', //下载照片
        'getLocalImgData', // 获取本地图片
        'startRecord', //开始录音
        'stopRecord',   //结束录音
        'onVoiceRecordEnd',
        'playVoice',
        'pauseVoice',
        'uploadVoice', //上传语音
        'downloadVoice', //下载语音
        'stopVoice',
        'onVoicePlayEnd',
        'translateVoice',
        'closeWindow',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem'
      ]
    };
    code = Object.assign(code, res.data);
    wx.config(code);
    wx.ready(function () {
      let shareData = {
        title: '转发文章问题还可获得积分哦,快来参与吧',
        link: link,
        imgUrl: 'http://bbs.namtc.com.cn/favicon.ico',
        desc: '转发到朋友圈还可以获得积分哦',
      };
      wx.onMenuShareTimeline(shareData);
      wx.onMenuShareAppMessage(shareData);
      wx.onMenuShareQQ(shareData);
      wx.onMenuShareQZone(shareData)
    })
  });
  axios.post(PATH + 'User/verify').then(res => {
    if (res.data) {
      next();
    } else {
      let nowUrl = window.location.href;
      let code = _g.getQueryParam(nowUrl).code;
      if (!code) {
        // let href = encodeURIComponent("http://oa.namtc.com.cn/line.php");
        let href = encodeURIComponent("http://oa.namtc.com.cn/code.php");
        window.location.href =
          "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8c62e8a800c6abbd&redirect_uri=" +
          href + "&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect";
      } else {
        let data = {code: code};
        axios.post(PATH + 'User/getInfo', data).then(res => {
          if (res.data.error === 0) {
            if (res.data.msg) {
              router.push('/loading/first');
              location.replace('/#/loading/first');
            } else {
              router.push('/index');
              location.replace('/#/index');
            }
          }
        })
      }
    }
  });
});

const bus = new Vue();
window.bus = bus;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
