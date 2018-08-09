// pages/videoVote/videoVoteJoinerList/videoVoteJoinerList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
        actId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId: options.actId,
        })
        // 获取页面数据
        that.getPageData()
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
        let that = this;
        that.setData({
            pageNum:1
        })
        // 获取页面数据
        that.getPageData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    // /**
    //  * 用户点击右上角分享
    //  */
    // onShareAppMessage: function() {

    // }
    // 编辑页面
    toEditPage:function(e){
        let that = this;
        wx.navigateTo({
            url: '../videoVoteAddJoiner/videoVoteAddJoiner?joinId=' + e.currentTarget.dataset.joinid + '&isEdit=1&actId=' + that.data.actId,
        })
    },
    // 添加选手
    addJoiner:function(e){
        let that = this;
        wx.navigateTo({
            url: '../videoVoteAddJoiner/videoVoteAddJoiner?isEdit=0&actId=' + that.data.actId,
        })
    },
    // 用户详情页面
    toInfo:function(e){
        let that = this;
        wx.navigateTo({
            url: '../videoVoteUserInfo/videoVoteUserInfo?joinId=' + e.currentTarget.dataset.id + '&actId=' + that.data.actId,
        })
    },
    // 获取页面数据
    getPageData: function () {
        let that = this;
        getApp().request({
            url: 'org/video_vote/joiners',
            data: {
                id: that.data.actId,
                page: that.data.pageNum,
            },
            method: 'get',
            success: function (res) {
                if (res.data.code == 1) {
                    wx.stopPullDownRefresh()
                    that.setData({
                        pageData: res.data.data.list
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    },
})