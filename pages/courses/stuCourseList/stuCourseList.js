// pages/courses/userCourseList/userCourseList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        showTitle: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url:'visitor_sale_lesson_appoint_list',
            data:{},
            method:'post',
            success:function(res){
                if (res.data.data.length == 0) {
                    // wx.showToast({
                    //     title: '您没有参加该活动',
                    //     icon: 'none'
                    // })
                    that.setData({
                        showTitle: false
                    })
                } else if (res.data.data.length != 0) {
                    that.setData({
                        showTitle: true
                    })
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = utils.formatDate(new Date(res.data.data[i].create_time*1000))
                    }
                    that.setData({
                        pageData: res.data.data
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        getApp().request({
            url: 'visitor_sale_lesson_appoint_list',
            data: {},
            method: 'post',
            success: function (res) {
                if (res.data.data.length == 0) {
                    // wx.showToast({
                    //     title: '您没有参加该活动',
                    //     icon: 'none'
                    // })
                    that.setData({
                        showTitle: false
                    })
                } else if (res.data.data.length != 0) {
                    that.setData({
                        showTitle: true
                    })
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = utils.formatDate(new Date(res.data.data[i].create_time*1000))
                    }
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh()
                }
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    tellPhone:function(e){
        getApp().tellPhone(e)
    },
    toIndex:function(){
        getApp().toIndex()
    }
})