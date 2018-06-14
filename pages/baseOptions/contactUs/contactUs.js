// pages/contactUs/contactUs.js.js
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageInfo:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getApp().request({
            url: 'school/contact',
            data: {},
            success: res => {
                console.log(res)
                this.setData({
                    pageInfo:res.data.data,
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
    onShareAppMessage: function () {

    },
    tellPhone: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.pageInfo.telephone,
        })
    },
    map: function () {
        let data = this.data.pageInfo
        let address = this.data.pageInfo.address;
        let n = address.indexOf('<')
        if (n!=-1){
            address = address.substr(0, n)
        }
        wx.openLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            scale: 28,
            name: data.app_name,
            address: address,
        })
    }
})