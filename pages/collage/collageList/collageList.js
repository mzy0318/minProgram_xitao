// pages/collage/collageList.js
let utils = require( '../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        startTime:'',
        endTime:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        getApp().request({
            url:'visitor_personal_group_list',
            method:'post',
            success:function(res){
                let data = res.data.data.list
                for (let i = 0; i < data.length;i++){
                    data[i].start_time = utils.formatTime(new Date(data[i].start_time))
                    data[i].end_time = utils.formatTime(new Date(data[i].end_time))
                }
                that.setData({
                    pageData:data,
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
    toCollageInfo:function(e){
        console.log(e.currentTarget.dataset.actid)
        wx.navigateTo({
            url: '../collageInfo/collageInfo?actId='+e.currentTarget.dataset.actid,
        })
    }
})