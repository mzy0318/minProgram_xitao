// pages/service/service.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index:0,
        isShow:false,
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
        let that = this;
        that.setData({
            index:that.data.index + 1
        })
        if (that.data.index == 2){
            wx.switchTab({
                url: '../index/index',
            })
            that.setData({
                index: 0,
                isShow: true,
            })
        }else if(that.data.index == 1){
            that.setData({
                isShow:false,
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        let that = this;
        that.setData({
            index: 0
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let that = this;
        that.setData({
            index: 0
        })
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
    // onShareAppMessage: function() {

    // }
    toIndex:function(){
        let that = this;
        wx.switchTab({
            url: '../index/index',
        })
        that.setData({
            index: 0
        })
    }
})