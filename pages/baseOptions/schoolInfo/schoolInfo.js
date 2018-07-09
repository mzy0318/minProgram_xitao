// pages/schoolnfo/schoolInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        autoplay: false,
        duration: 500,
        interval: 5000,
        indicatorColor: "rgb(0,0,0,0.3)",
        indicatorActiveColor: "#000000",
        pageData:'',
        isVideo:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url: 'school/intro',
            data: {
                orgid: getApp().getExtConfig().orgId
            },
            success: res => {
                if (res.data.data.brand == null){
                    that.setData({
                        isVideo:true,
                    })
                }else {
                    that.setData({
                        isVideo: false,
                    })
                }
                this.setData({
                    pageData:res.data.data
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

    }
})