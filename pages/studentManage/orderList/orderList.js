// pages/studentManage/orderList/orderList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        pageNum: 1,
        showTitle:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url: 'order_list',
            method: 'post',
            data: {
                page: that.data.pageNum,
            },
            success: function(res) {

                if (res.data.data.length == 0) {

                    that.setData({
                        showTitle:false
                    })
                } else if (res.data.data.length != 0){
                    that.setData({
                        showTitle: true
                    })
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000));
                        res.data.data[i].cover.url = utils.rect(res.data.data[i].cover.url,120,60)
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
            url: 'order_list',
            method: 'post',
            data: {
                page: that.data.pageNum,
            },
            success: function(res) {
                if (res.data.data.length == 0) {
                    that.setData({
                        showTitle: false
                    })
                } else if (res.data.data.length != 0) {
                    that.setData({
                        showTitle: true
                    })
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000))
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
    onReachBottom: function() {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.pageData)
        if (that.data.pageData.length >= that.data.pageNum * 10) {
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'order_list',
                method: 'post',
                data: {
                    page: that.data.pageNum,
                },
                success: function(res) {
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000))
                    }
                    pageDataArr.push(...res.data.data)
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
    toPayInfo: function(e) {
        let payInfo = JSON.stringify(e.currentTarget.dataset.payinfo)
        wx.navigateTo({
            url: '../../courses/orderInfoPay/orderInfoPay?payInfo=' + payInfo + '&isInfo=1',
        })
    }
})