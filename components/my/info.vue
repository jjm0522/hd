<template>
	<view class="tj">
		<view class="container">
			<view class="content">
				<view class="top">
					<view class="top-title">M.</view>
					<view class="top-img">
						<image :src="items.headimageurl" class="img"></image>
					</view>
				</view>
				<view class="center">
					<view class="attestation" v-if="realName">
						<view title="">姓名
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.truename}}</text>
						</view>
						<view title="身份证号">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.sfznum}}</text>
						</view>
						<view title="手机">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.tel}}</text>
						</view>
					</view>
					<view class="center-btn" v-if="realName">
						<image src="../../assets/attestation.png" class="btn-image"></image>
						已认证
					</view>
					<view v-if="!realName" style="overflow: hidden;">
						<view class="one">
							<text class="one-title">身份证号</text>
							<input placeholder="请输入身份证号" v-model="realParams.sfznum" class="inp"></input>
						</view>
						<view class="one">
							<text class="one-title">真实姓名</text>
							<input placeholder="请输入真实姓名" v-model="realParams.sfznum" class="inp"></input>
						</view>
						<view class="one">
							<text class="one-title">电话</text>
							<input placeholder="请输入电话" v-model="realParams.sfznum" class="inp"></input>
						</view>

						<!-- <input title="真实姓名" ref="name" is-type="china-name" placeholder="请输入真实姓名" v-model="realParams.truename"></input>
						<input title="电话" placeholder="请输入电话" keyboard="number" is-type="china-mobile" ref="phonenum" v-model="realParams.tel"></input> -->
					</view>
					<view class="center-btn btn-edit" v-if="!realName" @click="handleSubmitTname">
						请实名认证
					</view>
				</view>
				<view class="bottom">
					<view v-if="edit">
						<view title="邮箱">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.email}}</text>
						</view>
						<view title="QQ">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.qq}}</text>
						</view>
						<view title="生日">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.birthday}}</text>
						</view>
						<view title="区域">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{citya}}</text>
						</view>
						<view title="单位">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.department}}</text>
						</view>
						<view title="职位">
							<image src="../../static/dian.png" class="dian"></image>
							<text>{{items.position}}</text>
						</view>
					</view>
					<view class="center-btn btn-edit" v-if="edit" @click="handleEditShow">
						完善信息
					</view>
					<view v-if="!edit" style="overflow: hidden;">
						<view class="one">
							<text class="one-title">邮箱</text>
							<input placeholder="请输入邮箱" v-model="realParams.sfznum" class="inp"></input>
						</view>
						<view class="one">
							<text class="one-title">QQ</text>
							<input placeholder="请输入QQ" v-model="realParams.sfznum" class="inp"></input>
						</view>
						<view class="one">
							<text class="one-title">生日</text>
							<input placeholder="生日" v-model="realParams.sfznum" class="inp"></input>
						</view>
						<view class="one">
							<text class="one-title">请选择区域</text>
							<input placeholder="请选择区域" v-model="realParams.sfznum" class="inp"></input>
							<!-- <van-area :area-list="areaList" /> -->
							<!-- <van-popup v-model="show" position="bottom">
								<van-area :area-list="areaList" @confirm="onAddrConfirm" @cancel="onAddrCancel" title="标题" />
							</van-popup> -->
						</view>
						<view class="one">
							<text class="one-title">单位</text>
							<input placeholder="请选择区域" v-model="params.city_num" class="inp"></input>
						</view>
						<view class="one">
							<text class="one-title">职位</text>
							<input placeholder="请输入职位" v-model="realParams.sfznum" class="inp"></input>
						</view>
						<!-- <input ref="email" title="邮箱" is-type="email" placeholder="请输入邮箱" v-model="params.email"></x-input>
            <input title="QQ" placeholder="请输入QQ" v-model="params.qq"></x-input>
            <datetime
              v-model="params.birthday"
              title="生日" :min-year=1925></datetime>
            <x-address class="x-address" @on-shadow-change="onShadowChange" title="请选择区域" v-model="params.city_num" :list="addressData" placeholder="请选择区域"></x-address>
            <x-input title="单位" placeholder="请输入单位" v-model="params.department"></x-input>
            <x-input title="职位" placeholder="请输入职位" v-model="params.position"></x-input> -->
					</view>
					<view class="center-btn btn-edit" v-if="!edit" @click="handleEdit">
						修改信息
					</view>
				</view>
			</view>
			<!-- <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :text="text" position="middle"></toast> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		methods: {
			onSelAddr() { //选择地区
				this.show = true;
			},
			onAddrConfirm(val) { //确定选择
				this.show = false;
				this.addrInfo = val[0].name + val[1].name + val[2].name
			},
			onAddrCancel() { //取消选择
				this.show = false;
			}
			// showPopup() {
			// 	this.show = true;
			// },

			// onClose() {
			// 	this.show = false;
			// }
		}
	}
</script>

<style>
	.one {
		display: flex;
		width: 100%;
		height: 50rpx;
		/* background-color: pink; */
		margin: 40rpx 20rpx 0 20rpx;

	}

	.one-title {
		display: inline-block;
		width: 150rpx;
		height: 100%;
		line-height: 50rpx;
		text-align: left;
	}

	.inp {
		width: 450rpx;
		text-align: right;

	}

	.tj {
		height: 100vh;
		background: #F3F4F6;
	}

	.tj .weui-view_access {
		padding: 0 20px !important;
		height: 43px !important;
		line-height: 43px !important;
		height: auto;
		line-height: normal;
	}

	.weui-view {
		padding: 0 20px !important;
		height: 43px !important;
		line-height: 43px !important;
		height: auto;
		line-height: normal;
	}

	.container {
		height: auto;
		background: #F3F4F6;
	}

	.content {
		padding: 24px 24px 40px 24px;
	}

	.top {
		display: flex;
		justify-content: space-between;
		height: 79px;
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
	}

	.top-title {
		height: 79px;
		line-height: 79px;
		padding-left: 12px;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.7);
	}

	.top-img {
		width: 79px;
		height: 79px;
		padding: 12px;
		box-sizing: border-box;
	}

	.dian {
		position: absolute;
		left: 6px;
		top: 15px;
		/* color: #5f9aff;
	  font-weight: 900;
	  font-size: 20px; */
		width: 13px;
		height: 13px;
	}

	.img {
		width: 55px;
		height: 55px;
		border-radius: 50%;
	}

	.center {
		position: relative;
		height: 169px;
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
		margin-top: 16px;
	}

	.attestation {
		color: #5f9aff;
	}

	.center-btn {
		position: absolute;
		width: 100px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		color: #5f9aff;
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 15px;
		bottom: -15px;
		left: 50%;
		margin-left: -50px;
		font-weight: 600;
		font-size: 15px;
	}

	.btn-img {
		position: relative;
		top: 2px;
		width: 12px;
		height: 14px;
	}

	.btn-edit {
		background: #5f9aff;
		color: #fff;
	}

	.bottom {
		position: relative;
		/* height: 213.5px; */
		height: 299.5px;
		margin-top: 31px;
		background: #fff;
		box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
		border-radius: 5px;
	}
</style>
