<template>
	<view class="page_box1 my-order order-details">
		<view class="header bg-color-red" style="position: relative;">
		  <view class="picTxt acea-row row-between-wrapper">
		    <view class="text">
		      <view class="name">售后反馈</view>	
		    </view>
		  </view>
		</view>
		<!-- 下一行 -->
		<view class='title' style="margin-left: 10rpx;margin-right: 10rpx;">
			<view>
				<view>
					<u--form
						labelPosition="left"
						ref="form1"
					>
					<u-form-item
						label="售后原因"
						borderBottom
						@click="showReason = true; hideKeyboard()"
						ref="item1"
					>
						<u--input
							v-model="afterSaleData.reasons"
							disabled
							disabledColor="#ffffff"
							placeholder="请选择售后原因"
							border="none"
						></u--input>
						<u-icon
							slot="right"
							name="arrow-right"
						></u-icon>
					</u-form-item>
					</u--form>
				</view>
			</view>
		</view>
		<!-- 上传图片 -->
		<view style="margin-left: 10rpx;margin-top: 30rpx;">
			<text>售后图片:（图片上传,不少于3张,最多5张）</text>
		</view>

		<view class="u-demo-block__content" style="margin-left: 15rpx;margin-top: 30rpx;">
			<u-album  :urls="picTures"     
							rowCount="4"
						    maxCount="4"
						    multipleSize="90"></u-album>
		</view>
        <view style="margin-top: 20rpx">
			<text style='margin-left:10rpx;;font-size: 26rpx;'>售后说明(少于300字)</text>
		</view>
		<view style="margin-left: 10rpx;margin-right: 10rpx;margin-top: 20rpx;">
			<view class="u-demo-block__content">
				<u--textarea
					v-model="afterSaleData.applicationInstructions"
					placeholder="请输入售后说明"
					count
				></u--textarea>
			</view>
		</view>

		<view style="display: flex; flex-direction: row;align-items: center;justify-content: center;margin-top: 40rpx;">
<!-- 			<u-button style="width: 50%;" @click="btnClick" data-name="3333"  :plain=plain shape="square" size='default' ripple=false type="success">售后提交</u-button>
 -->			<!-- <view @click="goodExchange"  class="evaluate btn">立即兑换</view> -->
		</view>
	<!-- 	<OrderGoods
			:evaluate="status.type || 0"
			:isIntegral="isIntegral"
			:cartInfo="cartInfo || []"
		></OrderGoods> -->
		
	<view style="margin-top: 15rpx;margin-left: 10rpx; margin-right:10rpx: 15rpx;color:red;border-bottom: 2rpx solid #E1E1E1;padding-bottom: 15rpx;">
		<view><text>收件人信息</text></view>
	</view>
	<view class="address acea-row row-between-wrapper" style="margin-left: 10rpx;margin-right: 10rpx;">
	  <view class="addressCon">
			<view class="name">
			   <view>收货人:{{ orderInfo.realName }}</view>
				<view class="phone">{{ orderInfo.phone }}</view>
				<text
					  @click="telPhone(orderInfo.userPhone)"
					  class="iconfont icon-tonghua font-color-red"
				></text>
			</view>
			<view class='address1'>
			 <text>收货地址: {{  orderInfo.userAddress  }}</text>
			</view>
	  </view>
	</view>
	<uni-row style="margin-top: 20rpx; margin: 9px 0;border-bottom: 1rpx solid #E1E1E1;margin-left: 10rpx;margin-right: 10rpx;">
		<uni-col :span="3" style="height: 220rpx;display: flex;justify-content: left;align-items: center;">
			<!-- <view class="iconfont icon-jiantou"></view> -->
	
		</uni-col>
		<uni-col :span="18" style="display: flex; flex-direction: row;">
			<view><image class="goods_img" lazy-load fade-show :src="orderInfo.image" mode="aspectFill"></u-image></view>
			<view>
				<view class="order-sku u-ellipsis-1">
					<uni-text>卡券号：{{orderInfo.storeCouponNo}}</uni-text>
				</view>
				<view class="order-sku u-ellipsis-1">
					<uni-text>流水号：{{orderInfo.couponNo}}</uni-text>
				</view>
				<view class="order-sku u-ellipsis-1">
					<uni-text>标题：{{orderInfo.productName}}</uni-text>
				</view>
				<view class="order-sku u-ellipsis-1">
					<uni-text>规格：{{orderInfo.specTypeDec}}</uni-text>
				</view>
				<view class="order-sku u-ellipsis-1">
					<uni-text>净含量：{{orderInfo.netQty}}</uni-text>
				</view>
				<view class="order-sku u-ellipsis-1">
					<uni-text class="order-num">兑换数量:&nbsp;{{ orderInfo.qty}}</uni-text>
				</view>
			</view>
		</uni-col>
		<uni-col :span="3" style="height: 220rpx;display: flex;justify-content: end;align-items: center;">
			<!-- <view class="iconfont icon-jiantou"></view> -->
		</uni-col>
	</uni-row>
	<view>
		<text style='margin-left:10rpx;margin-top: 10rpx;font-size: 30rpx;'>留言</text>
	</view>
	<view style="margin-left: 10rpx;margin-right: 10rpx;">
		<view class="u-demo-block__content">
			<u--textarea
				v-model="orderInfo.mark"
				placeholder="请输入内容"
				count
			></u--textarea>
		</view>
	</view>
	 <view class="order-details">	
	  <view class="wrapper">
		  <view class="item acea-row row-between">
		    <view>订单编号：</view>
		    <view class="conter">{{ orderInfo.orderId || '' }}		
			<!-- #ifndef H5 -->
			<text class="copy copy-data" @click="copyClipboard(orderInfo.orderId)">复制</text>
			<!-- #endif -->
			</view>
		  </view>
		<view class="item acea-row row-between">
		  <view>下单时间：</view>
		  <view class="conter">{{orderInfo.createTime || '' }}</view>
		</view>
	    <view class="item acea-row row-between">
	      <view>快递公司：</view>
	      <view class="conter">{{  orderInfo.deliveryName || '' }}</view>
	    </view>
	    <view class="item acea-row row-between">
	      <view>快递号：</view>
	      <view class="conter">{{  orderInfo.deliveryId }}</view>
	    </view>
		<view style="height: 120rpx; "></view>
	  </view>
	 </view> 
		<u-action-sheet
			:show="showReason"
			:actions="actions"
			title="请选择售后原因"
			@close="closeReason"
			@select="sexReason"
		></u-action-sheet>
		<view class="footer acea-row row-between-wrapper" >
			<view class="item" @click="goToPerson()">  
			  <view style="text-align: center;"><image style="width: 24px;height:24px;" src="../../../../static/icon-user.png"></view>
			  <text>个人中心</text>
			</view>
			<view class="item" @click="gotoKefu()">
			   <view style="text-align: center;"><image style="width: 24px;height:24px;" src="../../../../static/icon-class.png"></view>
			  <text>联系客服</text>
			</view>		
		</view>
		<u-loadmore  height="120rpx" :status="loadStatus" icon-type="flower"
			color="#ccc" />
		
	</view>
</template>

<script>
	import {
		getAfterSalesDeatail
	} from '@/api/aftersales.js';
	import {
	  orderDetail
	} from "@/api/order";
	import {
	  copyClipboard
	} from "@/utils";
	const NAME='OrderReturnRecord'
	export default {
		name:NAME,
		components:{
		},
		data() {
			return {
				reasonForApplication:'',//申请售后的说明
				loadStatus:'nomore',
				afterSaleData:{},//售后订单详细信息
				picTures:[],
				id:0,
				id2:0,
				status: {},
				urls2: [],
				showReason: false,
				 isIntegral: false,
				reason:'',
				orderInfo: {
				  _status: {},
				},
				actions: [{
						name: '地址写错了。',
					},
					{
						name: '电话写错了',
					},
					{
						name: '我不想要了',
					},
				],
				list:[
					{value:1,label:1},
					{value:2,label:2},
					{value:3,label:3},
				],
				plain:false,
				step:1,
				disabled:false,
				bgColor:"#F2F3F5",
				color :'#323233',
				showAddress: false,
				addressLoaded: false,
	
			}
		},
		onShow() {
			this.id = this.$yroute.query.id || 0;
			this.id2 = this.$yroute.query.id2 || 0;
			this.getAfterSalesDeatail();//获取售后订单的详细信息
			this.getDetail();//获取订单的详细信息
			
		},
		methods: {
			copyClipboard,
			gotoKefu(){
					  uni.switchTab({
					  	url: '/pages/user/CustomerService/index'
					  }) 
			},
			
			// 个人中心
			goToPerson(orderInfo) {
					  uni.switchTab({
					  	url: '/pages/user/User/index'
					  }) 
			},
			telPhone(phoneNumber) {
			  uni.makePhoneCall({
			    phoneNumber: phoneNumber,
			    fail() {
			      console.log("取消拨打");
			    }
			  });
			},
			/* 获取订单的详细的信息 */
			getDetail() {
			  const id = this.id;
			  if (!id) {
			    uni.showToast({
			      title: "订单不存在",
			      icon: "none",
			      duration: 2000,
			    });
			    return;
			  }
			  orderDetail(id)
			    .then((res) => {
			      this.orderInfo = res.data;
				  console.log(this.orderInfo);
			    })
			    .catch((err) => {
			      uni.showToast({
			        title: err.response.data.msg,
			        icon: "none",
			        duration: 2000,
			      });
			    });
			},
			/* 获取售后的详细信息 */
			getAfterSalesDeatail(){
				getAfterSalesDeatail(this.id2).then(res=>{
					console.log("售后详细信息")
					console.log(res.data[0])
					this.afterSaleData=res.data[0];
					this.picTures=res.data[0].applicationDescriptionPicture.split(",")
					
				})
			},
			// 删除图片
			deletePic(event) {
				this[`fileList`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList`].length
				lists.map((item) => {
					this[`fileList`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList`][fileListLen]
					this[`fileList`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: '', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			closeReason(){
				this.showReason=false
			},
			sexReason(e) {
				this.reason = e.name
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			btnClick:function(){
				
			},
			goodExchange:function(){
				
			},
			addressTap: function() {
			  this.showAddress = true
			  if (!this.addressLoaded) {
			    this.addressLoaded = true
				console.log(this.$refs.mychild01)
			    this.$refs.mychild01.getAddressList()
			  }
			},
			addressRedirect() {
			  this.addressLoaded = false
			  this.showAddress = false
			},
			changeAddress(addressInfo) {
			  this.addressInfo = addressInfo
			 // this.computedPrice()
			},
			focus() {
				console.log('focus');
			},
			change(e) {
				//console.log(e.value);
			},
			
		}
	}
</script>
<style lang='scss'>
	.btn {
		margin-right: 18rpx;
		line-height: 52rpx;
		width: 160rpx;
		border-radius: 26rpx;
		border: 2rpx solid #e4e7ed;
		font-size: 24rpx;
		text-align: center;
		color: #82848a;
	}
	.evaluate {
		color: #f29100;
		border-color: #f29100;
	}
	
	.order-sku {
		font-size: 26rpx;
		font-weight: 400;
		/* color: rgba(153, 153, 153, 1); */
		color:#282828;
		max-width: 100%;
		margin-bottom: 14rpx;
		margin-left: 16rpx;
		
		.order-num {
			margin-right: 10rpx;
		}
	}
	.goods_img{
		width: 220rpx;
		height: 220rpx;
		border-radius: 6rpx;
	}
	.productInfo{
		display: flex;
		flex-direction: row;
		justify-content:space-between;
		align-items: center;
		margin-top: 10rpx;
	}
	.address{
		border-bottom: 2rpx solid #E1E1E1;
	}
	.title{
		border-bottom: 2rpx solid #E1E1E1;
	}
	.title1{
		margin-top: 18rpx;
		font-size: 30rpx;
		margin-left: 10rpx;
		margin-bottom: 16rpx;
		font-weight: 500;
		
	}
	.addressCon{
		width: 90%;
	}
	.phone{
		margin-right: 5rpx;
	}
	.name{
		font-size:28rpx;
		color: #282828;
		font-weight: 500;
		margin-bottom: 10rpx;
		margin-top: 16rpx;
		margin-left: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content:space-between;
	}
	.address1{
		font-size: 26rpx;
		margin-left: 10rpx;
		color: #782828;
		margin-top: 6rpx;
		margin-bottom: 16rpx;
	}
	
	.page_box1 {
		
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
		overflow-x: hidden;
		/* background: $u-bg-color; */
		background: #fff;
	}
	.bottom {
		display: flex;
		flex: 1;
		flex-direction: row;
		margin-top: 10rpx;
		padding: 0 10rpx 10rpx;
		justify-content: flex-end;

		align-items: center;
		.btn {
			margin-right: 18rpx;
			line-height: 52rpx;
			width: 160rpx;
			border-radius: 26rpx;
			border: 2rpx solid #e4e7ed;
			font-size: 24rpx;
			text-align: center;
			color: #82848a;
		}
		.evaluate {
			color: #f29100;
			border-color: #f29100;
		}
	}

	.order-nav {
		background-color: #fff;
		width: 7.0 * 100rpx;
		height: 1.3 * 100rpx;
		border-radius: 0.06 * 100rpx;
		margin: -0.73 * 100rpx auto 0 auto;
		background: #fff;

	
		.nav-item {
			flex: 1;
	
			.item-title {
				font-size: 28rpx;
	
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				line-height: 76rpx;
			}
	
			.nav-line {
				width: 100rpx;
				height: 4rpx;
				background: #fff;
			}
	
			.line-active {
				background: rgba(230, 184, 115, 1);
			}
		}
	}
	.order-list {
		background: #fff;
		margin: 20rpx 0;
	
		.order-bottom {
			padding-bottom: 20rpx;
	
			.btn-box {
				justify-content: flex-end;
			}
	
			.all-msg {
				font-size: 24rpx;
				color: #999;
				justify-content: flex-end;
				margin-bottom: 10rpx;
				padding: 0 30rpx;
	
				.all-unit {
					font-size: 20rpx;
				}
	
				.all-money {
					font-size: 26rpx;
					color: #333;
					font-weight: 500;
	
					&::before {
						content: '￥';
						font-size: 20rpx;
					}
				}
			}
	
			.obtn1 {
				width: 160rpx;
				line-height: 60rpx;
				background: rgba(238, 238, 238, 1);
				border-radius: 30rpx;
				font-size: 26rpx;
	
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				margin-right: 20rpx;
				padding: 0;
			}
	
			.obtn2 {
				width: 160rpx;
				line-height: 60rpx;
				background: linear-gradient(90deg, rgba(233, 180, 97, 1), rgba(238, 204, 137, 1));
				box-shadow: 0px 7rpx 6rpx 0px rgba(229, 138, 0, 0.22);
				border-radius: 30rpx;
				margin-right: 20rpx;
				font-size: 26rpx;
	
				font-weight: 400;
				color: #fff;
				padding: 0;
			}
	
			.obtn3 {
				background: #ffeeee;
				color: #e50808;
				width: 160rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				margin-right: 20rpx;
				font-size: 26rpx;
				font-weight: 400;
				padding: 0;
			}
		}
	
		.order-head {
			padding: 0 25rpx;
			height: 77rpx;
			border-bottom: 1rpx solid #E1E1E1;
	
			.no {
				font-size: 28rpx;
				color: #82848f;
			}
				
			.state {
				font-size: 28rpx;
				color: #82848f;
			}
		}
	
		.goods-order {
			border-bottom: 1px solid rgba(223, 223, 223, 0.5);
			padding: 20rpx 20rpx 0;
			margin-bottom: 20rpx;
	
			.order-content {
				padding-bottom: 20rpx;
	
				.order-sku {
					font-size: 26rpx;
					font-weight: 400;
					/* color: rgba(153, 153, 153, 1); */
					color:#282828;
					max-width: 100%;
					margin-bottom: 16rpx;

					.order-num {
						margin-right: 10rpx;
			
					}
				}
	
				.order-price-box {
					.status-btn {
						height: 32rpx;
						border: 1rpx solid rgba(207, 169, 114, 1);
						border-radius: 15rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: rgba(168, 112, 13, 1);
						padding: 0 10rpx;
						margin-left: 20rpx;
						background: rgba(233, 183, 102, 0.16);
					}
	
					.order-price {
						font-size: 26rpx;
	
						font-weight: 600;
						color: rgba(51, 51, 51, 1);
					}
				}
			}
		}
	}
</style>
