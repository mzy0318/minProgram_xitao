// pages/actReg/actRegManList/actRegManList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        pageNum: 1,
        btnText: 0
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
            pageNum: 1,
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
            pageNum:1
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
        let that = this;
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
                        icon:'success',
                        success:function(){
                            that.setData({
                                pageNum: 1
                            })
                            that.getPageData()
                        }
                    })
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    },
    toUserInfo: function (e) {
        wx.navigateTo({
            url: '../actRegUserInfo/actRegUserInfo?actTag=' + e.currentTarget.dataset.acttag + '&actId=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title,
        })
    },
    taBack:function(){
        wx.navigateBack({})
    },
    sharePage:function(e){
        wx.navigateTo({
            url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/actReg/actRegListInfo/actRegListInfo&actTag=' + e.currentTarget.dataset.acttag,
        })
    },
    // 获取页面更多数据
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
                url: 'org/normal_list',
                data: {
                    page: that.data.pageNum
                },
                method: 'post',
                success: function (res) {
                    if (res.data.code == 1) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].end_time = utils.formatTime(new Date(res.data.data[i].end_time * 1000))
                        }
                        res.data.data = utils.map(res.data.data, function (one) {
                            one.cover.url = utils.rect(one.cover.url, 200, 100)
                            return one
                        })
                        pageData.push(...res.data.data)
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
                            title: res.code.msg,
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
            url: 'org/normal_list',
            data: {
                page: that.data.pageNum
            },
            method: 'post',
            success: function (res) {
                if(res.data.code == 1){
                    for (let i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].end_time = utils.formatTime(new Date(res.data.data[i].end_time * 1000))
                    }
                    res.data.data = utils.map(res.data.data, function (one) {
                        one.cover.url = utils.rect(one.cover.url, 200, 100)
                        return one
                    })
                    if (res.data.data.length >= 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh();
                } else if (res.data.code == 0){
                    wx.stopPullDownRefresh();
                    wx.showToast({
                        title: res.code.msg,
                        icon:'none',
                    })
                }
            }
        })
    }
})