// 去除空格
const trim = str => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

// 验证手机号码
const checkPhone = str => {
  let regex = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  if (str.match(regex)) {
    return true
  } else {
    return false
  }
}

// 获取当天日期
const getNowDate = (pattern = 'yyyy-mm-dd') => {
  let mydata = new Date()
  let year = mydata.getFullYear()
  let month = mydata.getMonth() + 1 + ''
  month = month.padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm') {
    return `${year}-${month}`
  }
  let day = mydata.getDate() + ''
  day = day.padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${year}-${month}-${day}`
  }
  let hour = mydata.getHours() + ''
  hour = hour.padStart(2, '0')
  let minutes = mydata.getMinutes() + ''
  minutes = minutes.padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd hh:mm') {
    return `${year}-${month}-${day} ${hour}:${minutes}`
  }
  let seconds = mydata.getSeconds() + ''
  seconds = seconds.padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd hh:mm:ss') {
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
  }
  const weekAry = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let week = weekAry[mydata.getDay()]
  if (pattern.toLowerCase() === 'yyyy-mm-dd hh:mm:ss e') {
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${week}`
  }
}

// 获取前一天日期
const getBeforeDate = () => {
  const nowdate = new Date().getTime() - 86400000
  const mydate = new Date(nowdate)
  let year = mydate.getFullYear()
  let month = mydate.getMonth() + 1 + ''
  month = month.padStart(2, '0')
  let day = mydate.getDate() + ''
  day = day.padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 获取浏览器宽高
const getDomClientSize = () => {
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
}

// 错误提示
const errorCodeHint = code => {
  let hintMes = ''
  switch (code) {
    case 0:
      hintMes = '服务器连接失败！'
      break
    case 1001:
      hintMes = 'sig校验失败！'
      break
    case 1002:
      hintMes = '短信/语音内容中含有敏感词！'
      break
    case 1003:
      hintMes = '请求包体没有sig字段或sig为空！'
      break
    case 1004:
      hintMes = '请求包解析失败！'
      break
    case 1006:
      hintMes = '请求没有权限！'
      break
    case 1007:
      hintMes = '其他错误！'
      break
    case 1008:
      hintMes = '请求下发短信/语音超时！'
      break
    case 1009:
      hintMes = '请求ip不在白名单中！'
      break
    case 1011:
      hintMes = '不存在该REST API接口！'
      break
    case 1012:
      hintMes = '签名格式错误或者签名未审批！'
      break
    case 1013:
      hintMes = '下发短信/语音命中了频率限制策略！'
      break
    case 1014:
      hintMes = '模版未审批或请求的内容与审核通过的模版内容不匹配！'
      break
    case 1015:
      hintMes = '手机号在黑名单库中！'
      break
    case 1016:
      hintMes = '手机号格式错误！'
      break
    case 1017:
      hintMes = '请求的短信内容太长！'
      break
    case 1018:
      hintMes = '语音验证码格式错误！'
      break
    case 1019:
      hintMes = 'sdkappid不存在！'
      break
    case 1020:
      hintMes = 'sdkappid已禁用此sdkappid禁止提供服务！'
      break
    case 1021:
      hintMes = '请求发起时间不正常！'
      break
    case 1022:
      hintMes = '业务短信日下发条数超过设定的上限！'
      break
    case 1023:
      hintMes = '单个手机号30秒内下发短信条数超过设定的上限！'
      break
    case 1024:
      hintMes = '单个手机号1小时内下发短信条数超过设定的上限！'
      break
    case 1025:
      hintMes = '单个手机号日下发短信条数超过设定的上限！'
      break
    case 1026:
      hintMes = '单个手机号下发相同内容超过设定的上限！'
      break
    case 10001:
      hintMes = '公司不存在！'
      break
    case 10002:
      hintMes = '邀请码不可用！'
      break
    case 10003:
      hintMes = '公司简称不可用！'
      break
    case 10004:
      hintMes = '公司简称不存在！'
      break
    case 10005:
      hintMes = '用户名不存在或密码不正确！'
      break
    case 10007:
      hintMes = '不在绑定设备上登录！'
      break
    case 10008:
      hintMes = '用户不存在！'
      break
    case 10009:
      hintMes = '硬件设备已经被绑定！'
      break
    case 10010:
      hintMes = '输入的验证码错误！'
      break
    case 10050:
      hintMes = '公司不存在！'
      break
    case 10053:
      hintMes = '用户信息不存在！'
      break
    case 10054:
      hintMes = '增加失败！'
      break
    case 10055:
      hintMes = '修改失败！'
      break
    case 10056:
      hintMes = '冻结失败！'
      break
    case 10057:
      hintMes = '点位不存在！'
      break
    case 10058:
      hintMes = '点位信息缺失！'
      break
    case 10060:
      hintMes = '点位不存在！'
      break
    case 10070:
      hintMes = '点位不可用！'
      break
    case 10081:
      hintMes = '服务器返回错误，请稍后再试！'
      break
    case 10082:
      hintMes = '班次不存在！'
      break
    case 10083:
      hintMes = '没有您的值班信息！'
      break
    case 10084:
      hintMes = '值班日期不存在！'
      break
    case 10085:
      hintMes = '开始日期大于结束日期！'
      break
    case 10086:
      hintMes = '开始日期小于今天！'
      break
    case 10087:
      hintMes = '组别不存在！'
      break
    case 10088:
      hintMes = '手机号码重复！'
      break
    case 10089:
      hintMes = '此点位已经添加！'
      break
    case 10090:
      hintMes = '此位置正在使用，禁止禁用！'
      break
    case 10091:
      hintMes = '此线路正在使用，禁止删除、修改！'
      break
    case 10092:
      hintMes = '计划正在使用，禁止删除、修改！'
      break
    case 10093:
      hintMes = '角色名重复！'
      break
    case 10094:
      hintMes = '没有新的版本！'
      break
    case 10095:
      hintMes = '已经存在公司！'
      break
    case 10096:
      hintMes = '重复上传！'
      break
    case 10097:
      hintMes = '班次重复！'
      break
    case 10098:
      hintMes = '用户不存在！'
      break
    case 10099:
      hintMes = '您今天暂无排班！'
      break
    case 10100:
      hintMes = '用户权限错误！'
      break
    case 10101:
      hintMes = '新密码和原密码重复！'
      break
    case 10102:
      hintMes = '抢单失败！'
      break
    case 10103:
      hintMes = '工单已经被关闭！'
      break
    case 10104:
      hintMes = '工单已经结单！'
      break
    case 10105:
      hintMes = '任务已经被领取！'
      break
    case 10106:
      hintMes = '没有点位任务！'
      break
    case 10107:
      hintMes = '没有设备！'
      break
    case 10108:
      hintMes = '此网关不存在！'
      break
    case 10109:
      hintMes = '网关已经被绑定！'
      break
    case 10110:
      hintMes = '没有班次！'
      break
    case 10111:
      hintMes = '手机已解绑，重新登录后再切换公司！'
      break
    case 10112:
      hintMes = '卡片已经存在！'
      break
    case 10113:
      hintMes = '用户不在任何一个项目！'
      break
    case 10114:
      hintMes = '手机号码已注册！'
      break
    case 10115:
      hintMes = '编码重复！'
      break
    case 10116:
      hintMes = '删除失败，请先删除子级！'
      break
    case 10117:
      hintMes = '用户已经存在！'
      break
    case 10118:
      hintMes = '已经提交申请，请不要重复申请！'
      break
    case 10119:
      hintMes = '地址已经被添加！'
      break
    case 100050:
      hintMes = '无法获取企业信息！'
      break
    case 10121:
      hintMes = '没有权限！'
      break
    case 10122:
      hintMes = '已在其他设备登录，请重新登录！'
      break
    case 10123:
      hintMes = '点位名称重复！'
      break
    case 10124:
      hintMes = '正在被使用，不允许删除！'
      break
    case 10125:
      hintMes = 'MAC地址重复！'
      break
    case 10126:
      hintMes = '有用户已经进行过点名设置！'
      break
    case 10129:
      hintMes = '删除失败，请先修改原始密码！'
      break
    case 10130:
      hintMes = '非本项目网关！'
      break
    default:
      hintMes = '网络连接超时，请稍后再试！'
  }
  return hintMes
}

export default {
  trim: trim,
  checkPhone: checkPhone,
  getNowDate: getNowDate,
  getBeforeDate: getBeforeDate,
  getDomClientSize: getDomClientSize,
  errorCodeHint: errorCodeHint
}
