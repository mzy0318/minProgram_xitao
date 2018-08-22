// pages/videos/userVideoList/userVideoList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        pageNum: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url: 'visitor_video_card_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    that.setData({
                        pageData: res.data.data.list,
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
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
        getApp().request({
            url: 'visitor_video_card_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: function(res) {
                that.setData({
                    pageData: res.data.data.list,
                })
                wx.stopPullDownRefresh()
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.pageData)
        if (that.data.pageData.length >= that.data.pageNum * 10) {
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'visitor_video_card_list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'post',
                success: function(res) {
                    pageDataArr.push(...res.data.data.list)
                    that.setData({
                        pageData: pageDataArr,
                    })
                }
            })
        } else {
            wx.showToast({
                title: '到底啦',
                icon: 'none'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    toListInfo: function(e) {
        wx.navigateTo({
            url: '../videoListInfo/videoListInfo?id=' + e.currentTarget.dataset.actid + '&userType=1',
        })
    }
})