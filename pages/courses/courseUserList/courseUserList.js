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
        status: [
        {
            name: '待跟进',
            color: '#FAC935',
        }, {
            name: '跟进中',
            color: '#469AFB',
        }, {
            name: '已预约',
            color: '#58C268',
        }, {
            name: '已试听',
            color: '#B5B6B9',
        }, {
            name: '已到访',
            color: '#EE505B',
        }, {
            name: '已失效',
            color: '#9F85CD',
        }, {
            name: '已成交',
            color: '#37C2D3',
        }
        ],
        cancelData: '＋',
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
        // let that = this
        // App.request({
        //     url: 'org/sale_lesson_appoint_list',
        //     data: {},
        //     method: 'post',
        //     success: function (res) {
        //         for (let i = 0; i < res.data.data.length; i++) {
        //             res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000));
        //             res.data.data[i].backgroundColor = that.data.status[res.data.data[i].status].color
        //             res.data.data[i].status = that.data.status[res.data.data[i].status].name;
        //         }
        //         that.setData({
        //             pageData: res.data.data,
        //             // xinData: that.data.xinArr[res.data.data.intention],
        //         });
        //         // console.log('that.data.xinData', that.data.xinData)
        //     }
        // })
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
        let that = this
        App.request({
            url: 'org/sale_lesson_appoint_list',
            data: {},
            method: 'post',
            success: function (res) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000));
                    res.data.data[i].backgroundColor = that.data.status[res.data.data[i].status].color
                    res.data.data[i].status = that.data.status[res.data.data[i].status].name;
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
        let that = this
        App.request({
            url: 'org/sale_lesson_appoint_list',
            data: {},
            method: 'post',
            success: function (res) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000));
                    res.data.data[i].backgroundColor = that.data.status[res.data.data[i].status].color
                    res.data.data[i].status = that.data.status[res.data.data[i].status].name;
                }
                that.setData({
                    pageData: res.data.data,
                    // xinData: that.data.xinArr[res.data.data.intention],
                });
                wx.stopPullDownRefresh()
                // console.log('that.data.xinData', that.data.xinData)
            }
        })
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
                
                if (Number(res.data.code) == 1) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'none',
                    })
                    App.request({
                        url: 'org/sale_lesson_appoint_list',
                        data: {},
                        method: 'post',
                        success: function (res) {
                            for (let i = 0; i < res.data.data.length; i++) {
                                res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time*1000));
                                res.data.data[i].backgroundColor = that.data.status[res.data.data[i].status].color;
                                res.data.data[i].status = that.data.status[res.data.data[i].status].name;
                            }
                            if(Number(res.data.code)==1){
                                that.setData({
                                    pageData: res.data.data,
                                    isShow: true,
                                    cancelData: '＋'
                                })
                            }
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
                cancelData: '＋'
            })
            wx.setNavigationBarTitle({
                title: '咨询本',
            })
        } else {
            that.setData({
                cancelData: '×'
            })
            wx.setNavigationBarTitle({
                title: '快速新增咨询',
            })
        }
    }
})