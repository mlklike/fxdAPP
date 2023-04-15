<template>
  <view class="order-details">
    <!-- 给header上与data上加on为退款订单-->
    <view class="header bg-color-red acea-row row-middle" :class="refundOrder ? 'on' : ''">
      <view class="data" :class="refundOrder ? 'on' : ''">
        <!-- <view class="state">{{ orderInfo._status._msg }}</view> -->
		<view class='state'>订单详情</view>
        <view>{{ orderInfo.createTime ||  '' }}</view>
      </view>
    </view>
    <template >

      <view class="address">
		<view style="color: red;font-size:28rpx;line-height: 50rpx;">收件人信息</view>
		<view style="border-bottom: 1rpx solid #dfdfdf;"></view>
        <view class="name" style="margin-top: 15rpx;">
          {{ orderInfo.realName }}
          <text class="phone">{{ orderInfo.userPhone }}</text>
          <text
			  @click="telPhone(orderInfo.userPhone)"
			  class="iconfont icon-tonghua font-color-red"
		  ></text>
        </view>
        <view>{{ orderInfo.userAddress }}</view>
      </view>
    </template>
    <view style="background: #fff;margin-top: 15rpx;font-size: 28rpx;line-height: 50rpx;">
		<view style="margin-left: 25rpx;">卡券/商品信息</view>
		<view style="border-bottom: 1px solid #dfdfdf;margin-left: 25rpx;margin-right: 25rpx;"></view>
	    <view class="order-list">
		<!-- 订单里的商品信息 -->
			<view class="goods-order">
				<view class="order-content">
					<shopro-mini-card :title="orderInfo.productName" :image="orderInfo.image">
						<template #describe>
							<view class="order-sku u-ellipsis-1">
								<uni-text class="order-num">卡号:&nbsp;{{ orderInfo.storeCouponNo}}</uni-text>
							</view>
							<view class="order-sku u-ellipsis-1">
								<uni-text class="order-num">流水:&nbsp;{{ orderInfo.couponNo}}</uni-text>
							</view>
							<view class="order-sku u-ellipsis-1">
								<uni-text class="order-num">标题:&nbsp;{{ orderInfo.productName}}</uni-text>
							</view>
							<view class="order-sku u-ellipsis-1">
								<uni-text class="order-num">规格:&nbsp;{{ orderInfo.specTypeDec}}</uni-text>
							</view>
							<view class="order-sku u-ellipsis-1">
								<uni-text class="order-num">净含量:&nbsp;{{ orderInfo.netQty}}</uni-text>
							</view>
							<view class="order-sku u-ellipsis-1">
								<uni-text class="order-num">兑换数量:&nbsp;{{ orderInfo.qty}}</uni-text>
							</view>
						
						</template>
					<!-- 	<template #rightQty>
							<view class="order-sku u-ellipsis-1;" style="margin-left: -10rpx;">
								<uni-text class="">X{{ orderInfo.qty}}</uni-text>
							</view>
						</template> -->
			
					</shopro-mini-card>
				</view>
			</view>

					</view>
	</view>
	<view style="margin-top: 15rpx;">
		<view style="background:#FFF;font-size: 28rpx;line-height: 50rpx;margin-top: 15rpx;">
			<text style="margin-left: 25rpx;">留言:</text></view>
		<view class="u-demo-block__content">
			
			<u--textarea
				v-model="orderInfo.mark"
				placeholder="请输入内容"
				count
			></u--textarea>
		</view>
	</view>
    <view class="wrapper">
      <view class="item acea-row row-between">
        <view>订单编号：</view>
        <view class="conter acea-row row-middle row-right">
          {{ orderInfo.orderId || '' }}
          <!-- #ifndef H5 -->
		  <text class="copy copy-data" @click="copyClipboard(orderInfo.orderId)">复制</text>
		  <!-- #endif -->
        </view>
      </view>
      <view class="item acea-row row-between">
        <view>下单时间：</view>
        <view class="conter">{{ orderInfo.createTime || '' }}</view>
      </view>
      <view class="item acea-row row-between">
        <view>快递公司：</view>
        <view class="conter">{{ orderInfo.deliveryName || '' }}</view>
      </view>
      <view class="item acea-row row-between">
        <view>快递单号：</view>
        <view class="conter">{{ orderInfo.deliveryId}}</view>
      </view>
	  <view class="item acea-row row-between">
	    <view>物流信息：</view>
		<view><button size="mini"
		  @click="$yrouter.push({ path: '/pages/order/Logistics/index' ,query:{id:orderInfo.orderId }})">查看物流</button></view>
		
	  </view>
    </view>

<!--    <view>
      <view class="wrapper" v-if="orderInfo.deliveryType === 'express'">
        <view class="item acea-row row-between">
          <view>配送方式：</view>
          <view class="conter">发货</view>
        </view>
        <view class="item acea-row row-between">
          <view>快递公司：</view>
          <view class="conter">{{ orderInfo.deliveryName || "" }}</view>
        </view>
        <view class="item acea-row row-between">
          <view>快递号：</view>
          <view class="conter">{{ orderInfo.deliveryId || "" }}</view>
        </view>
      </view>
    </view> -->

    <view style="height:100rpx;" v-if="!refundOrder && offlineStatus"></view>
    <view class="footer acea-row row-between-wrapper" >
		<view class="item" @click="goToPerson()">  
		  <view style="text-align: center;"><image style="width: 24px;height:24px;" src="../../../static/icon-user.png"></view>
		  <text>个人中心</text>
		</view>
		<view class="item" @click="gotoKefu()">
		   <view style="text-align: center;"><image style="width: 24px;height:24px;" src="../../../static/icon-class.png"></view>
		  <text>联系客服</text>
		</view>
      <template v-if="orderInfo.shippingType == 1 && status.type == 3 && orderInfo.deliveryType == 'express'">
        <view class="bnt default"
          @click="$yrouter.push({ path: '/pages/order/Logistics/index' ,query:{id:orderInfo.orderId }})">查看物流</view>
      </template>

    </view>
    <Payment
		v-model="pay"
		:types="payType"
		@checked="toPay"
		:balance="userInfo.nowMoney"
	></Payment>
    <view class="geoPage" v-if="mapShow">
      <iframe
		width="100%"
		height="100%"
		frameborder="0"
		scrolling="no"
		:src="'https://apis.map.qq.com/uri/v1/geocoder?coord=' + system_store.latitude + ',' +system_store.longitude +'&referer=' +mapKey"
		></iframe>
    </view>
	<u-loadmore  height="50rpx" :status="loadStatus" icon-type="flower"
		color="#ccc" />
  </view>
</template>

<script>
  import OrderGoods from "@/components/OrderGoods";
  import{ShoproMiniCard} from '@/components/shopro-mini-card/shopro-mini-card'
  import {
    orderDetail
  } from "@/api/order";
  import Payment from "@/components/Payment";
  import {
    isWeixin,
    copyClipboard
  } from "@/utils";
  import {
    mapGetters
  } from "vuex";
  import {
    cancelOrderHandle,
    takeOrderHandle,
    delOrderHandle,
    payOrderHandle,
  } from "@/libs/order";
  // import { wechatEvevt } from "@/libs/wechat";

  const NAME = "OrderDetails";

  export default {
    name: NAME,
    components: {
      OrderGoods,
      Payment,
	  ShoproMiniCard
    },
    data: function () {
      return {
		loadStatus:'nomore',
        offlinePayStatus: 2,
        orderTypeNameStatus: true,
        offlineStatus: true,
        id: "",
        orderInfo: {
          _status: {},
        },
        status: {},
        pay: false,
        payType: ["yue", "weixin"],
        from: this.$deviceType,
        system_store: {},
        mapKay: "",
        mapShow: false,
        isIntegral: false
      };
    },
    computed: {
      refundOrder() {
        return this.orderInfo.refund_status > 0;
      },
      ...mapGetters(["userInfo"]),
    },
    onShow() {
      this.id = this.$yroute.query.id;
      this.getDetail();
    },
    mounted: function () {
      this.id = this.$yroute.query.id;
      // this.getDetail();
    },
    methods: {
      copyClipboard,
	  
	  /**
	   * 联系客服
	   */
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
      /*  this.$yrouter.push({
          path: "/pages/order/GoodsReturn/index",
          query: {
            id: orderInfo.orderId,
          },
        }); */
      },
      goGroupRule(orderInfo) {
        this.$yrouter.push({
          path: "/pages/activity/GroupRule/index",
          query: {
            id: orderInfo.pinkId,
          },
        });
      },
      //拨打电话
      telPhone(phoneNumber) {
        uni.makePhoneCall({
          phoneNumber: phoneNumber,
          fail() {
            console.log("取消拨打");
          }
        });
      },
      showChang: function (data) {
        // 这里判断是不是微信小程序
        this.$yrouter.push({
          path: "/pages/map/index",
          query: data,
        });
        // if (isWeixin()) {
        //   let config = {
        //     latitude: this.system_store.latitude,
        //     longitude: this.system_store.longitude,
        //     name: this.system_store.name,
        //     address: this.system_store.address
        //   };
        // } else {
        //   if (!this.mapKey)
        //     uni.showToast({
        //       title: "暂无法使用查看地图，请配置您的腾讯地图key",
        //       icon: "none",
        //       duration: 2000
        //     });
        //   return;
        //   this.mapShow = true;
        // }
      },
      goBack() {
        if (this.name === "MyOrder") {
          this.$yrouter.back();
          return;
        } else {
          console.log(this);
          this.$yrouter.replace({
            path: "/pages/order/MyOrder/index",
          });
          return;
        }
      },
      cancelOrder() {
        cancelOrderHandle(this.orderInfo.orderId)
          .then(() => {
            setTimeout(() => this.goBack(), 300);
          })
          .catch(() => {
            this.getDetail();
          });
      },
      takeOrder() {
        takeOrderHandle(this.orderInfo.orderId).finally(() => {
          this.getDetail();
        });
      },
      delOrder() {
        delOrderHandle(this.orderInfo.orderId).then(() => {
          setTimeout(() => this.goBack(), 300);
        });
      },
      setOfflinePayStatus: function (status) {
        var that = this;
        that.offlinePayStatus = status;
        if (status === 1 && that.orderTypeNameStatus === true) {
          that.payType.push("offline");
        }
      },
      getOrderStatus: function () {
        let orderInfo = this.orderInfo || {},
          _status = orderInfo._status || {
            _type: 0
          },
          status = {};
        let type = parseInt(_status._type),
          delivery_type = orderInfo.deliveryType,
          seckill_id = orderInfo.seckillId ? parseInt(orderInfo.seckillId) : 0,
          bargain_id = orderInfo.bargainId ? parseInt(orderInfo.bargainId) : 0,
          combination_id = orderInfo.combinationId ?
          parseInt(orderInfo.combinationId) :
          0;
        status = {
          type: type,
          class_status: 0,
        };
        if (type == 1 && combination_id > 0) {
          status.type = 6;
          status.class_status = 1;
        } //查看拼团
        if (type == 2 && delivery_type == "express") status.class_status = 2; //查看物流
        if (type == 2) status.class_status = 3; //确认收货
        if (type == 4 || type === 0) status.class_status = 4; //删除订单
        if (
          !seckill_id &&
          !bargain_id &&
          !combination_id &&
          (type == 3 || type == 4)
        )
          status.class_status = 5; //再次购买
        if (type == 9) {
          //线下付款
          status.class_status = 0;
          this.offlineStatus = false;
        }
        this.status = status;
      },
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
			console.log("orderInfo")
			console.log(this.orderInfo)
            this.getOrderStatus();
            if (this.orderInfo.combinationId > 0) {
              this.orderTypeName = "拼团订单";
              this.orderTypeNameStatus = false;
            } else if (this.orderInfo.bargainId > 0) {
              this.orderTypeName = "砍价订单";
              this.orderTypeNameStatus = false;
            } else if (this.orderInfo.seckillId > 0) {
              this.orderTypeName = "秒杀订单";
              this.orderTypeNameStatus = false;
            }
            this.isIntegral = res.data.payType == 'integral'
            if (this.isIntegral) {
              this.orderTypeName = "积分兑换订单";
              this.orderTypeNameStatus = false;
            }

            this.system_store = res.data.systemStore || {};
            this.mapKey = res.data.mapKay;
            this.setOfflinePayStatus(this.orderInfo.offlinePayStatus);
          })
          .catch((err) => {
            uni.showToast({
              title: err.response.data.msg,
              icon: "none",
              duration: 2000,
            });
          });
      },
      async toPay(type) {
        var that = this;
        await payOrderHandle(this.orderInfo.orderId, type, that.from);
        that.getDetail();
      },
    },
  };
</script>

<style scoped lang="less">
  .geoPage {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 10000;
  }

  .order-details .writeOff {
    background-color: #fff;
    margin-top: 0.13 * 100rpx;
    padding-bottom: 0.3 * 100rpx;
  }

  .order-details .writeOff .title {
    font-size: 0.3 * 100rpx;
    color: #282828;
    height: 0.87 * 100rpx;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 0.3 * 100rpx;
    line-height: 0.87 * 100rpx;
  }

  .order-details .writeOff .grayBg {
    background-color: #f2f5f7;
    width: 5.9 * 100rpx;
    height: 3.84 * 100rpx;
    border-radius: 0.2 * 100rpx 0.2 * 100rpx 0 0;
    margin: 0.5 * 100rpx auto 0 auto;
    padding-top: 0.55 * 100rpx;
  }

  .order-details .writeOff .grayBg .pictrue {
    width: 2.9 * 100rpx;
    height: 2.9 * 100rpx;
    margin: 0 auto;
  }

  .order-details .writeOff .grayBg .pictrue img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .order-details .writeOff .gear {
    width: 5.9 * 100rpx;
    height: 0.3 * 100rpx;
    margin: 0 auto;
  }

  .order-details .writeOff .gear img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .order-details .writeOff .num {
    background-color: #f0c34c;
    width: 5.9 * 100rpx;
    height: 0.84 * 100rpx;
    color: #282828;
    font-size: 0.48 * 100rpx;
    margin: 0 auto;
    border-radius: 0 0 0.2 * 100rpx 0.2 * 100rpx;
    text-align: center;
    padding-top: 0.04 * 100rpx;
  }

  .order-details .writeOff .rules {
    margin: 0.46 * 100rpx 0.3 * 100rpx 0 0.3 * 100rpx;
    border-top: 0.01 * 100rpx solid #f0f0f0;
    padding-top: 0.1 * 100rpx;
  }

  .order-details .writeOff .rules .item {
    margin-top: 0.15 * 100rpx;
  }

  .order-details .writeOff .rules .item .rulesTitle {
    font-size: 0.28 * 100rpx;
    color: #282828;
  }

  .order-details .writeOff .rules .item .rulesTitle .iconfont {
    font-size: 0.3 * 100rpx;
    color: #333;
    margin-right: 0.08 * 100rpx;
    margin-top: 0.05 * 100rpx;
  }

  .order-details .writeOff .rules .item .info {
    font-size: 0.28 * 100rpx;
    color: #999;
    margin-top: 0.05 * 100rpx;
  }

  .order-details .writeOff .rules .item .info .time {
    margin-left: 0.2 * 100rpx;
  }

  .order-details .map {
    height: 0.86 * 100rpx;
    font-size: 0.3 * 100rpx;
    color: #282828;
    line-height: 0.86 * 100rpx;
    border-bottom: 0.01 * 100rpx solid #f0f0f0;
    margin-top: 0.13 * 100rpx;
    background-color: #fff;
    padding: 0 0.3 * 100rpx;
  }

  .order-details .map .place {
    font-size: 0.26 * 100rpx;
    width: 1.76 * 100rpx;
    height: 0.5 * 100rpx;
    border-radius: 0.25 * 100rpx;
    line-height: 0.5 * 100rpx;
    text-align: center;
  }

  .order-details .map .place .iconfont {
    font-size: 0.27 * 100rpx;
    height: 0.27 * 100rpx;
    line-height: 0.27 * 100rpx;
    margin: 0.02 * 100rpx 0.03 * 100rpx 0 0;
  }

  .order-details .address .name .iconfont {
    font-size: 0.34 * 100rpx;
    margin-left: 0.1 * 100rpx;
  }
</style>
