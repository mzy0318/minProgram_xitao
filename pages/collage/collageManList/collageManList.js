var utils = require("../../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum: 1,
        pageData: '',
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        // 获取页面数据
        that.setData({
            pageNum: 1,
        })
        that.getPageData();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        let that = this;
        // 获取页面数据
        that.setData({
            pageNum: 1,
        })
        that.getPageData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },
    // 拼团详情页面
    toKillPirce: function(e) {
        let pageType = wx.getStorageSync('pageType')
        wx.setStorageSync('actTag', e.currentTarget.dataset.acttag)
        wx.navigateTo({
            url: '../../collage/collageInfo/collageInfo?actId=' + e.currentTarget.dataset.id + '&actTag=' + e.currentTarget.dataset.acttag,
        })

    },
    // 删除活动
    delActive: function(e) {
        let that = this;
        let pageType = wx.getStorageSync('pageType')
        getApp().request({
            url: 'org/delete_act',
            data: {
                act_id: e.currentTarget.dataset.actid,
                act_tag: e.currentTarget.dataset.acttag,
            },
            method: 'post',
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        success: function() {
                            that.setData({
                                pageNum: 1
                            })
                            that.getPageData()
                        }
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        title: 'none'
                    })
                }
            }
        })
    },
    // 编辑活动
    tomanageEdit: function(e) {
        let that = this;
        wx.navigateTo({
            url: '../../manageCenters/collageEdit/collageEdit?isEdit=1&id=' + e.currentTarget.dataset.id,
        })
    },
    // 分享页面
    toSharePage: function (e) {
        let that = this;

        wx.navigateTo({
            url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/collage/collageInfo/collageInfo&actTag=' + e.currentTarget.dataset.acttag,
        })

    },
    // 拼团参与人员
    toPersonList: function (e) {
       let that = this;
        wx.navigateTo({
            url: '../collageUserList/collageUserList?id=' + e.currentTarget.dataset.id,
        })
    },
    // 新建活动
    toChooseModel: function () {
        wx.navigateTo({
            url: '../../manageCenters/chooseModel/chooseModel',
        })
    },
    // 返回
    toback: function() {
        wx.navigateBack({})
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
                url: 'org/personal_group_list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'post',
                success: res => {
                    wx.stopPullDownRefresh()
                    if (res.data.data.list.length <= 0) {
                        that.setData({
                            isData: false
                        })
                    } else {
                        that.setData({
                            isData: true
                        })
                        // 改变图片大小
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].coverImage = utils.rect(res.data.data.list[i].cover.url, 200, 100);
                            res.data.data.list[i].start_time = utils.seconds(new Date(res.data.data.list[i].start_time * 1000))
                            res.data.data.list[i].end_time = utils.seconds(new Date(res.data.data.list[i].end_time * 1000))
                        }
                    }
                    pageData.push(...res.data.data.list)
                    // 更多数据
                    if (pageData.length >= that.data.pageNum * 10) {
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
                    this.setData({
                        pageData: pageData
                    })
                    wx.hideLoading()
                    if (Number(res.data.code) == 0) {
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
    getPageData: function(e) {
        let that = this;
        getApp().request({
            url: 'org/personal_group_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: res => {
                wx.stopPullDownRefresh()
                if (res.data.data.list.length <= 0) {
                    that.setData({
                        isData: false
                    })
                } else {
                    that.setData({
                        isData: true
                    })
                    // 改变图片大小
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].coverImage = utils.rect(res.data.data.list[i].cover.url, 200, 100);
                        res.data.data.list[i].start_time = utils.seconds(new Date(res.data.data.list[i].start_time * 1000))
                        res.data.data.list[i].end_time = utils.seconds(new Date(res.data.data.list[i].end_time * 1000))
                    }
                }
                // 更多数据
                if(res.data.data.list.length >= 10){
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
                this.setData({
                    pageData: res.data.data.list
                })
                if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})