const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const seconds = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}
// 月
const month = date =>{
    return date.getMonth() + 1;
}
//年
const year = date => {
    return date.getFullYear()
}
const dateTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatTimer = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds();
    if(month >= 10){
        month = month;
    }else{
        month = '0' + month
    };
    if (day >= 10){
        day = day
    }else{
        day = '0' + day
    }

    return [year, month, day].map(formatNumber).join('-')
}

const formatDateO = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('.')
}
const dayMonth = date => {
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const liteDate = timestamp => {
  let tt = "" + timestamp
  if (tt.length == 10) {
    timestamp = timestamp * 1000
  } else {
    timestamp = timestamp * 1
  }
  let date = new Date(timestamp)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  if (m < 10) {
    m = "0" + m
  }
  if (d < 10) {
    d = "0" + d
  }
  return [y, m, d].join("-")
}

const map = (list, callback) => {
  for (let i = 0, len = list.length; i < len; i++) {
    list[i] = callback(list[i], i)
  }
  return list
}

const today = function () {
  let date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  if (m < 10) {
    m = "0" + m
  }
  if (d < 10) {
    d = "0" + d
  }
  return [y, m, d].join("-")
}

const afterDay = function (day) {
  day = day || 1
  var date = new Date(new Date().getTime() + day * 60 * 60 * 24 * 1000)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  if (m < 10) {
    m = "0" + m
  }
  if (d < 10) {
    d = "0" + d
  }
  return [y, m, d].join("-")
}

const square = function (url, size) {
  size = size || 100
  url = url || ""
  let all = [100, 200]
  if (all.indexOf(size) < 0) {
    throw "no image size:" + size
  }
  if (url.indexOf("?") == -1) {
    return url + "?x-oss-process=style/square" + size
  } else {
    return url
  }
}

const rect = function (url, width, height) {
  width = width || 0
  height = height || 0
  url = url || ""
  if (url.indexOf("?") == -1) {
    url = url + "?x-oss-process=image/resize,m_fill"
    if (width > 0){
      url = url + ",w_" + width 
    }
    if (height > 0){
      url = url + ",h_" + height
    }
    url = url + ",limit_0/auto-orient,1/quality,q_100"
    return url
  } else {
    return url
  }
}

const dateWeek = function (date){
    let timeString = date.valueOf();
    const day = date.getDate();
    const weekDay = date.getDay()
    
    return { day: day, timeString: timeString, week: weekDay}
} 

module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    formatTimer: formatTimer,
    formatDateO: formatDateO,
    map: map,
    today: today,
    afterDay: afterDay,
    square: square,
    rect: rect,
    liteDate: liteDate,
    dayMonth: dayMonth,
    dateTime: dateTime,
    dateWeek: dateWeek,
    month: month,
    year: year,
    seconds: seconds,
}
