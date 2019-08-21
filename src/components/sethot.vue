<template>
  <div class="sethot">
    <div class="aside">
      <div class="tree">
        <el-tree
          :data="treeData"
          ref="tree"
          show-checkbox
          default-expand-all
          check-strictly
          node-key="id"
          :props="defaultProps"
          @check-change="handleCheckChange"
          @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="tree-operate">
        <el-button type="danger" :disabled="existCoord" @click="delDialog = true">删除</el-button>
        <el-button type="primary" :disabled="saveDisabled" @click="saveClick">保存</el-button>
      </div>
    </div>
    <div class="operate">
      <el-button type="primary" @click="returnClick">返回</el-button>
      <el-button type="primary" @click="quitClick">退出</el-button>
    </div>
    <div id="container"></div>
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialog" :show-close="false" :close-on-click-modal="false" custom-class="hint-dialog">
      <p class="hint-text"><i class="el-icon-warning"></i>是否要删除此坐标？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="delDisabled" @click="submitDelForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BMap from 'BMap'
import { mapState } from 'vuex'
export default{
  data () {
    return {
      map: null,
      mapLevel: 19,
      treeData: [],
      whether: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      id: 0,
      name: '',
      coord: '',
      existCoord: true,
      saveDisabled: true,
      delDialog: false,
      delDisabled: false
    }
  },
  created () {

  },
  mounted () {
    // 初始化地图
    this.mapInit()
    // 获取位置树
    this.getPositionTree()
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
      // 点击地图
      map.addEventListener('click', e => {
        if (!this.whether) {
          this.$message({
            showClose: true,
            message: '此位置不可添加坐标！',
            type: 'warning'
          })
          return
        }
        // 获取当前地图级别
        const level = map.getZoom()
        // 清除地图上的所有标点
        map.clearOverlays()
        let point = new BMap.Point(e.point.lng, e.point.lat)
        map.centerAndZoom(point, level)
        // 创建标注
        let marker = new BMap.Marker(point)
        // 将标注添加到地图中
        map.addOverlay(marker)
        this.coord = e.point.lng + ',' + e.point.lat
        // 开启标注拖拽功能
        marker.enableDragging()
        marker.addEventListener('dragend', e => {
          this.coord = e.point.lng + ',' + e.point.lat
        })
      })
      // 挂在map对象
      this.map = map
    },
    // 获取位置树
    getPositionTree (b = false) {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.proId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/selPositionTree628',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const treeData = res.data.data1
          this.treeData = treeData
          if (b) {
            this.$refs.tree.setCheckedKeys([this.id])
          }
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
    // 点击地址树
    handleCheckChange (data, checked, self) {
      if (checked === true) {
        if (this.id === data.id) {
          return
        }
        this.$refs.tree.setCheckedKeys([data.id])
        // 设置当前参数
        this.id = data.id
        this.name = data.name
        const coord = data.coordinate || ''
        this.coord = coord
        if (coord) {
          this.existCoord = false
          // 生成标点
          this.createPoint()
        } else {
          this.existCoord = true
          // 清除标点
          this.clearPoint()
        }
      } else {
        if (this.id === data.id) {
          this.$refs.tree.setCheckedKeys([data.id])
        }
      }
    },
    handleNodeClick (data, node, self) {
      if (node.checked) return
      this.$refs.tree.setCheckedKeys([data.id])
      // 设置当前参数
      this.id = data.id
      this.name = data.name
      const coord = data.coordinate || ''
      this.coord = coord
      if (coord) {
        this.existCoord = false
        // 生成标点
        this.createPoint()
      } else {
        this.existCoord = true
        // 清除标点
        this.clearPoint()
      }
    },
    // 生成标点
    createPoint () {
      // 获取地图对象
      let map = this.map
      // 获取标点坐标
      const coordStr = this.coord
      let pointArr = coordStr.split(',')
      const pointLng = Number.parseFloat(pointArr[0])
      const pointLat = Number.parseFloat(pointArr[1])
      // 获取当前地图级别
      const level = map.getZoom()
      // 清除地图上的所有标点
      map.clearOverlays()
      // 初始化地图,设置中心点坐标和地图级别
      let point = new BMap.Point(pointLng, pointLat)
      map.centerAndZoom(point, level)
      // 创建标注
      let marker = new BMap.Marker(point)
      // 将标注添加到地图中
      map.addOverlay(marker)
      // 开启标注拖拽功能
      marker.enableDragging()
      marker.addEventListener('dragend', e => {
        this.coord = e.point.lng + ',' + e.point.lat
      })
    },
    // 清除标点
    clearPoint () {
      // 获取地图对象
      let map = this.map
      // 清除地图上的所有标点
      map.clearOverlays()
    },
    // 保存
    saveClick () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.proId,
        position_id: this.id,
        coordinate: this.coord
      }
      params = this.$qs.stringify(params)
      this.saveDisabled = true
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/setPositionCoordinate',
        data: params
      }).then((res) => {
        this.saveDisabled = false
        if (res.data.result === 'Sucess') {
          this.$message({
            showClose: true,
            message: '坐标设置成功！',
            type: 'success'
          })
          // 获取地址树
          this.getPositionTree()
        } else {
          this.$message({
            showClose: true,
            message: '服务器连接失败！',
            type: 'error'
          })
        }
      }).catch(() => {
        this.saveDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    // 删除
    submitDelForm () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.proId,
        position_id: this.id,
        coordinate: ''
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/setPositionCoordinate',
        data: params
      }).then((res) => {
        this.delDisabled = false
        if (res.data.result === 'Sucess') {
          this.$message({
            showClose: true,
            message: '坐标删除成功！',
            type: 'success'
          })
          // 获取地址树
          this.getPositionTree()
          // 隐藏模态框
          this.delDialog = false
          // 清空当前坐标
          this.coord = ''
          // 不可删除
          this.existCoord = true
          // 清除标点
          this.clearPoint()
        } else {
          this.$message({
            showClose: true,
            message: '服务器连接失败！',
            type: 'error'
          })
        }
      }).catch(() => {
        this.delDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    // 返回
    returnClick () {
      this.$router.push({ path: '/roadmap' })
    },
    // 退出
    quitClick () {
      this.$router.push({ path: '/login' })
    }
  },
  watch: {
    id (val, oldVal) {
      if (val.indexOf('w') !== -1) {
        this.whether = false
      } else {
        this.whether = true
      }
    },
    coord (val, oldVal) {
      if (val) {
        this.saveDisabled = false
      } else {
        this.saveDisabled = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sethot{
  width: 100%;
  height: 100%;
  .aside{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 340px;
    height: 100%;
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
    background: #ffffff;
    box-shadow: 0 0 2px 3px rgba(0, 0, 0, .4);
    .tree{
      height: 80%;
      padding: 5px;
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      overflow: auto;
    }
    .tree-operate{
      padding-top: 20px;
      text-align: center;
      .el-button{
        margin: 0 10px;
      }
    }
  }
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
