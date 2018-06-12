// pages/videos/manVideoList.js
let utils = require('../../../utils/util.js')
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
            url:'org/video_card_list',
            method:'post',
            data:{
                page:'1',
            },
            success:function(res){
                for (let i = 0; i < res.data.data.list.length; i++) {
                    res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time))
                }
                that.setData({
                    pageData:res.data.data.list
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
    toListInfo:function(e){
        wx.navigateTo({
            url: '../videoListInfo/videoListInfo?id=' + e.currentTarget.dataset.actid + '&userType=0',
        })
    },
    toVideosEdit: function (e) {
        wx.navigateTo({
            url: '../../manageCenters/videoEdit/videoEdit?id=' + e.currentTarget.dataset.actid + '&isEdit=1&userType=0',
        })
    },
    chooseModel:function(res){
        wx.navigateTo({
            url: '../../manageCenters/chooseModel/chooseModel',
        })
    },
    moveAct:function(e){
        getApp().request({
            url:'org/delete_act',
            method:'post',
            data:{
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.tag,
            },
            success:function(res){
                if(res.data.code==1){
                    wx.wx.navigateTo({
                        url:'../../videos/manVideoList/manVideoList'
                    })
                }
            }    
        })
    }
})