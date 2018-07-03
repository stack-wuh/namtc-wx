<template>
  <section class="wrap">
    <div class="pay_div">
      <p class="pay_p">支付中，请稍候...</p>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        wxPay: {},
      }
    },
    methods: {
      pay() {
        let this_ = this;
        if (this.wxPay.type === "answer") {
          this.apiPost('Index/purchaseAnswer', {id: this.wxPay.id}).then(res => {
            wx.chooseWXPay({
              timestamp: res.timestamp,
              nonceStr: res.nonceStr,
              package: res.package,
              signType: res.signType,
              paySign: res.paySign,
              success: function () {
                this_.apiPost('Index/completeAnswerPayment').then(res_ => {
                  this_.$vux.toast.text(res_.msg, 'middle');
                  Lockr.rm('wx_pay');
                  setTimeout(() => {
                    router.go(-1);
                  }, 1000);
                })
              },
              fail: function () {
                this_.$vux.toast.text("支付失败", 'middle');
                setTimeout(() => {
                  router.go(-1);
                }, 1000);
              }
            });
          })
        }
        if (this.wxPay.type === "vip") {
          this.apiPost('Index/openVip', {id: this.wxPay.id}).then(res => {
            wx.chooseWXPay({
              timestamp: res.timestamp,
              nonceStr: res.nonceStr,
              package: res.package,
              signType: res.signType,
              paySign: res.paySign,
              success: function () {
                this_.apiPost('Index/completeVipPayment').then(res_ => {
                  this_.$vux.toast.text(res_.msg, 'middle');
                  Lockr.rm('wx_pay');
                  setTimeout(() => {
                    router.go(-1);
                  }, 1000);
                })
              },
              fail: function (res) {
                this_.$vux.toast.text("支付失败", 'middle');
                setTimeout(() => {
                  router.go(-1);
                }, 1000);
              }
            });
          })
        }
        if (this.wxPay.type === "article") {
          this.apiPost('Index/purchaseArticle', {id: this.wxPay.id}).then(res => {
            wx.chooseWXPay({
              timestamp: res.timestamp,
              nonceStr: res.nonceStr,
              package: res.package,
              signType: res.signType,
              paySign: res.paySign,
              success: function () {
                this_.apiPost('Index/completeArticlePayment').then(res_ => {
                  this_.$vux.toast.text(res_.msg, 'middle');
                  Lockr.rm('wx_pay');
                  setTimeout(() => {
                    router.go(-1);
                  }, 1000);
                })
              },
              fail: function (res) {
                this_.$vux.toast.text("支付失败", 'middle');
                setTimeout(() => {
                  router.go(-1);
                }, 1000);
              }
            });
          })
        }
      },
    },
    created() {
      this.wxPay = Lockr.get('wx_pay');
      this.pay();
    }
  }
</script>

<style scoped>
  .pay_div {
    margin-top: 5%;
  }
  .pay_p {
    text-align: center;
    font-size: 3em;
  }
</style>
