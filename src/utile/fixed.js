function toFixed2(argument) {
   return Math.floor(argument*100)/100
}
function toFixed4(argument) {
   return Math.floor(argument*10000)/10000
}

function toFixed5(argument) {
   return Math.floor(argument*100000)/100000
}
//导出
module.exports = {
  toFixed2: toFixed2,
  toFixed4: toFixed4,
  toFixed5: toFixed5
}