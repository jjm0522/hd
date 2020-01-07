<template>
  <view class="container">
    <view class="content">
      <view :line-width="3" custom-bar-width="60px" default-color="#C6C6C6" active-color="#de3b12" bar-active-color="#de3b12"
       class="tab-vux">
      	<view selected @tap="handleTab(1)" class="content-item" :class="{ active: tab === 1 }">我参与的赛事</view>
      	<view @tap="handleTab(2)" class="content-item" :class="{ active: tab === 2 }">我收藏的赛事</view>
      </view>
      <view-box ref="viewBox" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="60" v-show="tab==1">
        <view class="content-inner">
          <view class="item" v-for="(item,index) in list" :key="index" @tap="handleDetail(item.versus_activity_id)">
          <flexbox :gutter="0" >
             <flexbox-item :span="4.5" class="img" v-if="item.activity.image"><img :src=item.activity.image.url alt=""></flexbox-item>
             <flexbox-item class="img" v-if="item.activity">
                <flexbox orient="vertical"  :gutter="0" >
                     <flexbox-item><view class="item-title">{{item.activity.title}}</view></flexbox-item>
                     <flexbox-item><view class="item-desc">{{item.activity.describe}}</view></flexbox-item>
                     <flexbox-item><view class="button">查看详情</view></flexbox-item>
                </flexbox>
             </flexbox-item>
          </flexbox>
          </view>
        </view>
		<van-divider contentPosition="center" :class="this.list.length == 0 ? 'show' : 'hidden'">暂无答题记录</van-divider>
        <view class="load-more-view">
          <load-more :show-loading="loading" :tip="load_more_tip"></load-more>
        </view>
      </view-box>

      <view-box ref="viewBox" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="60" v-show="tab==2">
        <view class="content-inner">
          <view class="item" v-for="(item,index) in praList" :key="index" @tap="handleDetail2(item.versus_activity_id)">
          <flexbox :gutter="0" >
              <flexbox-item :span="4.5" class="img" v-if="item.activity.image"><img :src=item.activity.image.url alt=""></flexbox-item>
             <flexbox-item class="img" v-if="item.activity">
                <flexbox orient="vertical"  :gutter="0" >
                     <flexbox-item><view class="item-title">{{item.activity.title}}</view></flexbox-item>
                     <flexbox-item><view class="item-desc">{{item.activity.describe}}</view></flexbox-item>
                     <flexbox-item><view class="button">查看详情</view></flexbox-item>
                </flexbox>
             </flexbox-item>
          </flexbox>
          </view>
        </view>

        <view class="load-more-view">
          <load-more :show-loading="loading" :tip="load_more_tip"></load-more>
        </view>
    </view-box>
    </view>
  </view>
</template>

<script>
import { getVersusJoin, getVersusCollection } from '../../api/myVersus.js'
export default {
  data () {
    return {
      params: {
        page: 1
      },
      list: [],
      praList: [],
      loading: false,
      no_more: true,
      load_err: false,
      load_more_tip: '暂无记录',
      tab: 1
    }
  },
  onLoad () {
    
    this.answerData()
  },
  methods: {
    answerData () {
      getVersusJoin(this.params).then(response => {
		  // console.log('response',response)
		  // console.log('response.data',response.data)
		  // console.log('response.data.data',response.data.data)
		  // console.log('response.data.data.data',response.data.data.data)
        if (response.data.data) {
          this.loading = false
          this.no_more = false
          if (response.data.current_page == 1) { // eslint-disable-line
            this.list = response.data.data
            if (this.list.length < response.data.per_page) {
              this.no_more = true
            }
            // else if (this.list.length < 12) {
            //   this.loadMore()
            // }
          } else {
            var list = []
            for (var i = 0; i < response.data.data.length; i++) {
              list.push(response.data.data[i])
            }
            this.list = this.list.concat(list)
            if (parseInt(this.params.page) >= parseInt(response.data.total) / parseInt(response.data.per_page)) {
              this.no_more = true
            }
          }
          this.load_more_tip = this.no_more ? '别拉了，到底了' : '加载中'
          if (this.list.length == 0) { // eslint-disable-line
            this.load_more_tip = '暂无记录'
          }
        }
      })
    },
    practiceData () {
      getVersusCollection(this.params).then(response => {
		  console.log('response',response)
		  console.log('response.data',response.data)
		  console.log('response.data.data',response.data.data)
		  console.log('response.data.data.data',response.data.data.data)
        if (response.data.data) {
          this.loading = false
          this.no_more = false
          if (response.data.current_page == 1) { // eslint-disable-line
            this.praList = response.data.data
            if (this.praList.length < response.data.per_page) {
              this.no_more = true
            }
            // else if (this.praList.length < 12) {
            //   this.loadMore()
            // }
          } else {
            var list = []
            for (var i = 0; i < response.data.data.length; i++) {
              list.push(response.data.data[i])
            }
            this.praList = this.praList.concat(list)
            if (parseInt(this.params.page) >= parseInt(response.data.total) / parseInt(response.data.per_page)) {
              this.no_more = true
            }
          }
          this.load_more_tip = this.no_more ? '别拉了，到底了' : '加载中'
          if (this.praList.length == 0) { // eslint-disable-line
            this.load_more_tip = '暂无记录'
          }
        }
      })
    },
    handleTab (id) {
      if (this.tab !== id) {
        this.list = []
        this.praList = []
        this.tab = id
        this.params.page = 1
        if (id === 1) {
          this.answerData()
        } else {
          this.practiceData()
        }
      }
    },
    loadMore () {
      // if (this.loading || this.no_more) return false
      // this.loading = true
      // this.params.page = this.params.page + 1
      // this.load_more_tip = '加载中'
      // if (this.tab === 1) {
      //   this.answerData()
      // } else {
      //   this.practiceData()
      // }
    },
    handleDetail (id) {
		uni.navigateTo({
			url:'./contestDetail?id='+id
		})
      // this.$router.push({ path: '/myContest/detail/' + id })
    },
    handleDetail2 (id) {
		uni.navigateTo({
			url:'./contestDetail?id='+id
		})
      // this.$router.push({ path: '/contest/detail/' + id })
    }
  }
}
</script>

<style>
	.show{
		display: block;
	}
	.hidden{
		display: none;
	}
	.button {
	  float: right;
	  margin-top: 3px;
	  width:64px;
	  height:24px;
	  background:rgba(255,182,95,1);
	  border-radius:12px;
	  font-size:12px;
	  line-height:24px;
	  color:rgba(255,255,255,1);
	  text-align: center;
	}
	.img {
	  height:88px;
	}
	.img img {
	  width:104px;
	  height:88px;
	}
	.container {
	  height: 100vh;
	  background: #F3F4F7;
	  width: 100%;
	}
	.content {
	  height: auto;
	  background: #F3F4F7;
	  width: 100%;
	}
	.content-inner {
	  padding: 24px 24px 20.5px 24px;
	}
	.tab-vux {
		font-weight: 700;
		width: 100%;
		display: flex;
		height: 80rpx;
		background-color: #fff;
	}
	
	.active {
		color: red;
	}
	
	.content-item {
		width: 50%;
		text-align: center;
		line-height: 80rpx;
	}
	.item {
	  /* height: 64.5px; */
	  padding: 9px;
	  background: #fff;
	  box-shadow: 0px 1px 24px 0px rgba(136, 136, 136, 0.35);
	  border-radius: 5px;
	  font-size: 14px;
	  color: rgba(0,0,0,0.7);
	  font-family: PingFang-SC-Bold;
	  margin-bottom: 10px;
	}
	.item-title {
	  height:22px;
	  font-size:16px;
	  line-height:26px;
	  color:rgba(51,51,51,1);
	  font-weight: bold;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	}
	.item-desc {
	  margin-top: 5px;
	  height:36px;
	  font-size:13px;
	  line-height:18px;
	  color:rgba(102,102,102,1);
	  overflow:hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
	}
	.item-bottom {
	  display: flex;
	  justify-content: space-between;
	  padding-top: 6px;
	}
	.item-score {
	  font-size: 12px;
	  color: rgba(0,0,0,0.4);
	}
	.bg {
	  height: 16px;
	}
</style>
