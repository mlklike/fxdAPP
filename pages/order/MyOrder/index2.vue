<template>
	
  <view class="my-order" ref="container">
	  	
    <view class="header bg-color-red">
      <view class="picTxt acea-row row-between-wrapper">
        <view class="text">
          <view class="name">订单信息</view>
          <view>累计订单：{{ orderData.orderCount || 0 }} 总消费：￥{{ orderData.sumPrice || 0 }}</view>
        </view>
      </view>
    </view>
    <view class="nav acea-row row-around">
      <view class="item" :class="{ on: type === 1 }" @click="changeType(1)">
        <view>待发货</view>
        <view class="num">{{ orderData.unshippedCount || 0 }}</view>
      </view>
      <view class="item" :class="{ on: type === 2 }" @click="changeType(2)">
        <view>已发货</view>
        <view class="num">{{ orderData.receivedCount || 0 }}</view>
      </view>
      <view class="item" :class="{ on: type === 4 }" @click="changeType(4)">
        <view>已完成</view>
        <view class="num">{{ orderData.completeCount || 0 }}</view>
      </view>
	  <view class="item" :class="{ on: type === 4 }" @click="changeType(4)">
	    <view>售后反馈</view>
	    <view class="num">{{ orderData.completeCount || 0 }}</view>
	  </view>
    </view>
    <view class="list">
      <view class="item" v-for="(order, orderListIndex) in orderList" :key="orderListIndex">
        <view class="title acea-row row-between-wrapper">
          <view class="acea-row row-middle">
            <span class="sign cart-color acea-row row-center-wrapper" v-if="order.combinationId > 0">拼团</span>
            <span class="sign cart-color acea-row row-center-wrapper" v-if="order.seckillId > 0">秒杀</span>
            <span class="sign cart-color acea-row row-center-wrapper" v-if="order.bargainId > 0">砍价</span>
            <span class="sign cart-color acea-row row-center-wrapper" v-if="order.storeId > 0">门店</span>
            订单号:{{ order.orderId }}
          </view>
          <view class="font-color-red">{{ getStatus(order) }}</view>
        </view>
        <view class="item-info acea-row row-between row-top" v-for="(cart, cartInfoIndex) in order.cartInfo" :key="cartInfoIndex">
          <view class="pictrue">
            <image :src="order.image" @click.stop="$yrouter.push({ path: '/pages/shop/GoodsCon/index', query: { id: order.productId } })" />
          </view>
          <view class="text acea-row row-between">
            <view class="name line2">{{ order.createDate }}</view>
            <view class="money">
              <view>卡劵编号: {{ order.storeCouponNo }}</view>
			  <view>卡劵流水: {{ order.couponNo }}</view>
			  <view>卡劵标题: {{ order.productName }}</view>
			  <view>产品规格: {{ order.specTypeDec }}</view>
			  <view>产品净含量: {{ order.netQty }}</view>
              <view>本次兑换数量: {{ order.qty }}</view>
			  <view>快递信息: {{ order.deliverySn }} - {{ order.deliveryId }}</view>
            </view>
          </view>
        </view>
        <view class="bottom acea-row row-right row-middle">
          <template v-if="order._status._type == 0">
            <view class="bnt cancelBnt" @click="cancelOrder(order)">取消订单</view>
            <view class="bnt bg-color-red" @click="goOrderDetails(order)">立即付款</view>
          </template>
          <template v-if="order._status._type == 1 || order._status._type == 9">
            <view class="bnt bg-color-red" @click="goOrderDetails(order)">查看详情</view>
          </template>
          <template v-if="order._status._type == 2">
            <view class="bnt default" @click="goLogistics(order)">查看物流</view>
            <view class="bnt bg-color-red" @click="takeOrder(order)">确认收货</view>
          </template>
          <template v-if="order._status._type == 3">
            <!--<view-->
            <!--class="bnt default"-->
            <!--@click="-->
            <!--$yrouter.push({ path: '/pages/order/Logistics/index',query:{id:order.orderId}})-->
            <!--"-->
            <!--v-if="order.deliveryType == 'express'"-->
            <!--&gt;-->
            <!--查看物流-->
            <!--</view>-->
            <view class="bnt bg-color-red" @click="goOrderDetails(order)">去评价</view>
          </template>
          <template v-if="order._status._type === 4">
            <view class="bnt bg-color-red" @click="goOrderDetails(order)">查看订单</view>
          </template>
        </view>
      </view>
    </view>
    <view class="noCart" v-if="orderList.length === 0 && page > 1">
      <view class="pictrue">
        <image :src="`${$VUE_APP_RESOURCES_URL}/images/noOrder.png`" />
      </view>
    </view>
    <Loading :loaded="loaded" :loading="loading"></Loading>
    <Payment v-model="pay" :types="payType" @checked="toPay" :balance="userInfo.nowMoney"></Payment>
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
                //1         2        4         4
const STATUS = ['待发货', '待收货', '已完成', '售后反馈', '', '', '', '待付款']

const NAME = 'MyOrder'

export default {
  name: NAME,
  data() {
    return {
      offlinePayStatus: 2,
      orderData: {},
      type: '',
      page: 1,
      limit: 20,
      loaded: false,
      loading: false,
      orderList: [],
      pay: false,
      payType: ['yue', 'weixin'],
      from: this.$deviceType,
    }
  },
  components: {
    Loading,
    Payment,
    DataFormat,
  },
  computed: mapGetters(['userInfo']),
  onShow: function() {
    // console.log(uni.getStorageSync('orderType'))
	const type = uni.getStorageSync('orderType');
	this.type = parseInt(type) || 0
	
    // this.type = parseInt(this.$yroute.query.type) || 0
    this.changeType(this.type)
    this.getOrderData()
    this.getOrderList()
  },
  onHide: function() {
    this.orderList = []
    this.page = 1
    this.limit = 20
    this.loaded = false
    this.loading = false
  },
  methods: {
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
      this.changeType(this.type)
    },
    changeType(type) {
	  uni.setStorageSync('orderType',type);
      this.type = type
      this.orderList = []
      this.page = 1
      this.loaded = false
      this.loading = false
      this.getOrderList()
    },
    getOrderList() {
      if (this.loading || this.loaded) return
      this.loading = true
      const { page, limit, type } = this
      getOrderList({
        page,
        limit,
        type,
      }).then(res => {
        this.orderList = this.orderList.concat(res.data)
        this.page++
        this.loaded = res.data.length < this.limit
        this.loading = false
      })
    },
    getStatus(order) {
      return STATUS[order._status._type]
    },
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
