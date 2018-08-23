let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        showTitle: true,
        pageNum:1,
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.getPageData();
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
            pageNum: 1
        })
        that.getPageData();
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
    toInfo:function(e){
        wx.navigateTo({
            url: '../videoVoteUserInfo/videoVoteUserInfo?joinId=' + e.currentTarget.dataset.joinid,
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
                url: 'my_video_vote_list',
                data: {
                    page: that.data.pageNum
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        // 时间格始化
                        if (res.data.data.list.length > 0){
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = formatTime.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                            }
                        }
                        
                        pageData.push(...res.data.data.list)
                        // 更多数据
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
                    } else if (Number(res.data.code) == 0) {
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
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'my_video_vote_list',
            data: {
                page:that.data.pageNum
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    if (res.data.data.list > 0) {
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = formatTime.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                    } 
                    
                    // 更多数据
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
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})