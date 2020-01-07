<template>
	<view class="container">
		<view class="content">
			<!-- <tab :line-width="3" custom-bar-width="60px" default-color="#C6C6C6" active-color="#5F9AFF" bar-active-color="#5F9AFF" class="tab-vux">
        <tab-item selected @on-item-click="handleTab(1)">答题活动</tab-item>
        <tab-item @on-item-click="handleTab(2)">题库练习</tab-item>
      </tab> -->
			<view :line-width="3" custom-bar-width="60px" default-color="#C6C6C6" active-color="#de3b12" bar-active-color="#de3b12"
			 class="tab-vux">
				<view selected @tap="handleTab(1)" class="content-item" :class="{ active: tab === 1 }">答题活动</view>
				<view @tap="handleTab(2)" class="content-item" :class="{ active: tab === 2 }">题库练习</view>
			</view>
			<view-box ref="viewBox" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="60"
			 v-show="tab==1">
				<view class="content-inner">
					<view v-for="(item,index) in list" :key="index">
						<view class="item" @click="handleDetail(item.id)">
							<view class="item-title">{{item.info_name}}</view>
							<view class="item-bottom">
								<view><text class="item-score">得分：</text>{{item.score}}</view>
								<view class="item-time">{{item.updated_at}}</view>
							</view>
						</view>
						<view class="bg"></view>
					</view>
				</view>
				<van-divider contentPosition="center" :class="this.list.length == 0 ? 'show' : 'hidden'">暂无答题记录</van-divider>
				<view class="load-more-view">
				</view>
			</view-box>

			<view ref="viewBox"
			 v-show="tab==2">
				<view class="content-inner">
					<view v-for="(item,index) in praList" :key="index">
						<view class="item" @click="handleDetail(item.id)">
							<view class="item-title">{{item.info_name}}</view>
							<view class="item-bottom">
								<view><text class="item-score">得分：</text>{{item.score}}</view>
								<view class="item-time">{{item.updated_at}}</view>
							</view>
						</view>
						<view class="bg"></view>
					</view>
				</view>
				<van-divider contentPosition="center" :class="this.praList.length == 0 ? 'show' : 'hidden'">暂无答题记录</van-divider>
				<view class="load-more-view">
					<load-more :show-loading="loading" :tip="load_more_tip"></load-more>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getAnswer, getPractice } from '../../api/my.js'
	export default {
		data() {
			return {
				params: {
					page: 1
				},
				list: [],
				praList: [],
				loading: false,
				no_more: true,
				load_err: false,
				load_more_tip: '暂无答题记录',
				tab: 1
			}
		},
		onLoad(){
			 this.answerData()
		},
		methods: {
			answerData() {
				getAnswer(this.params).then(response => {
					console.log('response',response)
					console.log('response.data',response.data)
					console.log('response.data.data',response.data.data)
					if (response.data) {
						this.loading = false
						this.no_more = false
						if (response.data.current_page == 1) { // eslint-disable-line
							this.list = response.data
							if (this.list.length < response.data.per_page) {
								this.no_more = true
							}
							// else if (this.list.length < 12) {
							//   this.loadMore()
							// }
						} else {
							var list = []
							for (var i = 0; i < response.data.length; i++) {
								list.push(response.data[i])
							}
							this.list = this.list.concat(list)
							if (parseInt(this.params.page) >= parseInt(response.data.total) / parseInt(response.data.per_page)) {
								this.no_more = true
							}
						}
						this.load_more_tip = this.no_more ? '别拉了，到底了' : '加载中'
						if (this.list.length == 0) { // eslint-disable-line
							this.load_more_tip = '暂无答题记录'
						}
					}
				})
			},
			practiceData() {
				getPractice(this.params).then(response => {
					console.log('practiceData',response)
					console.log('practiceData.data',response.data)
					if (response.data) {
						this.loading = false
						this.no_more = false
						if (response.data.current_page == 1) { // eslint-disable-line
							this.praList = response.data
							if (this.praList.length < response.data.per_page) {
								this.no_more = true
							}
							// else if (this.praList.length < 12) {
							//   this.loadMore()
							// }
						} else {
							var list = []
							for (var i = 0; i < response.data.length; i++) {
								list.push(response.data[i])
							}
							this.praList = this.praList.concat(list)
							if (parseInt(this.params.page) >= parseInt(response.data.total) / parseInt(response.data.per_page)) {
								this.no_more = true
							}
						}
						this.load_more_tip = this.no_more ? '别拉了，到底了' : '加载中'
						if (this.praList.length == 0) { // eslint-disable-line
							this.load_more_tip = '暂无答题记录'
						}
					}
				})
			},
			handleTab(id) {
				if (this.tab !== id) {
					this.list = []
					this.praList = []
					this.tab = id
					this.params.page = 1
					if (id === 1) {
						this.answerData()
					} else {
						this.practiceData()
					}
				}
			},
			loadMore() {
				if (this.loading || this.no_more) return false
				this.loading = true
				this.params.page = this.params.page + 1
				this.load_more_tip = '加载中'
				if (this.tab === 1) {
					this.answerData()
				} else {
					this.practiceData()
				}
			},
			handleDetail(id) {
				this.$router.push({
					name: 'myAnswerDetail',
					params: {
						id: id
					}
				})
			}
		}
	}
</script>

<style>
	.show{
		display: block;
	}
	.hidden{
		display: none;
	}
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

	.content-inner {
		padding: 24px 24px 20.5px 24px;
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

	.item {
		height: 64.5px;
		padding: 0 9.5px 0 12px;
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.7);
		font-family: PingFang-SC-Bold;
	}

	.item-title {
		padding-top: 12px;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-bottom {
		display: flex;
		justify-content: space-between;
		padding-top: 6px;
	}

	.item-score {
		font-size: 12px;
		color: rgba(0, 0, 0, 0.4);
	}

	.bg {
		height: 16px;
	}
</style>
