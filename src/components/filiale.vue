<template>
  <div class="filiale">
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
      mapLevel: 5,
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
        listData: 'filialeData',
        mapCoord: 'filialeCoord',
        projects: 'projects'
      }
    )
  },
  methods: {
    ...mapActions({
      setProjectData: 'setProjectData',
      setProjectCoord: 'setProjectCoord',
      setNowPro: 'setNowPro'
    }),
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
        const type = poi.organize_type
        if (type === 3) {
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
        } else {
          this.getListData(poi)
        }
      })
    },
    getListData (poi) {
      let params = { ogz_id: poi.id }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/v3.8/selOrganizeTreeChild',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const list = res.data.data1
          // 设置列表数据
          let listData = []
          list.forEach(item => {
            if (item.organize_type !== 4) {
              let listItem = item
              listItem.name = item.organize_name
              listItem.id = item.organize_id
              listData.push(listItem)
            }
          })
          const mapData = {
            coord: poi.coordinate,
            level: 12
          }
          this.setProjectData(listData)
          this.setProjectCoord(mapData)
          this.$router.push({ path: '/project' })
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
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
  .filiale{
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
