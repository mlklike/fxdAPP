<template>
	<view class="page_box1 my-order">
		<view class="header bg-color-red" style="position: relative;height: 200rpx" >
		  <view class="picTxt acea-row row-between-wrapper" style="height: 120rpx; ">
		    <view class="text">
		      <view class="name">温馨提示:</view>	
		    </view>
		  </view>
		  	<view style="position: absolute;bottom: 40rpx;left:40rpx;font-size: 26rpx;color: #fff;">提交兑换订单前，请认真审核收货信息</view>
		</view>
		<view class="address acea-row row-between-wrapper" style="margin-left: 10rpx;margin-right: 10rpx;"  @click="addressTap">
		  <view class="addressCon1" v-if="addressInfo.realName">
				<view class="name">
				   <view>收货人:{{ addressInfo.realName }}</view>
					<view class="phone">{{ addressInfo.phone }}</view>
				</view>
				<view class='address1'>
				 <text>收货地址: {{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.district }}{{ addressInfo.detail }}</text>
				</view>
		  </view>
		  <view class="addressCon" v-else>
		    <view class="setaddress">设置收货地址</view>
		  </view>
		  <view class="iconfont icon-jiantou"></view>
		</view>
		<!-- 下一行 -->
		<view class='title' style="margin-left: 10rpx;margin-right: 10rpx;">
			<view class='title1'>选择有效卡券进行兑换</view>
		</view>
		<!--新增产品的展示-->
		<uni-row style="margin-top: 20rpx; margin: 9px 0;border-bottom: 1rpx solid #E1E1E1;margin-left: 10rpx;margin-right: 10rpx;">
			<uni-col :span="3" style="height: 220rpx;display: flex;justify-content: left;align-items: center;">
				<!-- <view class="iconfont icon-jiantou"></view> -->
				<view @click="goPrevious()">
					<i class="uni-btn-icon" style="color: rgb(0, 0, 0); font-size: 50rpx;"></i>
				</view>
			</uni-col>
			<uni-col :span="18" style="display: flex; flex-direction: row;">
				<view><image class="goods_img" lazy-load fade-show :src="storeInfo.image" mode="aspectFill"></u-image></view>
				<view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>卡券号：{{item.couponCode}}</uni-text>
					</view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>流水号：{{item.couponNo}}</uni-text>
					</view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>标题：{{item.couponTitle}}</uni-text>
					</view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>规格：{{item.specQty}}</uni-text>
					</view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>净含量：{{item.netQty}}</uni-text>
					</view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>剩余次数：{{item.surplusSpecQty}}</uni-text>
					</view>
					<view class="order-sku u-ellipsis-1">
						<uni-text>本次兑换次数:</uni-text>
						<view class="u-demo-area" style="display: inline-block;margin-left: 10rpx;">
							<u-number-box v-model="value" :bg-color="bgColor" :color="color" :min="1"
							:step="step" :disabled="disabled" @change="change" @focus="focus"></u-number-box>
						</view>
					</view>
				</view>
			</uni-col>
			<uni-col :span="3" style="height: 220rpx;display: flex;justify-content: end;align-items: center;">
				<view @click="goNext()" class="iconfont icon-jiantou"></view>
			</uni-col>
		</uni-row>
        <view>
			<text style='margin-left:10rpx;margin-top: 10rpx;font-size: 30rpx;'>留言</text>
		</view>
		<view style="margin-left: 10rpx;margin-right: 10rpx;">
			<view class="u-demo-block__content">
				<u--textarea
					v-model="value2"
					placeholder="请输入内容"
					count
				></u--textarea>
			</view>
		</view>
		<view style="padding-left: 16rpx;line-height: 46rpx;display:flex;flex-direction: row;margin-top: 18rpx;">
			<view style=""><text>是否开启自动兑换:</text></view>
			<view class='switch' style="margin-left: 16rpx;"><u-switch  v-model="item.autoExchange" ></u-switch></view>
		</view>
		<view class="" style="display: flex;align-items: center;padding-left: 16rpx;margin-top: 20rpx;">
			<uni-text>自动兑换时间频次：</uni-text>
			<uni-tag :inverted="true" 
				:text=getString(item.autoExchangeDate) type="success" />
				<text style="margin-left: 10rpx;">天</text>
		</view>
		<view style="display: flex; flex-direction: row;align-items: center;justify-content: center;margin-top: 40rpx;">
			<u-button style="width: 50%;" @click="btnClick" data-name="3333"  :plain=plain shape="square" size='default' ripple=false type="success">立即兑换</u-button>
	
			<!-- <view @click="goodExchange"  class="evaluate btn">立即兑换</view> -->
		</view>
		<u-loadmore  height="120rpx" :status="loadStatus" icon-type="flower"
			color="#ccc" />
		
		<address-window @checked="changeAddress" @redirect="addressRedirect" v-model="showAddress" :checked="addressInfo.id" ref="mychild01"></address-window>
	</view>
</template>

<script>
	import { getByCouponNo,createExchangeOrder,setAutoAutoExchange,getPreviousCouponNo,getNextCouponNo } from '@/api/coupon'
	import AddressWindow from '@/components/AddressWindow'
	const NAME='GoodExchange'
	export default {
		name:NAME,
		components:{
			AddressWindow
		},
		data() {
			return {
				couponCode:'',//定义为传递过来的卡券Id
				loadStatus:'nomore',
				plain:false,
				step:1,
				disabled:false,
				value:1,
				value2:'',
				bgColor:"#F2F3F5",
				color :'#323233',
				showAddress: false,
				addressLoaded: false,
				storeInfo:{
					'image':''
				},
				item:{},
				addressInfo:{
					id:1,
					realName:'',
					phone:'',
					isDefault:true,
					province:'',
					city:'',
					district:'',
					detail:''
				}
			}
		},
		watch:{
			'item.autoExchange'(newData,oldData){
				if(oldData==undefined){return}
				console.log(newData,oldData)
				if(newData && newData!=oldData){
					this.setAutoEchange(1,this.item.id)
				}else if(!newData && newData!=oldData){
					this.setAutoEchange(0,this.item.id)
				}								
			}
		},
		mounted() {
			 this.couponCode = this._route.query.couponCode
			 this.getCouponDetail();//查询当前用户券的详情
		},
		methods: {
			/**
			 * 获取下一张卡券
			 */
			goNext(){
				getNextCouponNo(this.couponCode).then(res=>{
					console.log(res);
					if(res.status==200){
						if(res.data.nextExceptionData=='lastData'){
						  console.log('<><><><><><><><><>')
						  uni.showModal({
						  	title:'提示',
						  	content:'已经是最后一张卡券'
						  })
					    }else{
							this.couponCode=res.data.nextData;//
						    this.getCouponDetail();//查询当前用户券的详情						
						}
				    }
				});
				
			},
			/**
			 * 获取前一张卡券
			 */
			goPrevious(){
				getPreviousCouponNo(this.couponCode).then(res=>{
					console.log(res);
					if(res.status==200){
						if(res.data.previousExceptionData=='firstData'){
						  console.log('<><><><><><><><><>')
						  uni.showModal({
						  	title:'提示',
						  	content:'已经是首张卡券'
						  })
					    }else{
							this.couponCode=res.data.previousData;//
						    this.getCouponDetail();//查询当前用户券的详情						
						}
				    }
				});
			},
			setAutoEchange(status,id){
				if(status==1){//表明当前是开启
				let that=this
					uni.showModal({
						title:'地址确认',
						content:'确认您当前'+this.addressInfo.province+this.addressInfo.city+this.addressInfo.district+this.addressInfo.detail+"地址为自动兑换地址?",
						success:function(res){
							if(res.confirm){
								setAutoAutoExchange({'isAutoExchange':status,couponId:that.item.id}).then(res=>{
									if(res.status==200){
										uni.showModal({
											title:'success',
											content:'设置成功'
										})
									}
								})
							}
							if(res.cancel){
								that.item.autoExchange=0
							}
						}
					})
				}
				if(status==0){
					setAutoAutoExchange({'isAutoExchange':status,couponId:this.item.id}).then(res=>{
						if(res.status==200){
							uni.showModal({
								title:'success',
								content:'已经取消自动兑换'
							})
						}
					})
				}
			},
			getString(data){
				console.log("自动获取的频次的天数"+data)
				if (data) {
					return data+'';
				} else{
					return '';
				}
				
			},
			/**
			 * 获取卡券的详细信息
			 */
			getCouponDetail(){
				getByCouponNo(this.couponCode).then(res=>{
					if(res.data){
						this.item=res.data.yxStoreCouponUser;
						this.addressInfo=res.data.yxUserAddress
						this.storeInfo.image=res.data.image
                        console.log(this.storeInfo.image);
						console.log(this.item.autoExchangeDate)
					}
				})
			},
			/* 卡券兑换 */
			btnClick:function(){
			   if(this.value>this.item.surplusSpecQty){
				   uni.showModal({
				   	title:'提示',
				   	content:'兑换数量超过了限制'
				   })
				   return;
			   }
			
			   if(this.addressInfo.uid==null  || this.addressInfo.city==null){
				   uni.showModal({
				   	title:'提示',
				   	content:'请选择地址'
				   })
				   return;
			   }
				createExchangeOrder({'addressId':this.addressInfo.id,
						'couponId':this.item.id,
						'mark':this.value2,
						'qty':this.value
				}).then(res=>{
					if(res.status==200){//创建订单成功返回到卡券列表
						uni.switchTab({
							url: '/pages/shop/GoodsList/index'
						})
					}
				})
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
		margin-top: 10rpx;
		width: 90%;
		height: 60rpx;
		line-height: 60rpx;
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
