// pages/course/course.js

let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseData:null,
        lessonClassName: '',
        lessonData: wx.getStorageSync('lessonData'),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            lessonClassName: app.globalData.lessonClassName
        })

        getApp().request({
            url: 'recruit/sale_lesson/sale_lesson_list',
            data: {},
            success: res => {
                console.log(res)
                this.setData({
                    courseData:res.data.data,
                })
                wx.setStorageSync('lessonAllData', res.data.data.lesson)
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
    toCourseClass: function () {
        wx.setStorageSync('lessonClassData', this.data.courseData.catalog)
        wx.navigateTo({
            url: '../courseClass/courseClass',
        })
    },
    toCourseInfo:function(e){
        wx.setStorageSync('lessonInfo', e.currentTarget.dataset.lessoninfo)
        wx.navigateTo({
            url: '../courseInfo/courseInfo',
        })
    }
})