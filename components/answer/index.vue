<template>
	<view class="container">
		<view class="content-wrap">
			<view class="item-wrap">
				<view class="img-wrap">
					<image src="../../static/1-3.png" mode=""></image>
				</view>
				<view class="title-wrap">
					<text class="title-one">赛事标题：高校防电诈PK擂台赛</text>
					<text class="title-content">赛事内容：高校防电诈PK赛火热揭幕，等你来战！</text>
				</view>
			</view>
			<view class="item-wrap">
				<view class="img-wrap">
					<image src="../../static/1-3.png" mode=""></image>
				</view>
				<view class="title-wrap">
					<text class="title-one">赛事标题：高校防电诈PK擂台赛</text>
					<text class="title-content">赛事内容：高校防电诈PK赛火热揭幕，等你来战！</text>
				</view>
			</view>
			<view class="bottom">
				
					别拉了，到底了
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getQuestionList
	} from '../../api/answer.js'
	export default{
		onLoad(options){
			getQuestionList().then(res =>{
				console.log('res',res)
			})
		},
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped>
	.container {
	  width: 100%;
	  height: 100%;
	  /* background: #F3F4F7; */
	  /* background-color: pink; */
	  overflow: hidden;
	}
	.content-wrap{
		margin:40rpx 60rpx 40rpx 60rpx;
	}
	.item-wrap{
		width: 100%;
		height: 400rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin-top: 40rpx;
	}
	.img-wrap{
		width: 100%;
		height: 300rpx;
	}
	.img-wrap>image{
		width: 100%;
		height: 100%;
	}
	.title-wrap{
		width: 100%;
		height: 100rpx;
		
	}
	.title-one,.title-content{
		display: inline-block;
		width: 100%;
		text-align: left;
		margin-top: 14rpx;
		margin-left: 10rpx;
	}
	.bottom{
		width: 100%;
		height: 40rpx;
		/* background-color: pink; */
		text-align: center;
		line-height: 40rpx;
		margin-top: 80rpx;
	}
	
</style>
