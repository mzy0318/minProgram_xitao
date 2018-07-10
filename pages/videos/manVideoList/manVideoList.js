// pages/videos/manVideoList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
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
                page:that.data.pageNum,
            },
            success:function(res){
                for (let i = 0; i < res.data.data.list.length; i++) {
                    res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time*1000))
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
        let that = this;
        that.setData({
            pageNum: 1,
        })
        getApp().request({
            url: 'org/video_card_list',
            method: 'post',
            data: {
                page: that.data.pageNum,
            },
            success: function (res) {
                for (let i = 0; i < res.data.data.list.length; i++) {
                    res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time*1000))
                }
                that.setData({
                    pageData: res.data.data.list
                })
                wx.stopPullDownRefresh()
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.pageData)
        if (that.data.pageData.length >= that.data.pageNum * 10){
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'org/video_card_list',
                method: 'post',
                data: {
                    page: that.data.pageNum,
                },
                success: function (res) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time*1000))
                    }
                    pageDataArr.push(...res.data.data.list)
                    that.setData({
                        pageData: pageDataArr
                    })
                }
            })
        }else{
            wx.showToast({
                title: '到底啦',
                icon: 'none'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
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
                    wx.showToast({
                        title: '删除成功',
                        icon:'success',
                        success:function(){
                            
                        }
                    })
                    // wx.navigateTo({
                    //     url:'../../videos/manVideoList/manVideoList'
                    // })
                }
            }    
        })
    },
    taBack:function(){
        wx.navigateBack({})
    },
    toSharePage: function (e) {
        wx.navigateTo({
            url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/videos/videoListInfo/videoListInfo',
        })
    }
})