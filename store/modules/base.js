import {
	login,
	getUserInfo
} from '@/api/base'

export default {
	namespaced: true,
	state: {
		hasLogin: false,
		userInfo: {},
	},
	mutations: {
		login(state, provider) {
			console.log(provider)
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider
			})
			console.log(state.userInfo);
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
		}
	},
	actions: {
		// 登录
		handleLogin({
			commit,
			dispatch
		}, {
			code,
			encryptedData,
			iv
		}) {
			return new Promise((resolve, reject) => {
				login({
						code,
						encryptedData,
						iv
					})
					.then(res => {
						if (res) {
							uni.setStorageSync('access_token', res.access_token)
							resolve()
						}
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// 获取用户相关信息
		getUserInfo({
			state,
			commit,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				try {
					getUserInfo()
						.then(res => {
							commit('login', res)
							resolve()
						})
						.catch(err => {
							reject(err)
						})
				} catch (error) {
					reject(error)
				}
			})
		}

	}
}
