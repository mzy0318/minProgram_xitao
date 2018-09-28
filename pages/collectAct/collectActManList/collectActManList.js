let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        statusText:'活动进行中',
        statusColor:'green',
        pageNum:1,
        isMore:true,
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
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
        that.setData({
            pageNum:1
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
        that.setData({
            pageNum:1
        })
        that.getPageData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    // onReachBottom: function() {
    // },
    // 查看报名列表
    toJoinList:function(e){
        let that = this;
        wx.navigateTo({
            url: '../collectActJoinerList/collectActJoinerList?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 页面功能
    pageOpt: function(e) {
        let that = this;
        if (e.currentTarget.dataset.id == 0) {
            //返回
            wx.navigateBack({})
        } else if (e.currentTarget.dataset.id == 1) {
            //新建活动
            wx.navigateTo({
                url: '../../manageCenters/chooseModel/chooseModel',
            })
        }
    },
    // 活动详情页面
    toActInfo: function(e) {
        let that = this;
        wx.navigateTo({
            url: '../collectActInfo/collectActInfo?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 活动功能
    actOpts: function(e) {
        let that = this;
        if (e.currentTarget.dataset.id == 0) {
            // 删除
            getApp().request({
                url: 'org/sugar/delete',
                data: {
                    id: e.currentTarget.dataset.actid,
                },
                method: 'post',
                success: function(res) {
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
                        wx.showLoading({
                            title: '正在删除',
                            mask: true,
                        })
                        setTimeout(closeLogin, 2000);

                        function closeLogin() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                success: function() {
                                    that.getPageData()
                                }
                            })
                        }
                    }
                }
            })
        } else if (e.currentTarget.dataset.id == 1) {
            //编辑
            wx.navigateTo({
                url: '../collectActEdit/collectActEdit?isEdit=1&actId=' + e.currentTarget.dataset.actid,
            })
        } else if (e.currentTarget.dataset.id == 2) {
            //分享
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/collectAct/collectActInfo/collectActInfo&actTag=' + e.currentTarget.dataset.acttag,
            })
        }
    },
    // 更多页面数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData);
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'org/sugar/list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'get',
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
                        wx.stopPullDownRefresh()

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
                        pageData.push(...res.data.data.list);
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
                            pageData: pageData
                        })
                        wx.hideLoading()
                    } else {
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
            url: 'org/sugar/list',
            data: {
                page: that.data.pageNum,
            },
            method: 'get',
            success: function(res) {
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
                    wx.stopPullDownRefresh()

                    for (let i = 0; i < res.data.data.list.length; i++) {
                        if (res.data.data.list[i].end_time*1000 > new Date().valueOf()){
                            res.data.data.list[i].statusText = '活动进行中';
                            res.data.data.list[i].statusColor = 'green';
                        } else if (res.data.data.list[i].end_time * 1000 <= new Date().valueOf()){
                            res.data.data.list[i].statusText = '活动已结束';
                            res.data.data.list[i].statusColor = 'red';
                        }
                        res.data.data.list[i].start_time = format.formatTime(new Date(res.data.data.list[i].start_time*1000));
                        res.data.data.list[i].end_time = format.formatTime(new Date(res.data.data.list[i].end_time*1000));
                        res.data.data.list[i].banner_image_url = format.rect(res.data.data.list[i].banner_image_url,200,100)
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
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})