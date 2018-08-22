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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu');

        if (Number(pageTypeStu) == 6) {
            wx.setNavigationBarTitle({
                title: '砍价报名列表',
            })
            getApp().request({
                url: "org/bargain_joiner_list",
                method: "post",
                data: {
                    id: options.id,
                    page:1,
                },
                success: res => {
                    if (res.data.data.list.length == 0){

                        that.setData({
                            showTitle: false
                        })
                    } else if (res.data.data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        that.setData({
                            userList: res.data.data
                        })
                    }
                }
            })
        } else if (Number(pageTypeStu) == 3) {
            wx.setNavigationBarTitle({
                title: '私人拼团报名列表',
            })
            getApp().request({
                url: "personal_group_range",
                method: "post",
                data: {
                    act_id: options.id,
                    page: '1',
                },
                success: res => {
                    let userData = res.data.data.list;
                    if (userData.length==0){
                        that.setData({
                            showTitle: false
                        })
                    } else if (userData.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < userData.length; i++) {
                            if (userData[i].is_leader == 1) {
                                userData[i].is_leader = '【团长】'
                            } else if (userData[i].is_leader == 0) {
                                userData[i].is_leader = '【团员】'
                            }
                            userData[i].create_time = utils.formatTime(new Date(userData[i].create_time*1000))
                        }
                        that.setData({
                            userList: userData,
                            oriData: res.data.data.list,
                        })
                    }
                }
            })
        } else if (Number(pageTypeStu) == 4) {
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
                    if (res.data.data.list.length==0){

                        that.setData({
                            showTitle: false
                        })
                    } else if (res.data.data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < res.data.data.list.length;i++){
                            res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                        that.setData({
                            userList: res.data.data.list
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
                    if (res.data.data.list.length==0){
                        // wx.showToast({
                        //     title: '您没有参加该活动',
                        // })
                        that.setData({
                            showTitle: false
                        })
                    } else if (res.data.data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                        that.setData({
                            userList: res.data.data.list
                        })   
                    }
                }
            })
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
                    if (res.data.data.list.length==0){
                        that.setData({
                            showTitle: false
                        })
                    } else if (res.data.data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        that.setData({
                            userList: res.data.data.list
                        })
                        wx.stopPullDownRefresh()
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
                    if (res.data.data.list.length == 0){
                        that.setData({
                            showTitle: false
                        })
                    } else if (res.data.data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        that.setData({
                            userList: res.data.data.list
                        })
                        wx.stopPullDownRefresh()
                    }
                }
            })
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu');
        if (Number(pageTypeStu) == 10){
            wx.setNavigationBarTitle({
                title: '我的常规活动',
            })
            let pageDataArr = [];
            pageDataArr.push(...that.data.userList);
            if (that.data.userList.length >= that.data.pageNum * 10){
                that.setData({
                    pageNum: that.data.pageNum + 1,
                })
                getApp().request({
                    url: 'my_normal_list',
                    method: 'post',
                    data: {
                        page: that.data.pageNum,
                    },
                    success: function (res) {
                        pageDataArr.push(...res.data.data.list)
                        that.setData({
                            userList: pageDataArr
                        })
                    }
                })
            }else{
                wx.showToast({
                    title: '到底啦',
                    icon: 'none'
                })
            }
        } else if (Number(pageTypeStu) == 4){
            wx.setNavigationBarTitle({
                title: '一元好课报名',
            })
            let pageDataArr = [];
            pageDataArr.push(...that.data.userList);
            if (that.data.userList.length >= that.data.pageNum * 10){
                that.setData({
                    pageNum: that.data.pageNum + 1,
                })
                getApp().request({
                    url: 'my_lesson_one_list',
                    method: 'post',
                    data: {
                        page: that.data.pageNum,
                    },
                    success: function (res) {
                        pageDataArr.push(...res.data.data.list)
                        that.setData({
                            userList: pageDataArr
                        })
                    }
                })
            }else{
                wx.showToast({
                    title: '到底啦',
                    icon: 'none'
                })
            }
        }
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
        if (Number(pageTypeStu) == 6) {
            wx.navigateTo({
                url: '../killPricePerson/killPricePerson?joinId=' + e.currentTarget.dataset.joinerid + '&actId=' + e.currentTarget.dataset.actid,
            })
        } else if (Number(pageTypeStu) == 3) {
            wx.navigateTo({
                url: '../../collage/collagePersonInfo/collagePersonInfo?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinerid,
            })
        } else if (Number(pageTypeStu) == 4) {
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
        if (Number(pageTypeStu) == 6) {
            wx.navigateTo({
                url: '../killPriceListInfo/killPriceListInfo?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinid,
            })
        } else if (Number(pageTypeStu) == 3) {
            let userData = this.data.userList;
            for (let i = 0; i < userData.length; i++) {
                if (this.data.oriData[i].can_join) {
                    this.data.oriData[i].can_join = '正在进行'
                } else {
                    this.data.oriData[i].can_join = '已经结束'
                }

            }
            this.setData({
                isPersonInfo: false,
                personInfo: this.data.oriData[e.currentTarget.dataset.index]
            })
        } else if (Number(pageTypeStu) == 10) {
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
            // this.data.userList[e.currentTarget.dataset.index].create_time = utils.formatTime(new Date(this.data.userList[e.currentTarget.dataset.index].create_time*1000))
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
    }
})