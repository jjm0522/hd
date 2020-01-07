<template>
	<view class="container">
		<view class="content">
			<view class="content-inner">
				<view class="top">
					<view class="top-title">
						<view>
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="top-dian"></image>
								<text class="top-name">举报状态</text>
						</view>
						<view class="top-flag">{{list.flag_name}}</view>
					</view>
					<view class="top-title">
						<view>
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="top-dian"></image>
								<text class="top-name">详情</text>
						</view>
					</view>
					<view class="top-desc">
						<text v-if="list.flag==4">{{list.remarks}}</text>
						<text v-if="list.flag!=4">您好，我们已收到您的举报，并将开展相关核查工作。</text>
					</view>
				</view>
				<view class="center">
					<group class="online-group">
						<cell title="举报人">
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="center-dian"></image>
								<text v-if="list.oaTrueName!=''">{{list.oaTrueName}}</text>
								<text v-if="list.oaTrueName==''">匿名</text>
						</cell>
						<cell title="证件号码">
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="center-dian"></image>
								<text>{{list.sfzNum}}</text>
						</cell>
						<cell title="联系电话" :value="list.oaTel">
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="center-dian"></image>
								<text>{{list.oaTel}}</text>
						</cell>
						<cell title="举报时间" :value="list.oaTime">
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="center-dian"></image>
								<text>{{list.oaTime}}</text>
						</cell>
						<cell title="举报地点" :value="list.oaAddress">
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="center-dian"></image>
								<text>{{list.oaAddress}}</text>
						</cell>
					</group>
				</view>
				<view class="bottom">
					<view class="top-title">
						<view>
							<!-- <text class="top-dian">·</text> -->
							<image src="../../static/dian.png" class="top-dian"></image>
								<text class="top-name">详情</text>
						</view>
					</view>
					<view class="top-desc">
						{{list.oaWhat}}
					</view>
					<view class="imgs">
						<image :src="item" class="img-item" v-for="(item,index) in list.filePath" :key="index"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		myOnlineDetail
	} from '../../api/my.js'
	export default {
		data() {
			return {
list: {},
			}
		},
		onLoad(options) {
			console.log('options', options)
			myOnlineDetail(options.id).then(response => {
				console.log('response',response)
				this.list = response.data
				// if (this.list.label.length === 0) {
				// 	this.labelShow = false
				// } else {
				// 	this.labelShow = true
				// }
				// this.$vux.loading.hide()
			})
		}
	}
</script>

<style>
	.container {
		height: 100vh;
		background: #f3f4f7;
	}

	.content {
		height: auto;
		background: #f3f4f7;
	}

	.content-inner {
		padding: 35px 24px 24px 24px;
	}

	.top,
	.bottom {
		height: auto;
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
	}

	.top-title {
		position: relative;
		display: flex;
		justify-content: space-between;
		height: 36.5px;
		line-height: 36.5px;
		font-size: 14px;
		color: #000;
	}

	.top-dian {
		position: absolute;
		left: 6px;
		top: 11px;
		/* color: #5f9aff;
	  font-weight: 900;
	  font-size: 20px; */
		width: 13px;
		height: 13px;
	}

	.center-dian {
		position: absolute;
		left: 6px;
		top: 15px;
		/* color: #5f9aff;
	  font-weight: 900;
	  font-size: 20px; */
		width: 13px;
		height: 13px;
	}

	.top-name {
		padding-left: 23px;
		color: rgba(0, 0, 0, 0.8);
	}

	.top-flag {
		padding-right: 14px;
		text-align: right;
		color: #73a7ff;
	}

	.top-desc {
		font-size: 12px;
		margin: 0 11px 0 23px;
		padding-bottom: 12px;
		color: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.center {
		margin: 24px 0;
		/* height: 221.5px; */
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
	}

	.imgs {
		margin-left: 23px;
		padding-bottom: 12.5px;
	}

	.img-item {
		width: 75px;
		height: 75px;
		margin-right: 8px;
	}

	.title {
		padding: 20px;
		font-size: 14px;
	}

	.title-status {
		display: flex;
	}

	.status-left {
		flex: 1;
	}

	.status-right {
		flex: 1;
		text-align: right;
	}

	.desc {
		margin-top: 10px;
	}

	.bg {
		height: 5px;
		background: #E3E3E3;
	}
</style>

<style>
	// @import '~vux/src/styles/1px.less';

	.card-demo-flex {
		display: flex;
	}

	.card-demo-content01 {
		padding: 10px 0;
	}

	.card-padding {
		padding: 15px;
	}

	.card-demo-flex>div {
		flex: 1;
		text-align: center;
		font-size: 12px;
	}

	.card-demo-flex span {
		color: #f74c31;
	}
</style>
