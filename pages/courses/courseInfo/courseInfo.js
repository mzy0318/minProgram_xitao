let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        lessonInfo:'',
        isShow:true,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            lessonInfo: wx.getStorageSync('lessonInfo')
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
    handleShow: function () {
       this.setData({
           isShow:false
       })
    },
    handleHidden: function () {
        this.setData({
            isShow: true
        })
    },
    toIndex: function () {
        wx.navigateTo({
            url: '../index/index',
        })

    },
    tellPhone: function () {
        app.tellPhone()
    },
    map: function () {
        app.map()
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
        }
        return {
            title: '智慧招生小程序',
            path: '/page/courseInfo/courseInfo'
        }
    }, 
    toOrderInfo:function(e){
        wx.navigateTo({
            url: '../orderInfo/orderInfo?nowPrice=' + e.currentTarget.dataset.price,
        })
    },
})