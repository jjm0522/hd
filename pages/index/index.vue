<template>
	<!-- :style="{background: 'url('+imageURL+')'}" -->
	<view class="container">
		<view class="top" :style="{backgroundImage:`url(${bgTop})`}">
		</view>
		<view class="content-bg" :style="contentBg">
			<!-- 线索举报、精彩活动。。按钮 -->
			<view class="btn">
				<!-- 线索举报 -->
				<view class="online" @click="handleOnline">
					<view class="item-img" :style="{backgroundImage:`url(${onlineImg})`}"></view>
				</view>
				<!-- 积分商城 -->
				<view class="shop" @click="handleAnswer">
					<view class="item-img" :style="{backgroundImage:`url(${shopImg})`}"></view>
				</view>
				<!-- 精彩活动 -->
				<view class="answer" @click="handActive">
					<view class="item-img" :style="{backgroundImage:`url(${answerImg})`}"></view>
				</view>
				<!-- 网友福利 -->
				<view class="gift" @click="handFriend">
					<view class="item-img" :style="{backgroundImage:`url(${giftImg})`}"></view>
				</view>
				<!-- 个人中心 -->
				<view class="my" @click="handleMy">
					<view class="item-img" :style="{backgroundImage:`url(${myImg})`}"></view>
				</view>
				<van-button></van-button>
			</view>
		</view>
		<!-- <view class="bottom" :style="bottom"></view> -->
	</view>
</template>

<script>
	// import bg from '@/static/bg.png'
	import indexBackgroundImage from "@/static/bg.png"
	import onlineImg from "@/static/1-2.png"
	import shopImg from "@/static/1-4.png"
	import answerImg from "@/static/1-3.png"
	import giftImg from "@/static/1-5.png"
	import bgTop from '@/static/bgTop2.jpg'
	import myImg from '@/static/1-6.png'

	export default {
		data() {
			return {
				indexBackgroundImage: indexBackgroundImage,
				// container: {
				//   backgroundImage: 'url(' + require('../../assets/bg.png') + ')'
				// },
				onlineImg: onlineImg,
				answerImg: answerImg,
				giftImg: giftImg,
				bgTop: bgTop,
				myImg: myImg,
				shopImg: shopImg
			}
		},
		methods: {
			// 线索举报
			handleOnline() {
				uni.navigateTo({
					url: '../../components/online/online'
				});
			},
			// 赛事广场
			handleAnswer() {
				console.log(111)
				uni.navigateTo({
					url: '../../components/answer/index'
				});
			},
			// 个人中心
			handleMy() {
				console.log(111)
				uni.navigateTo({
					url: '../../components/my/index'
				});
			},
			//精彩活动
			handActive() {
				uni.navigateTo({
					url: '../../components/active/index'
				});
			},
			// 网友福利
			handFriend() {
				uni.navigateTo({
					url: '../../components/friend/index'
				});
			}
		}
	}
</script>

<style>
	.container {
		height: 100vh;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		box-sizing: border-box;
		/* padding-top: 38.5px; */
		background-image: url('https://s2.ax1x.com/2020/01/03/lNjXIe.png');
	}

	.top {
		margin: 0 35px 10px 35px;
		height: 120px;
		display: flex;
		justify-content: space-between;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.img {
		width: 177px;
		height: 177px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		position: relative;
		top: -28px;
		right: -4px;
	}

	.title-top {
		width: 96px;
		height: 17px;
		padding: 11.5px 0 0 0;
		font-family: PingFang-SC-Bold;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.7);
		letter-spacing: 6px;
	}

	.title-center {
		height: 38px;
		padding: 10px 0 0 0;
		font-family: PingFang-SC-Heavy;
		font-size: 30px;
		color: #d0d0d4;
		letter-spacing: -2px;
		font-size: 600;
	}

	.title-your {
		color: #fff;
		font-size: 40px;
		font-weight: 600;
	}

	.title-bottom {
		height: 12.5px;
		padding: 24px 0 0 0;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.4);
	}

	.content-view-wrap {
		margin: -100rpx 60rpx 80rpx 60rpx;
	}

	.content-view-left {
		width: 49%;
		float: left;
	}

	.content-view-right {
		width: 49%;
		float: right;
	}

	.view-left-top {
		width: 100%;
		height: 350rpx;
		background-color: #4d72ec;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}

	.view-left-top>span {
		color: #fff;
		font-size: 35rpx;
	}

	.view-left-middle {
		height: 280rpx;
	}



	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}

	/* .bottom {
  height: 108px;
  margin-top: -48px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
} */
	.container {
		/* height: 100vh; */
		/* background-repeat: no-repeat; */
		/* background-size: 100% 100%;
  box-sizing: border-box;
  padding-top: 38.5px; */
	}

	/* .top {
  margin: 0 30px 33px 35px;
  height: 128px;
  display: flex;
  justify-content: space-between;
} */
	.img {
		width: 375px;
		height: 128px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.btn {
		-moz-column-count: 2;
		/* Firefox */
		-webkit-column-count: 2;
		/* Safari 和 Chrome */
		column-count: 2;
		-moz-column-gap: 10px;
		-webkit-column-gap: 10px;
		column-gap: 0;
		/* width: 360px; */
		margin: 0 13.2px;
	}

	.answer,
	.shop,
	.gift,
	.my {
		break-inside: avoid;
		margin-top: 8px;
	}

	.online .item-img {
		width: 320rpx;
		height: 380rpx;

		margin: 0 auto;
	}

	.answer .item-img {
		width: 340rpx;
		height: 210rpx;


	}

	.my .item-img {
		width: 340rpx;
		height: 210rpx;


	}

	.shop .item-img {
		width: 320rpx;
		height: 380rpx;
		margin: 0 auto;
	}

	.gift .item-img {
		width: 340rpx;
		height: 325rpx;

	}

	.item-img {
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>
