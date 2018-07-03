<template>
  <section class="wrap">
    <div class="top-box box">
      <p>授权中的课程</p>
      <div>
        <span v-for="item in unconfirmed" @click="pushToAbsent(item.id)">{{item.classify_name}}</span>
      </div>

    </div>
    <div class="bottom-box box">
      <p>未授权课程</p>
      <div>
        <span v-for="item in absent" @click="pushToUnconfirmed(item.id)">{{item.classify_name}}</span>
      </div>
    </div>
    <div class="already-box box">
      <p>已授权课程</p>
      <div>
        <span v-for="item in affirm">{{item.classify_name}}</span>
      </div>
    </div>
    <div class="btn-area">
      <span class="default" @click="subData">申请授权</span>
    </div>
    <div class="empty"></div>
    <div class="empty"></div>
  </section>
</template>

<script>
  import {XButton} from 'vux'

  export default {
    components: {
      XButton
    },
    data() {
      return {
        unconfirmed: [],
        absent: [],
        affirm: [],
      }
    },
    methods: {
      fetchData() {
        this.apiPost('Index/teacherClassify').then(res => {
          this.unconfirmed = res.unconfirmed;
          this.absent = res.absent;
          this.affirm = res.affirm;
        })
      },
      subData() {
        let id = [];
        this.unconfirmed.forEach(item => {
          id.push(item.id);
        });
        if (id.length === 0) {
          this.$vux.toast.text('请选择申请的课程分类', 'middle');
        }
        let str = id.toString();
        this.apiPost("Index/authorization", {id: str}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          if (res.error === 0) {
            setTimeout(() => {
              router.push('/user')
            }, 1500)
          }
        })
      },
      pushToAbsent(id) {
        let arr = [];
        this.unconfirmed.forEach(item => {
          if (item.id !== id) {
            arr.push(item);
          } else {
            this.absent.push(item);
          }
        });
        this.unconfirmed = arr;
      },
      pushToUnconfirmed(id) {
        let arr = [];
        this.absent.forEach(item => {
          if (item.id !== id) {
            arr.push(item);
          } else {
            this.unconfirmed.push(item);
          }
        });
        this.absent = arr;
      },
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style scoped>
  .box {
    padding: 1em;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 1em;
    background-color: #fff;
  }
  .box p {
    color: #a9a9a9;
    font-size:1.4em;
  }
  .box div {
    display: flex;
    justify-content: flex-start;
    flex-flow: wrap;
  }
  .box > div span {
    display: inline-block;
    height:30px;
    min-width:5em;
    margin: .5em .5em;
    padding:.1em 1em;
    font-size: 1.4em;
    text-align: center;
    line-height: 30px;
    color: #58cfb7;
    border: 1px solid #58cfb7;
  }
  .already-box > div span {
    display: inline-block;
    width: 5em;
    margin: .5em 0;
    padding: .1em 1em;
    font-size: 1.4em;
    text-align: center;
    line-height: 2;
    color: #b5b8ba;
    border: 1px solid #b5b8ba;
  }
  .btn-area {
    position: fixed;
    bottom: 2em;
    left: 0;
    width: 100%;
    padding: 1em 0;
    text-align: center;
    box-sizing: border-box;
  }
  .btn-area span {
    display: inline-block;
    width: 80%;
    height: 3em;
    font-size: 1.5em;
    text-align: center;
    line-height: 3em;
    border-radius: 4px;
    color: #fff;
  }
  .default {
    background-color: #1bbd9c;
  }
</style>
