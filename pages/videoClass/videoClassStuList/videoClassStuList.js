let rect = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum:1,
        pageData:'',
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
        let that = this;
        let pageData = [];
        pageData.push(...that.data.pageData)
        if(that.data.pageData.length >= that.data.pageNum*10){
            that.setData({
                pageNum:that.data.pageNum + 1
            })
            getApp().request({
                url: 'my_video_class_list',
                data: {
                    page:that.data.pageNum
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
                        that.setData({
                            pageData: pageData,
                        })
                        wx.stopPullDownRefresh()
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        }
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
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    }
})