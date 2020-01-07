<template>
	<view class="tj" :style="{backgroundImage:`url(${indexBackgroundImage})`}">
		<view class="container">
			<view class="top" :style="top">
				<view class="top-img-box">
					<!-- <img src="../../assets/onemen.png" class="top-img"> -->
					<image src="/static/onemen.png" mode="" class="top-img"></image>
				</view>
			</view>
			<view class="content">
				<view class="">
					<view class="title-sel">
						<span class="title-sel-color1" @tap="tab" :class="{ active: tabCurrentIndex === 1 }">实名举报</span>
						<span class="title-sel-color2" @tap="tab1" :class="{ active: tabCurrentIndex === 2 }">匿名举报</span>
					</view>
					<view class="wrapper-wrap" v-if="tabCurrentIndex === 1">
						<view class="jubao_name" v-if="params.oaType==1">
							举报人姓名
						</view>
						<view class="jubao_name_inp_wrap" id="oaTrueName">
							<input type="text" value="" placeholder='请输入举报人姓名' class="inp" v-if="params.oaType==1" />
						</view>
						<view class="jubao_name" v-if="params.oaType==1">
							举报人身份证号
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="password" value="" id="oaSfzNum" placeholder='请输入举报人身份证号' class="inp" v-if="params.oaType==1" />
						</view>
						<view class="jubao_name">
							举报人电话
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" id="oaTel" placeholder='请输入举报人电话' class="inp" />
						</view>
						<view class="jubao_name">
							案发时间
						</view>
						<view class="jubao_name_inp_wrap" @tap="handleTime()">
							<input type="text" value="" id="oaTime" placeholder='请选择案发时间' class="inp" />
						</view>
						<view class="jubao_name">
							案发地点
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" placeholder='请选择案发地点' class="inp inp1" />
							<view class="ditu" id="oaAddress" :style="{backgroundImage:`url(${ditu})`}" @tap.prevent="handleMap">

							</view>
						</view>
						<view class="jubao_name">
							案情描述
						</view>
						<view class="jubao_name_inp_wrap">
							<input id="oaWhat" type="text" value="" placeholder='请输入案情描述' class="inp" @input="handleDesc()" />
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" class="inp" />
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" class="inp" />
						</view>
						<view class="jubao_name">
							上传线索
						</view>
						<view class="jubao_name_inp_wrap jubao_name_inp_wrap1">
							<!-- <input type="text" value="" placeholder='请输入案情描述' class="inp" /> -->
							<van-uploader  bind:after-read="afterRead" :file-list="fileList" max-count="3"></van-uploader>
						</view>
					</view>
					<view class="wrapper-wrap" v-if="tabCurrentIndex === 2">
						<view class="jubao_name">
							举报人电话
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" placeholder='请输入举报人电话' class="inp" />
						</view>
						<view class="jubao_name">
							案发时间
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" placeholder='请选择案发时间' class="inp" />
						</view>
						<view class="jubao_name">
							案发地点
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" placeholder='请选择案发地点' class="inp inp1" />
							<view class="ditu" id="oaAddress" :style="{backgroundImage:`url(${ditu})`}" @tap.prevent="handleMap">

							</view>
						</view>
						<view class="jubao_name">
							案情描述
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" placeholder='请输入案情描述' class="inp" />
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" class="inp" />
						</view>
						<view class="jubao_name_inp_wrap">
							<input type="text" value="" class="inp" />
						</view>
						<view class="jubao_name">
							上传线索
						</view>
						<view class="jubao_name_inp_wrap jubao_name_inp_wrap1">
							<van-uploader  bind:after-read="afterRead" :file-list="fileList" max-count="3"/>
						</view>
					</view>
				</view>
				<view class="btn-sub" @tap="handleSubmit()">
					提交
				</view>
			</view>
			<view class="foot"></view>
		</view>
	</view>
</template>

<script>
	import { storeOnlineAlarm } from '@/api/online'
	import indexBackgroundImage from "@/static/bg.png"
	import onemen from "@/static/onemen.png"
	import ditu from "@/static/address.png"
	export default {

		data() {
			return {
				fileList: [],
				tabCurrentIndex: 1,
				indexBackgroundImage: indexBackgroundImage,
				onemen: onemen,
				ditu: ditu,
				params: {
					oaTime: '',
					oaAddress: '',
					oaTel: '',
					oaWhat: '',
					oaType: 1,
					oaTrueName: '',
					oaSfzNum: '',
					filePath: [],
					latandlong: ''
				},
			}
		},
		methods: {
			// 上传文件
			afterRead(event) {
				console.log(event)
				const {
					file
				} = event.detail;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				wx.uploadFile({
					url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
					filePath: file.path,
					name: 'file',
					formData: {
						user: 'test'
					},
					success(res) {
						// 上传完成需要更新 fileList
						const {
							fileList = []
						} = this.data;
						fileList.push({ ...file,
							url: res.data
						});
						this.setData({
							fileList
						});
					}
				});
			},
			tab() {
				this.tabCurrentIndex = 1
			},
			tab1() {
				this.tabCurrentIndex = 2
			},
			
			handleDesc() {
				var oaWhat = uni.createSelectorQuery().select('oaWhat')
				if (oaWhat.innerHTML.length > 300) {
					oaWhat.innerHTML = oaWhat.innerHTML.substring(0, 300)
					oaWhat.blur()
				}
			},
			handleNull() {
				// console.log('null')
			},
			infoData() {
				info().then(response => {
					if (this.params.oaType === 1) {
						var oaTrueName = uni.createSelectorQuery().select('oaTrueName')
						oaTrueName.innerHTML = response.data.data.truename
						var oaSfzNum = uni.createSelectorQuery().select('oaSfzNum')
						oaSfzNum.innerHTML = response.data.data.sfznum
					}
					var oaTel = uni.createSelectorQuery().select('oaTel')
					oaTel.innerHTML = response.data.data.tel
				})
			},
			initData() {
				var oaTel = uni.createSelectorQuery().select('oaTel')
				this.params.oaTel = oaTel.innerHTML
				var oaTime = uni.createSelectorQuery().select('oaTime')
				this.params.oaTime = oaTime.innerHTML
				var oaWhat = uni.createSelectorQuery().select('oaWhat')
				this.params.oaWhat = oaWhat.innerHTML
				if (this.params.oaType === 1) {
					var oaTrueName = uni.createSelectorQuery().select('oaTrueName')
					this.params.oaTrueName = oaTrueName.innerHTML
					var oaSfzNum = uni.createSelectorQuery().select('oaSfzNum')
					this.params.oaSfzNum = oaSfzNum.innerHTML
				}
			},
			initDom() {
				var oaTel = uni.createSelectorQuery().select('oaTel')
				oaTel.innerHTML = this.$route.params.oaTel
				var oaTime = uni.createSelectorQuery().select('oaTime')
				oaTime.innerHTML = this.$route.params.oaTime
				var oaWhat = uni.createSelectorQuery().select('oaWhat')
				oaWhat.innerHTML = this.$route.params.oaWhat
				var oaAddress = uni.createSelectorQuery().select('oaAddress')
				oaAddress.innerHTML = this.$route.params.oaAddress
				this.params.oaType = this.$route.params.oaType
				if (this.params.oaType === 1) {
					var oaTrueName = uni.createSelectorQuery().select('oaTrueName')
					oaTrueName.innerHTML = this.$route.params.oaTrueName
					var oaSfzNum = uni.createSelectorQuery().select('oaSfzNum')
					oaSfzNum.innerHTML = this.$route.params.oaSfzNum
				}
				for (var i = 0; i < this.$route.params.filePath.length; i++) {
					var imgItem = {
						w: 0,
						h: 0,
						msrc: '',
						src: ''
					}
					imgItem.src = this.$route.params.filePath[i]
					imgItem.msrc = this.$route.params.filePath[i]
					this.image.push(imgItem)
				}
				this.params.oaAddress = this.$route.params.oaAddress
				this.params.latandlong = this.$route.params.latandlong
			},
			handleTab(tab) {
				if (this.params.oaType != tab) { // eslint-disable-line
					this.params.oaType = tab
					this.params.oaTime = ''
					this.params.oaAddress = ''
					this.params.oaTel = ''
					this.params.oaWhat = ''
					this.params.oaTrueName = ''
					this.params.oaSfzNum = ''
					this.params.filePath = []
					this.params.latandlong = ''
					var oaTel = uni.createSelectorQuery().select('oaTel')
					oaTel.innerHTML = null
					var oaTime = uni.createSelectorQuery().select('oaTime')
					oaTime.innerHTML = '请选择案发时间'
					var oaAddress = uni.createSelectorQuery().select('oaAddress')
					oaAddress.innerHTML = '请选择案发地点'
					var oaWhat = uni.createSelectorQuery().select('oaWhat')
					oaWhat.innerHTML = null
					this.image = []
				}
			},
			handleTime() {
				this.$vux.datetime.show({
					cancelText: '取消',
					confirmText: '确定',
					format: 'YYYY-MM-DD',
					value: this.today,
					onConfirm(val) {
						// console.log('plugin confirm', val)
						// var oaTime = document.getElementById('oaTime')
						var oaTime = uni.createSelectorQuery().select('oaTime')
						oaTime.innerHTML = val
					},
					onShow() {
						// console.log('plugin show')
					},
					onHide() {
						// console.log('plugin hide')
					}
				})
			},
			handleMap() {
				this.initData()
				setTimeout(() => {
					// this.$router.push({
					// 	name: 'map',
					// 	params: this.params
					// })
					uni.navigateTo({
						url: './map?params=' + JSON.stringify(this.params)
					});
				}, 300)
			},
			checkIDCard(idNum) {
				// alert(idNum);
				var errors = new Array( // eslint-disable-line
					"alert('验证通过');",
					"alert('身份证号码位数不对');",
					"alert('身份证含有非法字符');",
					"alert('身份证号码校验错误');",
					"alert('身份证地区非法');"
				)
				// 身份号码位数及格式检验
				var re
				var len = idNum.length
				// 身份证位数检验
				if (len != 15 && len != 18) { // eslint-disable-line
					return false
				} else if (len == 15) { // eslint-disable-line
					re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{3})$/)
				} else {
					re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})([0-9xX])$/)
				}
				var area = {
					11: '北京',
					12: '天津',
					13: '河北',
					14: '山西',
					15: '内蒙古',
					21: '辽宁',
					22: '吉林',
					23: '黑龙江',
					31: '上海',
					32: '江苏',
					33: '浙江',
					34: '安徽',
					35: '福建',
					36: '江西',
					37: '山东',
					41: '河南',
					42: '湖北',
					43: '湖南',
					44: '广东',
					45: '广西',
					46: '海南',
					50: '重庆',
					51: '四川',
					52: '贵州',
					53: '云南',
					54: '西藏',
					61: '陕西',
					62: '甘肃',
					63: '青海',
					64: '宁夏',
					65: '新疆',
					71: '台湾',
					81: '香港',
					82: '澳门',
					91: '国外'
				}
				var idcard_array = new Array() // eslint-disable-line
				idcard_array = idNum.split('') // eslint-disable-line
				// 地区检验
				if (area[parseInt(idNum.substr(0, 2))] == null) {
					return false
				}
				// 出生日期正确性检验
				var a = idNum.match(re)
				if (a != null) { // eslint-disable-line
					var flag
					var DD
					if (len == 15) { // eslint-disable-line
						DD = new Date('19' + a[3] + '/' + a[4] + '/' + a[5])
						flag = DD.getYear() == a[3] && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5] // eslint-disable-line
					} else if (len == 18) { // eslint-disable-line
						DD = new Date(a[3] + '/' + a[4] + '/' + a[5])
						flag = DD.getFullYear() == a[3] && (DD.getMonth() + 1) == a[4] && DD.getDate() == a[5] // eslint-disable-line
					}
					if (!flag) {
						// return false;
						return false
					}
					// 检验校验位
					if (len == 18) { // eslint-disable-line
						var S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
							(parseInt(idcard_array[1]) +
								parseInt(idcard_array[11])) * 9 +
							(parseInt(idcard_array[2]) +
								parseInt(idcard_array[12])) * 10 +
							(parseInt(idcard_array[3]) +
								parseInt(idcard_array[13])) * 5 +
							(parseInt(idcard_array[4]) +
								parseInt(idcard_array[14])) * 8 +
							(parseInt(idcard_array[5]) +
								parseInt(idcard_array[15])) * 4 +
							(parseInt(idcard_array[6]) +
								parseInt(idcard_array[16])) * 2 +
							parseInt(idcard_array[7]) * 1 +
							parseInt(idcard_array[8]) * 6 +
							parseInt(idcard_array[9]) * 3
						var Y = S % 11
						var M = 'F'
						var JYM = '10X98765432'
						M = JYM.substr(Y, 1) // 判断校验位
						// 检测ID的校验位
						if (M == idcard_array[17]) { // eslint-disable-line
							return true
							// return "";
						} else {
							// return false;
							return false
						}
					}
				} else {
					// return false;
					return false
				}
				return true
			},
			handleSubmit() {
				var submit = true
				var tel = false
				var oaTel = uni.createSelectorQuery().select('oaTel')
				this.params.oaTel = oaTel.innerHTML
				var oaTime = uni.createSelectorQuery().select('oaTime')
				this.params.oaTime = oaTime.innerHTML
				var oaAddress = uni.createSelectorQuery().select('oaAddress')
				this.params.oaAddress = oaAddress.innerHTML
				var oaWhat = uni.createSelectorQuery().select('oaWhat')
				this.params.oaWhat = oaWhat.innerHTML
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
				if (!myreg.test(this.params.oaTel)) {
					tel = false
				} else {
					tel = true
				}
				if (this.params.oaType == 1) { // eslint-disable-line
					var oaTrueName = uni.createSelectorQuery().select('oaTrueName')
					this.params.oaTrueName = oaTrueName.innerHTML
					var oaSfzNum = uni.createSelectorQuery().select('oaSfzNum')
					this.params.oaSfzNum = oaSfzNum.innerHTML
					// var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
					var sfz = false
					// if (reg.test(this.params.oaSfzNum) === false) {
					//   sfz = false
					// } else {
					//   sfz = true
					// }
					sfz = this.checkIDCard(oaSfzNum.innerHTML)
					if (this.params.oaTrueName == '') { // eslint-disable-line
						this.text = '请输入举报人姓名'
						this.showPositionValue = true
						submit = false
					} else if (this.params.oaSfzNum == '') { // eslint-disable-line
						this.text = '请输入举报人身份证号'
						this.showPositionValue = true
						submit = false
					} else if (!sfz) {
						this.text = '请输入正确身份证号'
						this.showPositionValue = true
						submit = false
					}
				}
				if (this.params.oaTel == '') { // eslint-disable-line
					this.text = '请输入举报人电话'
					this.showPositionValue = true
					submit = false
				} else if (!tel) {
					this.text = '请输入正确的举报人电话'
					this.showPositionValue = true
					submit = false
				} else if (this.params.oaTime == '请选择案发时间') { // eslint-disable-line
					this.text = '请选择案发时间'
					this.showPositionValue = true
					submit = false
				} else if (this.params.oaAddress == '请选择案发地点') { // eslint-disable-line
					this.text = '请选择案发地点'
					this.showPositionValue = true
					submit = false
				} else if (this.params.oaWhat == '') { // eslint-disable-line
					this.text = '请输入案情描述'
					this.showPositionValue = true
					submit = false
				}
				if (this.image != '') { // eslint-disable-line
					this.params.filePath = []
					for (var i = 0; i < this.image.length; i++) {
						this.params.filePath.push(this.image[i].msrc)
					}
				}
				if (submit) {
					storeOnlineAlarm(this.params).then(response => {
						console.log('response',response)
						// this.text = '提交成功'
						// this.showPositionValue = true
						setTimeout(() => {
							// this.$router.push({
							// 	path: '/onlineSuccess'
							// })
						}, 800)
					})
				}
			},
			timestampToTime(date) {
				var Y = date.getFullYear() + '-'
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
				var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
				return Y + M + D
			},
			onSuccess(res, file) {
				this.image.push({
					src: res.data.url
				})
				this.params.filePath.push(res.data.url)
			},
			onError(e, file) {
				//
			},
			onRemove(index) {
				this.image.splice(index, 1)
			}
		}

	}
</script>

<style scoped>
	.title-sel {
		width: 100%;
		height: 80rpx;
		text-align: center;
		/* border-radius: 50% 0 30% 0; */
	}

	.title-sel>span {
		display: inline-block;
		width: 150rpx;
		height: 70rpx;
		background-color: #252525;
		color: #808080;
		text-align: center;
		line-height: 70rpx;
		/* border-radius: 40% 0 0 40%; */
	}

	.active {
		background-color: #6398f7 !important;
		color: #fff !important;
	}

	.title-sel-color1 {
		border-radius: 35rpx 0 0 35rpx;

	}

	.title-sel-color2 {
		border-radius: 0 35rpx 35rpx 0;
	}

	.wrapper-wrap {
		margin: 0px 40rpx 40rpx 40rpx;
		background-color: #fff;
		text-align: left;
	}

	.jubao_name {
		color: #343434;
		font-weight: 600;
		margin-top: 35rpx;
	}

	.jubao_name_inp_wrap {
		border-bottom: 1px solid #808080;
		margin-top: 25rpx;
		position: relative;
	}

	.jubao_name_inp_wrap1 {
		border: 0;
	}

	.inp {
		color: #000000;
	}

	.inp1 {
		width: 510rpx;
	}

	.ditu {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		top: 0rpx;
		right: 20rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}


	.tj {
		/* height: 100vh; */
		background-repeat: no-repeat;
		/* background-size: 100% 100%; */
		box-sizing: border-box;
		/* padding-top: 38.5px; */

	}

	.content-bg {
		background-repeat: repeat-y;
		margin: 0px 20rpx 20rpx 20rpx;
	}

	.content {
		/* text-align: center; */
	}

	.container {
		height: auto;
		color: #fff;
	}

	.top {
		height: 200rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.top-img-box {
		position: relative;
		top: -35px;
		width: 177px;
		margin: 0 auto;
		height: 177px;
	}

	.top-img {
		height: 100%;
		width: 100%;
	}



	.content {
		position: relative;
		height: auto;
		margin: 0 24px;
		background: #fff;
		border-radius: 5px;
		box-sizing: border-box;
		padding: 70rpx 0 100rpx 0;
		position: relative;
	}


	.name {
		color: rgba(0, 0, 0, 0.7);
		font-weight: bold;
		margin: 0 48px;
		font-size: 15px;
		padding-top: 18px;
		padding-bottom: 8px;
	}

	.foot {
		height: 50px;
	}

	.btn-sub {
		width: 150rpx;
		height: 50rpx;
		border-radius: 25rpx;
		background-color: #6398f7;
		line-height: 50rpx;
		position: absolute;
		bottom: -23rpx;
		left: 50%;
		transform: translate(-50%, 0);
	}
</style>
