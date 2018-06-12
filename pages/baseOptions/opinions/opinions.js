// pages/opinions/opinions.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        textAreaData:'',
        name:'',
        phoneNum:undefined,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    bindTextAreaBlur: function (e) {
        this.setData({
            textAreaData: e.detail.value,
        })
    },
    getName:function(e){
        this.setData({
            name: e.detail.value,
        })
    },
    getPhone:function(e){
        this.setData({
            phoneNum: e.detail.value,
        })
    },
    subPinions:function(){
        getApp().request({
            url: 'school/intro',
            data: {
                content: this.data.textArea,
                nickname: this.data.name,
                phone: this.data.phoneNum
            },
            method:'post',
            success: res => {}
        })
    }
})