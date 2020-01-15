<template>
  <div class="roadmap">
    <div class="operate">
      <el-button type="primary" @click="returnClick">返回</el-button>
      <el-button type="primary" @click="setClick">设置</el-button>
      <el-button type="primary" @click="quitClick">退出</el-button>
    </div>
    <ul class="list">
      <li class="item" v-for="item in nowListData" :key="item.id">
        <span>{{ item.user_name }}</span>
        <span class="position">{{ item.position_name }}</span>
      </li>
    </ul>
    <div id="container"></div>
  </div>
</template>

<script>
import BMap from 'BMap'
import { mapState } from 'vuex'
import icon from '../assets/images/head_icon.png'
export default {
  name: 'roadmap',
  data () {
    return {
      map: null,
      mapLevel: 19,
      icon: icon,
      listData: [],
      nowListData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      trackTimer: null,
      speed: 5000
    }
  },
  mounted () {
    this.mapInit()
  },
  computed: {
    ...mapState(
      {
        mapCoord: 'proCoord',
        companyId: 'companyId',
        userId: 'userId',
        proId: 'proId'
      }
    )
  },
  methods: {
    mapInit () {
      // 百度地图API功能
      let map = new BMap.Map('container', {
        enableMapClick: false,
        minZoom: 6,
        maxZoom: 19
      })
      // 创建Map实例，初始化地图,设置中心点坐标和地图级别
      const coordStr = this.mapCoord
      const coordArr = coordStr.split(',')
      const coordLng = Number.parseFloat(coordArr[0])
      const coordLat = Number.parseFloat(coordArr[1])
      const mapLevel = this.mapLevel
      map.centerAndZoom(new BMap.Point(coordLng, coordLat), mapLevel)
      // 设置个性化地图样式
      map.setMapStyleV2({
        styleId: '98549d78ed26e9b24a12b19b97cc040a'
      })
      // 开启滚轮缩放地图
      map.enableScrollWheelZoom()
      // 禁用双击放大
      map.disableDoubleClickZoom()
      // 挂在map对象
      this.map = map
      // 获取列表数据
      this.getListData()
    },
    // 获取列表数据
    getListData () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.proId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/inspection/selTrajectorys',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          let listData = res.data.data1 || []
          this.listData = listData
          this.total = listData.length
          this.nowPage = 1
          // 轨迹处理
          this.trackDispose()
        } else {
          this.$message({
            showClose: true,
            message: '服务器连接失败！',
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    // 轨迹处理
    trackDispose () {
      if (this.listData.length === 0) {
        return
      }
      // 列表数据
      const listData = this.listData
      // 总条数
      const total = this.total
      // 每页条数
      const limit = this.limit
      // 当前数据
      this.nowListData = listData.slice(0, limit)
      this.createPoint()
      this.trackTimer = setInterval(() => {
        if (this.nowPage * limit < total) {
          let start = this.nowPage * limit
          this.nowListData = this.listData.slice(start, start + limit)
          this.nowPage++
          // 生成标注
          this.createPoint()
        } else {
          // 清空定时器
          clearInterval(this.trackTimer)
          // 获取列表数据
          this.getListData()
        }
      }, this.speed)
    },
    // 生成标点
    createPoint () {
      // 获取地图对象
      let map = this.map
      // 清除地图上的所有标点
      map.clearOverlays()
      let nowListData = this.nowListData
      nowListData.forEach(item => {
        if (item.coordinate) {
          const pointArr = item.coordinate.split(',')
          const pointLng = Number.parseFloat(pointArr[0])
          const pointLat = Number.parseFloat(pointArr[1])
          let marker = this.addMarker(new BMap.Point(pointLng, pointLat))
          this.addInfoWindow(marker, item)
        }
      })
    },
    // 添加标注
    addMarker (point) {
      // 获取地图对象
      let map = this.map
      let icon = this.icon
      let myIcon = new BMap.Icon(icon, new BMap.Size(24, 24), {
        anchor: new BMap.Size(12, 12)
      })
      let marker = new BMap.Marker(point, {icon: myIcon})
      map.addOverlay(marker)
      return marker
    },
    // 添加信息窗口
    addInfoWindow (marker, poi) {
      // 信息窗口
      let opts = {
        width: 0,
        height: 0,
        title: poi.user_name
      }
      const message = '地址：' + poi.position_name
      // 创建信息窗口对象
      let infoWindow = new BMap.InfoWindow(message, opts)
      // 打开信息窗口
      marker.addEventListener('mouseover', () => {
        marker.openInfoWindow(infoWindow)
      })
      // 关闭信息窗口
      marker.addEventListener('mouseout', () => {
        marker.closeInfoWindow(infoWindow)
      })
    },
    // 设置
    setClick () {
      this.$router.replace({ path: '/sethot' })
    },
    // 返回
    returnClick () {
      this.$router.go(-1)
    },
    // 退出
    quitClick () {
      this.$router.push({ path: '/login' })
    }
  },
  beforeDestroy () {
    // 清除轨迹列表定时器
    clearInterval(this.trackTimer)
  }
}
</script>

<style  lang="less" scoped>
  .roadmap{
    width: 100%;
    height: 100%;
    position: relative;
    #container{
      width: 100%;
      height: 100%;
    }
    .operate{
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 10;
      .el-button{
        margin: 0 10px;
      }
    }
    .list{
      width: 240px;
      height: 380px;
      padding: 5px;
      border-radius: 6px;
      border: 1px solid #cfcfcf;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      .item{
        display: flex;
        height: 35px;
        align-items: center;
        span{
          width: 50%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #ffffff;
        }
        .position{
          text-align: right;
        }
      }
    }
  }
</style>
