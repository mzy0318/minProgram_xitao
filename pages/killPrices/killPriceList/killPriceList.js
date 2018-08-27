// pages/killPrices/killPriceList/killPriceList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList: '',
        isPersonInfo: true,
        personInfo: '',
        oriData: '',
        actReg: true,
        lesson: true,
        pageNum:1,
        showTitle: true,
        btnText: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu');

        if (Number(pageTypeStu) == 4) {
            wx.setNavigationBarTitle({
                title: '一元好课报名',
            })
            getApp().request({
                url: 'my_lesson_one_list',
                method: 'post',
                data: {
                    page: 1
                },
                success: function (res) {
                    if(res.data.code == 1){
                        if (res.data.data.list.length > 0) {
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                            }
                        }
                        // 更多
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
                            userList: res.data.data.list
                        })   
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                }
            })
        } else if (Number(pageTypeStu) == 10) {
            wx.setNavigationBarTitle({
                title: '我的常规活动',
            })
            getApp().request({
                url: 'my_normal_list',
                method: 'post',
                data: {
                    page: that.data.pageNum,
                },
                success: function (res) {
                    if(res.data.code == 1){
                        if(res.data.data.list.length > 0){
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                            }
                        }
                        // 更多
                        if(res.data.data.list.length >= 10){
                            that.setData({
                                btnText: 1
                            })
                        }else{
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            userList: res.data.data.list
                        })   
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                }
            })
        }
    },
    moreData:function(e){
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu');
        if (Number(pageTypeStu) == 4){
            wx.setNavigationBarTitle({
                title: '一元好课报名',
            })
            let userList = [];
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                userList.push(...that.data.userList)
                that.setData({
                    pageNum: that.data.pageNum + 1
                })
                getApp().request({
                    url: 'my_lesson_one_list',
                    method: 'post',
                    data: {
                        page: that.data.pageNum,
                    },
                    success: function (res) {
                        if (res.data.code == 1) {
                            if (res.data.data.list.length > 0) {
                                for (let i = 0; i < res.data.data.list.length; i++) {
                                    res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                                }
                            }
                            userList.push(...res.data.data.list)
                            // 更多
                            if (userList.length >= that.data.pageNum*10) {
                                that.setData({
                                    btnText: 1
                                })
                            } else {
                                that.setData({
                                    btnText: 0
                                })
                            }
                            that.setData({
                                userList: userList
                            })
                            wx.hideLoading()
                        } else {
                            wx.hideLoading()
                            that.setData({
                                btnText: 0
                            })
                        }
                    }
                })
            }
        } else if (Number(pageTypeStu) == 10){
            wx.setNavigationBarTitle({
                title: '我的常规活动',
            })
            let userList = [];
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                userList.push(...that.data.userList)
                that.setData({
                    pageNum: that.data.pageNum + 1
                })
                getApp().request({
                    url: 'my_normal_list',
                    method: 'post',
                    data: {
                        page: that.data.pageNum,
                    },
                    success: function (res) {
                        if (res.data.code == 1) {
                            if (res.data.data.list.length > 0) {
                                for (let i = 0; i < res.data.data.list.length; i++) {
                                    res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                                }
                            }
                            userList.push(...res.data.data.list)
                            // 更多
                            if (userList.length >= that.data.pageNum*10) {
                                that.setData({
                                    btnText: 1
                                })
                            } else {
                                that.setData({
                                    btnText: 0
                                })
                            }
                            that.setData({
                                userList: userList
                            })
                            wx.hideLoading()
                        } else {
                            wx.hideLoading()
                            that.setData({
                                btnText: 0
                            })
                        }
                    }
                })
            }
        }
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
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu');
        that.setData({
            pageNum: 1
        })
        if (Number(pageTypeStu) == 10){
            wx.setNavigationBarTitle({
                title: '我的常规活动',
            })
            getApp().request({
                url: 'my_normal_list',
                method: 'post',
                data: {
                    page: that.data.pageNum,
                },
                success: function (res) {
                    if(res.data.code == 1){
                        if (res.data.data.list.length > 0) {
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                            }
                        }
                        // 更多
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
                            userList: res.data.data.list
                        })
                        wx.stopPullDownRefresh()
                    }else{
                        wx.stopPullDownRefresh();
                        that.setData({
                            btnText: 0
                        })
                    }
                }
            })
        } else if (Number(pageTypeStu) == 4){
            wx.setNavigationBarTitle({
                title: '一元好课报名',
            })
            getApp().request({
                url: 'my_lesson_one_list',
                method: 'post',
                data: {
                    page: that.data.pageNum
                },
                success: function (res) {
                    if (res.data.code == 1) {
                        if (res.data.data.list.length > 0) {
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                            }
                        }
                        // 更多
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
                            userList: res.data.data.list
                        })
                        wx.stopPullDownRefresh()
                    } else {
                        wx.stopPullDownRefresh()
                        that.setData({
                            btnText: 0 
                        })
                    }
                }
            })
        }
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
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    toPricePerson: function (e) {
        let sendData = JSON.stringify(e.currentTarget.dataset)
        let pageTypeStu = wx.getStorageSync('pageTypeStu');
        if (Number(pageTypeStu) == 4) {
            wx.navigateTo({
                url: '../../goodLesson/lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.id,
            })
        } else if (Number(pageTypeStu) == 10) {
            wx.navigateTo({
                url: '../../actReg/actRegListInfo/actRegListInfo?actId=' + e.currentTarget.dataset.actid,
            })
        }
    },
    toPriceListInfo: function (e) {
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (Number(pageTypeStu) == 10) {
            if (typeof this.data.userList[e.currentTarget.dataset.index].create_time == 'string'){

            } else if (typeof this.data.userList[e.currentTarget.dataset.index].create_time == 'number'){

                this.data.userList[e.currentTarget.dataset.index].create_time = utils.formatTime(new Date(this.data.userList[e.currentTarget.dataset.index].create_time * 1000))
            }
            
            this.setData({
                actReg: false,
                personInfo: this.data.userList[e.currentTarget.dataset.index]
            })
        } else if (Number(pageTypeStu) == 4) {
            if (typeof this.data.userList[e.currentTarget.dataset.index].create_time == 'string') {

            } else if (typeof this.data.userList[e.currentTarget.dataset.index].create_time == 'number') {

                this.data.userList[e.currentTarget.dataset.index].create_time = utils.formatTime(new Date(this.data.userList[e.currentTarget.dataset.index].create_time * 1000))
            }
            that.setData({
                lesson: false,
                personInfo: this.data.userList[e.currentTarget.dataset.index]
            })
        }
    },
    hiddenInfo: function () {
        this.setData({
            isPersonInfo: true,
            actReg: true,
            lesson: true
        })
    },
})