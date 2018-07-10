// pages/courses/orderInfoPay/orderInfoPay.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        createTime: '',
        orderNumber: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            pageData: JSON.parse(options.payInfo),
            createTime: utils.formatTime(new Date(JSON.parse(options.payInfo).create_time*1000)),
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

    // },
    payMoney: function() {
        let that = this;
        getApp().request({
            url: 'pay',
            data: {
                order_number: String(that.data.pageData.order_number),
            },
            method: 'post',
            success: function(r) {
                if (r.data.code == 0) {
                    wx.showModal({
                        title: 'error',
                        content: r.data.msg,
                    })
                } else {
                    var data = r.data.data;
                    wx.requestPayment({
                        'timeStamp': data.timeStamp,
                        'nonceStr': data.nonceStr,
                        'package': data.package,
                        'signType': data.signType,
                        'paySign': data.paySign,
                        'success': function(res) {
                            console.log("success:", res);
                            wx.navigateTo({
                                url: '../../studentManage/orderList/orderList',
                            })
                        },
                        'fail': function(res) {
                            console.log("fail:", res);
                            wx.showToast({
                                title: '您已取消订单',
                                icon:'none'
                            })
                        }
                    })
                }
            }
        })
    },
})