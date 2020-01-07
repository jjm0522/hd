<template>
	<div style="height:99vh">
		<web-view id="mapPage" width="100%" height="100%" frameborder=0 
			src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp">
		</web-view>
	</div>
</template>

<script>
	// import router from '../../router'
	// let params = {}
	export default {
		data() {
			return {
				loc: ''
			}
		},
		onLoad(options) {
			// console.log(options.params)
			let params = options
			// uni.$emit('Tmap', {})
			this.Tmap()
			// uni.$on('Tmap', this.Tmap)
		},
		// created () {
		//   // params = this.$route.params
		//   // this.Tmap()
		// },
		methods: {
			Tmap(event) {
				
				// console.log(event)
				// console.log(222)
				// console.log(event.data)
				var loc = event.data
				if (loc && loc.module == 'locationPicker') { // eslint-disable-line
					if (loc) {
						params.oaAddress = loc.poiaddress + loc.poiname
						params.latandlong = loc.latlng.lat + ',' + loc.latlng.lng
						setTimeout(() => {
							// router.replace({
							// 	name: 'online',
							// 	params: params
							// })
							uni.navigateTo({
								url: './online?params=' + params
							})
						}, 800)
					}
				}
			}
		}
	}
</script>

<style scoped>
</style>
