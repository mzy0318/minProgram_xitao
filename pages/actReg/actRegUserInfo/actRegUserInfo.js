let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:true,
        pageData:'',
        userInfo:'',
        pageNum:1,
        actId:'',
        actTag:'',
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.setNavigationBarTitle({
            title: options.title,
        })
        that.setData({
            actId: options.actId,
            actTag: options.actTag,
        })
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

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    makePhone:function(e){
        getApp().tellPhone(e)
    },
    isShowInfo:function(e){
        let that = this
        if (Number(e.currentTarget.dataset.num)==-1){
            that.setData({
                isShow:true
            })
        } else if (Number(e.currentTarget.dataset.num) == 0){
            that.setData({
                isShow: false,
                userInfo: e.currentTarget.dataset.userdata,
            })
        }
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
                url: 'org/normal_joiner_list',
                data: {
                    act_id: that.data.actId,
                    act_tag: that.data.actTag,
                    page: that.data.pageNum,
                },
                method: 'post',
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
                        pageData: pageData,
                    })
                    wx.hideLoading()
                    if (res.data.code == 0) {
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'org/normal_joiner_list',
            data: {
                act_id: that.data.actId,
                act_tag: that.data.actTag,
                page: that.data.pageNum,
            },
            method: 'post',
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
                    pageData: res.data.data.list,
                })
                wx.stopPullDownRefresh()
                if(res.data.code == 0){
                    wx.stopPullDownRefresh()
                }
            }
        })
    },
})