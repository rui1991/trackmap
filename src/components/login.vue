<template>
  <div class="login">
    <div class="content">
      <h3 class="title">e掌巡-人员轨迹</h3>
      <div class="login-box">
        <div class="item">
          <div class="item-content">
            <span class="iconfont icon-yonghu"></span>
            <div class="item-input">
              <input type="text" class="input" v-model.trim="phone" placeholder="请输账号">
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-content">
            <span class="iconfont icon-mima"></span>
            <div class="item-input">
              <input type="password" class="input" v-model.trim="password" @keyup.enter.native="enterEvent" placeholder="请输密码">
            </div>
          </div>
        </div>
        <div class="other">
          <el-checkbox v-model="checked" class="left save">记住密码</el-checkbox>
        </div>
        <div class="login-btn">
          <el-button @click="verifyLogin">登  录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default{
  name: 'login',
  data () {
    return {
      phone: '',
      password: '',
      checked: false
    }
  },
  created () {
    const urlPhone = this.$route.query.phone || ''
    if (urlPhone) {
      let params = { type: 1, user_phone: urlPhone }
      this.loginSkip(params)
      return
    }
    // 获取账号
    const phone = localStorage.getItem('wxMapLoginPhone') || ''
    this.phone = phone
    // 获取密码
    const password = localStorage.getItem('wxMapLoginPwd') || ''
    // this.password = password
    // 获取记住密码状态
    const state = localStorage.getItem('wxMapSavePwdState')
    if (state === '1') {
      this.checked = true
      this.password = password
    } else {
      this.checked = false
      this.password = ''
    }
  },
  methods: {
    ...mapActions({
      setUser: 'setUserInfo',
      setFirmData: 'setFirmData',
      setFirmCoord: 'setFirmCoord',
      setFilialeData: 'setFilialeData',
      setFilialeCoord: 'setFilialeCoord',
      setProjectData: 'setProjectData',
      setProjectCoord: 'setProjectCoord',
      setProScope: 'setProScope',
      setNowPro: 'setNowPro'
    }),
    // 登录验证
    verifyLogin () {
      // 验证手机
      let phone = this.phone
      if (!phone) {
        this.$message({
          showClose: true,
          message: '请输入账号!',
          type: 'warning'
        })
        return
      }
      // 验证密码
      let password = this.password
      if (!password) {
        this.$message({
          showClose: true,
          message: '请输入密码!',
          type: 'warning'
        })
        return
      }
      let params = { type: 0, user_phone: this.phone, user_pwd: this.password }
      this.loginSkip(params)
    },
    // 回车
    enterEvent () {
      // 验证手机
      let phone = this.phone
      if (!phone) {
        return
      }
      // 验证密码
      let password = this.password
      if (!password) {
        return
      }
      let params = { type: 0, user_phone: this.phone, user_pwd: this.password }
      this.loginSkip(params)
    },
    // 登录跳转
    loginSkip (params) {
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.baseUrl() + '/ezx_syset/v3.2/login',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          // 保存账号
          let phone = this.phone
          localStorage.setItem('wxMapLoginPhone', phone)
          // 保存密码
          if (this.checked) {
            localStorage.setItem('wxMapSavePwdState', '1')
            let password = this.password
            localStorage.setItem('wxMapLoginPwd', password)
          } else {
            localStorage.setItem('wxMapSavePwdState', '0')
            localStorage.setItem('wxMapLoginPwd', '')
          }
          // 存储登录返回数据
          const loginData = res.data.data1
          // 判断是否有项目
          const projects = loginData.projects
          if (projects.length === 0) {
            this.$message({
              showClose: true,
              message: '您还未分配项目，请联系管理员分配项目！',
              type: 'warning'
            })
            return
          }
          this.setProScope(projects)
          // 存储本次登录需要用到的数据
          // 存储Token
          let token = loginData.user.token
          sessionStorage.setItem('wxMapToken', token)
          // 存储用户ID
          let userId = loginData.user.user_id
          sessionStorage.setItem('wxMapUserId', userId)
          // 存储用户基本信息
          this.setUser(userId)
          // 设置显示数据
          let listData = []
          let coord = '105.403119,38.028658'
          let trees = loginData.trees
          if (trees.length === 1) {
            let childData = trees[0].children
            childData.forEach(item => {
              if (item.organize_type !== 4) {
                let listItem = item
                listItem.children = null
                listData.push(listItem)
              }
            })
            // 企业级
            const firmData = childData.find(item => {
              return item.organize_type === 1
            })
            if (firmData) {
              this.setFirmData(listData)
              this.setFirmCoord(coord)
              this.$router.push({ path: '/firm' })
              return
            }
            // 分公司级
            let filialeData = childData.find(item => {
              return item.organize_type === 2
            })
            if (filialeData) {
              this.setFilialeData(listData)
              this.setFilialeCoord(coord)
              this.$router.push({ path: '/filiale' })
              return
            }
            // 项目级
            let projectData = childData.find(item => {
              return item.organize_type === 3
            })
            if (projectData) {
              coord = trees[0].coordinate || '116.404,39.915'
              let mapData = {
                coord: coord,
                level: 12
              }
              this.setProjectData(listData)
              this.setProjectCoord(mapData)
              this.$router.push({ path: '/project' })
              return
            }
            // 单个项目
            const orgId = trees[0].id
            const proData = projects.find(item => {
              return item.organize_id === orgId
            })
            let pro = {
              id: proData.project_id,
              name: proData.project_name,
              comId: proData.company_id,
              coord: trees[0].coordinate || '116.404,39.915'
            }
            this.setNowPro(pro)
            this.$router.push({ path: '/roadmap' })
          } else {
            trees.forEach(item => {
              if (item.organize_type !== 4) {
                let listItem = item
                listItem.children = null
                listData.push(listItem)
              }
            })
            // 企业级
            const firmData = trees.find(item => {
              return item.organize_type === 1
            })
            if (firmData) {
              this.setFirmData(listData)
              this.setFirmCoord(coord)
              this.$router.push({ path: '/firm' })
              return
            }
            // 分公司级
            const filialeData = trees.find(item => {
              return item.organize_type === 2
            })
            if (filialeData) {
              this.setFilialeData(listData)
              this.setFilialeCoord(coord)
              this.$router.push({ path: '/filiale' })
              return
            }
            // 项目级
            const projectData = trees.find(item => {
              return item.organize_type === 3
            })
            if (projectData) {
              let mapData = {
                coord: coord,
                level: 5
              }
              this.setProjectData(listData)
              this.setProjectCoord(mapData)
              this.$router.push({ path: '/project' })
            }
          }
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
    }
  }
}
</script>

<style lang="less" scoped>
  .login{
    width: 100%;
    height: 100%;
    background: url("../assets/images/login_bg.jpg") no-repeat center center;
    background-size: cover;
    position: relative;
    .content{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      background: #ffffff;
      border-radius: 8px;
      /*box-shadow: 0 0 2px 2px #999999;*/
      .title{
        text-align: center;
        color: #272727;
        font-size: 32px;
        height: 60px;
        line-height: 60px;
      }
      .login-box{
        width: 420px;
        height: 320px;
        padding: 20px 30px;
        .item{
          padding-bottom: 30px;
          .item-content{
            position: relative;
            height: 40px;
            .iconfont{
              position: absolute;
              width: 60px;
              height: 100%;
              left: 0;
              top: 0;
              background: #4fa5f2;
              border-radius: 6px;
              line-height: 40px;
              text-align: center;
              font-size: 24px;
              color: #ffffff;
            }
            .item-input{
              height: 100%;
              padding-left: 60px;
              background: #eaeef2;
              border-radius: 6px;
              .input{
                display: block;
                width: 100%;
                height: 100%;
                padding-left: 6px;
                font-size: 14px;
                color: #272727;
                border: none;
                background: transparent;
                -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
              }
            }
          }
        }
        .other{
          height: 60px;
          color: #272727;
          .switch{
            font-size: 14px;
          }
        }
        .login-btn{
          height: 40px;
          .el-button{
            display: block;
            width: 100%;
            height: 100%;
            background: #4fa5f2;
            color: #ffffff;
            font-size: 16px;
            border: none;
            border-radius: 20px;
          }
        }
      }
    }
  }
</style>
