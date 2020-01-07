<template>
	<view class="">
		<view class="">
			
		</view>
		<view class="zanwu">
			暂无活动
		</view>
	</view>
</template>

<script>
	import {
		getQuestionList
	} from '../../api/answer.js'
	export default{
		onLoad(){
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

<style>
	.zanwu{
		margin-top: 80rpx;
	}
</style>
