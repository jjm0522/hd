<template>
	<view class="">
		<block v-for="(item,index) in lists" :key="index">
			<web-view :src="item.url"></web-view>
		</block>
	</view>
</template>

<script>
	import {
		getGiftList
	} from '../../api/gift.js'
	export default {
		data() {
			return {
				lists: ''
			}
		},
		onLoad(options) {
			console.log('options',options)
			
		}
	}
</script>

<style>
	web-view{
		width: 100%;
		height: 100%;
	}
</style>
