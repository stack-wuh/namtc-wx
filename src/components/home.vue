<template>
  <div class="father">
    <!-- <transition name="slide-fade"> -->
      <keep-alive>  
          <router-view v-if="$route.meta.keepAlive" class="main"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" class="main"></router-view>
    <!-- </transition> -->
  </div>  
</template>

<script>
import Bottom from '../components/common/bottom'
import { Loading } from 'vux'
  export default {
    components:{
      Bottom,
      Loading
    },
    data(){
      return {

      }
    },
  }
</script>
 
<style scoped>
.father{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main{
  width:100%;
  height:100%;
  box-sizing: border-box;
  /* overflow: hidden; */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
