// pages/goodLesson/goodLessonList/goodLessonList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getApp().request({
            url:'visitor_lesson_one_list',
            data:{},
            method:'post',
            success:res=>{
                if(res.data.code == 1){
                    this.setData({
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
        getApp().request({
            url: 'visitor_lesson_one_list',
            data: {},
            method: 'post',
            success: res => {
                this.setData({
                    pageData: res.data.data
                })
                if(Number(res.data.code)==1){
                    wx.stopPullDownRefresh()
                }
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    // onReachBottom: function () {

    // },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toListInfo: function (e) {
        wx.navigateTo({
            url: '../lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.actid,
        })
    }
})