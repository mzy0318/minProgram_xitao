// pages/baseOptions/schoolList/schoolList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        isFrozen: 'empty',
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
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
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
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
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
    // onReachBottom: function () {

    // },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that = this;
        if(res.from == 'menu'){
            return {
                path:'pages/index/index?pageId=11'
            }
        }
    },
    makePhone:function(e){
        getApp().tellPhone(e)
    },
    getAddress:function(e){
        getApp().map(e.currentTarget.dataset.latitude,e.currentTarget.dataset.longitude,e.currentTarget.dataset.name,e.currentTarget.dataset.address,);
    }
})