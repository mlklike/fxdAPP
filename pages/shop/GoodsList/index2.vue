<template>
  <view class="productList" ref="container" style="font-size: 24rpx;">
	  <view style="height: 250rpx;">
		  <view style="position: fixed;">
			<view style="font-size: 30rpx;padding: 30rpx;background-color: white; width: 750rpx;border-bottom: 1px dashed #eee;">
			有效卡券张数：{{totalCoupons.totalCoupon}}张<br/>
			剩余总兑换次数：{{totalCoupons.surplusSpecQty}}次<br/>
			</view>
			<view class="nav acea-row row-middle" style="font-size: 36rpx;">
			  <view class="item" :class="title ? 'font-color-red' : ''" @click="set_where(0)">有效卡券</view>
			  <view class="item" :class="nows ? 'font-color-red' : ''" @click="set_where(1)">失效卡券</view>
			</view>
		</view>
		  
	  </view>
	
	<view class="list acea-row row-between-wrapper" :class="Switch === true ? '' : 'on'" ref="container" v-if="!isIntegral">
		<view v-for="(item, productListIndex) in productList" :key="productListIndex" :title="item.storeName" style="width: 100%;">
			<view class="item" style="width: 100%; padding: 10rpx; font-size: 26rpx;">
				<view class="acea-row row-between-wrapper" style="border-bottom: 1px dashed #eee;padding:10rpx 0;font-size: 30rpx;">
					<text>卡券{{productListIndex+1}}</text>
					<text>状态：{{statusDict[item.status]}}</text>
				</view>
				<view>卡券名称：{{item.couponTitle}}</view>
				<view class="acea-row row-between-wrapper">
					<text>卡券号：{{item.couponCode}}</text>
					<text>卡券流水号：{{item.couponNo}}</text>
				</view>
				<view></view>
				<view class="acea-row row-between-wrapper">
					<text>激活时间：{{parseTime(item.activationDate)}}</text>
					<!-- <text>剩余有效时间：{{item.endTime}}天</text>					 -->
					<text>过期时间：{{parseTime(item.endTime)}}</text>				
				</view>
				<view class="acea-row row-between-wrapper">
					<text>总兑换次数：{{item.specQty?item.specQty:'0'}}</text>
					<text>剩余兑换次数：{{item.surplusSpecQty?item.surplusSpecQty:'0'}}次</text>
				</view>
				<view class="acea-row row-between-wrapper">
					<text>自动提现设置：{{item.autoExchangeDate?item.autoExchangeDate:'10'}}天</text>
					<button type="default" style="width: 100rpx; display: inline-block;padding: 0 !important;margin: 0!important;">{{openDict[item.isAutoExchange]}}</button>
				</view>
				<view>自动兑换地址：{{item.couponCode}}</view>
				<button type="default" @click="" style="width: 50%;display: inline-block;">立即兑换</button>
				<button type="default" @click="$yrouter.push({ path: '/pages/shop/GoodsCon/index', query: { id: 12 }})" style="width: 50%;display: inline-block;">产品介绍</button>
			</view>
		</view>

	</view>

   
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <view class="noCommodity" style="background-color: #fff" v-if="productList.length === 0 && where.page > 1">
      <view class="noPictrue">
        <image :src="`${$VUE_APP_RESOURCES_URL}/images/noGood.png`" class="image" />
      </view>
    </view>
    <Recommend v-if="productList.length === 0 && where.page > 1" :recommendLoading="recommendLoading" @changeRecommendLoading="changeRecommendLoading"></Recommend>
  </view>
</template>
<script>
import Recommend from '@/components/Recommend'
// import { getCards as getProducts, getProductsIntegral } from '@/api/store'
import { getTotalCoupons,queryUserCoupons,queryInvalidUserCoupons} from '@/api/coupon'
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
	  openDict:{'0':'关闭','1':'开启'},
	  statusDict:{'0':'未使用','1':'已使用', '2':'已过期'},
      hostProduct: [],
      productList: [],
      Switch: true,
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
      title: title && id ? title : '',
      loadTitle: '',
      loading: false,
      loadend: false,
      price: 0,
      stock: 0,
      nows: false,
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
  	getTotalCoupons().then(res=>{
  		this.totalCoupons.totalCoupon = res.data.totalCoupon
  		this.totalCoupons.surplusSpecQty = res.data.surplusSpecQty
  	})
  },
  onReachBottom() {
    this.recommendLoading = true
    !this.loading && this.getProductList()
  },
  onShow(){
	  queryUserCoupons().then(res=>{
		  this.productList = res.data.content
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
      // this.setWhere()
      // const { s = '', id = 0, title = '' } = this.$yroute.query
      // if (s !== this.where.keyword || id !== this.where.sid) {
      //   this.loadend = false
      //   this.loading = false
      //   this.where.page = 1
      //   // this.where.sid = id
      //   this.title = title && id ? title : ''
      //   this.nows = false
      //   this.$set(this, 'productList', [])
      //   this.price = 0
      //   this.stock = 0
      //   // this.getProductList();
      // }
      let q = this.where
	  console.log("this.where.status="+this.where.status)
      let getData = this.where.status !== 1 ? queryUserCoupons : queryInvalidUserCoupons
      getData(q).then(res => {
        this.loading = false
        this.productList = res.data.content
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
      const { s = '', id = 0, title = '', isIntegral = false } = this.$yroute.query

      let that = this
      switch (index) {
        case 0:
          this.where.status = 0
          break
        case 1:
          this.where.status = 1
          break
        default:
          break
      }
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
<style scoped lang="less">
.noCommodity {
  border-top: 3px solid #f5f5f5;
  padding-bottom: 1px;
}
.productList .list {
  padding: 0 20rpx;
  margin-top: 0rpx;
}
.productList .list .item {
  width: 710rpx;
  margin-top: 20rpx;
  background-color: #fff;
  -webkit-border-radius: 10rpx;
          border-radius: 10rpx;
}
</style>
