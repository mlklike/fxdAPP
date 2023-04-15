<template>
  <view class="user">
    <view v-if="$store.getters.token || userInfo.uid">
	<view class="getUserBaseData header bg-color-red acea-row row-between-wrapper" v-if="!userInfo.avatar && !userInfo.nickname">
			<button class="userDataBtn" v-if="canIUseGetUserProfile" @tap="getUserInfoProfile">授权并查看用户信息</button>
			<button class="userDataBtn" v-else @getuserinfo="getUserInfo" open-type="getUserInfo">授权并查看用户信息</button>
	</view>
	<view class="header bg-color-red acea-row row-center-wrapper" v-else>
        <view class="picTxt" style="align-items: center;justify-content: center;">
          <view class="pictrue" style="margin: 10rpx auto;">
            <image :src="userInfo.avatar" />
          </view>
		  <view style="color:white;text-align: center;">
			  <text>{{userInfo.nickname}}</text>
			  <text class="iconfont icon-bianji1" @click="goPersonalData()"></text>
		  </view>
		 <!-- <view style="color:white;text-align: center;">
			  <text>({{userInfo.phone}})</text>
		  </view> -->
          <!-- <view class="text">
            <view class="acea-row row-middle">
              <view class="name line1">{{ userInfo.nickname }}</view>
              <view class="member acea-row row-middle" v-if="userInfo.vip">
                <image :src="userInfo.vipIcon" />
                <text>{{ userInfo.vipName }}</text>
              </view>
            </view>
            <view @click="goPersonalData()" class="id" v-if="userInfo.phone">
              <text>ID：{{ userInfo.uid || 0 }}</text>
              <text class="iconfont icon-bianji1"></text>
            </view>
          </view> -->
        </view>
        <!-- <text class="iconfont icon-shezhi" @click="goPersonalData()"></text> -->
    </view>
      <view class="wrapper">
		  <view class="myOrder">
			  <view class="title acea-row row-between-wrapper">
				  <text>有效卡券张数：{{totalCoupons.totalCoupon}}张</text>
				  <text @click="goCardList()" style="color: red;">查看列表</text>
			  </view>
			  <view class="title acea-row row-between-wrapper">
				<text>剩余总兑换次数：{{totalCoupons.surplusSpecQty}}次</text>
				<text @click="goCardList()" style="color: red;">立即兑换</text>
			  </view>
		  </view>
		  <view class="myOrder">
			  <view class="acea-row row-between-wrapper" style="font-size: 30rpx;padding: 0 30rpx;" v-if="expiringCoupons && expiringCoupons.couponCode"><text>尊敬的会员，您的卡券
				  <span style="color: red;">{{expiringCoupons.couponCode}}</span>剩余有效期
				  <span style="color: red;">{{leftDay(expiringCoupons.endTime)}}</span>天，请尽快兑换，
				  <span style="color: red;">过期失效不作补发！</span></text>
			  </view>
		  </view>
       <!-- <view class="nav acea-row row-middle">
          <view @click="goUserAccount()" class="item">
            <text>我的余额</text>
            <text class="num">{{ userInfo.nowMoney || 0 }}</text>
          </view>
          <view @click="goUserPromotion()" class="item" v-if="userInfo.isPromoter === 1 || userInfo.statu === 2">
            <text>当前佣金</text>
            <text class="num">{{ userInfo.brokeragePrice || 0 }}</text>
          </view>
          <view @click="goIntegral()" class="item" v-else>
            <text>当前积分</text>
            <text class="num">{{ userInfo.integral || 0 }}</text>
          </view>
          <view @click="goUserCoupon()" class="item">
            <text>优惠券</text>
            <text class="num">{{ userInfo.couponCount || 0 }}</text>
          </view>
        </view> -->
        <view class="myOrder">
          <view class="title acea-row row-between-wrapper">
            <text>我的订单</text>
            <text @click="goMyOrder()" class="allOrder">
              <text>全部订单</text>
              <text class="iconfont icon-jiantou"></text>
            </text>
          </view>
          <view class="orderState acea-row row-middle" v-if="userInfo.orderStatusNum !== undefined || userInfo.orderStatusNum !== null">
           <!-- <view @click="goMyOrder(0)" class="item">
              <view class="pictrue">
                <image :src="`${$VUE_APP_RESOURCES_URL}/images/dfk.png`" />
                <text class="order-status-num" v-if="userInfo.orderStatusNum.unpaidCount > 0">{{ userInfo.orderStatusNum.unpaidCount }}</text>
              </view>
              <view>待付款</view>
            </view> -->
            <view @click="goMyOrder(1)" class="item">
              <view class="pictrue">
                <image :src="`${$VUE_APP_RESOURCES_URL}/images/dfh.png`" />
                <text class="order-status-num" v-if="userInfo.orderStatusNum.unshippedCount > 0">{{ userInfo.orderStatusNum.unshippedCount }}</text>
              </view>
              <view>待发货</view>
            </view>
            <view @click="goMyOrder(2)" class="item">
              <view class="pictrue">
                <image :src="`${$VUE_APP_RESOURCES_URL}/images/dsh.png`" />
                <text class="order-status-num" v-if="userInfo.orderStatusNum.receivedCount > 0">{{ userInfo.orderStatusNum.receivedCount }}</text>
              </view>
              <text>待收货</text>
            </view>
            <view @click="goMyOrder(3)" class="item">
              <view class="pictrue">
                <image :src="`${$VUE_APP_RESOURCES_URL}/images/dpj.png`" />
                <text class="order-status-num" v-if="userInfo.orderStatusNum.evaluatedCount > 0">{{ userInfo.orderStatusNum.evaluatedCount }}</text>
              </view>
              <text>已完成</text>
            </view>
           <!-- <view @click="goReturnList()" class="item">
              <view class="pictrue">
                <image :src="`${$VUE_APP_RESOURCES_URL}/images/sh.png`" />
                <text class="order-status-num" v-if="userInfo.orderStatusNum.refundCount > 0">{{ userInfo.orderStatusNum.refundCount }}</text>
              </view>
              <text>售后/退款</text>
            </view> -->
          </view>
        </view>
		<view class="myOrder">
		  <view class="title acea-row row-between-wrapper">
		    <text>我的礼品卡</text>
		    <!-- <text @click="goMyOrder()" class="allOrder">
		      <text>全部订单</text>
		      <text class="iconfont icon-jiantou"></text>
		    </text> -->
		  </view>
		  <view class="orderState acea-row row-middle" v-if="userInfo.orderStatusNum !== undefined || userInfo.orderStatusNum !== null">
		    <view @click="$yrouter.push('/pages/coupon/index')" class="item">
		      <view class="pictrue">
		        <image :src="`${$VUE_APP_RESOURCES_URL}/images/dfk.png`" />
		        <!-- <text class="order-status-num" v-if="userInfo.orderStatusNum.unpaidCount > 0">{{ userInfo.orderStatusNum.unpaidCount }}</text> -->
		      </view>
		      <view>卡片激活</view>
		    </view>
		    <view @click="goMyCard()" class="item">
		      <view class="pictrue">
		        <image :src="`${$VUE_APP_RESOURCES_URL}/images/dfh.png`" />
		        <!-- <text class="order-status-num" v-if="userInfo.orderStatusNum.unshippedCount > 0">{{ userInfo.orderStatusNum.unshippedCount }}</text> -->
		      </view>
		      <view>卡券列表</view>
		    </view>
		    <view @click="goMyCard()" class="item">
		      <view class="pictrue">
		        <image :src="`${$VUE_APP_RESOURCES_URL}/images/dsh.png`" />
		        <!-- <text class="order-status-num" v-if="userInfo.orderStatusNum.receivedCount > 0">{{ userInfo.orderStatusNum.receivedCount }}</text> -->
		      </view>
		      <text>卡券兑换</text>
		    </view>
		  </view>
		</view>
		<!-- <view class="myOrder" style="height: 300rpx;"> -->
		  <!-- <view class="title acea-row row-center-wrapper" > -->
			  <!-- <text>海报占位</text> -->
		  <!-- </view> -->
		<!-- </view> -->
		<view class="myOrder">
		  <view class="title acea-row row-between-wrapper">
		    <text>个人信息</text>
		  </view>
		  <view class="orderState acea-row row-middle" v-if="userInfo.orderStatusNum !== undefined || userInfo.orderStatusNum !== null">
		<!--    <view @click="goPersonalData()" class="item">
		      <view class="pictrue">
		        <image :src="`${$VUE_APP_RESOURCES_URL}/images/dfk.png`" />
		        <!-- <text class="order-status-num" v-if="userInfo.orderStatusNum.unpaidCount > 0">{{ userInfo.orderStatusNum.unpaidCount }}</text> -->
		 <!--     </view>
		      <view>微绑定/换绑</view>
		    </view> --> 
		
		    <view @click="goPersonalData()" class="item">
		      <view class="pictrue">
		        <image :src="`${$VUE_APP_RESOURCES_URL}/images/dfh.png`" />
		        <!-- <text class="order-status-num" v-if="userInfo.orderStatusNum.unshippedCount > 0">{{ userInfo.orderStatusNum.unshippedCount }}</text> -->
		      </view>
		      <view>手机号修改</view>
		    </view>
		    <view @click="gotoAddress()" class="item">
				<!-- <view @click="addressTap" class="item"> -->
		      <view class="pictrue">
		        <image :src="`${$VUE_APP_RESOURCES_URL}/images/dsh.png`" />
		        <text class="order-status-num" v-if="userInfo.orderStatusNum.receivedCount > 0">{{ userInfo.orderStatusNum.receivedCount }}</text>
		      </view>
		      <text>收货地址</text>
		    </view>
			<view class="item">
							 
			</view>
		  </view>
		</view>
	
		<view class="myOrder" style="margin: 40rpx;">
		  <view class="title acea-row row-center-wrapper" @click="logout()" >
			  <text style="color: red; ">退出登录</text>
		  </view>
		</view>

        <!-- <view class="myService">
          <view class="serviceList acea-row row-middle">
            <template v-for="(item, MyMenusIndex) in MyMenus">
              <view class="item" :key="MyMenusIndex" @click="goPages(MyMenusIndex)">
                <view class="pictrue">
                  <image :src="item.pic" />
                </view>
                <view class="cell">{{ item.name }}</view>
                <text class="iconfont icon-jiantou"></text>
              </view>
            </template>
          </view>
        </view> -->
      </view>
      <view class="by">
        <view>
          <!-- <text class="by-text">www.yixiang.co提供技术支持</text> -->
        </view>
      </view>
      <!-- <SwitchWindow
        v-on:changeswitch="changeswitch"
        :switchActive="switchActive"
        :login_type="userInfo.login_type"
      ></SwitchWindow>-->
    </view>
    
	<AddressWindow @checked="changeAddress" @redirect="addressRedirect" v-model="showAddress" :checked="addressInfo.id" ref="mychild"></AddressWindow>
	
	<!-- <Authorization v-else /> -->
  </view>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getUserInfo, getMenuUser, wxappAuth, bindingPhone, wxappBindingPhone, wxappGetUserInfo,getLogout } from '@/api/user'
import { getTotalCoupons,getExpiringCoupons } from '@/api/coupon'
import { isWeixin, VUE_APP_RESOURCES_URL, parseQuery, getProvider ,parseTime} from '@/utils'
import SwitchWindow from '@/components/SwitchWindow'
import Authorization from '@/pages/authorization/index'
import cookie from '@/utils/store/cookie'
import AddressWindow from '@/components/AddressWindow'

const NAME = 'User'

export default {
  name: NAME,
  components: {
    SwitchWindow,
    Authorization,
	AddressWindow
  },
  props: {},
  data: function() {
    return {
		//address start
		showAddress: false,
		addressInfo: {}, //checked 之后 父组件获取到的地址信息
		addressLoaded: false,
		//address end
		
		canIUseGetUserProfile: false,
		MyMenus: [],
		switchActive: false,
		isWeixin: false,
		totalCoupons:{
			totalCoupon: 0,
			surplusSpecQty: 0
		},
		expiringCoupons:{}
    }
  },
  computed: mapGetters(['userInfo']),
  created() {
  	// 获取卡券状态总量
  	getTotalCoupons().then(res=>{
  		this.totalCoupons.totalCoupon = res.data.totalCoupon
		this.totalCoupons.surplusSpecQty = res.data.surplusSpecQty
  	})
	getExpiringCoupons().then(res=>{
		//endTime
		//couponCode
		this.expiringCoupons = res.data.content[0]
	})
  },
 //  onShow:function() {
	//   console.log('onShow')
 //  	getUserInfo()
	// console.log('onShow')
	// getTotalCoupons().then(res=>{
		
	// })
 //  },
  onLoad() {
	// getUserInfo()
    // if (wx.getUserProfile) {
    //   this.canIUseGetUserProfile = true
    // }
  },
  methods: {
	  leftDay(val){
		var val = new Date(val).getTime() 
		var today = new Date().getTime()
		return ((val-today)/(24*60*60*1000)).toFixed(1)
		  
	  },
	  parseTime,
	  changeAddress(addressInfo) {
	    this.addressInfo = addressInfo
	    // this.computedPrice()
	  },
	  addressRedirect() {
	    this.addressLoaded = false
	    this.showAddress = false
	  },
	  addressTap: function() {
	    this.showAddress = true
	    if (!this.addressLoaded) {
	      this.addressLoaded = true
	      this.$refs.mychild.getAddressList()
	    }
	  },
    ...mapMutations(['updateAuthorizationPage']),
	logout: function () {
	  uni.showModal({
	    title: "提示",
	    content: "确认退出登录?",
	    success: (res) => {
	      if (res.confirm) {
	        getLogout()
	          .then((res) => {
	            this.$store.commit("logout");
	            this.$yrouter.replace({
	              path: "/pages/user/Login/index",
	              query: {},
	            });
	          })
	          .catch((err) => {});
	      } else if (res.cancel) {
	        // console.log("用户点击取消");
	      }
	    },
	  });
	},
	toLogin() {
	  this.$yrouter.push('/pages/user/Login/index')
	},

	goCardList(){
		// console.log("goCardList")
		// tabbar只能用switchTab进行跳转
		
		uni.switchTab({
			url: '/pages/shop/GoodsList/index'
		})
		// this.$yrouter.push('/pages/shop/GoodsList/index')
	},
    goReturnList() {
      this.$yrouter.push('/pages/order/ReturnList/index')
    },
	goMyCard(){
		// pages/shop/GoodsList/index
		uni.switchTab({
			url: '/pages/shop/GoodsList/index'
		})
	},
    goMyOrder(type) {
      // this.$yrouter.push({
      //   path: '/pages/order/MyOrder/index',
      //   query: {
      //     type,
      //   },
      // })
	  uni.setStorageSync('orderType', type);
	  uni.switchTab({
	  	url: '/pages/order/MyOrder/index'
	  })
    },
    goBindPhone() {
      this.$yrouter.push('/pages/user/BindingPhone/index')
    },
    goUserCoupon() {
      this.$yrouter.push('/pages/user/coupon/UserCoupon/index')
    },
    goIntegral() {
      this.$yrouter.push('/pages/user/signIn/Integral/index')
    },
    goUserPromotion() {
      this.$yrouter.push('/pages/user/promotion/UserPromotion/index')
    },
    goUserAccount() {
      this.$yrouter.push('/pages/user/UserAccount/index')
    },
    goPersonalData() {
      this.$yrouter.push('/pages/user/PersonalData/index')
    },
	gotoAddress(){
	  this.$yrouter.push('/pages/user/address/AddressManagement/index')
	},
    getPhoneNumber (e) {
		// 判断一下这里是不是小程序 如果是小程序，走获取微信手机号进行绑定
		if (e.mp.detail.errMsg == 'getPhoneNumber:ok') {
			uni.showLoading({
			  title: '绑定中',
			})
			wxappBindingPhone({
			  encryptedData: e.mp.detail.encryptedData,
			  iv: e.mp.detail.iv,
			})
			.then(res => {
				// this.User();
				this.$store.dispatch('userInfo', true)
				uni.hideLoading()
				uni.showToast({
				  title: res.msg,
				  icon: 'success',
				  duration: 2000,
				})
			})
			.catch(error => {
				uni.hideLoading()
				this.$store.dispatch('userInfo', true)
				console.log(error)
				uni.showToast({
				  title: error.msg || error.response.data.msg || error.response.data.message,
				  icon: 'none',
				  duration: 2000,
				})
			})
        // // 获取当前环境的服务商
        // uni.getProvider({
        //   service: "oauth",
        //   success: function (res) {
        //     // 此处可以排除h5
        //     if (res.provider) {
        //       uni.login({
        //         success: loginRes => {
        //           bindingPhone({
        //               code: loginRes.code,
        //               encryptedData: e.mp.detail.encryptedData,
        //               iv: e.mp.detail.iv
        //             })
        //             .then(res => {
        //               // this.User();
        //               this.$store.dispatch("userInfo", true);
        //               uni.hideLoading();
        //               uni.showToast({
        //                 title: res.msg,
        //                 icon: "success",
        //                 duration: 2000
        //               });
        //             })
        //             .catch(error => {
        //               uni.hideLoading();
        //               this.$store.dispatch("userInfo", true);
        //               console.log(error);
        //               uni.showToast({
        //                 title: error.msg ||
        //                   error.response.data.msg ||
        //                   error.response.data.message,
        //                 icon: "none",
        //                 duration: 2000
        //               });
        //             });
        //         },
        //         fail() {
        //           reject("绑定失败");
        //         }
        //       });
        //     }
        //   },
        //   fail() {
        //     reject("获取环境服务商失败");
        //   }
        // });
		} else {
			uni.showToast({
				title: '已拒绝授权',
				icon: 'none',
				duration: 2000,
			})
		}
    },
    // 获取用户授权，读取头像、昵称
	getUserInfo(data) {
      if (data.detail.errMsg == 'getUserInfo:fail auth deny') {
        uni.showToast({
          title: '取消授权',
          icon: 'none',
          duration: 2000,
        })
        return
      }
    },
	// 申请获取用户信息
	getUserInfoProfile(data) {
		wx.getUserProfile({
			lang: 'zh_CN',
			desc: '需要获取您的信息用来展示',
			success: res => {
				uni.showLoading({
					title: '正在更新信息...',
					duration: 2000,
				})
				getProvider()
				.then(provider => { // 环境提供商
					if (!provider) {
					  reject()
					}
					// 获取开发code
					uni.login({
						provider: provider,
						success: async loginRes => {
							wxappGetUserInfo({
								encryptedData: res.encryptedData,
								iv: res.iv,
								code: loginRes.code, // 开发code
							}).then(res => {
								if (res.status === 200) {
									this.userInfo.avatar = res.data.avatar
									this.userInfo.nickname = res.data.nickname
								} else {
									uni.showLoading({
										title: res.msg,
										duration: 2000,
									})
								}
							})
						}
					})
				})
			}
		})
	},
	changeswitch(data) {
      this.switchActive = data
    },
	// 获取用户信息
    MenuUser() {
		getMenuUser()
        .then(res => {
          uni.hideLoading()
          this.MyMenus = res.data.routine_my_menus
        })
        .catch(error => {
          uni.hideLoading()
          console.log(error)
        })
    },
    goPages(index) {
      let url = this.MyMenus[index].uniapp_url
      if (url === '/pages/user/promotion/UserPromotion/index' && this.userInfo.statu === 1) {
        if (!this.userInfo.isPromoter) {
          uni.showToast({
            title: '您还没有推广权限！！',
            icon: 'none',
            duration: 2000,
          })
          return
        }
      }

      if (url === '/pages/orderAdmin/OrderIndex/index' && !this.userInfo.adminid) {
        uni.showToast({
          title: '您还不是管理员！！',
          icon: 'none',
          duration: 2000,
        })
        return
      }
      console.log(this.userInfo)
      if (url === '/pages/orderAdmin/OrderCancellation/index' && !this.userInfo.checkStatus) {
        uni.showToast({
          title: '您没有核销权限,请后台店员设置！！',
          icon: 'none',
          duration: 2000,
        })
        return
      }

      this.$yrouter.push({
        path: this.MyMenus[index].uniapp_url,
      })
    },
    goPages2() {
      this.$yrouter.push({
        path: '/pages/shop/GoodsList/index',
        query: {
          // id: 0,
          title: '积分商城',
          isIntegral: true,
        },
      })
    },
  },
  watch: {
    userInfo() {
      this.MenuUser()
    },
  },
  onShow() {
	  
	  // 获取卡券状态总量
	  getTotalCoupons().then(res=>{
	  	this.totalCoupons.totalCoupon = res.data.totalCoupon
	  	this.totalCoupons.surplusSpecQty = res.data.surplusSpecQty
	  }),
	  getExpiringCoupons().then(res=>{
	  	//endTime
	  	//couponCode
	  	this.expiringCoupons = res.data.content[0]
	  })
    if (this.$store.getters.token) {
      //
      uni.showLoading({
        title: '加载中',
      })
      this.$store.dispatch('getUser', true)
      this.MenuUser()
      this.isWeixin = isWeixin()
    }

	
  },
  onHide() {
    console.log('离开用户中心')
    this.updateAuthorizationPage(false)
  },
}
</script>

<style lang="less">
.getUserBaseData{
	.userDataBtn{
		width: 80%;
		height: 80rpx;
		background: linear-gradient(to right, #f35447 0%, #ff8e3c 100%);
		background: -moz-linear-gradient(to right, #f35447 0%, #ff8e3c 100%);
		border-radius: 40rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
	}
}
.footer-line-height {
  height: 1 * 100rpx;
}

.order-status-num {
  min-width: 0.33 * 100rpx;
  background-color: #fff;
  color: #eb3729;
  border-radius: 15px;
  position: absolute;
  right: -0.14 * 100rpx;
  top: -0.15 * 100rpx;
  font-size: 0.2 * 100rpx;
  padding: 0 0.08 * 100rpx;
  border: 1px solid #eb3729;
}

.pictrue {
  position: relative;
}

.switch-h5 {
  margin-left: 0.2 * 100rpx;
}

.binding {
  margin-top: 0.1 * 100rpx;
  display: inline-block;
  padding: 0.05 * 100rpx 0.2 * 100rpx;
  background-color: #ca1f10;
  border-radius: 50px;
  font-size: 0.22 * 100rpx;
  line-height: 1.5;
  border: 1px solid #e8695e;
  color: #ffffff;
}

.by {
  text-align: center;
  padding: 100rpx 0;
}

.by-text {
  text-align: center;
  font-size: 24rpx;
}
/*个人中心*/
.user .header {
  // padding: 0 0.3 * 100rpx;
  height: 2 * 100rpx;
  position: relative;
}

// .user .header:after {
//   position: absolute;
//   left: 0;
//   right: 0;
//   bottom: -0.98 * 100rpx;
//   z-index: -1;
//   content: '';
//   height: 1 * 100rpx;
//   width: 100%;
//   border-radius: 0 0 50% 50%;
//   background-color: #eb3729;
// }

.user .header .picTxt .pictrue {
  width: 1.2 * 100rpx;
  height: 1.2 * 100rpx;
}

.user .header .picTxt .pictrue image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 0.03 * 100rpx solid #f5f5f5;
}

.user .header .picTxt .text {
  width: 4.34 * 100rpx;
  color: rgba(255, 255, 255, 1);
  margin-left: 0.35 * 100rpx;
  text-align: left;
}

.user .header .picTxt .text .name {
  font-size: 0.32 * 100rpx;
  max-width: 2.6 * 100rpx;
  width: unset;
}

.user .header .picTxt .text .member {
  padding: 0 0.1 * 100rpx;
  height: 0.36 * 100rpx;
  background-color: rgba(0, 0, 0, 0.2);
  font-size: 0.2 * 100rpx;
  border-radius: 0.3 * 100rpx;
  margin-left: 0.17 * 100rpx;
}

.user .header .picTxt .text .member image {
  width: 0.28 * 100rpx;
  height: 0.28 * 100rpx;
  font-size: 0.2 * 100rpx;
  margin-right: 0.08 * 100rpx;
}

.user .header .picTxt .text .id {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.26 * 100rpx;
  margin-top: 0.15 * 100rpx;
}

.user .header .picTxt .text .id .iconfont {
  font-size: 0.3 * 100rpx;
  margin-left: 0.12 * 100rpx;
}

.user .header .icon-shezhi {
  font-size: 0.36 * 100rpx;
  color: #fff;
  margin-top: -0.52 * 100rpx;
}

.user .wrapper {
  padding: 0 0.2 * 100rpx;
}

.user .wrapper .nav {
  background-color: #fff;
  border-radius: 0.06 * 100rpx;
  height: 1.4 * 100rpx;
}

.user .wrapper .nav .item {
  flex: 1;
  -o-flex: 1;
  -ms-flex: 1;
  text-align: center;
  font-size: 0.26 * 100rpx;
  color: #aaa;
  position: relative;
}

.user .wrapper .nav .item text {
  display: block;
}

.user .wrapper .nav .item ~ .item:after {
  position: absolute;
  content: '';
  left: 0;
  width: 1px;
  height: 0.7 * 100rpx;
  background-color: #eee;
  top: 50%;
  margin-top: -0.35 * 100rpx;
}

.user .wrapper .nav .item .num {
  margin-top: 0.1 * 100rpx;
  font-size: 0.36 * 100rpx;
  color: #282828;
}

.user .wrapper .myOrder {
  background-color: #fff;
  border-radius: 0.1 * 100rpx;
  margin-top: 0.15 * 100rpx;
}

.user .wrapper .myOrder .title,
.user .wrapper .myService .title {
  height: 0.88 * 100rpx;
  padding: 0 0.3 * 100rpx;
  border-bottom: 1px dashed #eee;
  font-size: 0.3 * 100rpx;
  color: #282828;
}

.user .wrapper .myOrder .title .allOrder {
  font-size: 0.26 * 100rpx;
  color: #666;
}

.user .wrapper .myOrder .title .allOrder .iconfont {
  font-size: 0.25 * 100rpx;
  margin-left: 0.07 * 100rpx;
}

.user .wrapper .myOrder .orderState {
  height: 1.6 * 100rpx;
}

.user .wrapper .myOrder .orderState .item {
  font-size: 0.26 * 100rpx;
  color: #454545;
  flex: 1;
  -o-flex: 1;
  -ms-flex: 1;
  text-align: center;
}

.user .wrapper .myOrder .orderState .item .pictrue {
  width: 0.49 * 100rpx;
  height: 0.42 * 100rpx;
  margin: 0 auto 0.18 * 100rpx auto;
}

.user .wrapper .myOrder .orderState .item .pictrue image {
  width: 100%;
  height: 100%;
}

.user .wrapper .myService {
  background-color: #fff;
  margin-top: 0.15 * 100rpx;
  border-radius: 0.1 * 100rpx;
}

.user .wrapper .myService .serviceList {
  padding: 0.08 * 100rpx 0 0.27 * 100rpx 0;
}

.user .wrapper .myService .serviceList .item {
  width: 100%;
  text-align: left;
  font-size: 0.26 * 100rpx;
  color: #333;
  display: flex;
  align-items: center;
  padding: 0.2 * 100rpx 0.3 * 100rpx;
  position: relative;

  .iconfont {
    font-size: 0.26 * 100rpx;
    color: #666;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0.3 * 100rpx;
    right: 0;
    bottom: 0;
    border-bottom: 1rpx solid #f5f5f5;
    z-index: 99;
    height: 1rpx;
  }
}

.user .wrapper .myService .serviceList .item .pictrue {
  width: 36rpx;
  height: 36rpx;
  margin-right: 0.16 * 100rpx;
}

.user .wrapper .myService .serviceList .item .cell {
  flex: 1;
}

.user .wrapper .myService .serviceList .item .pictrue image {
  width: 100%;
  height: 100%;
}

.user .support {
  width: 2.19 * 100rpx;
  height: 0.74 * 100rpx;
  margin: 0.54 * 100rpx auto;
  display: block;
}
</style>
