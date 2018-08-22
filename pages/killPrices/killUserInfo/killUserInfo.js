// pages/killPrices/killUserInfo/killUserInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showTitle:true,
        pageNum:1,
        actId:'',
        pageData:'',
        actReg:true,
        personInfo:'',
        isMore:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId: options.id,
        })
        wx.setNavigationBarTitle({
            title: '砍价报名列表',
        })
        that.getPageData();
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
    onReachBottom: function() {
       
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
    userInfo:function(e){
        let that = this;
        wx.navigateTo({
            url: '../killPricePerson/killPricePerson?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinid,
        })
    },
    hiddenInfo:function(){
        let that = this;
        that.setData({
            actReg: true,
        })
    },
    toPriceListInfo:function(e){
        let that = this;
        let index = Number(e.currentTarget.dataset.index)
        that.setData({
            personInfo: that.data.pageData[index],
            actReg: false,
        })
    },
    //获取页面更多数据
    moreData:function(){
        let that = this;
        let pageData = [];
        wx.showLoading({
            title: '正在加载...',
        })
        pageData.push(...that.data.pageData);
        getApp().request({
            url: "org/bargain_joiner_list",
            method: "post",
            data: {
                id: that.data.actId,
                page: that.data.pageNum,
            },
            success: function(res) {
                if (res.data.data.list.length <= 0) {

                    that.setData({
                        showTitle: false
                    })
                } else if (res.data.data.list.length > 0) {
                    that.setData({
                        showTitle: true
                    })
                    pageData.push(...res.data.data.list)
                    if (pageData.length >= that.data.pageNum*10) {
                        that.setData({
                            isMore: false
                        })
                    } else {
                        that.setData({
                            isMore: true
                        })
                    }
                    that.setData({
                        pageData: pageData
                    })
                    wx.hideLoading()
                }
                if(res.data.code == 0){
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: "org/bargain_joiner_list",
            method: "post",
            data: {
                id: that.data.actId,
                page: that.data.pageNum,
            },
            success: res => {
                if (res.data.data.list.length <= 0) {

                    that.setData({
                        showTitle: false
                    })
                } else if (res.data.data.list.length > 0) {
                    that.setData({
                        showTitle: true
                    })
                    if(res.data.data.list.length >= 10){
                        that.setData({
                            isMore:false
                        })
                    }else{
                        that.setData({
                            isMore: true
                        })
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                }
                wx.stopPullDownRefresh()
            }
        })
    },
})