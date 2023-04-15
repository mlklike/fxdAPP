<template>
  <view class="container">
	  <!-- <text>礼品卡卡号：</text> -->
	<!-- <img :src="logoUrl" style="height: 300rpx;margin-bottom:100rpx"/> -->
	<view class="image"></view>
	<view style="margin-left: 18%;margin-right: 18%;line-height: 40rpx;text-align: center;">恭喜！您的礼品卡已激活绑定,现在即可进行礼品兑换！</view>
	<u-button style="width: 50%;margin-top: 60rpx;line-height: 60rpx;height: 60rpx;" :plain=plain shape="square" size='default' ripple=false type="success" @click="gotoMyCard()">我的礼品卡</u-button>

  </view>
</template>

<script>
import {activateCoupon } from '@/api/user'
import {LOGO_URL} from "@/config"

// 公众号登录
import { auth } from '@/libs/wechat.js'

export default {
  data() {
    return {
		plain:false,
		logoUrl: LOGO_URL,
      form:{
		  couponCode: '',
		  couponPassword: '',
	  }
    }
  },
  methods: {
	  gotoMyCard(){
		  uni.switchTab({
		  	url: '/pages/shop/GoodsList/index'
		  })
	  }
}
}
</script>

<style lang="less">
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  padding: 30rpx;
  font-size: 30rpx;
  background: url('/static/logo.png') no-repeat;
  background-position: top;
  background-size: 90% 70%;
}
.image{
	height: 440rpx;
}
.item{
	width: 100%;
	font-size: 30rpx;
	// padding: 100rpx;
	margin: 30rpx 0;
	border-bottom: 1px solid grey;
}
</style>
