<template>
  <div class="project">
    <div class="operate">
      <el-button type="primary" @click="returnClick">返回</el-button>
      <el-button type="primary" @click="quitClick">退出</el-button>
    </div>
    <div id="container"></div>
  </div>
</template>

<script>
import BMap from 'BMap'
import { mapState, mapActions } from 'vuex'
import icon from '../assets/images/locate_icon.png'
export default{
  data () {
    return {
      map: null,
      icon: icon
    }
  },
  created () {

  },
  mounted () {
    this.mapInit()
  },
  computed: {
    ...mapState(
      {
        listData: 'projectData',
        mapLevel: 'projectLevel',
        mapCoord: 'projectCoord',
        projects: 'projects'
      }
    )
  },
  methods: {
    ...mapActions({
      setNowPro: 'setNowPro'
    }),
    // 初始化地图
    mapInit () {
      // 处理数据
      let markerArr = this.listData.filter(item => {
        return item.coordinate
      })
      // 百度地图API功能
      let map = new BMap.Map('container', {
        enableMapClick: false
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
      // 处理列表数据
      markerArr.forEach(item => {
        let point = item.coordinate.split(',')
        let p0 = Number.parseFloat(point[0])
        let p1 = Number.parseFloat(point[1])
        let marker = this.addMarker(new BMap.Point(p0, p1))
        this.addInfoWindow(marker, item)
      })
    },
    // 添加标注
    addMarker (point, index) {
      // 获取地图对象
      let map = this.map
      let myIcon = new BMap.Icon(this.icon, new BMap.Size(24, 24), {
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
        width: 220,
        height: 60,
        title: poi.name
      }
      // 创建信息窗口对象
      let infoWindow = new BMap.InfoWindow('', opts)
      // 打开信息窗口
      marker.addEventListener('mouseover', () => {
        marker.openInfoWindow(infoWindow)
      })
      // 关闭信息窗口
      marker.addEventListener('mouseout', () => {
        marker.closeInfoWindow(infoWindow)
      })
      // 点击标注
      marker.addEventListener('click', () => {
        this.getListData(poi)
      })
    },
    getListData (poi) {
      // 项目信息
      const orgId = poi.id
      const projects = this.projects
      const proData = projects.find(item => {
        return item.organize_id === orgId
      })
      let pro = {
        id: proData.project_id,
        name: proData.project_name,
        comId: proData.company_id,
        coord: poi.coordinate
      }
      this.setNowPro(pro)
      this.$router.push({ path: '/roadmap' })
    },
    // 返回
    returnClick () {
      this.$router.go(-1)
    },
    // 退出
    quitClick () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="less" scoped>
  .project {
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
  }
</style>
