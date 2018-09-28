// pages/videos/manVideoList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
        btnText: 0,
        isFrozen: 'empty',
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
        let that = this;
        that.setData({
            pageNum:1
        })
        that.getPageData()
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
        that.getPageData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
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
    // 删除活动
    moveAct:function(e){
        let that = this;
        getApp().request({
            url:'org/delete_act',
            method:'post',
            data:{
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.tag,
            },
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
                if(res.data.code==1){
                    wx.showToast({
                        title: '删除成功',
                        icon:'success',
                        success:function(){
                            that.setData({
                                pageNum:1
                            })
                            that.getPageData()
                        }
                    })
                } else if (res.data.code == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }    
        })
    },
    taBack:function(){
        wx.navigateBack({})
    },
    // 分享
    toSharePage: function (e) {
        let that = this;
        let url = encodeURIComponent(e.currentTarget.dataset.url)
        wx.navigateTo({
            url: '../videoSharePage/videoSharePage?actid=' + e.currentTarget.dataset.actid + '&url=' + url + '&title=' + e.currentTarget.dataset.title,
        })
    },
    // 获取更多数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'org/video_card_list',
                method: 'post',
                data: {
                    page: that.data.pageNum,
                },
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
                    if (res.data.code == 1) {
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                        pageData.push(...res.data.data.list)
                        if (pageData.length >= that.data.pageNum*10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            pageData: pageData
                        })
                        wx.hideLoading()
                    } else if (res.data.code == 0) {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'org/video_card_list',
            method: 'post',
            data: {
                page: that.data.pageNum,
            },
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
                if(res.data.code == 1){
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                    }
                    if (res.data.data.list.length >= 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                } else if (res.data.code == 0){
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    }
})