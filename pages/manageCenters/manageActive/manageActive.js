// pages/manageCenters/manageActive/manageActive.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        btnText:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let pageType = wx.getStorageSync('pageType')
        if (pageType == 1){
            this.setData({
                btnText:'发布新拼团'
            })
        } else if (pageType == 4){
            this.setData({
                btnText: '发布新砍价'
            })
        }
        getApp().request({
            url: options.url,
            data: {
                page:'1'
            },
            method: 'post',
            success: res => {
                console.log(res.data.dat)
                this.setData({
                    pageData: res.data.data
                })
            }
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    toback:function(){
        wx.navigateBack({
            
        })
    },
    toPersonList:function(e){
        wx.navigateTo({
            url: '../../killPrices/killPriceList/killPriceList?id=' + e.currentTarget.dataset.id,
        })
    },
    tomanageEdit:function(e){
        let pageType = wx.getStorageSync('pageType')
        if (pageType==4){
            wx.navigateTo({
                url: '../manageEdit/manageEdit?id=' + e.currentTarget.dataset.id,
            })
        } else if (pageType == 1){
            wx.navigateTo({
                url: '../collageEdit/collageEdit?id=' + e.currentTarget.dataset.id,
            })
        }
    },
    toChooseModel:function(){
        wx.navigateTo({
            url: '../chooseModel/chooseModel',
        })
    },
    delActive:function(e){
        console.log(e.currentTarget.dataset)
        let pageType = wx.getStorageSync('pageType')
        if (pageType==4){
            getApp().request({
                url: 'org/delete_act',
                data: {
                    act_id: e.currentTarget.dataset.actid,
                    act_tag: e.currentTarget.dataset.acttag,
                },
                method: 'post',
                success: function (res) {
                    wx.navigateTo({
                        url: '../manageActive/manageActive?url=org/bargain_list',
                    })
                }
            })
        } else if (pageType == 1){
            getApp().request({
                url: 'org/delete_act',
                data: {
                    act_id: e.currentTarget.dataset.actid,
                    act_tag: e.currentTarget.dataset.acttag,
                },
                method: 'post',
                success: function (res) {
                    wx.navigateTo({
                        url: '../manageActive/manageActive?url=org/personal_group_list',
                    })
                }
            })
        }
    },
    toKillPirce:function(e){
        wx.setStorageSync('actTag', e.currentTarget.dataset.acttag)
        let pageType = wx.getStorageSync('pageType')
        //砍价活动
        if (pageType==4){
            wx.navigateTo({
                url: '../../killPrices/killPriceInfo/killPriceInfo?id=' + e.currentTarget.dataset.id,
            })
        //私人拼团
        } else if (pageType==1){
            wx.navigateTo({
                url: '../../collage/collageInfo/collageInfo?actId=' + e.currentTarget.dataset.id,
            })
        }
        
    }
})