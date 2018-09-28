let formate = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
        actId:'',
        isNoData:true,
        isPersonInfo:true,
        personInfo:'',
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId:options.actId,
        })
        // 请求活动参与者列表
        that.getJoinerList();
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
            pageNum:1,
        })
        // 请求活动参与者列表
        that.getJoinerList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },
    // 电话
    tellPhone:function(e){
        let that = this;
        getApp().tellPhone(e)
    },
    // 查看用户详细信息
    hiddenInfo:function(e){
        let that = this;
        if (e.currentTarget.dataset.id == 1){
            that.setData({
                isPersonInfo:true,
            })
        } else if (e.currentTarget.dataset.id == 0){
            that.setData({
                personInfo: that.data.pageData[e.currentTarget.dataset.index],
                isPersonInfo: false,
            })
        }
    },
    // 活动详情页面
    toActInfo:function(e){
        let that = this;
        wx.navigateTo({
            url: '../collectActUserInfo/collectActUserInfo?actId=' + that.data.actId + '&userId=' + e.currentTarget.dataset.userid,
        })
    },
    // 请求更多数据
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
                url: 'org/sugar/joiners',
                data: {
                    act_id: that.data.actId,
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
                        if (res.data.data.list.length > 0) {
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = formate.formatDate(new Date(res.data.data.list[i].create_time * 1000))
                            }
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
                    } else {
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    // 请求活动报名列表
    getJoinerList:function(e){
        let that = this;
        getApp().request({
            url:'org/sugar/joiners',
            data:{
                act_id:that.data.actId,
                page:that.data.pageNum,
            },
            method:'get',
            success:function(res){
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if(res.data.code == 1){
                    if(res.data.data.list.length>0){
                        for(let i = 0;i<res.data.data.list.length;i++){
                            res.data.data.list[i].create_time = formate.formatDate(new Date(res.data.data.list[i].create_time*1000))
                        }
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
                        pageData:res.data.data.list,
                    })
                    wx.stopPullDownRefresh();
                }else{
                    wx.stopPullDownRefresh();
                }
            }
        })
    }
})