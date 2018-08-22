// pages/goodLesson/goodLessonList/goodLessonList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.getPageData();
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
        that.setData({
            pageNum:1
        })
        that.getPageData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageData = [];
        pageData.push(...pageData)
        if(that.data.pageData.length >= that.data.pageNum*10){
            that.setData({
                pageNum:that.data.pageNum + 1
            })
            getApp().request({
                url: 'visitor_lesson_one_list',
                data: {
                    page: that.data.pageNum
                },
                method: 'post',
                success: res => {
                    if (res.data.code == 1) {
                        pageData.push(...res.data.data)
                        that.setData({
                            pageData: pageData
                        })
                    }
                }
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    toListInfo: function (e) {
        wx.navigateTo({
            url: '../lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.actid,
        })
    },
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'visitor_lesson_one_list',
            data: {
                page: that.data.pageNum
            },
            method: 'post',
            success: res => {
                if (res.data.code == 1) {
    
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh();
                }
            }
        })
    }
})