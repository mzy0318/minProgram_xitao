// pages/videoClass/videoClassUserList/videoClassUserList.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        listData:'',
        catalogList:'',
        tagList:'',
        isCatalog:true,
        isTag:true,
        catalogNum:0,
        tagNum:0,
        catalog:'',
        tag:'',
        pageNum:1,
        btnText: 0,
        isAdd:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.getPageData();
        let loginCode = wx.getStorageSync('loginCode');
        if (loginCode == 1){
            that.setData({
                isAdd: false,
            })
        }else{
            that.setData({
                isAdd: true,
            })
        }
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
        that.getPageData()
    },
    // 获取更多页面数据
    moreData:function(e){
        let that = this;
        let listData = [];
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            listData.push(...that.data.listData)
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'visitor_video_class_list',
                data: {
                    tag: that.data.tag,
                    catalog: that.data.catalog,
                    page: that.data.pageNum,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.hideLoading()
                        
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].cover.url = utils.rect(res.data.data.list[i].cover.url, 172, 100)
                        }
                        listData.push(...res.data.data.list);
                        if (listData.length >= that.data.pageNum*10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            listData: listData
                        })
                        wx.stopPullDownRefresh()
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }
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
    // 功能
    toOptions:function(e){
        if (Number(e.currentTarget.dataset.id) == 0){
            getApp().toIndex()
        } else if (Number(e.currentTarget.dataset.id) == 1){
            wx.navigateTo({
                url: '../../courses/course/course',
            })
        }
    },
    goManList: function () {
        wx.navigateTo({
            url: '../videoClassManList/videoClassManList',
        })
    },
    toInfo:function(e){
        wx.navigateTo({
            url: '../videoClassInfo/videoClassInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    // 显示/隐藏  分类/标签
    isContent:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            that.setData({
                isCatalog: !that.data.isCatalog
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            that.setData({
                isTag: !that.data.isTag
            })
        }
    },
    // 分类/标签  切换效果  请求数据
    switchTag:function(e){
        let that = this;
        that.setData({
            pageNum:1
        })
        if (Number(e.currentTarget.dataset.id) == 0) {
            that.setData({
                catalogNum: e.currentTarget.dataset.index,
                catalog: e.currentTarget.dataset.name == '全部' ? '' : e.currentTarget.dataset.name
            })
            wx.showLoading({
                title: '',
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            wx.showLoading({
                title: '',
            })
            that.setData({
                tagNum: e.currentTarget.dataset.index,
                tag: e.currentTarget.dataset.name == '全部' ? '' : e.currentTarget.dataset.name
            })
        }
        getApp().request({
            url: 'visitor_video_class_list',
            data: {
                tag: that.data.tag,
                catalog: that.data.catalog,
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.hideLoading()
                    res.data.data.catalog.unshift('全部')
                    res.data.data.tag.unshift('全部');
                    if (res.data.data.list.length >= 10) {
                        that.setData({
                            btnText: 1
                        })
                    } else {
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        catalogList: res.data.data.catalog,
                        tagList: res.data.data.tag,
                        listData: res.data.data.list
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'visitor_video_class_list',
            data: {
                tag: '',
                catalog: '',
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    res.data.data.catalog.unshift('全部')
                    res.data.data.tag.unshift('全部')
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].cover.url = utils.rect(res.data.data.list[i].cover.url, 172, 100)
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
                        catalogList: res.data.data.catalog,
                        tagList: res.data.data.tag,
                        listData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0) {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
})