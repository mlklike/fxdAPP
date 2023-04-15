import request from '@/utils/request'

// 获取用户卡券列表
export function queryUserCoupons(data) {
  return request.get(
	  '/coupons/queryUserCoupons', 
	  data, 
	  // {login: false,},
  )
}
// 获取用户有效卡券
export function queryValidCoupons(data) {
  return request.get(
	  '/coupons/queryValidCoupons', 
	  data, 
	  // {login: false,},
  )
}

// 获取用户生效的卡券列表
export function queryInvalidUserCoupons(data) {
  return request.get(
	  '/coupons/queryInvalidCoupons', 
	  data, 
	  // {login: false,},
  )
}

export function getChanelAndProductInfo(chanelId,productId) {
  return request.get("/coupons/getChanelAndProductInfo?chanelId="+chanelId+"&productId="+productId)
}

// 获取卡券状态总览
export function getTotalCoupons() {
  return request.get(
	  '/coupons/totalCoupons', 
	  // data, 
	  // {login: false,},
  )
}

// 卡券即将过期
export function getExpiringCoupons() {
  return request.get(
	  '/coupons/expireTipsCoupons', 
	  // data, 
	  // {login: false,},
  )
}

/*
 * 获取卡券的信息
 * */
export function getByCouponNo(coupon) {
	return request.get("/getByCouponNo?couponNo="+coupon);
}
/**
 * @param {Object} data创建卡券兑换
 * @addressId
 * @couponId
 * @mark
 * @qty
 */
export function createExchangeOrder(data){
	return request.post("coupon/createExchangeOrder",data);
}

/**
 * @param {Object} data设置为自动兑换卡券
 */
export function setAutoAutoExchange(data){
	return request.post("coupon/setAutoAutoExchange",data);
}
/**
 * 获取当前卡券的前一张卡券
 */
export function getPreviousCouponNo(couponNo){
	return request.get("coupons/getPreviousCouponNo?couponNo="+couponNo);
}
/**
 * 获取当前卡券的前一张卡券
 */
export function getNextCouponNo(couponNo){
	return request.get("coupons/getNextCouponNo?couponNo="+couponNo);
}