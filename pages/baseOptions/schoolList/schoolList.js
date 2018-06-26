// pages/baseOptions/schoolList/schoolList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url:'campus_list',
            data:{},
            method:'get',
            success:function(res){
                that.setData({
                    pageData:res.data.data,
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
        let that = this;
        getApp().request({
            url: 'campus_list',
            data: {},
            method: 'get',
            success: function (res) {
                that.setData({
                    pageData: res.data.data,
                })
                wx.stopPullDownRefresh()
            }
        })
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
    makePhone:function(e){
        getApp().tellPhone(e)
    },
    getAddress:function(e){
        getApp().map(e.currentTarget.dataset.latitude,e.currentTarget.dataset.longitude,e.currentTarget.dataset.name,e.currentTarget.dataset.address,);
    }
})