<template>
  <el-container class="sethot">
    <el-aside width="280px" class="module-aside">
      <el-tree
        :data="posTree"
        ref="posTree"
        :highlight-current="treeHighlight"
        default-expand-all
        node-key="id"
        :props="defaultProps"
        @node-click="handleNodeClick"></el-tree>
    </el-aside>
    <el-main class="module-main">
      <div class="operate">
        <el-button type="primary" :disabled="opeComDis" @click="comClick">编辑</el-button>
        <el-button type="danger" :disabled="opeDelDis" @click="delClick">删除</el-button>
      </div>
      <div class="content">
        <div class="map" @click="clickMap">
          <div v-if="!comState">
            <div class="point" :title="item.name" v-for="item in opointData" :key="item.id" :style="{left: item.coordX -50 + 'px', top: item.coordY -20 + 'px'}">
              <i class="el-icon-location"></i>
              <p class="txt">{{ item.name }}</p>
            </div>
          </div>
          <div v-else>
            <div class="point" :title="item.name" v-for="item in pointData" :key="item.id" v-if="item.coordX !== ''" :style="{left: item.coordX -50 + 'px', top: item.coordY -20 + 'px'}">
              <i class="el-icon-location"></i>
              <p class="txt">{{ item.name }}</p>
            </div>
            <div class="point active" ref="activeHot" v-drag="greet" v-show="hotShow">
              <i class="el-icon-location"></i>
              <p class="txt">{{ comItem.name }}</p>
            </div>
          </div>
        </div>
        <div class="content-operate" v-if="comState">
          <el-button @click="resetForm">取消编辑</el-button>
          <el-button type="primary" :disabled="comDisabled" @click="submitComfirm">保存热点</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default{
  data () {
    return {
      companyId: 20,
      userId: 333,
      nowProid: 53,
      posId: 32,
      posTree: [],
      treeHighlight: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      opointData: [],
      pointData: [],
      pointId: '',
      pointName: '',
      opeComDis: false,
      opeDelDis: true,
      comState: false,
      comItem: {
        id: '',
        name: '',
        coordX: '',
        coordY: '',
        state: false
      },
      hotShow: false,
      comDisabled: false
    }
  },
  created () {
    // 获取位置树
    this.getPositionTree()
    // 获取热点
    this.getPointData()
  },
  methods: {
    // 获取位置树
    getPositionTree () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.nowProid
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/selPositionTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const treeData = res.data.data1
          this.posTree = treeData
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
    // 获取热点
    getPointData () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.nowProid,
        location_id: this.posId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_location/location/v1.0/selLocationByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const points = res.data.data1.position
          let pointData = []
          points.forEach((item, index) => {
            if (item.xaxis !== '') {
              pointData.push({
                id: item.position_id,
                name: item.position_name,
                coordX: parseInt(item.xaxis),
                coordY: parseInt(item.yaxis)
              })
            }
          })
          this.opointData = pointData
          this.pointData = pointData
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
    /* 编辑 */
    comClick () {
      this.comState = true
      // 编辑按钮不可点击
      this.opeComDis = true
      // 初始化编辑数据
      this.pointData = JSON.parse(JSON.stringify(this.opointData))
    },
    // 点击位置树
    handleNodeClick (data) {
      if (!this.comState) {
        return
      }
      // 设置高亮
      this.treeHighlight = true
      // 保存当前点位ID和name
      this.pointName = data.name
      this.pointId = data.id
    },
    // 处理热点
    disposePosit () {
      // 保存以前热点
      if (this.comItem.state) {
        this.pointData.forEach(item => {
          if (item.id === this.comItem.id) {
            item.coordX = this.comItem.coordX
            item.coordY = this.comItem.coordY
          }
        })
      }
      // 处理当前热点
      const nowPointItem = this.pointData.find(item => {
        return item.id === this.pointId
      })
      if (nowPointItem) {
        this.comItem = {
          id: nowPointItem.id,
          name: nowPointItem.name,
          coordX: nowPointItem.coordX,
          coordY: nowPointItem.coordY,
          state: true
        }
        this.pointData.forEach(item => {
          if (item.id === this.comItem.id) {
            item.coordX = ''
            item.coordY = ''
          }
        })
        this.$refs.activeHot.style.left = (this.comItem.coordX - 50) + 'px'
        this.$refs.activeHot.style.top = (this.comItem.coordY - 20) + 'px'
      } else {
        this.comItem = {
          id: this.pointId,
          name: this.pointName,
          coordX: '',
          coordY: '',
          state: false
        }
      }
    },
    // 生成热点
    clickMap (el) {
      if (!this.comItem.id) {
        return
      }
      if (this.hotShow) {
        return
      }
      this.comItem.coordX = el.offsetX
      this.comItem.coordY = el.offsetY
      this.comItem.state = true
      this.$refs.activeHot.style.left = (el.offsetX - 50) + 'px'
      this.$refs.activeHot.style.top = (el.offsetY - 20) + 'px'
      // 添加到热点数组
      this.pointData.push({
        id: this.comItem.id,
        name: this.comItem.name,
        coordX: '',
        coordY: ''
      })
    },
    // 移动
    greet (val) {
      this.comItem.coordX = val.x + 50
      this.comItem.coordY = val.y + 20
    },
    // 重置
    resetForm () {
      this.comState = false
      // 编辑按钮可点击
      this.opeComDis = false
      // 地址树取消高亮
      this.treeHighlight = false
      // 初始化当前点位ID和name
      this.pointId = ''
      this.pointName = ''
      // 初始化编辑数据
      this.comItem = {
        id: '',
        name: '',
        coordX: '',
        coordY: '',
        state: false
      }
    },
    // 删除
    delClick () {
      this.comItem.coordX = ''
      this.comItem.coordY = ''
    },
    // 确定
    submitComfirm () {
      if (this.comItem.state) {
        this.pointData.forEach((item, index) => {
          if (item.id === this.comItem.id) {
            item.coordX = this.comItem.coordX
            item.coordY = this.comItem.coordY
          }
        })
      }
      this.sendComRequest()
    },
    // 提交
    sendComRequest () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.nowProid,
        location_id: this.posId,
        pomsg: JSON.stringify(this.pointData)
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_location/location/v1.0/altPositionAxis',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          // 获取热点
          this.getPointData()
          // 重置
          this.resetForm()
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
    }
  },
  directives: {
    drag: {
      bind (el, binding) {
        let oDiv = el
        oDiv.onmousedown = function (e) {
          let disX = e.clientX - oDiv.offsetLeft
          let disY = e.clientY - oDiv.offsetTop
          document.onmousemove = function (e) {
            let l = e.clientX - disX
            let t = e.clientY - disY
            if (l <= -50) {
              l = -50
            } else if (l >= 750) {
              l = 750
            }
            if (t <= -20) {
              t = -20
            } else if (t >= 580) {
              t = 580
            }
            oDiv.style.left = l + 'px'
            oDiv.style.top = t + 'px'
            // 将此时的位置传出去
            binding.value({x: l, y: t})
          }
          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  },
  watch: {
    pointId (newVal, oldVal) {
      if (newVal) {
        // 处理热点
        this.disposePosit()
      }
    },
    'comItem.coordX' (newVal, oldVal) {
      if (newVal === '') {
        this.hotShow = false
      } else {
        this.hotShow = true
      }
    },
    'comItem.state' (newVal, oldVal) {
      if (newVal) {
        this.opeDelDis = false
      } else {
        this.opeDelDis = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.sethot{
  width: 100%;
  height: 100%;
  padding: 20px;
  .module-aside{
    height: 100%;
    padding: 5px;
    border-radius: 6px;
    border: 1px solid #cccccc;
  }
  .module-main{
    padding: 0;
    .operate{
      display: flex;
      height: 60px;
      align-items: center;
      justify-content: flex-end;
      button{
        margin-left: 30px;
      }
    }
    .content{
      padding-top: 20px;
      .map{
        position: relative;
        width: 960px;
        height: 540px;
        margin-left: auto;
        margin-right: auto;
        background: url("../assets/map.jpg") no-repeat;
        background-size: cover;
        .point{
          position: absolute;
          width: 100px;
          text-align: center;
          cursor: pointer;
          i{
            color: #4e89c5;
            font-size: 24px;
          }
          .txt{
            width: 100%;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #4e89c5;
            font-size: 12px;
          }
          &.active{
            i{
              color: red;
            }
            .txt{
              color: red;
            }
          }
        }
      }
      .content-operate{
        margin-top: 40px;
        text-align: center;
        button{
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
