let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        statusText: '活动进行中',
        statusColor: 'green',
        pageNum:1,
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
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
            pageNum:1
        })
        that.getPageData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    },
    // 活动详情页面
    toInfoPage:function(e){
        let that = this;
        wx.navigateTo({
            url: '../collectActInfo/collectActInfo?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 获取页面更多数据
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
                url: 'sugar/list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'get',
                success: (res) => {
                    if (res.data.code == 1) {
                        wx.stopPullDownRefresh();
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            if (res.data.data.list[i].end_time * 1000 > new Date().valueOf()) {
                                res.data.data.list[i].statusText = '活动进行中';
                                res.data.data.list[i].statusColor = 'green';
                            } else if (res.data.data.list[i].end_time * 1000 <= new Date().valueOf()) {
                                res.data.data.list[i].statusText = '活动已结束';
                                res.data.data.list[i].statusColor = 'red';
                            }
                            res.data.data.list[i].start_time = format.formatTime(new Date(res.data.data.list[i].start_time * 1000));
                            res.data.data.list[i].end_time = format.formatTime(new Date(res.data.data.list[i].end_time * 1000));
                            res.data.data.list[i].banner_image_url = format.rect(res.data.data.list[i].banner_image_url, 200, 100)
                        }
                        pageData.push(...res.data.data.list)
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
                        wx.hideLoading()
                        that.setData({
                            pageData: pageData
                        })
                    }else{
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    // 获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url:'sugar/list',
            data:{
                page:that.data.pageNum,
            },
            method:'get',
            success:(res) => {
                if(res.data.code == 1){
                    wx.stopPullDownRefresh();
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        if (res.data.data.list[i].end_time * 1000 > new Date().valueOf()) {
                            res.data.data.list[i].statusText = '活动进行中';
                            res.data.data.list[i].statusColor = 'green';
                        } else if (res.data.data.list[i].end_time * 1000 <= new Date().valueOf()) {
                            res.data.data.list[i].statusText = '活动已结束';
                            res.data.data.list[i].statusColor = 'red';
                        }
                        res.data.data.list[i].start_time = format.formatTime(new Date(res.data.data.list[i].start_time * 1000));
                        res.data.data.list[i].end_time = format.formatTime(new Date(res.data.data.list[i].end_time * 1000));
                        res.data.data.list[i].banner_image_url = format.rect(res.data.data.list[i].banner_image_url, 200, 100)
                    }
                    if (res.data.data.list.length >= 10){
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
                        pageData: res.data.data.list
                    })
                }
            }
        })
    }
})