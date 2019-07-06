<template>
  <div class="roadmap">
    <div class="point" :title="item.name" v-for="item in nowPointData" :key="item.id" :style="{left: item.coordX -50 + 'px', top: item.coordY -20 + 'px'}">
      <i class="iconfont icon-xunluorenyuan"></i>
      <p class="txt">{{ item.name }}</p>
    </div>
    <ul class="track-list">
      <li class="item" v-for="item in nowPointData" :key="item.id">
        <span>{{ item.name }}</span>
        <span class="position">{{ item.posName }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'roadmap',
  data () {
    return {
      companyId: 2,
      userId: 333,
      nowProid: 1,
      posId: 32,
      ratio: 2,
      pointData: [],
      listData: [],
      nowData: [],
      nowPointData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      trackTimer: null,
      speed: 5000,
      pointIds: []
    }
  },
  mounted () {
    const dom = this.getDomClientSize()
    const domWidth = dom.width
    this.ratio = domWidth / 960
    // 获取全部热点
    this.getPointData()
    // 获取列表数据
    this.getListData()
  },
  methods: {
    // 获取浏览器宽高
    getDomClientSize () {
      if (window.innerWidth != null) {
        return {
          width: window.innerWidth,
          height: window.innerHeight
        }
      } else if (document.compatMode === 'CSS1Compat') {
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight
        }
      }
      return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
      }
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
          const ratio = this.ratio
          points.forEach((item, index) => {
            if (item.xaxis !== '') {
              pointData.push({
                id: item.position_id,
                name: item.position_name,
                coordX: parseInt(item.xaxis) * ratio,
                coordY: parseInt(item.yaxis) * ratio
              })
            }
          })
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
    // 获取列表数据
    getListData () {
      let params = {
        company_id: this.companyId,
        user_id: this.userId,
        project_id: this.nowProid
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/inspection/selTrajectorys',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          let listData = res.data.data1
          this.listData = listData
          // 总条数
          this.total = listData.length
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
      this.nowData = listData.slice(0, limit)
      this.trackTimer = setInterval(() => {
        if (this.nowPage * limit < total) {
          let start = this.nowPage * limit
          this.nowData = this.listData.slice(start, start + limit)
          this.nowPage++
        } else {
          // 清空定时器
          clearInterval(this.trackTimer)
          // 获取列表数据
          this.getListData()
        }
      }, this.speed)
    }
  },
  watch: {
    nowData (val, oldVal) {
      if (val) {
        const nowData = this.nowData
        const pointData = this.pointData
        let nowPointData = []
        nowData.forEach((item, index) => {
          pointData.forEach(point => {
            if (point.id === item.position_id) {
              nowPointData.push(
                {
                  name: item.user_name,
                  coordX: point.coordX,
                  coordY: point.coordY,
                  posName: point.name,
                  id: index
                }
              )
            }
          })
        })
        this.nowPointData = nowPointData
      }
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
  background: url("../assets/map.jpg") no-repeat;
  background-size: cover;
  position: relative;
  .point{
    position: absolute;
    width: 100px;
    text-align: center;
    cursor: pointer;
    i{
      color: red;
      font-size: 24px;
    }
    .txt{
      width: 100%;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      color: red;
      font-size: 12px;
    }
  }
  .track-list{
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
