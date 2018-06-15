// pages/actReg/actRegSignUp/actRegSignUp.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        actId: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        let that = this;
        that.setData({
            actId: options.actId
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
    submitInfo: function (e) {
        let that = this;
        e.detail.value['act_id'] = that.data.actId
        getApp().request({
            url: 'join_normal',
            data: e.detail.value,
            method: 'post',
            success: function (res) {
                wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                })
                if(Number(res.data.code)==1){
                    that.setData({
                        isShow: true
                    })
                }
            }
        })
    },
    toBackPage:function(){
        let that = this;
        wx.navigateTo({
            url: '../../actReg/actRegListInfo/actRegListInfo?actId=' + that.data.actId,
        })
        that.setData({
            isShow: false
        })
    }
})