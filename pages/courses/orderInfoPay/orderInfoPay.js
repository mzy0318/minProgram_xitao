// pages/courses/orderInfoPay/orderInfoPay.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        createTime: '',
        isInfo:'',
        bgColor:'#F15352',
        is_pay:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            isInfo: Number(options.isInfo),
        })
        if(Number(options.isInfo) == 0){
            let sendData = {};
            sendData['act_id'] = options.actId;
            sendData['act_tag'] = options.actTag;
            sendData['phone'] = options.phone;
            sendData['nickname'] = options.nickname;
            sendData['note'] = options.note;
            sendData['amount'] = options.amount;
            sendData['joiner_id'] = options.joinId;
            getApp().request({
                url: 'generate_order',
                method: 'post',
                data: sendData,
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        res.data.data.cover.url = utils.rect(res.data.data.cover.url,120,60)
                        that.setData({
                            pageData: res.data.data,
                            createTime: utils.formatTime(new Date(res.data.data.create_time * 1000)),
                        })
                    } else {
                        wx.navigateBack({})
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        } else if (Number(options.isInfo) == 1){
            JSON.parse(options.payInfo).cover.url = utils.rect(JSON.parse(options.payInfo).cover.url, 120, 60)
            that.setData({
                pageData: JSON.parse(options.payInfo),
                createTime: JSON.parse(options.payInfo).create_time
            })
        }
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
        if(that.data.isInfo == 1){
            if (Number(that.data.pageData.is_pay) == 0){
                that.setData({
                    bgColor: '#F15352'
                })
                getApp().request({
                    url: 'pay',
                    data: {
                        order_number: String(that.data.pageData.order_number),
                    },
                    method: 'post',
                    success: function (r) {
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
                                'success': function (res) {
                                    wx.navigateTo({
                                        url: '../../studentManage/orderList/orderList',
                                    })
                                },
                                'fail': function (res) {
                                    console.log("fail:", res);
                                    wx.showToast({
                                        title: '您已取消订单',
                                        icon: 'none'
                                    })
                                }
                            })
                        }
                    }
                })
            } else if (Number(that.data.pageData.is_pay) == 1){
                that.setData({
                    bgColor: '#7b7b7b'
                })
            }
        } else if (that.data.isInfo == 0){
            that.setData({
                bgColor: '#F15352'
            })
            getApp().request({
                url: 'pay',
                data: {
                    order_number: String(that.data.pageData.order_number),
                },
                method: 'post',
                success: function (r) {
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
                            'success': function (res) {
                                wx.navigateTo({
                                    url: '../../studentManage/orderList/orderList',
                                })
                            },
                            'fail': function (res) {
                                console.log("fail:", res);
                                wx.showToast({
                                    title: '您已取消订单',
                                    icon: 'none'
                                })
                            }
                        })
                    }
                }
            })
        }
        
    },
})