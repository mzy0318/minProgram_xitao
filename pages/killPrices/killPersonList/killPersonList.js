// pages/killPrices/killPersonList/killPersonList.js
let util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList:'',
        isPersonInfo:true,
        personInfo:'',
        showTitle: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (pageTypeStu == 6){
            getApp().request({
                url: "my_bargain_list",
                method: "post",
                data: {},
                success: res => {
                    let data = res.data.data;
                    wx.setNavigationBarTitle({
                        title: '砍价报名列表',
                    })
                    if (data.list.length==0){
                        // wx.showToast({
                        //     title: '您没有参加该活动',
                        //     icon:'none',
                        // })
                        that.setData({
                            showTitle:false
                        })
                    } else if (data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < data.list.length; i++) {
                            data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time*1000))
                        }
                        this.setData({
                            userList: data
                        })
                    }
                }
            })
        }else if(pageTypeStu == 3) {
            getApp().request({
                url: "my_personal_group_list",
                method: "post",
                data: {},
                success: res => {
                    let data = res.data.data;
                    wx.setNavigationBarTitle({
                        title: '我的私人拼团',
                    })
                    if (data.list.length==0){
                        // wx.showToast({
                        //     title: '您没有参加该活动',
                        //     icon:'none',
                        // })
                        that.setData({
                            showTitle: false
                        })
                    } else if (data.list.length != 0){
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < data.list.length; i++) {
                            data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time*1000))
                        }
                        this.setData({
                            userList: data
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
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (pageTypeStu == 6) {
            getApp().request({
                url: "my_bargain_list",
                method: "post",
                data: {},
                success: res => {
                    let data = res.data.data;
                    wx.setNavigationBarTitle({
                        title: '砍价报名列表',
                    })
                    if (data.list.length == 0) {
                        // wx.showToast({
                        //     title: '您没有参加该活动',
                        //     icon: 'none',
                        // })
                        that.setData({
                            
                                showTitle: false
                            
                        })
                    } else if (data.list.length != 0) {
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < data.list.length; i++) {
                            data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time*1000))
                        }
                        this.setData({
                            userList: data
                        })
                        wx.stopPullDownRefresh()
                    }
                }
            })
        } else if (pageTypeStu == 3) {
            getApp().request({
                url: "my_personal_group_list",
                method: "post",
                data: {},
                success: res => {
                    let data = res.data.data;
                    wx.setNavigationBarTitle({
                        title: '我的私人拼团',
                    })
                    if (data.list.length == 0) {
                        // wx.showToast({
                        //     title: '您没有参加该活动',
                        //     icon: 'none',
                        // })
                        that.setData({
                            showTitle: false
                        })
                    } else if (data.list.length != 0) {
                        that.setData({
                            showTitle: true
                        })
                        for (let i = 0; i < data.list.length; i++) {
                            data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time*1000))
                        }
                        this.setData({
                            userList: data
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toKillPriceInfo:function(e){
        let personInfo = JSON.stringify(e.currentTarget.dataset)
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (Number(pageTypeStu) == 6) {
            wx.navigateTo({
                url: '../killPricePerson/killPricePerson?personInfo=' + personInfo + '&nickName=' + e.currentTarget.dataset.nickname,
            })
        } else if (Number(pageTypeStu) == 3) {
            wx.navigateTo({
                url: '../../collage/collagePersonInfo/collagePersonInfo?joinId=' + e.currentTarget.dataset.joiner_id + '&actId=' + e.currentTarget.dataset.act_id,
            })
        }
    },
    toListInfo:function(e){
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (pageTypeStu == 6){
            wx.navigateTo({
                url: '../killPriceListInfo/killPriceListInfo?actId=' + e.currentTarget.dataset.actid,
            })
        } else if (pageTypeStu == 3){
            let userInfo = this.data.userList.list[e.currentTarget.dataset.index];
            userInfo.start_time = util.formatTime(new Date(userInfo.start_time*1000));
            userInfo.end_time = util.formatTime(new Date(userInfo.end_time*1000));
            userInfo.is_leader = userInfo.is_leader?'团长':'团员';
            this.setData({
                isPersonInfo:false,
                personInfo: userInfo
            })
        }
    },
    hiddenInfo:function(){
        this.setData({
            isPersonInfo: true,
        })
    }
})