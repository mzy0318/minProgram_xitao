// pages/killPrices/killPriceListInfo/killPriceListInfo.js
const util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        personInfo:'',
        startTime:'',
        actId:'',
        joinId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            actId: options.actId,
            joinId: options.joinId
        })
        getApp().request({
            url: "org/bargain_info",
            method: "get",
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            success: res => {
                this.setData({
                    personInfo:res.data.data,
                    startTime: util.formatTime(new Date(res.data.data.create_time*1000))
                })
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
    // onShareAppMessage: function () {
    //     let that = this;
    //     if(res.from == 'menu'){
    //         return {
    //             path:'pages/index/index?ageId=5&actId='+that.data.actId
    //         }
    //     }
    // },
    backPage: function () {
        wx.navigateBack({})
    }
})