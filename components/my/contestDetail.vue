<template>
  <div class="container">
    <div class="content" v-show="is_show">
      <img v-if="items.image" :src="items.image.url" class="img">
      <div class="desc">
        <div class="name">赛事标题：{{items.title}}</div>
        <div class="time">赛事时间：{{items.start_time}}-{{items.end_time}}</div>
        <div class="desc-content" v-if="versusItem.is_captain">我的战队：{{versusItem.item}}战队</div>
        <div class="desc-content">赛事内容：{{items.describe}}</div>
        <div class="detail" v-html="items.info_content"></div>
         <flexbox>
        <flexbox-item>
          <div class="team_points">
            <flexbox>
              <flexbox-item>
                <div class="team_color points_title">团队得分</div>
                <div class="team_color points_value">{{item_score}}</div>
              </flexbox-item>
              <flexbox-item><div class="team_background"></div></flexbox-item>
            </flexbox>
          </div>
        </flexbox-item>
        <flexbox-item><div class="my_points">
            <flexbox>
              <flexbox-item>
                <div class="my_color points_title">个人得分</div>
                <div class="my_color points_value">{{user_score}}</div>
              </flexbox-item>
              <flexbox-item><div class="my_background"></div></flexbox-item>
            </flexbox>
          </div></flexbox-item>
      </flexbox>
         <flexbox>
      <flexbox-item><div class="tj-h2">{{statistics.click_num}}</div></flexbox-item>
      <flexbox-item><div class="tj-h2">{{statistics.item_total}}</div></flexbox-item>
      <flexbox-item><div class="tj-h2">{{statistics.user_total}}</div></flexbox-item>
      <flexbox-item><div class="tj-h2">{{statistics.collection_num}}</div></flexbox-item>

    </flexbox>
     <flexbox>
      <flexbox-item><div class="tj-h5">点击量</div></flexbox-item>
      <flexbox-item><div class="tj-h5">答题战队数</div></flexbox-item>
      <flexbox-item><div class="tj-h5">答题总人数</div></flexbox-item>
      <flexbox-item><div class="tj-h5">收藏总数</div></flexbox-item>
    </flexbox>
        <!-- <div class="warn" v-if="items.is_real_name==0">温馨提示：实名认证后才有机会获得红包</div> -->
      </div>
    <div class="tj"></div>

    <div @click="getTeam()" class="tj-container" >
       <flexbox>
      <flexbox-item :span="10.5"><div class="tj-title">参与战队（{{zhandui_num}}）</div></flexbox-item>
      <flexbox-item :span="1.5">更多></flexbox-item>
    </flexbox>
    <div class="tjs"></div>
    <flexbox v-if="itemRanking.length > 0">
      <flexbox-item v-for="(item,index) in itemRanking" :key="index">
        <flexbox orient="vertical">
          <flexbox-item><div class="tj-center" v-if="item.image"><img class="tj-image" :src=item.image /></div></flexbox-item>
          <flexbox-item class="tj-h3">{{item.title}}</flexbox-item>
          <flexbox-item class="tj-h6">人数：{{item.user_total}}人</flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
     <flexbox v-else>
      <flexbox-item v-for="(item,index) in zhandui" v-if="index < 3" :key="index">
        <flexbox orient="vertical">
          <flexbox-item><div class="tj-center" v-if="item.image"><img class="tj-image" :src=item.image.url /></div></flexbox-item>
          <flexbox-item class="tj-h3">{{item.name}}</flexbox-item>
          <flexbox-item class="tj-h6">人数：{{item.total_user}}人</flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    </div>
    <div class="tj"></div>

    <div class="tj-container">
       <flexbox>
      <flexbox-item :span="10.5"><div class="tj-title">赛事详情</div></flexbox-item>
    </flexbox>
      <div class="tj-container" v-html="items.detail"></div>
    </div>
    <div class="tj-fixed-end"></div>
      <!-- <div class="btn">
        <div class="btn-left" @click="handleTrueName" v-if="items.is_real_name==0">实名认证</div>
        <div class="btn-right" @click="handleSubmit" v-if="items.status!='closed'">开始答题</div>
        <div class="btn-right btn-right-closed" v-if="items.status=='closed'">活动已关闭</div>
      </div> -->
    <flexbox :gutter="0" class="tj-fixed">
          <flexbox-item>
            <flexbox class="tj-white-back" orient="vertical">
          <flexbox-item><div class="tj-margin-auto shoucang" :class="{active: items.is_collection}" @click="toggleCollect()"></div></flexbox-item>
          <flexbox-item class="tj-h6"><div @click="toggleCollect()" v-if="items.is_collection">取消收藏</div><div @click="toggleCollect()" v-else>收藏</div></flexbox-item>
        </flexbox></flexbox-item>
          <flexbox-item><div @click="getRanking()" class="contest_ranking">赛事排名</div></flexbox-item>
          <flexbox-item><div @click="postAnswer()" class="contest_answer">我要答题</div></flexbox-item>
        </flexbox>
      <div v-transfer-dom>
        <x-dialog v-model="showToast" hide-on-blur class="dialog">
          <div class="dialog_title">提示</div>
          <div class="dialog_desc">您还没有<span style="color:red">实名认证</span>，不能进行答题，赶快认证吧！</div>
          <group class="attestation">
            <x-input title="姓名" ref="name" is-type="china-name" placeholder="请输入真实姓名" v-model="params.truename"></x-input>
            <x-input title="身份证号" placeholder="请输入身份证号" v-model="params.sfznum"></x-input>
            <x-input title="手机号" placeholder="请输入电话" keyboard="number" is-type="china-mobile" ref="phonenum" v-model="params.tel"></x-input>
            <!-- <div class="group-bg"></div> -->
          </group>
          <div class="attestation-btn" @click="handleSubmitTname">确认</div>
        </x-dialog>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="showToastTeam" hide-on-blur class="dialog">
          <div class="dialog_title">提示</div>
          <div class="dialog_desc">您还没有<span style="color:red">战队</span>，快加入战队和你的小伙伴们一起答题吧！</div>
          <div class="attestation-btn" @click="getTeam">参与战队</div>
        </x-dialog>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="showToastTeam2" hide-on-blur class="dialog">
          <div class="dialog_title">提示</div>
          <div class="dialog_desc">您的战队尚未参与该赛事，请退出原战队后，加入本赛事活动战队进行答题。</div>
          <div class="attestation-btn" @click="myTeam">我的战队</div>
        </x-dialog>
      </div>
      <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :text="text" position="middle"></toast>
    </div>
  </div>
</template>

<script>
import { VersusActivityItemRanking, getVersusActivity, getVersusActivityStatistics, getVersusActivityItem, postVersusActivityList, getVersusActivityQuestion, postVersusActivityJoin } from '../../api/teamAnswer.js'
import { infoEdit, info } from '../../api/my.js'
import { getVersusUserJoinScore } from '../../api/myVersus.js'
export default {
  // directives: {
  //   TransferDom
  // },
  
  data () {
    return {
      item_score: 0,
      user_score: 0,
      versusItem: {},
      is_show: 0,
      is_item_join: 0,
      itemRanking: [],
      zhandui: {},
      zhandui_num: 0,
      items: {},
      statistics: {},
      showToast: false,
      showToastTeam: false,
      showToastTeam2: false,
      params: {
        sfznum: '',
        truename: '',
        tel: '',
        email: null,
        qq: null,
        birthday: null,
        city_str: null,
        city_num: null,
        position: null,
        department: null
      },
      rankingParams: {
        page: 1,
        limit: 3
      },
      showPositionValue: false,
      text: '',
      highest_time: null,
      current_time: null,
      highest_score: '',
      isSelected: false
    }
  },
  onLoad (options) {
	  console.log('options',options)
    // this.$vux.loading.show()
    this.fetchData(options)
    // this.getInfo(options)
    // this.getItemRanking(options)
    // this.showToast = true
  },
  methods: {
    getItemRanking () {
      VersusActivityItemRanking(this.$route.params.id, this.rankingParams).then(res => {
        this.itemRanking = res.data.data.data
      })
    },
    getInfo () {
      info().then(res => {
        this.versusItem = res.data.data.versusItem
      })
    },
    getRanking () {
      this.$router.push({ name: 'RankList', query: { id: this.$route.params.id, title: this.items.title } })
    },
    postJoin () {
      postVersusActivityJoin(this.$route.params.id).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
          if (response.data.data === '成功加入赛事') {
            this.$vux.toast.text('成功加入赛事')
            this.is_item_join = 1
            // this.postAnswer()
          } else if (response.data.data === '尚未加入战队') {
            this.showToastTeam = true
          }
        }
      })
    },
    postAnswer () {
      getVersusActivityQuestion(this.$route.params.id).then(response => {
        // console.log(response)
        if (response.data.code === 200) {
          if (response.data.data === '未实名认证') {
            this.showToast = true
          } else if (response.data.data === '战队尚未参与该赛事') {
            this.showToastTeam2 = true
          } else if (response.data.data === '不在活动时间内') {
            this.$vux.toast.text('不在活动时间内')
          } else if (response.data.data === '尚未加入战队') {
            this.showToastTeam = true
          } else {
            this.$router.push({ path: '/contest/answer/' + this.$route.params.id })
          }
        }
      })
    },
    getTeam () {
      this.$router.push({ path: '/contest/team/' + this.$route.params.id })
    },

    myTeam () {
      this.$router.push({ path: '/myTeam' })
    },
    // postAnswer () {

    // },
    toggleCollect () {
      // this.$vux.loading.show()
      postVersusActivityList(this.$route.params.id).then(response => {
        // console.log(response.data)
        if (response.data.code === 200) {
          this.items.is_collection = !this.items.is_collection
          this.$vux.loading.hide()
          this.$vux.toast.text(response.data.data)
        }
      })
    },
    fetchData (options) {
      getVersusUserJoinScore(options.id).then(response => {
		  console.log('response',response)
		  console.log('response.data',response.data)
		  console.log('response.data.data',response.data.data)
        this.item_score = response.data.data.item_score
        this.user_score = response.data.data.user_score
      })
      getVersusActivity(options.id).then(response => {
        // console.log(response)
        this.items = response.data.data
        this.is_item_join = this.items.is_item_join
        this.$vux.loading.hide()
        this.is_show = 1
        // this.highest_time = response.data.data.highest_time
        // this.current_time = response.data.data.current_time
        // this.highest_score = response.data.data.highest_score
        // this.items = response.data.data.info
      })

      getVersusActivityStatistics(this.$route.params.id).then(res => {
        this.statistics = res.data.data
      })
      getVersusActivityItem(this.$route.params.id).then(res => {
        this.zhandui = res.data.data.data
        this.zhandui_num = res.data.data.total

        // console.log(this.zhandui)
      })
    },
    handleSubmit () {
      if (parseInt(this.highest_score) === 100) {
        this.showPositionValue = true
        this.text = '已全部答对，请勿重复答题'
      } else if (this.highest_time - this.current_time === 0) {
        this.showPositionValue = true
        this.text = '已达到答题上限'
      } else {
        this.$router.push({ name: 'answerDetail', params: { id: this.$route.params.id, title: this.items.title } })
      }
    },
    handleTrueName () {
      this.showToast = true
    },
    handleSubmitTname () {
      var sfz = false
      sfz = this.checkIDCard(this.params.sfznum)
      if (this.params.sfznum == '') { // eslint-disable-line
        this.showPositionValue = true
        this.text = '请输入身份证号'
        return
      } else if (!sfz) { // eslint-disable-line
        this.showPositionValue = true
        this.text = '请输入正确的身份证号'
        return
      } else if (this.params.truename == '') { // eslint-disable-line
        this.showPositionValue = true
        this.text = '请输入真实姓名'
        return
      } else if (this.$refs.name.valid == false) { // eslint-disable-line
        this.showPositionValue = true
        this.text = '请输入正确的真实姓名'
        return
      } else if (this.params.tel == '') { // eslint-disable-line
        this.showPositionValue = true
        this.text = '请输入联系电话'
        return
      } else if (this.$refs.phonenum.valid == false) { // eslint-disable-line
        this.showPositionValue = true
        this.text = '请输入正确的联系电话'
        return
      }
      infoEdit(this.params).then(response => {
        this.showPositionValue = true
        this.text = response.data.data
        setTimeout(() => {
          this.postAnswer()
        }, 500)
      })
      this.showToast = false
    },
    checkIDCard (idNum) {
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
    }
  }
}
</script>

<style scoped>
.img_height {height:2rem}
.team_color{color:#FF8B00}
.my_color{color:#005CFF}
.points_title{
margin:12px 0px 0px 16px;
height:14px;
font-size:10px;
line-height:18px;
}
.points_value{
margin:1px 0px 0px 14px;
height:31px;
font-size:26px;
font-weight:bold;
line-height:47px;
}
.team_background{
  margin: 12px 0px 0px 10px;
  width: 52px;
  height: 45px;
  background: url(../../static/team_contest.png);
  background-repeat: no-repeat;
  background-size: 52px 45px;
  background-position: right 50%;
}
.my_background{
  margin: 12px 0px 0px 10px;
  width: 52px;
  height: 45px;
  /* background: url(../../assets/my_contest.png); */
  background: url(../../static/my_contest.png);
  background-repeat: no-repeat;
  background-size: 52px 45px;
}
.team_points{
margin-top: 18px;
height:72px;
background:rgba(255,182,95,0.4);
/* opacity:0.4; */
border-radius:8px;
}
.my_points{
margin-top: 18px;
height:72px;
background:rgba(95,154,255,0.4);
border-radius:8px;
}
.group-bg{height:0px;}
.dialog_title{
margin:30px auto 0px auto;
width:64px;
height:24px;
font-size:17px;
font-weight:bold;
line-height:18px;
color:rgba(51,51,51,1);
opacity:1;
text-align: center;
}
.dialog_desc{
  margin:10px auto;
  width:230px;
  height:41px;
  font-size:14px;
  line-height:21px;
  color:rgba(51,51,51,1);
  opacity:1;
}
.weui-dialog .weui-cells:before {
border:0px;
}
.weui-cell {
  padding: 0 20px !important;
  height: 43px !important;
  line-height: 43px !important;
  height: auto;
  line-height: normal;
}
.tj-white-back{background: #fff;height:52px;}
.tj-fixed{position: fixed;bottom:0;}
.tj-fixed-end{height:92px;}
.tj-margin-auto {margin:8px auto 0px auto;}
.shoucang {
  width: 17px;
  height: 16px;
  /* background: url(../../assets/shoucang.png); */
  background: url(../../static/shoucang.png);
  background-repeat: no-repeat;
  background-size: 17px 16px;
}
.shoucang.active {
  width: 17px;
  height: 16px;
  /* background: url(../../assets/shoucang_s.png); */
  background: url(../../static/shoucang_s.png);
  background-repeat: no-repeat;
  background-size: 17px 16px;
}
.contest_ranking{
  height:52px;
  line-height: 52px;
  text-align: center;
  font-size:17px;
  color: #fff;
  background:rgba(95,154,255,1);
}
.contest_answer{
  height:52px;
  line-height: 52px;
  text-align: center;
  font-size:17px;
  color: #fff;
  background:rgba(239,182,111,1);
}
.tj{
  height:8px;
  background:rgba(247,247,247,1);
}
.tjs{
  height:18px;
}
.tj-center{
  text-align: center;
}
.tj-image{
  width: 72px;
  height: 72px;
  border-radius:100px;
}
.tj-container{
  padding: 16px;
}
.tj-title{
height:22px;
font-size:16px;
font-weight:bold;
line-height:18px;
color:rgba(51,51,51,1);
}
.tj-h2{
margin-top: 27px;
text-align: center;
height:29px;
font-size:24px;
line-height:18px;
color:rgba(51,51,51,1);}
.tj-h3{
text-align: center;
height:36px;
font-size:15px;
line-height:18px;
overflow: hidden;
color:rgba(51,51,51,1);}
.tj-h5{text-align: center;margin-bottom: 24px;
height:14px;
font-size:10px;
line-height:18px;
color:rgba(153,153,153,1);}
.tj-h6{text-align: center;
height:16px;
font-size:11px;
line-height:18px;
color:rgba(153,153,153,1);}
.container {
  height: 100vh;
  background: #fff;
}
.content {
  height: auto;
  background: #fff;
}
.img {
   width: 100%;
  height: 200px;
}
.desc {
  padding: 0 16px;
  color: #000;
}
.name {
  font-weight: bold;
  margin-top: 18px;
  font-size: 16px;
  color: rgba(0,0,0,0.7);
}
.desc-content {
  margin-top: 4px;
  font-size: 14px;
  line-height:18px;
  color:rgba(102,102,102,1);
}
.time {
  margin-top: 5px;
  font-size: 11px;
  line-height:18px;
  color:rgba(153,153,153,1);
}
.detail {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0,0,0,0.4);
}
.warn {
  margin-top: 18px;
  font-size: 12px;
  color: #5f9aff;
}
.btn {
  display: flex;
  height: 35px;
  justify-content: space-around;
  padding: 48px 40px 41px 40px;
}
.btn-left, .btn-right {
  width: 100px;
  height: 35px;
  font-size: 14px;
  text-align: center;
  line-height: 35px;
  color: #fff;
  border-radius: 17.5px;
}
.btn-left {
  background: #5f9aff;
}
.btn-right {
  background: #ffb65f;
}
.btn-right-closed {
  background: #ee5d31;
}
/* .attestation-btn {
  position: absolute;
  bottom: -15px;
  left: 50%;
  margin-left: -50px;
  width: 100px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background: #5f9aff;
  font-size: 15px;
  color: #fff;
  text-align: center;
} */
.attestation-btn {
  margin: 20px auto;
  text-align: center;
  color:#fff;
  width:200px;
  height:32px;
  line-height: 32px;
  font-size:15px;
  background:rgba(255,182,95,1);
  box-shadow:0px 3px 6px rgba(255,187,0,0.16);
  opacity:1;
  border-radius:16px;
}
.group-bg {
  height: 39px;
}
</style>

<style>
.wscnph {
  width: 100%;
}
.attestation .weui-cells__title {
  font-size: 16px !important;
  color: #5f9aff !important;
  margin: 25px 0 !important;
  font-weight: 600 !important;
}
.dialog .weui-dialog {
  overflow: auto !important;
}
</style>
