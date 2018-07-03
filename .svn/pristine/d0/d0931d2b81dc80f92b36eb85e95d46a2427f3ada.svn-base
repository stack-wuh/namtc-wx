<template>
  <section class="wrap">
    <div class="item-detail">
      <img :src="info.wx_pic" alt="avatar" class="avatar">
      <div>
        <span>{{info.nickname}}</span>
        <span>{{info.vip_type}}</span>
        <span v-if="info.is_vip">有效期：{{info.vip_time}}</span>
        <span v-else>开通会员</span>
      </div>
    </div>
    <ul class="item-list">
      <li v-for="(item,index) in list" :key="index">
        <span>{{item.month == 0? '永久会员' : item.month+'月'}}<b>{{item.price}}</b>元</span>
        <span @click="openVip(item.id)">{{info.vip_expiry?'续费':'开通'}}</span>
      </li>
    </ul>
    <div v-transfer-dom>
      <confirm v-model="isShow"
               title="验证手机号以确认您的身份"
               @on-cancel="back_p"
               @on-confirm="next_p"
               :close-on-confirm="false">
        <div class="confirm-form">
          <div class="group">
            <div>
              <x-input placeholder="请输入联系电话" class="my-input" v-model="tel"></x-input>
              <span class="btn-active" v-if="secondIsShow">{{second}}s</span>
              <span class="active btn-active" @click="getCode" v-if="!secondIsShow">获取验证码</span>
            </div>
          </div>
          <div class="group">
            <div>
              <x-input placeholder="请输入短信验证码" class="my-input" v-model="code"></x-input>
            </div>
          </div>
        </div>
      </confirm>
    </div>
  </section>
</template>

<script>
  import {XInput, XButton, Confirm, TransferDomDirective as TransferDom} from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Confirm,
      XButton
    },
    data() {
      return {
        list: [],
        isShow: false,
        tel: '',
        code: '',
        info: {},
        second: 60,
        secondIsShow: false,
      };
    },
    methods: {
      openVip(id) {
        Lockr.set('wx_pay', {type: 'vip', id: id});
        router.push('/pay')
      },
      fetchData() {
        this.apiPost('Index/vipList').then(res => {
          this.list = res
        });
        this.apiPost('Index/userVipDetail').then(res1 => {
          this.info = res1
        })
      },
      getStatus() {
        this.apiPost('Index/isTel').then(res => {
          this.isShow = !res;
        })
      },
      getCode() {
        if (!this.tel) {
          this.$vux.toast.show({
            text: '请输入手机号',
            type: 'warn',
            width: '20em'
          });
          return
        }
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/).test(this.tel)) {
          this.$vux.toast.show({
            text: '手机号格式错误',
            type: 'warn',
            width: '20em'
          });
          return
        }
        this.apiPost('Index/telMessage', {tel: this.tel}).then(res => {
          this.$vux.toast.show({
            text: '短信已发送',
            width: '20em'
          });
          this.codeShow = true;
          this.secondIsShow = true;
          this.countDown()
        })
      },
      back_p() {
        router.go(-1);
      },
      next_p() {
        if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.tel))) {
          this.$vux.toast.text('暂时不支持该号码', 'middle');
          return false;
        }
        if (!this.code) {
          this.$vux.toast.text('请输入验证码', 'middle');
          return false;
        }
        this.apiPost('Index/editTel', {code: this.code, tel: this.tel}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          if (res.error === 0) {
            this.isShow = false;
          }
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
    },
    mounted() {
      this.fetchData();
      this.getStatus();
    }
  };
</script>

<style scoped>
  .confirm-form > div {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e4e4e4;
  }
  .confirm-form > div > div {
    display: flex;
    align-items: center;
  }
  .confirm-form > div > div > span {
    white-space: nowrap;
  }
  .my-input {
    width: 150px;
  }
  .avatar {
    width: 5em;
    height: 5em;
    border-radius: 50%;
  }
  .item-detail {
    display: flex;
    padding: 1em 2em;
    background-color: #f2f2f2;
  }
  .item-detail > div {
    display: flex;
    justify-content: center;
    align-items: left;
    flex-direction: column;
    margin-left: 1em;
  }
  .item-detail > div > span:first-of-type {
    margin-bottom: 0.2em;
    font-size: 2em;
  }
  .item-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3em;
    padding: 0 1em;
    font-size: 1.5em;
    line-height: 3em;
    border-bottom: 1px solid #e4e4e4;
  }
  .item-list li b {
    color: #1bbd9c;
  }
  .item-list li span:last-of-type {
    display: inline-block;
    width: 4em;
    height: 2em;
    text-align: center;
    line-height: 2em;
    border-radius: 1em;
    color: #fff;
    background-color: #1bbd9c;
  }
</style>
