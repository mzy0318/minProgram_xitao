// pages/killPrices/killPrice/killPrice.js
var utils = require("../../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        pageNum: 1,
        isMore:true,
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
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
            pageNum: 1
        })
        that.getPageData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    toPriceInfo: function(e) {
        wx.navigateTo({
            url: '../killPriceInfo/killPriceInfo?id=' + e.currentTarget.dataset.id,
        })
    },
    // 更多数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'visitor_bargain_list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'post',
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
                    if (Number(res.data.code) == 1) {
                        res.data.data.list = utils.map(res.data.data.list, function (one) {
                            one.banner_image_url = utils.square(one.banner_image_url, 100)
                            return one
                        })
                        pageData.push(...res.data.data.list)
                        
                        if (pageData.length >= that.data.pageNum * 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
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
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'visitor_bargain_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: res => {
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if (Number(res.data.code) == 1) {
                    res.data.data.list = utils.map(res.data.data.list, function (one) {
                        one.banner_image_url = utils.square(one.banner_image_url, 100)
                        return one
                    })
                    if (res.data.data.list.length >= 10) {
                        that.setData({
                            btnText: 1
                        })
                    } else {
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0) {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})