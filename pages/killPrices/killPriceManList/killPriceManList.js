let utils = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum:1,
        pageData:'',
        isMore:true,
        btnText: 0
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
        that.setData({
            pageNum:1
        })
        that.getData()
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
        that.getData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },
    // 报名列表
    toPersonList:function(e){
        let that = this;
        wx.setStorageSync('pageTypeStu', 6);
        wx.navigateTo({
            url: '../killUserInfo/killUserInfo?id=' + e.currentTarget.dataset.id,
        })
    },
    // 共享页面
    toSharePage:function(e){
        let that = this;
        wx.navigateTo({
            url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/killPrices/killPriceInfo/killPriceInfo&actTag=' + e.currentTarget.dataset.acttag,
        })
    },
    // 砍价详情页
    toKillPirce:function(e){
        let that = this;
        wx.setStorageSync('actTag', e.currentTarget.dataset.acttag)
        wx.navigateTo({
            url: '../killPriceInfo/killPriceInfo?id=' + e.currentTarget.dataset.id + '&actTag=' + e.currentTarget.dataset.acttag,
        })
    },
    // 编辑活动
    tomanageEdit:function(e){
        let that = this;
        wx.navigateTo({
            url: '../../manageCenters/manageEdit/manageEdit?id=' + e.currentTarget.dataset.id +'&isEdit=1',
        })
    },
    // 删除活动
    delActive:function(e){
        let that = this;
        getApp().request({
            url: 'org/delete_act',
            data: {
                act_id: e.currentTarget.dataset.actid,
                act_tag: e.currentTarget.dataset.acttag,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        success: function () {
                            that.getData()
                        }
                    })
                } else if (res.data.code == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        title: 'none'
                    })
                }
            }
        })
    },
    // 新建活动
    toChooseModel: function () {
        wx.navigateTo({
            url: '../../manageCenters/chooseModel/chooseModel',
        })
    },
    // 返回
    toback: function () {
        wx.navigateBack({})
    },
    // 获取更多页面数据
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
                url: 'org/bargain_list',
                data: {
                    page: that.data.pageNum
                },
                method: 'post',
                success: function (res) {
                    if (res.data.code == 1) {
                        wx.stopPullDownRefresh();
                        //处理图片
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].coverImage = utils.rect(res.data.data.list[i].banner_image_url, 200, 100)
                        }
                        pageData.push(...res.data.data.list)
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
                    } else if (res.data.code == 0) {
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
    getData:function(e){
        let that = this;
        getApp().request({
            url:'org/bargain_list',
            data:{
                page:that.data.pageNum
            },
            method:'post',
            success:function(res){
                if(res.data.code == 1){
                    //处理图片
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].coverImage = utils.rect(res.data.data.list[i].banner_image_url, 200, 100)
                    }
                    if(res.data.data.list.length >= 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData:res.data.data.list
                    })
                    wx.stopPullDownRefresh();
                } else if (res.data.code == 0){
                    wx.stopPullDownRefresh();
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    }
})