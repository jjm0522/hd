<template>
	<view class="container">
		<view class="content">
			<view :line-width="3" custom-bar-width="60px" default-color="#C6C6C6" active-color="#de3b12" bar-active-color="#de3b12"
			 class="tab-vux">
				<view selected @tap="handleTab(0)" class="content-item" :class="{ active: tab === 0 }">举报红包</view>
				<view @tap="handleTab(1)" class="content-item" :class="{ active: tab === 1 }">活动红包</view>
			</view>
			<!-- <van-tabs :active="active" bind:change="onChange">
			  <van-tab title="举报红包">内容 1</van-tab>
			  <van-tab title="活动红包">内容 2</van-tab>
			</van-tabs> -->
			<!-- <van-tabs bind:click="onClick">
			  <van-tab title="举报红包">内容 1</van-tab>
			  <van-tab title="活动红包">内容 2</van-tab>
			</van-tabs> -->
			<view class="top-bg"></view>
			<view ref="viewBox" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="60"
			 v-show="tab==0">
				<view v-for="(item,index) in onlineList" :key="index">
					<view class="red-box" :style="redBox">
						<view class="red-left">
							￥<text class="left-z">{{item.moneyZ}}</text>.{{item.moneyL}}
						</view>
						<view class="red-right">
							<view class="right-top">案件编号</view>
							<view class="right-center">{{item.mchbillno}}</view>
							<view class="right-bottom">{{item.addtime}}</view>
						</view>
					</view>
					<view class="red-bg"></view>
				</view>
				
				<van-divider contentPosition="center" v-show="this.onlineList.length == 0">暂无红包</van-divider>
				<view class="load-more-view">
					<load-more :show-loading="loading" :tip="load_more_tip"></load-more>
				</view>
			</view>

			<view ref="viewBox" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="60"
			 v-show="tab==1">
				<view v-for="(item,index) in list" :key="index">
					<view class="red-box" :style="redBox">
						<view class="red-left">
							￥<text class="left-z">{{item.moneyZ}}</text>.{{item.moneyL}}
						</view>
						<view class="red-right">
							<view class="right-top">活动编号</view>
							<view class="right-center">{{item.mchbillno}}</view>
							<view class="right-bottom">{{item.addtime}}</view>
						</view>
					</view>
					<view class="red-bg"></view>
				</view>
				<van-divider contentPosition="center" v-show="this.list.length == 0">暂无红包</van-divider>
				<view class="load-more-view">
					<load-more :show-loading="loading" :tip="load_more_tip"></load-more>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { questionRedPack, onlineRedPack } from '../../api/my.js'
	export default {
		data() {
			return {
				active: 0,
				params: {
					page: 1
				},
				onlineParams: {
					page: 1
				},
				list: [],
				onlineList: [],
				loading: false,
				no_more: true,
				load_err: false,
				load_more_tip: '暂无红包',
				tab: 0,
				// redBox: {
				// 	backgroundImage: 'url(' + require('../../assets/redBox.png') + ')'
				// }
			}
		},
		
		onLoad(){
			this.onlineData()
		},
		methods: {
			 onClick(event) {
			    wx.showToast({
			      title: `点击标签 ${event.detail.name}`,
			      icon: 'none'
			    });
			  },
			onlineData() {
				onlineRedPack(this.onlineParams).then(response => {
					if (response.data.data) {
						for (var n = 0; n < response.data.data.length; n++) {
							this.$set(response.data.data[n], 'moneyZ', response.data.data[n].money.toString().split('.')[0])
							if (response.data.data[n].money.toString().split('.')[1]) { // eslint-disable-line
								this.$set(response.data.data[n], 'moneyL', response.data.data[n].money.toString().split('.')[1])
							} else {
								this.$set(response.data.data[n], 'moneyL', '00')
							}
							var num = ''
							for (var m = 0; m < 7; m++) {
								num += response.data.data[n].mchbillno.split('')[m]
								if (m === 6) {
									num += '***'
								}
							}
							response.data.data[n].mchbillno = num
						}
						this.loading = false
						this.no_more = false
						if (response.data.current_page == 1) { // eslint-disable-line
							this.onlineList = response.data.data
							if (this.onlineList.length < response.data.per_page) {
								this.no_more = true
							}
							// else if (this.onlineList.length < 12) {
							//   this.loadMore()
							// }
						} else {
							var onlineList = []
							for (var i = 0; i < response.data.data.length; i++) {
								onlineList.push(response.data.data[i])
							}
							this.onlineList = this.onlineList.concat(onlineList)
							if (parseInt(this.params.page) >= parseInt(response.data.total) / parseInt(response.data.per_page)) {
								this.no_more = true
							}
						}
						this.load_more_tip = this.no_more ? '别拉了，到底了' : '加载中'
						if (this.onlineList.length == 0) { // eslint-disable-line
							this.load_more_tip = '暂无红包'
						}
					}
				})
			},
			questionData() {
				questionRedPack(this.params).then(response => {
					if (response.data.data) {
						for (var n = 0; n < response.data.data.length; n++) {
							this.$set(response.data.data[n], 'moneyZ', response.data.data[n].money.toString().split('.')[0])
							if (response.data.data[n].money.toString().split('.')[1]) { // eslint-disable-line
								this.$set(response.data.data[n], 'moneyL', response.data.data[n].money.toString().split('.')[1])
							} else {
								this.$set(response.data.data[n], 'moneyL', '00')
							}
							var num = ''
							for (var m = 0; m < 7; m++) {
								num += response.data.data[n].mchbillno.split('')[m]
								if (m === 6) {
									num += '***'
								}
							}
							response.data.data[n].mchbillno = num
						}
						this.loading = false
						this.no_more = false
						if (response.data.current_page == 1) { // eslint-disable-line
							this.list = response.data.data
							if (this.list.length < response.data.per_page) {
								this.no_more = true
							}
						} else {
							var list = []
							for (var i = 0; i < response.data.data.length; i++) {
								list.push(response.data.data[i])
							}
							this.list = this.list.concat(list)
							if (parseInt(this.params.page) >= parseInt(response.data.total) / parseInt(response.data.per_page)) {
								this.no_more = true
							}
						}
						this.load_more_tip = this.no_more ? '别拉了，到底了' : '加载中'
						if (this.list.length == 0) { // eslint-disable-line
							this.load_more_tip = '暂无红包'
						}
					}
				})
			},
			handleTab(tab) {
				if (this.tab !== tab) {
					if (tab === 0) {
						this.onlineData()
					} else {
						this.questionData()
					}
				}
				this.tab = tab
			},
			loadMore() {
				if (this.loading || this.no_more) return false
				this.loading = true
				if (this.tab === 0) {
					this.onlineParams.page = this.onlineParams.page + 1
					this.load_more_tip = '加载中'
					this.onlineData()
				} else {
					this.params.page = this.params.page + 1
					this.load_more_tip = '加载中'
					this.questionData()
				}
			}
		}
	}
</script>

<style>
	.container {
		height: 100vh;
		background: #F3F4F6;
		width: 100%;
	}

	.content {
		height: auto;
		background: #F3F4F6;
		width: 100%;
	}

	.tab-vux {
		font-weight: 700;
		width: 100%;
		display: flex;
		height: 80rpx;
		background-color: #fff;
	}

	.active {
		color: red;
	}

	.content-item {
		width: 50%;
		text-align: center;
		line-height: 80rpx;
	}

	.top-bg {
		height: 24px;
	}

	.red-box {
		display: flex;
		justify-content: space-between;
		height: 102px;
		margin: 0 48px;
		background-repeat: no-repeat;
		background-size: 107% 117%;
		background-position: center center;
	}

	.red-bg {
		height: 18px;
	}

	.red-left {
		width: 126px;
		height: 102px;
		line-height: 102px;
		text-align: center;
		font-size: 18px;
		color: #e8a899;
		font-weight: 900;
	}

	.left-z {
		font-size: 40px;
		color: #de3b12;
	}

	.red-right {
		width: 150px;
		text-align: center;
		color: rgba(255, 255, 255, 0.4);
	}

	.right-top {
		margin-top: 23px;
		font-size: 14px;
	}

	.right-center {
		font-size: 20px;
	}

	.right-bottom {
		font-size: 12px;
		margin-top: 5px;
	}

	.tab {
		padding: 15px 50px;
	}

	.item {
		display: flex;
		margin: 10px 20px 0 20px;
		border-bottom: 1px solid #ededed;
		padding: 10px;
	}

	.item-name {
		flex: 1.5;
	}

	.item-type {
		flex: 0.5;
	}

	.item-money {
		text-align: center;
		flex: 0.5;
	}

	.item-time {
		text-align: right;
		flex: 2;
	}
</style>
