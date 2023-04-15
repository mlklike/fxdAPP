<template>
	<view class="goods-box u-col-top" @tap="click">

	    <uni-row class="" :gutter=0 :width=730>
			<uni-col :span="8">
				<view style="display: block; margin: 0 auto;">
					<image class="goods_img"  lazy-load fade-show :src="image" mode="aspectFill"></u-image>
				</view>
			</uni-col>
			<uni-col :span="13" >
				<view class="u-m-l-20">
					<slot name="describe"></slot>
					<slot name="cardBottom"></slot>
				</view>
			</uni-col>
			<uni-col :span='3'>
				<view style="display: flex;justify-content: center;flex-direction: column;text-align: right;height: 125px;">
					<slot name="rightQty"></slot>
				</view>
			</uni-col>
		</uni-row>
			<view>
				<slot name='orderBottom'></slot>
			</view>
			<view class='rightButton'>
				<slot name="rightButton"></slot>
			</view>

		

	</view>
</template>

<script>
/**
 * 商品小卡片
 * @property {String} title - 编号
 * @property {String} liushui - 流水号
 * @property {String} image - 图片地址
 * @property {String} describe - 描述信息
 * @property {String | Number} price - 价格
 * @property {String | Number} originPrice - 原价
 * @property {String} tag - 商品标签
 * @property {Number} number - 商品数量
 * @event {Function} click - 点击卡片
 */
export default {
	components: {},
	data() {
		return {};
	},
	props: {
		image: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		liushui: {
			type: String,
			default: ''
		},
		describe: {
			type: String,
			default: ''
		},
		price: {
			type: [Number, String],
			default: ''
		},
		originPrice: {
			type: [Number, String],
			default: ''
		},
		tag: {
			type: String,
			default: ''
		},
		number: {
			type: Number,
			default: 0
		}
	},
	computed: {},
	created() {},
	methods: {
		click() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss">
/* 	.rightButton{
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: right;
		text-align: right;
		align-items: right;
	} */
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
