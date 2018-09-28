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
        pageNum: 1,
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.getPageData()
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
            pageNum: 1
        })
        that.getPageData();
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
    toCollageInfo:function(e){
        wx.navigateTo({
            url: '../collageInfo/collageInfo?actId=' + e.currentTarget.dataset.actid + '&acttag=' + e.currentTarget.dataset.acttag,
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
                url: 'visitor_personal_group_list',
                method: 'post',
                data: {
                    page: that.data.pageNum
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
                    if (Number(res.data.code) == 1) {
                        let data = res.data.data.list

                        data = utils.map(data, function (one) {
                            one.banner_image_url = utils.rect(one.banner_image_url, 500, 250)
                            one.start_time = utils.liteDate(one.start_time)
                            one.end_time = utils.liteDate(one.end_time)
                            return one
                        })
                        pageData.push(...data)
                        if (pageData.length >= that.data.pageNum * 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            pageData: pageData,
                        })
                        wx.hideLoading()
                    } else if (Nmuber(res.data.code) == 0) {
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
            url: 'visitor_personal_group_list',
            method: 'post',
            data:{
                page:that.data.pageNum
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
                if (Number(res.data.code) == 1) {
                    let data = res.data.data.list

                    data = utils.map(data, function (one) {
                        one.banner_image_url = utils.rect(one.banner_image_url, 500, 250)
                        one.start_time = utils.liteDate(one.start_time)
                        one.end_time = utils.liteDate(one.end_time)
                        return one
                    })
                    if(data.length >= 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: data,
                    })
                    wx.stopPullDownRefresh()
                } else if (Nmuber(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})