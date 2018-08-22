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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url: 'visitor_bargain_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: function(res) {
                if(Number(res.data.code) == 1){
                    res.data.data.list = utils.map(res.data.data.list, function (one) {
                        one.banner_image_url = utils.square(one.banner_image_url, 100)
                        return one
                    })
                    if (res.data.data.list.length >= 10){
                        that.setData({
                            isMore:false
                        })
                    }else{
                        that.setData({
                            isMore: true
                        })
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                }else {
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
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
            url: 'visitor_bargain_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    res.data.data.list = utils.map(res.data.data.list, function (one) {
                        one.banner_image_url = utils.square(one.banner_image_url, 100)
                        return one
                    })
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
    moreData:function(){
        let that = this;
        let pageData = [];
        wx.showLoading({
            title: '正在加载...',
        })
        pageData.push(...that.data.pageData)
        that.setData({
            pageNum:that.data.pageNum + 1
        })
        getApp().request({
            url: 'visitor_bargain_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    res.data.data.list = utils.map(res.data.data.list, function (one) {
                        one.banner_image_url = utils.square(one.banner_image_url, 100)
                        return one
                    })
                    pageData.push(...res.data.data.list)
                    if (pageData.length >= that.data.pageNum*10) {
                        that.setData({
                            isMore: false
                        })
                    } else {
                        that.setData({
                            isMore: true
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
    },
})