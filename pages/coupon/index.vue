<template>
  <view class="container">
	  <!-- <text>礼品卡卡号：</text> -->
	<!-- <img :src="logoUrl" style="height: 300rpx;margin-bottom:100rpx"/> -->
	<view class="image"></view>
    <input class="item" v-model="form.couponCode" placeholder="礼品卡卡号"/>
	<!-- <text>礼品卡密码：</text> -->
	<input class="item" v-model="form.couponPassword" placeholder="礼品卡密码"/>
	<u-button style="width: 50%;" :plain=plain shape="square" size='default' ripple=false type="success" @click="activateCoupon()">激活绑定</u-button>
  </view>
</template>

<script>
import {activateCoupon } from '@/api/user'
import {LOGO_URL} from "@/config"
import { mapGetters } from "vuex";

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
  computed: mapGetters(["userInfo"]),
  methods: {
	  activateCoupon(){
		this.form.nickName=this.userInfo.nickname;
		this.form.phone=this.userInfo.phone;
		activateCoupon(this.form).then(res=>{
			if(res.status==200){
			/* 	uni.showModal({
					title:'success',
					content:res['msg']
				}) */
				//跳转到完成界面
				this.$yrouter.push({ path: '/pages/coupon/index2'})
				return;
			}
		
			
		}).catch(e=>{
			uni.showModal({
				title:'提示',
				content:e['msg']
			})
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
