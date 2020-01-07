<template>
	<view class="tj" :style="{backgroundImage:`url(${indexBackgroundImage})`}">
		<view class="container">
			<view class="touxiang-wrap">
				<view class="touxiang">

				</view>
				<view class="nicheng">
					M.
				</view>
			</view>
			<view class="wrap">
				<view class="one" @tap="handleMaterial">
					<view class="icon-wrap">
						<view class="icon-img" :style="{backgroundImage:`url(${itemMaterial})`}">

						</view>
					</view>
					<view class="ziliao-wrap">
						<p class="ziliao">我的资料</p>
						<p class="xinxi">完善个人信息</p>
					</view>
					<view class="jiantou_right">
						<image src="../../static/right.png" mode="" class="right"></image>
					</view>
				</view>

				<view class="one" @tap="handleRedPack">
					<view class="icon-wrap">
						<view class="icon-img" :style="{backgroundImage:`url(${redPack})`}">

						</view>
					</view>
					<view class="ziliao-wrap">
						<p class="ziliao">活动红包</p>
						<p class="xinxi">查看红包明细</p>
					</view>
					<view class="jiantou_right">
						<image src="../../static/right.png" mode="" class="right"></image>
					</view>
				</view>

				<view class="one" @tap="handleReport">
					<view class="icon-wrap">
						<view class="icon-img" :style="{backgroundImage:`url(${report})`}">

						</view>
					</view>
					<view class="ziliao-wrap">
						<p class="ziliao">我的举报</p>
						<p class="xinxi">了解举报进度</p>
					</view>
					<view class="jiantou_right">
						<image src="../../static/right.png" mode="" class="right"></image>
					</view>
				</view>

				<view class="one" @tap="handleAnswer">
					<view class="icon-wrap">
						<view class="icon-img" :style="{backgroundImage:`url(${answer})`}">

						</view>
					</view>
					<view class="ziliao-wrap">
						<p class="ziliao">我的活动</p>
						<p class="xinxi">回顾活动记录</p>
					</view>
					<view class="jiantou_right">
						<image src="../../static/right.png" mode="" class="right"></image>
					</view>
				</view>

				<view class="one" @tap="handleSaishi">
					<view class="icon-wrap">
						<view class="icon-img" :style="{backgroundImage:`url(${saishi})`}">
						</view>
					</view>
					<view class="ziliao-wrap">
						<p class="ziliao">我的赛事</p>
						<p class="xinxi">查看参与赛事和收获赛事</p>
					</view>
					<view class="jiantou_right">
						<image src="../../static/right.png" mode="" class="right"></image>
					</view>
				</view>

				<view class="one" @tap="handleZhandui">
					<view class="icon-wrap">
						<view class="icon-img" :style="{backgroundImage:`url(${zhandui})`}">
						</view>
					</view>
					<view class="ziliao-wrap">
						<p class="ziliao">我的战队</p>
						<p class="xinxi">查看我的小伙伴</p>
					</view>
					<view class="jiantou_right">
						<image src="../../static/right.png" mode="" class="right"></image>
					</view>
				</view>

			</view>
			<view class="foot"></view>
		</view>
	</view>
</template>

<script>
	import indexBackgroundImage from "@/static/bg.png"
	import itemMaterial from '@/static/material.png'
	import redPack from '@/static/redPack.png'
	import report from '@/static/report.png'
	import answer from '@/static/answer.png'
	import saishi from '@/static/saishi.png'
	import zhandui from '@/static/zhandui.png'
	export default {

		data() {
			return {
				indexBackgroundImage: indexBackgroundImage,
				itemMaterial: itemMaterial,
				redPack: redPack,
				report: report,
				answer: answer,
				saishi: saishi,
				zhandui: zhandui
			}
		},
		methods: {
			handleMaterial() {
				uni.navigateTo({
					url: './info'
				})
			},
			handleRedPack() {
				uni.navigateTo({
					url: './redPacket'
				})
			},
			handleReport() {
				uni.navigateTo({
					url: './online'
				})
			},
			handleAnswer() {
				uni.navigateTo({
					url: './answers'
				})
			},
			handleSaishi() {
				uni.navigateTo({
					url: './contest'
				})
			},
			handleZhandui() {
				uni.navigateTo({
					url: './answers'
				})
			}
		}
	}
</script>

<style scoped>
	.tj {
		/* height: 100vh; */
		background-repeat: no-repeat;
		background-size: 100% 100%;
		box-sizing: border-box;
		/* padding-top: 38.5px; */

	}

	.container {
		height: auto;
		color: #fff;
	}

	.touxiang {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		background-color: #000080;
		text-align: center;
		margin-left: 50%;
		margin-top: 20%;
		transform: translate(-50%, -60%);
	}

	.touxiang-wrap {
		width: 100%;
		height: 300rpx;
		overflow: hidden;
		/* background-color: pink; */
	}

	.nicheng {
		margin-top: -72rpx;
	}

	.wrap {
		margin: 40rpx 80rpx 40rpx 80rpx;
	}

	.one {
		width: 100%;
		height: 130rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-bottom: 40rpx;
		text-align: left;
	}

	.icon-wrap {
		width: 100rpx;
		height: 100rpx;
		/* background-color: pink; */
		border-radius: 50%;
		float: left;
		margin: 5px 15px 0 5px;

	}

	.ziliao-wrap {
		float: left;
		margin-top: 16px;
	}

	.jiantou_right {
		float: right;
		margin: 25px 10px;

	}

	.right {
		width: 23rpx;
		height: 28rpx;

	}

	.ziliao {
		color: #000000;
	}

	.xinxi {
		color: #C0C0C0;
		font-size: 25rpx;
		margin-top: 8rpx;
	}

	.foot {
		height: 20px;
	}

	.icon-img {
		width: 125rpx;
		height: 125rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
</style>
