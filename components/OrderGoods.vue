<template>
  <view class="orderGoods">
    <view class="goodWrapper">
      <view class="item acea-row row-between-wrapper">
        <view class="pictrue">
          <image :src="cartInfo.image" class="image" />
        </view>
        <view class="text">
          <view class="acea-row row-between-wrapper">
            <view class="name line1">{{ cart.productInfo.storeName }}</view>
            <view class="num">x {{ cart.cartNum }}</view>
          </view>
          <view class="attr line1" v-if="cart.productInfo.attrInfo">{{ cart.productInfo.attrInfo.sku }}</view>
          <view class="money font-color-red" v-if="isIntegral">{{ cart.costPrice }}积分</view>
          <view class="money font-color-red" v-else>￥{{ cart.truePrice }}</view>
          <view class="evaluate" v-if="evaluate == 3 && cart.isReply == 0" @click="routerGo(cart)">评价</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'OrderGoods',
  props: {
    evaluate: Number,
    cartInfo: {
      type: Array,
      default: () => [],
    },
    isIntegral: Boolean,
  },
  data: function() {
    return {}
  },
  mounted: function() {},
  methods: {
    routerGo(cart) {
      this.$yrouter.push({
        path: '/pages/shop/GoodsEvaluate/index',
        query: { id: cart.unique },
      })
    },
  },
}
</script>
