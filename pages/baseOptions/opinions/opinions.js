// pages/opinions/opinions.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textAreaData: '',
        name: '',
        phoneNum: undefined,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
    onShareAppMessage: function() {

    },
    bindTextAreaBlur: function(e) {
        this.setData({
            textAreaData: e.detail.value,
        })
    },
    getName: function(e) {
        this.setData({
            name: e.detail.value,
        })
    },
    getPhone: function(e) {
        this.setData({
            phoneNum: e.detail.value,
        })
    },
    subPinions: function(e) {
        var that = this
        console.log(e.detail.value)
        getApp().request({
            url: 'school/feedback',
            data: e.detail.value,
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: '正在提交',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)

                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '提交成功',
                            icon: 'success',
                            success: function() {
                                wx.navigateBack()
                            }
                        })
                    }
                }
                if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    }
})