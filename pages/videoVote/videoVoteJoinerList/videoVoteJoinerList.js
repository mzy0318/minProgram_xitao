// pages/videoVote/videoVoteJoinerList/videoVoteJoinerList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
        actId:'',
        className: 'moreData',
        btnText: '更多',
        isFrozen: 'empty',
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
    // 获取页面更多数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'org/video_vote/joiners',
                data: {
                    id: that.data.actId,
                    page: that.data.pageNum,
                },
                method: 'get',
                success: function (res) {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if (res.data.code == 1) {
                        wx.stopPullDownRefresh()
                        pageData.push(...res.data.data.list)
                        if (pageData.length >= that.data.pageNum * 10) {
                            that.setData({
                                className: 'moreData',
                                btnText: '更多'
                            })
                        } else {
                            that.setData({
                                className: 'moreDataed',
                                btnText: '没有了'
                            })
                        }
                        that.setData({
                            pageData: pageData,
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }
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
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if (res.data.code == 1) {
                    if(res.data.data.list.length >= 10){
                        that.setData({
                            className: 'moreData',
                            btnText: '更多'
                        })
                    }else{
                        that.setData({
                            className: 'moreDataed',
                            btnText: '没有了'
                        })
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                }else{
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    },
})