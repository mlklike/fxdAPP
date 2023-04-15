<template>
	<view style="font-size: 30rpx;padding: 30rpx;" class="firstPage">
		<!-- <view style="height: 200rpx;background-color: white;margin: 30rpx;"> -->
			<!-- <img :src="logoUrl" style="width: 100%; height: 300rpx;"/> -->
		<!-- </view> -->
		<view style="margin-top: 440rpx;">
			<text>尊敬的贵宾会员：
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您好！感谢您对安顺得放心蛋的信任与支持！在服务过程中有任何问题，均可拨打安顺得贵宾热线：400-163-8058</text>
			
		</view>
		<view style="padding: 30rpx;text-align: center;color:red" @click="callPhone()"><text>立即拨打</text></view>
		<view><text>或者在公众号留言，安顺得贵宾客服会在24小时内回复并解决您的问题！</text></view>
		<!-- <view style="width: 200rpx;height: 200rpx;background-color: white;margin:30rpx auto"> -->
			<img :src="qrCodeUrl" style="height: 300rpx;margin:30rpx auto;display: block;"/>
		<!-- </view> -->
		<view style="text-align: center;">
			<view><text>安顺得放心蛋</text></view>
			<view><text>兑换服务公众号</text></view>
		</view>
		
		
		<view style="margin: 100rpx;"></view>
	</view>
</template>

<script>
	import {LOGO_URL,QR_CODE_URL} from "@/config"
	export default {
		data() {
			return {
				logoUrl: '',
				qrCodeUrl: QR_CODE_URL
			}
		},
		methods: {
			callPhone(){
				uni.makePhoneCall({ phoneNumber : "400-163-8058", 
				success: (res) => { console.log('调用成功!') },
				fail: (res) => { console.log('调用失败!') } });
			}
		}
	}
</script>

<style>
	.firstPage{
		background: url('/static/logo.png') no-repeat;
		background-size: 95% 70%;
	}

</style>
