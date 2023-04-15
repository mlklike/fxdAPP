<template>
  <view class="page_box my-order " ref="container" >
	  <view class="header bg-color-red">
	    <view class="picTxt acea-row row-between-wrapper">
	      <view class="text">
	        <view class="name">卡券信息</view>
			<view class="head_title">有效卡券张数：{{totalCoupons.totalCoupon || 0 }}</view>
			<view class="head_title">剩余总兑换次数：{{totalCoupons.surplusSpecQty || 0 }}</view>
	      </view>
	    </view>
	  </view>
	  <view class="head_box">
	  	<!-- tab -->
	  	<view class="order-nav u-flex">
	  		<view class="nav-item u-flex-col u-flex-1 u-col-center" v-for="nav in chooseList" :key="nav.id"
	  			@tap="set_where(nav.type)">
	  			<view class="item-title">{{ nav.title }}</view>
	  			<text class="nav-line" :class="{ 'line-active': orderType == nav.type }"></text>
	  		</view>
	  	</view>
	  </view>
	  <!--具体的内容-->
	  <view class="content_box">
		  <scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box scroll1">
				<view class="order-list" v-for="(item, productListIndex) in productList" :key="productListIndex.id">
				  
					<view class="order-head u-flex u-row-between">
						<text class="no">卡券：{{ productListIndex+1}}</text>
						<text class="state">状态: {{ getStatus(item) }}</text>	
					</view>
					<view class="goods-order">
						<view class="order-content">
							<!-- 第一行 -->
							<view class="goods-box u-col-top">
								<view class='order-sku u-ellipsis-1'>
									<uni-text>卡券名称：{{item.couponTitle}}</uni-text>
								</view>
							</view>
							<!-- 第二行 -->
							<uni-row>
								<uni-col :span='12'>
									<view class="order-sku u-ellipsis-1">
										<uni-text>卡券号：{{item.couponCode}}</uni-text>
									</view>
								</uni-col>
								<uni-col :span='12'>
									<view class="order-sku u-ellipsis-1">
										<uni-text>卡券流水号：{{item.couponNo}}</uni-text>
									</view>
								</uni-col>
							</uni-row>
							<!-- 第三行 -->
							<uni-row>
								<uni-col :span='16'>
									<view class="order-sku u-ellipsis-1">
										<uni-text>激活时间：{{parseTime(item.activationDate)}}</uni-text>
									</view>
								</uni-col>
							</uni-row>
							<!-- 第四行 -->
							<uni-row>
								<uni-col :span='16'>
									<view class="order-sku u-ellipsis-1">
										<uni-text>过期时间：{{parseTime(item.endTime)}}</uni-text>
									</view>
								</uni-col>
							</uni-row>
							<!-- 第五行 -->
							<uni-row>
								<uni-col :span='12'>
									<view class="order-sku u-ellipsis-1">
										<uni-text>总兑换次数：{{item.specQty?item.specQty:'0'}}</uni-text>
									</view>
								</uni-col>
								<uni-col :span='12'>
									<view class="order-sku u-ellipsis-1">
										<uni-text>剩余兑换次数：{{item.surplusSpecQty?item.surplusSpecQty:'0'}}次</uni-text>
									</view>
								</uni-col>
							</uni-row>
							<!---->
							<uni-row style="margin-top:2rpx;">
								<uni-col :span='12' style="display: flex;align-items: center;">
									<view class="order-sku u-ellipsis-1" style="display: flex;align-items: center;">
										<uni-text>自动提现设置：</uni-text>
										<uni-tag :inverted="true" 
											:text=getString(item.autoExchangeDate) type="success" />
											<text style="margin-left: 10rpx;">天</text>
									</view>
								</uni-col>
									<uni-col :span='12'>
											<!-- <u-switch v-model="checked"></u-switch> -->
											<u-switch  v-model='item.isAutoExchange==1?true:false' @change="changeSwitch(productListIndex)"></u-switch>
									</uni-col>
							   </uni-row>
							<uni-row>
								<uni-col>
									<view class="order-sku u-ellipsis-1">
										<uni-text>自动兑换地址：{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.district }}{{ addressInfo.detail }}</uni-text>
									</view>
								</uni-col>
							</uni-row>
							<view class="bottom">
								<view   @click="gotoExchangePage(item)" class="evaluate btn">立即兑换</view>
								<view  @click="$yrouter.push({ path: '/pages/shop/GoodsCon/index2', query: { id: item.productId, couponCode: item.couponCode }})" class="evaluate btn">产品介绍</view>
							</view>
						</view>
					</view>
				</view>
				<Loading :loaded="loadend" :loading="loading"></Loading>
				<view class="noCommodity" style="background-color: #fff" v-if="productList.length == 0 && where.page > 1">
				  <view class="noPictrue">
				    <image :src="`${$VUE_APP_RESOURCES_URL}/images/noGood.png`" class="image" />
				  </view>
				</view>
				<Recommend v-if="productList.length == 0 && where.page > 1" :recommendLoading="recommendLoading" @changeRecommendLoading="changeRecommendLoading"></Recommend>
		  </scroll-view>
	  </view>
     <!--产品推荐-->
    <Recommend v-if="productList.length === 0 && where.page > 1" :recommendLoading="recommendLoading" @changeRecommendLoading="changeRecommendLoading"></Recommend>
  </view>
</template>
<script>
import Recommend from '@/components/Recommend'
// import { getCards as getProducts, getProductsIntegral } from '@/api/store'
import { getTotalCoupons,queryUserCoupons,queryInvalidUserCoupons,queryValidCoupons,getChanelAndProductInfo} from '@/api/coupon'
import Loading from '@/components/Loading'
import {parseTime} from '@/utils/index'

export default {
  name: 'GoodsList',
  components: {
    Recommend,
    Loading,
  },
  props: {},
  data: function() {
	
    const s = '',
      id = 0,
      title = ''
    return {
		addressInfo:{
			province:"",
			city:'',
			district:'',
			detail:''
		},//默认
		checked:true,
		openDict:{'0':'关闭','1':'开启'},
		statusDict:{'0':'未使用','1':'已使用', '2':'已过期','3':'已结束'},
		hostProduct: [],
		productList: [],
		Switch: true,
		orderType:'',//当前被选择的选项
	    chooseList:[
		  {type:0,title:'有效卡券'},
		  {type:1,title:'失效卡券'}
	  ],
      where: {
        page: 1,
        limit: 8,
		staus: 0,
        // keyword: s,
        // sid: id, //二级分类id
        // news: 0,
        // priceOrder: '',
        // salesOrder: '',
      },
	  items:[],//构造一个数组，用来储存当前的被switch data
      title: title && id ? title : '',
      loadTitle: '',
      loading: false,
      loadend: false,
      price: 0,
      stock: 0,
      nows: false,
	  currentPage: 1,
	  totalPage: 1,
      recommendLoading: false,
      target: false,
      isIntegral: false,
	  totalCoupons:{
	  	totalCoupon: 0,
	  	surplusSpecQty: 0
	  }
    }
  },
  watch: {
    title() {
      this.updateTitle()
    },
    isIntegral() {
      if (this.isIntegral) {
        uni.setNavigationBarTitle({
          title: '积分商品',
        })
      } else {
        uni.setNavigationBarTitle({
          title: '商品列表',
        })
      }
    },
	productList(data){
		if(data && data.length>0){
			data.forEach((item,index) => {
			        this.items[index] = "";//构造输入框的字段
			    });
		}
	},
    $yroute(to) {},
  },
  // mounted: function() {
  //   const { s = '', id = 0, title = '', isIntegral = false } = this.$yroute.query

  //   this.where.keyword = s
  //   this.where.isIntegral = isIntegral == 'true' ? 1 : 0
  //   this.isIntegral = isIntegral
  //   // this.updateTitle()
  //   this.getProductList()
  // },
  created() {
  	// 获取卡券状态总量
  	
  },
  onReachBottom() {
    this.recommendLoading = true
    !this.loading && this.getProductList()
  },
  onShow(){
	getTotalCoupons().then(res=>{
  		this.totalCoupons.totalCoupon = res.data.totalCoupon
  		this.totalCoupons.surplusSpecQty = res.data.surplusSpecQty
  	})
	  queryValidCoupons().then(res=>{

		  this.productList = res.data.content
		  this.addressInfo=res.data.yxUserAddress
		  console.log(this.addressInfo)
	  }),
	  // 获取卡券状态总量
	  getTotalCoupons().then(res=>{
	  	this.totalCoupons.totalCoupon = res.data.totalCoupon
	  	this.totalCoupons.surplusSpecQty = res.data.surplusSpecQty
	  })
	  // const { s = '', id = 0, title = '', isIntegral = false } = this.$yroute.query
	  
	  // this.where.keyword = s
	  // // this.where.isIntegral = isIntegral == 'true' ? 1 : 0
	  // this.isIntegral = isIntegral
	  // // this.updateTitle()
	  
	  // this.where.page = 1
	  // this.getProductList()
  },
  onHide() {},
  methods: {
	  parseTime,
    changeRecommendLoading(recommendLoading) {
      this.recommendLoading = recommendLoading
    },
	
	gotoExchangePage(item){
		//首先判断是否为失效的卡券
		var currentState=this.getStatus(item);
		if(currentState=='已结束'||currentState=='已过期'){
			console.log("失效");
			console.log(item);
			//弹出失效的信息的提醒
			 getChanelAndProductInfo(item.channelId,item.productId).then(res=>{
				 console.log(res);
				 if(res.data.status=='1'){//如果不是买断,则直接跳出信息提示
				 let that=this;
					 uni.showModal({
					 	title:'提示',
					 	content:"对不起,您的卡券已失效,\n"+
						        "请联系原来渠道进行购买",
						
					 })
				 }
				 if(res.data.status=='0'){
					  let that=this;
					 uni.showModal({
					 	title:'提示',
					 	content:'对不起,您的卡券已失效,\n'+
					 						        '您可以点击继续购买卡券',
					    confirmText:'购买此券',
						success:(response)=>{
							if(response.confirm){
								that.successResult(res.data.link);
							}
						}
					 })
				 }
			 })
			
			return;
		}
		this.$yrouter.push({ path: '/pages/order/GoodExchange/index', query: { couponCode: item.couponCode }})
	},
	//	statusDict:{'0':'未使用','1':'已使用', '2':'已过期','3':'已结束'},
	getStatus(data){
		if(data.status==0 && data.state!=3){
			return "未使用";
		}
		if(data.state==3){
			return  "已结束";
		}
		if(data.status==1){
			return "已使用";
		}
		if(data.status==2){
			return "已过期";
		}
	},
	successResult(link){
		uni.navigateTo({
			url:'/pages/shop/GoodsList/common?url='+link
		})
	},
	changeSwitch(idx){
		console.log(idx)
		this.productList.map((el,index)=>{
			if(index==idx){
				if (el.isAutoExchange==1) {
					el.isAutoExchange=0
				} else{
					el.isAutoExchange=1
				}
			}
			return el
		})
	  
	},
	// 加载更多
	loadMore() {
		if (this.currentPage < this.lastPage) {
			this.currentPage += 1;
			this.getProductList();
		}
	},
	getString(data){
		return data+'';
	},
    goGoodsCon(item) {
      this.$yrouter.push({
        path: '/pages/shop/GoodsCon/index',
        query: {
          id: item.id,
          isIntegral: this.isIntegral,
        },
      })
    },
    goIntegralGoodsCon(item) {
      this.$yrouter.push({
        path: '/pages/shop/IntegralGoodsCon/index',
        query: {
          id: item.id,
          isIntegral: this.isIntegral,
        },
      })
    },
    updateTitle() {
      uni.setNavigationBarTitle({
        title: this.title,
      })
    },
    getProductList() {
      if (this.loading) {
        return
      }
      this.loading = true
      var that = this

      let q = this.where
	  console.log("this.where.status="+this.where.status)
      let getData = this.where.status != 1 ? queryValidCoupons : queryInvalidUserCoupons
      getData(q).then(res => {
        this.loading = false
        this.productList = res.data.content
		if(res.data.yxUserAddress){//设置地址值 
			this.addressInfo=res.data.yxUserAddress
			console.log('后台返回的地址为')
			console.log(this.addressInfo)
		}
		console.log(res.data.totalElements)
		console.log(res.data.content)
		this.where.limit = res.data.totalElements;
        this.loadend = res.data.length < this.where.limit //判断所有数据是否加载完成；
        this.where.page = this.where.page + 1
      })
    },
    submitForm: function() {
      this.$set(this, 'productList', [])
      this.where.page = 0
      this.loadend = false
      this.loading = false
      this.getProductList()
    },
    //点击事件处理
    set_where: function(index) {
		console.log('点击 index'+index)
      const { s = '', id = 0, title = '', isIntegral = false } = this.$yroute.query

      let that = this
	  this.orderType=index
      switch (index) {
        case 0:
          this.where.status = 0//有效
          break
        case 1:
          this.where.status = 1//无效
          break
        default:
          break
      }
	  this.currentPage = 1
	  this.totalPage = 1;
	  console.log('orderType'+this.orderType)
      this.productList = []
      that.$set(that, 'productList', [])
      that.where.page = 0
      that.target = true
      that.loadend = false
      that.getProductList()
    },
    //设置where条件
    setWhere() {
      if (this.price === 0) {
        this.where.priceOrder = ''
      } else if (this.price === 1) {
        this.where.priceOrder = 'asc'
      } else if (this.price === 2) {
        this.where.priceOrder = 'desc'
      }
      if (this.stock === 0) {
        this.where.salesOrder = ''
      } else if (this.stock === 1) {
        this.where.salesOrder = 'asc'
      } else if (this.stock === 2) {
        this.where.salesOrder = 'desc'
      }
      this.where.news = this.nows ? '1' : '0'
    },
    switchTap() {
      this.Switch = !this.Switch
    },
  },
}
</script>
<style lang='scss'>
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
			border-bottom: 1rpx solid #dfdfdf;
	
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
					margin-bottom: 20rpx;
					margin-left: 16rpx;
	
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
	.goods-box {
		position: relative;
		.goods__tag {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 5;
			.tag-img {
				width: 60rpx;
			}
		}
		.goods_img{
			width: 220rpx;
			height: 220rpx;
			border-radius: 6rpx;
		}
		.goods-title {
			font-size: 28rpx;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
			width: 450rpx;
			line-height: 40rpx;
		}
	
		.describe-text {
			font-size: 24rpx;
			width: 450rpx;
			color: #a8700d;
		}
	
		.price {
			color: #fa3534;
			font-weight: 600;
			&::before {
				content: '￥';
				font-size: 20rpx;
			}
		}
		.origin-price {
			color: #c8c9cc;
			font-size: 24rpx;
			text-decoration: line-through;
			&::before {
				content: '￥';
				font-size: 20rpx;
			}
		}
	}
</style>
<style scoped lang="less">
.noCommodity {
  border-top: 3px solid #f5f5f5;
  padding-bottom: 1px;
}

</style>
