<template>
  <view class="lottie-bg">
    <view id="lottie">
      <image src="@/static/live-logo.gif" rel="preload" mode="widthFix" style="width: 100%" />
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// 组件
// import request from "@//api/request";
import { wxappAuth } from '@/api/user'
import dayjs from 'dayjs'
import store from '@/store'
import cookie from '@/utils/store/cookie'
import { parseQuery, login, handleQrCode, getCurrentPageUrl, handleUrlParam, getCurrentPageUrlWithArgs } from '@/utils'

export default {
  name: 'Loading',
  data() {
    return {}
  },
  onShow() {
    
     if (this.$store.getters.token) {
      // 如果token存在，直接进行进页面
      console.log('登录状态存在，直接进页面')
      this.toLaunch()
      // return
    }else{
	  this.$yrouter.push("/pages/user/Login/index");
	}
   
  },
  methods: {
    ...mapActions(['changeAuthorization', 'setUserInfo', 'getUser']),
    toLaunch() {
		this.$yrouter.switchTab({
		  path: '/pages/user/User/index',
		})
      // console.log('loading home')
      // this.changeAuthorization(false)
      // let redirect = cookie.get('redirect').replace(/\ /g, '')
      // cookie.remove('redirect')
      // if (redirect && redirect.indexOf('/pages') != -1) {
      //   this.$yrouter.replace({
      //     path: '/pages' + redirect.split('/pages')[1],
      //   })
      // } else {
      //   this.$yrouter.switchTab({
      //     path: '/pages/user/User/index',
      //   })
      // }
    },
  },
}
</script>

<style scoped lang="less">
.lottie-bg {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #fff;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
}

#lottie {
  width: 35%;
  display: block;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  margin: auto;
}
</style>
