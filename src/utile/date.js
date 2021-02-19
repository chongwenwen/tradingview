const data_day= date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month].map(formatNumber).join('-')
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const time1 = date => {
  var h = date.getHours()
  var mm = date.getMinutes()
  var s = date.getSeconds()
  return [h, mm, s].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//导出
module.exports = {
  formatTime: data_day,
  time:time1
}