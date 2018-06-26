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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time))
                    }
                    this.setData({
                        userList: data
                    })
                }
            })
        }else if(pageTypeStu == 3) {
            getApp().request({
                url: "my_personal_group_list",
                method: "post",
                data: {},
                success: res => {
                    let data = res.data.data;

                    for (let i = 0; i < data.list.length; i++) {
                        data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time))
                    }

                    wx.setNavigationBarTitle({
                        title: '我的私人拼团',
                    })
                    this.setData({
                        userList: data
                    })
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
                url: '../../collage/collagePersonInfo/collagePersonInfo?joinId=' + e.currentTarget.dataset.joinerid + '&actId=' + e.currentTarget.dataset.id,
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
            this.setData({
                isPersonInfo:false,
                personInfo: this.data.userList.list[e.currentTarget.dataset.index]
            })
        }
    },
    hiddenInfo:function(){
        this.setData({
            isPersonInfo: true,
        })
    }
})