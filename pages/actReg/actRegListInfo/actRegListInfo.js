// pages/actReg/actRegListInfo/actRegListInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        status: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        getApp().request({
            url: 'normal_act',
            method: 'post',
            data: {
                id: options.actId,
            },
            success: function (res) {
                that.setData({
                    pageData: res.data.data,
                    status: res.data.data.time_status
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
    makePhone: function (e) {
        getApp().tellPhone(e)
    },
    toIndexPage: function () {
        getApp().toIndex()
    },
    toSignPage: function (e) {
        let that = this;
        if (that.data.status === '活动已结束') {
            wx.showModal({
                title: '提示',
                content: that.data.status,
            })
        } else {
            wx.navigateTo({
                url: '../actRegSignUp/actRegSignUp?actId=' + e.currentTarget.dataset.id,
            })
        }
    }
})