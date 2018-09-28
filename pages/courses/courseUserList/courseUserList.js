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
        pageNum:1,
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
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        that.setData({
            pageNum: 1
        })
        that.getPageData()
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
        that.setData({
            pageNum:1
        })
        that.getPageData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
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
                    wx.showToast({
                        title: '添加成功',
                        icon: 'none',
                    })
                    that.setData({
                        isShow: true,
                        cancelData: '＋'
                    })
                    that.getPageData()
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
    },
    // 获取更多页面数据
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
            App.request({
                url: 'org/sale_lesson_appoint_list',
                data: {
                    page: that.data.pageNum
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
                    if (res.data.code == 1) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time * 1000));
                            res.data.data[i].backgroundColor = that.data.status[res.data.data[i].status].color
                            res.data.data[i].status = that.data.status[res.data.data[i].status].name;
                        }
                        pageData.push(...res.data.data)
                        if (pageData.length >= that.data.pageNum*10) {
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

                        });
                        wx.hideLoading()
                    } else if (res.data.code == 0) {
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
        App.request({
            url: 'org/sale_lesson_appoint_list',
            data: {
                page:that.data.pageNum
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
                if (res.data.code == 1) {
                    wx.stopPullDownRefresh()
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].create_time = utils.formatTime(new Date(res.data.data[i].create_time * 1000));
                        res.data.data[i].backgroundColor = that.data.status[res.data.data[i].status].color
                        res.data.data[i].status = that.data.status[res.data.data[i].status].name;
                    }
                    if(res.data.data.length >= 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: res.data.data,

                    });
                } else if (res.data.code == 0) {
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