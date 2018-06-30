// pages/actReg/actRegManList/actRegManList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        pageNum: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url: 'org/normal_list',
            data: {
                page: that.data.pageNum
            },
            method: 'post',
            success: function (res) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].end_time = utils.formatTime(new Date(res.data.data[i].end_time))
                }
                that.setData({
                    pageData: res.data.data
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
            pageNum:1
        })
        getApp().request({
            url: 'org/normal_list',
            data: {
                page: that.data.pageNum
            },
            method: 'post',
            success: function (res) {
                for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].end_time = utils.formatTime(new Date(res.data.data[i].end_time))
                }
                that.setData({
                    pageData: res.data.data
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
                url: 'org/normal_list',
                data: {
                    page: that.data.pageNum
                },
                method: 'post',
                success: function (res) {
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].end_time = utils.formatTime(new Date(res.data.data[i].end_time))
                    }
                    pageDataArr.push(...res.data.data)
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
    onShareAppMessage: function () {

    },
    toLessonInfo: function (e) {
        wx.navigateTo({
            url: '../actRegListInfo/actRegListInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    toLessonEdit: function (e) {
        wx.navigateTo({
            url: '../../manageCenters/actRegEdit/actRegEdit?actId=' + e.currentTarget.dataset.id,
        })
    },
    delActive: function (e) {
        getApp().request({
            url: 'org/delete_act',
            data: {
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.acttag
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.showToast({
                        title: '删除成功',
                    })
                }
            }
        })
    },
    toUserInfo: function (e) {
        wx.navigateTo({
            url: '../actRegUserInfo/actRegUserInfo?actTag=' + e.currentTarget.dataset.acttag + '&actId=' + e.currentTarget.dataset.id,
        })
    }
})