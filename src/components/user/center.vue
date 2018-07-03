<template>
  <section class="wrap">
    <group class="my-group" label-width="4.5em">
      <x-input title="姓名" type="text" class="my-input" placeholder="请输入姓名" v-model="addForm.name"></x-input>
    </group>
    <group class="my-group" label-width="4.5em">
      <x-input title="联系电话" type="text" maxlength="11" class="my-input" placeholder="请输入联系电话"
               v-model="addForm.tel">
      </x-input>
    </group>
    <span class="btn-active" v-if="secondIsShow">{{second}}s</span>
    <span class="active btn-active" @click="getTelMessage" v-if="!secondIsShow">获取验证码</span>
    <group class="my-group" label-width="4.5em" v-if="codeShow">
      <x-input title=" " type="text" class="my-input" placeholder="请输入验证码" v-model="addForm.code"></x-input>
    </group>
    <div class="my-group my-group-item">
      <span>类型</span>
      <popup-picker :data='option' :columns="1" v-model="job"></popup-picker>
    </div>
    <picker class="my-picker" v-show="isShowJob" :data="option" :columns="1" v-model="job"></picker>

    <div class="my-group my-group-item">
      <span>职务</span>
      <popup-picker :data='type' :columns="1" v-model="post"></popup-picker>
    </div>
    <picker class="my-picker" v-show="isShowPost" :data="type" :columns="1" v-model="post"></picker>
    <div class="form-bottom">
      <span class="active" @click="jumpToOther">申请成为授权教师</span>
    </div>
    <div class="btn-area">
      <span class="btn-submit" @click="submit">确定</span>
    </div>
  </section>
</template>

<script>
  import {XInput, Radio, PopupRadio, Group, Selector, Picker, PopupPicker} from 'vux'
  import {setInterval, clearTimeout, setTimeout} from 'timers';

  export default {
    components: {
      XInput,
      Radio,
      Group,
      Selector,
      PopupRadio,
      Picker,
      PopupPicker
    },
    data() {
      return {
        option: [],
        type: [],
        addForm: {
          name: '',
          tel: '',
          code: '',
          job: [],
          post: '',
        },
        job: [],
        post: [],
        codeShow: false,
        second: 60,
        secondIsShow: false,
        isShowJob: false,
        isShowPost: false,
      }
    },
    methods: {
      //提交表单
      submit() {
        this.addForm.job = this.job.toString()
        this.addForm.post = this.post.toString()
        for (let i in this.addForm) {
          if (!this.addForm[i]) {
            this.$vux.toast.show({
              text: '请填写必填项',
              type: 'warn',
              width: '20em',
            });
            return
          }
        }
        this.apiPost('Index/subIdentification', this.addForm).then(res => {
          let msg = res.error === 0 ? '认证成功' : res.msg;
          let type = res.error === 0 ? 'success' : 'warn';
          this.$vux.toast.show({
            text: msg,
            type: type,
            width: '20em'
          });
          if (res.error === 0) {
            setTimeout(() => {
              this.$router.push('/user')
            }, 1000)
          }
        })
      },
      //跳转到授权教师
      jumpToOther() {
        this.$router.push('/index/apply')
      },

      //获取分类列表
      getClassify() {
        this.apiPost('Index/post').then(res => {
          res.forEach(item => {
            this.option.push({name: item.type, value: item.type})
            this.type = item.post.map(list => {
              return {name: list, value: list}
            })
          })
        })
      },
      //认证信息
      identifiInfo() {
        this.apiPost('Index/identification').then(res => {
          this.addForm = res;
          this.addForm.code = '';
        })
      },

      //60秒获取一次验证码
      countDown() {
        clearTimeout(timer);
        let timer;
        timer = setInterval(() => {
          this.second--;
          if (this.second === 0) {
            clearTimeout(timer);
            this.secondIsShow = false;
            this.second = 60
          }
        }, 1000)
      },
      //获取验证码
      getTelMessage() {
        if (!this.addForm.tel) {
          this.$vux.toast.show({
            text: '请输入手机号',
            type: 'warn',
            width: '20em'
          });
          return
        }
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test(this.addForm.tel)) {
          this.$vux.toast.show({
            text: '手机号格式错误',
            type: 'warn',
            width: '20em'
          });
          return
        }
        this.apiPost('Index/telMessage', {tel: this.addForm.tel}).then(res => {
          this.$vux.toast.show({
            text: '短信已发送',
            width: '20em'
          });
          this.codeShow = true;
          this.secondIsShow = true;
          this.countDown()
        })
      }
    },
    created() {
      this.getClassify();
      this.identifiInfo();
    }
  }
</script>


<style scoped>
  .form-bottom {
    margin-top: 10px;
    margin-right: 20px;
    text-align: right;
  }
  .form-bottom span {
    font-size: 1.6em;
  }
  .btn-area {
    position: fixed;
    bottom: 40px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .btn-submit {
    display: inline-block;
    width: 335px;
    height: 44px;
    margin-left: 20px;
    font-size: 1.8em;
    text-align: center;
    line-height: 44px;
    background-color: #1abc9b;
    color: #fff;
    border-radius: 3px;
  }
  .btn-active {
    display: inline-block;
    width: 100%;
    text-align: right;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-right: 20px;
    font-size: 1.4em;
    box-sizing: border-box;
  }
  .my-group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 1em;
    font-size: 1.6em;
    background-color: #fff;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
  }
  .my-group-item span {
    flex: 1;
  }
  .my-group-item span:nth-child(2) {
    margin-right: 1em;
  }
  @keyframes trans_rotate {
    form {
      transform: rotateZ(0);
    }
    to {
      transform: rotateZ(90deg)
    }
  }
  .trans-rotate {
    animation: trans_rotate .5s ease forwards;
  }
  .my-picker {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background-color: #fff;
    z-index: 10000 !important;
  }
</style>

<style lang="less">
  .my-group {
    height: 44px;
    border: none;
    .weui-cells {
      margin-top: 0;
      border: none;
    }
  }
  .vux-cell-box:not(:first-child):before {
    border: none !important;
  }
</style>
