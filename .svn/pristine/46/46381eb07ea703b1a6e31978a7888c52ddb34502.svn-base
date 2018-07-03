<template>
  <section class="wrap">
    <nav class="top-nav">
      <span v-for="(item,index) in list" @click="listData(index,item.list)"
            :class="active === index?'active':''" :key="index">{{item.title}}</span>
    </nav>
    <ul class=" item-list">
      <li v-for="(item_S,index) in s_list" :key="index">
        <img :src="item_S.wx_pic" alt="avatar" class="avatar">
        <span>{{item_S.nickname}}</span>
        <span>{{item_S.add_time}}</span>
        <span class="default">+{{item_S.alteration}}</span>
      </li>
    </ul>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        active: 0,
        s_list: [],
      }
    },
    methods: {
      getData() {
        this.apiPost('Index/integralGetRecord').then(res => {
          this.list = res;
          this.s_list = res[0].list;
        })
      },
      listData(index, list) {
        this.s_list = list;
        this.active = index;
      }
    },
    created() {
      this.getData();
    },
  }

</script>

<style scoped>
  nav.top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  nav.top-nav > span {
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: 1.4em;
    padding: .5em 0;
    color: #a9a9a9;
    text-align: center;
    border-bottom: 2px solid #e4e4e4;
  }
  .avatar {
    width: 3.5em;
    height: 3.5em;
    border-radius: 50%;
  }
  .item-list {
    background-color: #fff;
  }
  .item-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5em 1em;
    border-bottom: 1px solid #e4e4e4;
  }
  .item-list li span:first-of-type {
    margin-left: -4em;
    margin-right: -2em;
    font-size: 1.7em;
  }
  .item-list li span:first-of-type + span {
    color: #a9a9a9;
  }
  .item-list li span:last-of-type {
    margin-right: 1em;
  }
</style>
