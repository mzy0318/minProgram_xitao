// pages/teachers/teachers.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        teacherData:null,
        bgColor:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getApp().request({
            url: 'school/teacher/list',
            data: {},
            success: res => {
                if(res.data.code == 1){
                    this.setData({
                        teacherData: res.data.data,
                        bgColor: res.data.data[0].bg_color
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
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
        if(res.from == 'menu'){
            return {
                path:'pages/index/index?pageId=9'
            }
        }
    },
    switchBgcolor:function(e){
        let that = this;
        that.setData({
            bgColor: that.data.teacherData[e.detail.current].bg_color
        })
    },
})