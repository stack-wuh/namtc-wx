<template>
  <section class="wrap">
    <!--粉丝/关注 列表-->
    <div v-if="list.length > 0" class="item-list" v-for="(item,index) in list" :key="index">
      <img :src="item.wx_pic" alt="avatar" class="avatar">
      <div>
        <p>{{item.nickname}}</p>
        <span>{{item.praised}} 获赞</span>
        <span>{{item.follower}} 粉丝</span>
      </div>
      <span :class="item.is_follower?'btn-focus-active btn-focus':'btn-focus'" @click="change(item.uid)">
        {{item.is_follower?'已关注':'关注'}}</span>
    </div>
    <load-more v-show="isMoreShow && !list" :show-loading="isLoadShow"
               :tip="('没有更多了')"></load-more>

  </section>
</template>

<script>
  import {XButton, LoadMore} from 'vux'

  export default {
    components: {
      XButton,
      LoadMore
    },
    data() {
      return {
        isClick: false,
        list: [],
        id: '',
        isLoadShow: true,
        isMoreShow: true
      }
    },
    methods: {
      //获取粉丝
      getFans() {
        this.apiPost('Index/follower').then(res => {
          this.list = res
          this.isLoadShow = false
        })
      },

      //获取关注
      getFollow() {
        this.apiPost('Index/follow').then(res => {
          this.list = res
          this.isLoadShow = false
        })
      },

      change(id) {
        this.apiPost('Index/followUser', {uid: id}).then(res => {
          this.$vux.toast.text(res.msg, 'middle');
          this.getData();
        })
      },
      getData(id) {
        if (id === 1) {
          this.getFans()
        } else {
          this.getFollow()
        }
      },
    },
    created() {
      this.id = Lockr.get('floow_type');
      this.getData(this.id);
      Lockr.rm('floow_type');
    }
  }
</script>

<style scoped>
  .item-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em 1.5em;
    border: 1px solid #e4e4e4;;
    border-bottom: none;
    background-color: #fff;
  }
  .avatar {
    width: 5em;
    height: 5em;
    border-radius: 50%;
  }
  .item-list > div {
    flex: 1;
    margin-left: 1em;
    font-size: 1.4em;
    color: #7f7f7f;
  }
  .item-list > div p {
    font-size: 1.4em;
    font-weight: 600;
  }
  .item-list > div span {
    margin-right: 1em;
  }
  .btn-focus {
    display: inline-block;
    width: 50px;
    height: 23px;
    color: #1bbd9c;
    text-align: center;
    line-height: 23px;
    border: 1px solid #1bbd9c;
  }
  .btn-focus-active {
    color: #fff;
    background-color: #1bbd9c;
  }
</style>
