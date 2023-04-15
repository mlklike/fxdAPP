<template>
	<view class="page_box my-order">
		<view class="header bg-color-red">
		  <view class="picTxt acea-row row-between-wrapper">
		    <view class="text">
		      <view class="name">订单信息</view>
		      <view>累计订单：{{ orderData.orderCount || 0 }} 总消费：￥{{ orderData.sumPrice || 0 }}</view>
		    </view>
		  </view>
		</view>
		<view class="head_box">
			<!-- tab -->
			<view class="order-nav u-flex">
				<view class="nav-item u-flex-col u-flex-1 u-col-center" v-for="nav in orderState" :key="nav.id"
					@tap="changeType(nav.type)">
					<view class="item-title">{{ nav.title }}</view>
					<text class="nav-line" :class="{ 'line-active': orderType === nav.type }"></text>
				</view>
			</view>
		</view>
		
		<!-- 订单内容 -->
		<view class="content_box">
			<scroll-view scroll-y="true" enable-back-to-top @scrolltolower="loadMore" class="scroll-box scroll1">
				<!-- 订单编号 -->
				<view class="order-list" v-for="(order, orderIndex) in orderList" :key="orderIndex">
					<view class="order-head u-flex u-row-between" @tap.stop="jump('/pages/order/OrderDetails/index', { id: order.orderId })">
						<text class="no">订单号：{{ order.orderId }}</text>
						<text class="state">{{  getStatus(order) }}</text>
					</view>
				<!-- 订单里的商品信息 -->
					<view class="goods-order" v-for="(cart, cartInfoIndex) in order.cartInfo" :key="cartInfoIndex">
						<view class="order-content">
							<shopro-mini-card :title="order.productName" :image="order.image">
								<template #describe>
									<view class="order-sku u-ellipsis-1">
										<uni-text class="order-num">卡号:&nbsp;{{ order.storeCouponNo}}</uni-text>
									</view>
									<view class="order-sku u-ellipsis-1">
										<uni-text class="order-num">流水:&nbsp;{{ order.couponNo}}</uni-text>
									</view>
									<view class="order-sku u-ellipsis-1">
										<uni-text class="order-num">标题:&nbsp;{{ order.productName}}</uni-text>
									</view>
									<view class="order-sku u-ellipsis-1">
										<uni-text class="order-num">规格:&nbsp;{{ order.specTypeDec}}</uni-text>
									</view>
									<view class="order-sku u-ellipsis-1">
										<uni-text class="order-num">净含量:&nbsp;{{ order.netQty}}</uni-text>
									</view>
									<view v-if="getStatus(order)!='待发货'" class="order-sku u-ellipsis-1">
										<uni-text class="order-num">{{order.deliverySn}},{{ order.deliveryId}}</uni-text>
									</view>
								</template>
								<template #rightQty>
									<view class="order-sku u-ellipsis-1;" style="margin-left: -10rpx;">
										<uni-text class="">X{{ order.qty}}</uni-text>
									</view>
								</template>
					
							</shopro-mini-card>
						</view>
					</view>
		
							<view class="bottom">
								<view v-if="getStatus(order)=='已完成'" @click="goOrderDetails(order)" class="evaluate btn">订单详情</view>
								<view v-if="getStatus(order)=='已完成'" @click="goOrderReturn(order)" class="evaluate btn">售后反馈</view>
								
								<view v-if="getStatus(order)=='待发货'" @click="goOrderDetails(order)" class="evaluate btn">订单详情</view>
<!-- 								<view v-if="getStatus(order)=='待发货'" @click="cancelOrder(order)" class="evaluate btn">取消订单</view>
 -->								
								<view v-if="getStatus(order)=='已发货'" @click="goOrderDetails(order)" class="evaluate btn">订单详情</view>
								<view v-if="getStatus(order)=='已发货'" @click="takeOrder(order)" class="evaluate btn">确认收货</view>
								
								<view v-if="getStatus(order)=='售后反馈'" @click="goOrderDetails(order)" class="evaluate btn">订单详情</view>
								<view v-if="getStatus(order)=='售后反馈'" @click="goOrderReturnRecord(order)" class="evaluate btn">售后记录</view>
							</view>
				</view>
				<u-loadmore v-show="orderList.length" height="120rpx" :status="loadStatus" icon-type="flower"
					color="#ccc" />
				
			</scroll-view>
		</view>
	</view>	
	
</template>
<script>
import { getOrderData, getOrderList } from '@/api/order'
import { cancelOrderHandle, payOrderHandle, takeOrderHandle } from '@/libs/order'
import Loading from '@/components/Loading'
import Payment from '@/components/Payment'
import DataFormat from '@/components/DataFormat'
import { mapGetters } from 'vuex'
import { isWeixin, dataFormat } from '@/utils'
import{ShoproMiniCard} from '@/components/shopro-mini-card/shopro-mini-card'
	//			   1          2         4         3
const STATUS = ['未支付','待发货', '已发货', '待评价', '已完成', '', '', '', '待付款']

const NAME = 'MyOrder'

export default {
  name: NAME,
  components:{
	  ShoproMiniCard
  },
  data() {
    return {
		orderType:'1',//订单类型
		loadStatus: 'loadmore', //loadmore-加载前的状态，loading-加载中的状态，nomore-没有更多的状态
		currentPage: 1,
		totalPage: 1,
		orderState: [
			{
				id: 1,
				title: '待发货',
				type: '1'
			},
			{
				id: 2,
				title: '已发货',
				type: '2'
			},
			{
				id: 4,
				title: '已完成',
				type: '4'
			},
			{
				id: -1,
				title: '售后反馈',
				type: '-1'
			}
		],
      offlinePayStatus: 2,
      orderData: {},
      type: '',
      page: 1,
      limit: 20,
      orderList: [],
      pay: false,
      payType: ['yue', 'weixin'],
      from: this.$deviceType,
    }
  },
  components: {
    Payment,
    DataFormat,
  },
  computed: mapGetters(['userInfo']),
  onShow: function() {
    // console.log(uni.getStorageSync('orderType'))
	const type = uni.getStorageSync('orderType');
	this.type = parseInt(type) || 1
	
    // this.type = parseInt(this.$yroute.query.type) || 0
    this.changeType(this.type)
    this.getOrderData()
    this.getOrderList()
  },
  onHide: function() {
    this.orderList = []
    this.currentPage = 1
    this.limit = 20
  },
  methods: {
	  /**
	   * @param {Object} order售后记录
	   */
	  goOrderReturnRecord(order){
		this.$yrouter.push({
		  path: '/pages/shop/OrderReturn/OrderReturnApply/OrderReturnRecord',
		  query: { id: order.orderId,id2:order.id},
		})  
	  },
	  /**
	   * 售后反馈
	   */
	  goOrderReturn(order){
		  this.$yrouter.push({
		    path: '/pages/shop/OrderReturn/OrderReturnApply/OrderReturnApply',
		    query: { id: order.orderId },
		  })
	  },
	  /* 路由界面跳转*/
	  jump(path, parmas) {
	  	this.$yrouter.push({
	  		path: path,
	  		query: parmas
	  	});
	  },
	  // 加载更多
	  loadMore() {
	  	if (this.currentPage < this.totalPage) {
	  		this.currentPage += 1;
	  		this.getOrderList();
	  	}
	  },
    goLogistics(order) {
      this.$yrouter.push({
        path: '/pages/order/Logistics/index',
        query: { id: order.orderId },
      })
    },
    goOrderDetails(order) {
      this.$yrouter.push({
        path: '/pages/order/OrderDetails/index',
        query: { id: order.orderId },
      })
    },
    dataFormat,
    setOfflinePayStatus: function(status) {
      var that = this
      that.offlinePayStatus = status
      if (status === 1) {
        if (that.payType.indexOf('offline') < 0) {
          that.payType.push('offline')
        }
      }
    },
    getOrderData() {
      getOrderData().then(res => {
        this.orderData = res.data
      })
    },
    takeOrder(order) {
      takeOrderHandle(order.orderId).finally(() => {
        this.reload()
        this.getOrderData()
      })
    },
    reload() {
      this.changeType1(this.type)
    },
	/**
	 * @param {Object} id
	 * 点击按钮切换订单类型
	 */
    changeType(id) {
		
	 if (this.orderType !== id) {	
		  uni.setStorageSync('orderType',id);
		  this.orderType=id
		  this.type = id
		  this.orderList = []
		  this.currentPage = 1
		  this.totalPage = 1;
		  this.getOrderList()
	  }
    },
	changeType1(id) {
	  uni.setStorageSync('orderType',id);
	  this.orderType=id
	  this.type = id
	  this.orderList = []
	  this.currentPage = 1
	  this.totalPage = 1;
	  this.getOrderList()
	},
	/* 获取订单列表 */
    getOrderList() {
	  this.loadStatus = 'loading';
      const { currentPage, limit, type } = this
      getOrderList({
        currentPage,
        limit,
        type,
      }).then(res => {
        this.orderList = this.orderList.concat(res.data);//合并订单
        this.currentPage++
		this.totalPage=res.totalPage
		this.loadStatus = this.currentPage < res.totalPage ? 'loadmore' : 'nomore';
      })
    },
	/* 获取订单状态 */
    getStatus(order) {
		if(order._status._type==-1){
			return '售后反馈';
		}
      return STATUS[order._status._type]
    },
	/* 取消订单 */
    cancelOrder(order) {
      cancelOrderHandle(order.orderId)
        .then(() => {
          this.getOrderData()
          this.orderList.splice(this.orderList.indexOf(order), 1)
        })
        .catch(() => {
          this.reload()
        })
    },
    paymentTap: function(order) {
      var that = this
      if (!(order.combinationId > 0 || order.bargainId > 0 || order.seckillId > 0)) {
        that.setOfflinePayStatus(order.offlinePayStatus)
      }
      this.pay = true
      this.toPay = type => {
        payOrderHandle(order.orderId, type, that.from)
          .then(() => {
            const type = parseInt(this.$yroute.query.type) || 0
            that.changeType(type)
            that.getOrderData()
          })
          .catch(() => {
            const type = parseInt(that.$yroute.query.type) || 0
            that.changeType(type)
            that.getOrderData()
          })
      }
    },
    toPay() {},
  },
  mounted() {
	console.log("mounted")
  },
  onReachBottom() {
    !this.loading && this.getOrderList()
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
<style scoped lang="less">
.noCart {
  margin-top: 0.17 * 100rpx;
  padding-top: 0.1 * 100rpx;
}

.noCart .pictrue {
  width: 4 * 100rpx;
  height: 3 * 100rpx;
  overflow: hidden;
  margin: 0.7 * 100rpx auto 0.5 * 100rpx auto;
}

.noCart .pictrue image {
  width: 4 * 100rpx;
  height: 3 * 100rpx;
}
</style>
