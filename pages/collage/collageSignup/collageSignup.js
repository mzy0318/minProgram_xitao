// pages/collage/collageSignUp/collageSignup.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        formInfo:'',
        actId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            formInfo: JSON.parse(options.info),
            actId: options.actId
        })
        console.log('this.data.formInfo', this.data.formInfo)
        console.log('this.data.actId', this.data.actId)
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
    toBackPage: function (e) {
        wx.navigateBack({
        })
        this.setData({
            isShow: false
        })
    },
    submitInfo: function (e) {
        let arr = []
        arr.push(e.detail.value[1])
        e.detail.value.act_id = this.data.actId
        e.detail.value.info = arr
        delete e.detail.value[1]
        getApp().request({
            url:'join_personal_group',
            data:e.detail.value,
            method:'post',
            success:function(res){
                if (res.data.code == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                } else if (res.data.code == 1){
                    wx.navigateBack({

                    })
                }
            }
        })
    }
})