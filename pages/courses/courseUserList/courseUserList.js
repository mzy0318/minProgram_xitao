// pages/courses/courseUserList/courseUserList.js
let utils = require('../../../utils/util.js')

let App = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        startTime: '',
        pageData: '',
        status: ['待跟进', '跟进中', '已预约', '已试听', '已到访', '已失效', '已成交'],
        cancelData: '+',
        isShow: true,
        xinArr: [
            {
                name: "../../../icon/baixin.png",
            }, {
                name: "../../../icon/banxin.png",
            }, {
                name: "../../../icon/hongxin.png",
            }
        ],
        xinData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        App.request({
            url: 'org/sale_lesson_appoint_list',
            data: {},
            method: 'post',
            success: function (res) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time));
                    res.data.data[i].status = that.data.status[res.data.data[i].status]
                }
                that.setData({
                    pageData: res.data.data,
                    // xinData: that.data.xinArr[res.data.data.intention],
                });
                // console.log('that.data.xinData', that.data.xinData)
            }
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toListInfo: function (e) {
        let pageData = JSON.stringify(e.currentTarget.dataset.pagedata)
        wx.navigateTo({
            url: '../courseUserListInfo/courseUserListInfo?pageData=' + pageData,
        })
    },
    submitUserInfo: function (e) {
        let that = this;
        getApp().request({
            url: 'org/sale_lesson_appoint',
            data: e.detail.value,
            method: 'post',
            success: function (res) {
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                })
                if (res.data.code == 1) {
                    that.setData({
                        isShow: true,
                        cancelData: '+'
                    })
                    App.request({
                        url: 'org/sale_lesson_appoint_list',
                        data: {},
                        method: 'post',
                        success: function (res) {
                            for (let i = 0; i < res.data.data.length; i++) {
                                res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time));
                                res.data.data[i].status = that.data.status[res.data.data[i].status]
                            }
                            that.setData({
                                pageData: res.data.data
                            })
                        }
                    })
                }
            }
        })
    },
    showUserFrom: function () {
        let that = this;
        that.setData({
            isShow: !that.data.isShow
        })
        if (that.data.isShow) {
            that.setData({
                cancelData: '+'
            })
        } else {
            that.setData({
                cancelData: 'x'
            })
        }
    }
})