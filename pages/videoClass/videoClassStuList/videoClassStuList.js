let rect = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum:1,
        pageData:'',
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.getPageData();
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
    toInfo:function(e){
        wx.navigateTo({
            url: '../videoClassInfo/videoClassInfo?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 获取更多页面数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'my_video_class_list',
                data: {
                    page: that.data.pageNum
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        if (res.data.data.length > 0) {
                            for (let i = 0; i < res.data.data.length; i++) {
                                res.data.data[i].cover.url = rect.rect(res.data.data[i].cover.url, 172, 100)
                            }
                        }
                        pageData.push(...res.data.data)
                        // 更多
                        if (pageData.length >= that.data.pageNum*10) {
                            that.setData({
                                className: 'moreData',
                                btnText: '更多'
                            })
                        } else {
                            that.setData({
                                className: 'moreDataed',
                                btnText: '没有了'
                            })
                        }
                        that.setData({
                            pageData: pageData
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
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
            url: 'my_video_class_list',
            data: {
                page: that.data.pageNum
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    if(res.data.data.length > 0){
                        for(let i = 0;i<res.data.data.length;i++){
                            res.data.data[i].cover.url = rect.rect(res.data.data[i].cover.url,172,100)
                        }
                    }
                    // 更多
                    if(res.data.data.length >= 10){
                        that.setData({
                            className: 'moreData',
                            btnText: '更多'
                        })
                    }else{
                        that.setData({
                            className: 'moreDataed',
                            btnText: '没有了'
                        })
                    }
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0){
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    }
})