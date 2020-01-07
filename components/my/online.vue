<template>
	<view class="container">
		<view class="content">
			<view :line-width="3" custom-bar-width="60px" default-color="#C6C6C6" active-color="#de3b12" bar-active-color="#de3b12"
			 class="tab-vux">
				<view selected @tap="handleTab(0)" class="content-item" :class="{ active: tab === 0 }">处理中</view>
				<view @tap="handleTab(1)" class="content-item" :class="{ active: tab === 1 }">处理完成</view>
			</view>
			<view class="top-bg"></view>
			<view ref="viewBox" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="60">
				<view v-for="(item,index) in onlineList" :key="index" @click="handleDetail(item.id)">
					<view class="item">
						<view class="item-title">
							<view>
								<!-- <text class="title-dian">·</text> -->
								<image src="../../static/dian.png" class="title-dian">
									<text class="title-bianhao">编号</text>
									<text class="title-num">{{item.oanum}}</text>
							</view>
							<view class="title-time">{{item.oaTime}}</view>
						</view>
						<view class="item-title">
							<view>
								<!-- <text class="title-dian">·</text> -->
								<image src="../../static/dian.png" class="title-dian">
									<text class="title-bianhao">内容</text>
							</view>
						</view>
						<view class="item-desc">
							{{item.oaWhat}}
						</view>
						<view class="item-btn" @tap="handleDetail(item.id)">查看详情</view>
					</view>
					<view class="item-bg"></view>
				</view>

				<view class="load-more-view">
					<load-more :show-loading="loading" :tip="load_more_tip"></load-more>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		myOnlineList
	} from '../../api/my.js'
	export default {
		data() {
			return {
				params: {
					status: 1,
					page: 1
				},
				onlineList: [],
				loading: false,
				no_more: true,
				load_err: false,
				load_more_tip: '暂无举报'
			}
		},
		onLoad() {
			this.handleTab(1)
		},
		methods: {
			handleTab(status) {
				if (status !== this.params.status) {
					this.params.page = 1
				}
				this.params.status = status
				myOnlineList(this.params).then(response => {
					console.log(111)
					console.log(response)
					if (response.data.data) {
						this.loading = false
						this.no_more = false
						if (response.data.current_page == 1) { // eslint-disable-line
							this.onlineList = response.data.data
							if (this.onlineList.length < response.data.per_page) {
								this.no_more = true
							}
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
							this.load_more_tip = '暂无举报'
						}
					}
				})
			},
			handleDetail(id) {
				// this.$router.push({
				// 	name: 'myOnlineDetail',
				// 	params: {
				// 		id: id
				// 	}
				// })
				uni.navigateTo({
					url:'./onlineDetail?id='+id
				})
			},
			loadMore() {
				if (this.loading || this.no_more) return false
				this.loading = true
				this.params.page = this.params.page + 1
				this.load_more_tip = '加载中'
				this.handleTab(this.params.status)
			}
		}
	}
</script>

<style>
	.container {
		height: 100vh;
		background: #F3F4F7;
		width: 100%;
	}

	.content {
		height: auto;
		background: #F3F4F7;
		width: 100%;
	}

	.active {
		color: red;
	}

	.content-item {
		width: 50%;
		text-align: center;
		line-height: 80rpx;
	}

	.tab-vux {
		font-weight: 700;
		width: 100%;
		display: flex;
		height: 80rpx;
		background-color: #fff;
	}

	.top-bg {
		height: 24px;
	}

	.item {
		position: relative;
		height: auto;
		margin: 0 24px;
		background-color: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
	}

	.item-btn {
		position: absolute;
		width: 100px;
		height: 30px;
		bottom: -15px;
		left: 50%;
		margin-left: -50px;
		text-align: center;
		line-height: 30px;
		background-color: #5f9aff;
		border-radius: 15px;
		color: #fff;
		font-size: 15px;
	}

	.item-title {
		position: relative;
		display: flex;
		justify-content: space-between;
		height: 36.5px;
		line-height: 36.5px;
		font-size: 14px;
		color: #000;
	}

	.title-dian {
		position: absolute;
		left: 8px;
		top: 11px;
		/* color: #5f9aff;
	  font-weight: 900;
	  font-size: 20px; */
		width: 13px;
		height: 13px;
	}

	.title-bianhao {
		padding-left: 23px;
		color: rgba(0, 0, 0, 0.7);
	}

	.title-num {
		color: rgba(0, 0, 0, 0.4);
	}

	.item-bg {
		height: 38.5px;
	}

	.title-time {
		padding-right: 14px;
		text-align: right;
		color: rgba(0, 0, 0, 0.4);
	}

	.item-desc {
		font-size: 12px;
		margin: 0 11px 0 23px;
		padding-bottom: 38.5px;
		color: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
