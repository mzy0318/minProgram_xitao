// pages/task/taskDate/taskDate.js
let formate = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dayList:'',
        courseId:'',
        startDate:'',
        endDate:'',
        startTime: '',
        endTime: '',
        count:'',
        month:'',
        year:'',
        yearMonth:'',
        timeString:'',
        title:'',
        pwd:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        console.log('options', options)
        that.setData({
            pwd:options.pwd,
            title:options.title,
            courseId: options.courseId,
            month:formate.month(new Date(options.timeString*1000)),
            year: formate.year(new Date(options.timeString * 1000)),
            yearMonth: formate.year(new Date(options.timeString * 1000)) + '年' + formate.month(new Date(options.timeString * 1000)) + '月'
        })
        that.getDate(that.data.month, that.data.year)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
    // 具体作业
    toInfo:function(e){
        let that = this;
        let month = Number(e.currentTarget.dataset.month) > 10 ? Number(e.currentTarget.dataset.month) : ('0' + Number(e.currentTarget.dataset.month))
        let day = Number(e.currentTarget.dataset.day) > 10 ? Number(e.currentTarget.dataset.day) : ('0' + Number(e.currentTarget.dataset.day))
        let date = e.currentTarget.dataset.year + '-' + month + '-' + day
        if (e.currentTarget.dataset.enable){
            wx.navigateTo({
                url: '../taskUserListInfo/taskUserListInfo?courseId=' + that.data.courseId + '&date=' + date + '&isDate=1&title='+that.data.title+'&pwd='+that.data.pwd +'&startTime='+that.data.startTime+'&endTime='+that.data.endTime,
            })
        }else{

            return 
        }
    },
    changeMonth:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            // 减
            let month = that.data.month
            let year = that.data.year;
            month -= 1
            if (month <= 0){
                month = 12
                year -= 1
            }
            that.setData({
                month: month,
                year: year,
                yearMonth: year + '年' + month + '月'
            })
            that.getDate(month,year);

        } else if (Number(e.currentTarget.dataset.id) == 1){
            //加
            let month = that.data.month
            let year = that.data.year;
            month += 1
            if (month >= 13) {
                month = 1
                year += 1
            }
            that.setData({
                month: month,
                year: year,
                yearMonth: year + '年' + month + '月'
            })
            that.getDate(month, year)
        }
    },
    // 获取日历
    getDate:function(month,year){
        let that = this;
        getApp().request({
            url: 'punch_course/calendar',
            data: {
                month: month,
                year: year,
                punch_course_id: that.data.courseId,
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    for (let i = 0; i < res.data.data.date.length; i++) {
                        if (res.data.data.date[i].week == 0) {
                            res.data.data.date[i].week = 7
                        }
                    }
                    let dateList = res.data.data.date;
                    let index = dateList[0].week - 1;
                    for (let i = 0; i < index; i++) {
                        dateList.unshift({ day: '', enable: false, hasAssignment:false})
                    }
                    that.setData({
                        dayList: dateList,
                        startTime: res.data.data.start_time,
                        endTime: res.data.data.end_time,
                        startDate: formate.formatDate(new Date(res.data.data.start_time * 1000)),
                        endDate: formate.formatDate(new Date(res.data.data.end_time * 1000)),
                        count: res.data.data.assign_times
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})