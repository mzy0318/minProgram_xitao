let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId:'',
        pageNum:1,
        isPersonInfo:true,
        userList:'',
        oriData:'',
        isMore:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId: options.id
        })
        wx.setNavigationBarTitle({
            title: '私人拼团报名列表',
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
    toPricePerson:function(e){
        let that = this;
        wx.navigateTo({
            url: '../../collage/collagePersonInfo/collagePersonInfo?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinerid,
        })
    },
    // 用户信息页面
    toPriceListInfo:function(e){
        let that = this;
        let userData = this.data.userList;
        for (let i = 0; i < userData.length; i++) {
            if (this.data.oriData[i].can_join) {
                this.data.oriData[i].can_join = '正在进行'
            } else {
                this.data.oriData[i].can_join = '已经结束'
            }

        }
        this.setData({
            isPersonInfo: false,
            personInfo: this.data.oriData[e.currentTarget.dataset.index]
        })
    },
    hiddenInfo: function () {
        let that = this;
        that.setData({
            isPersonInfo: true,
        })
    },
    // 获取更多页面数据
    moreData:function(){
        let that = this;
        let userList = [];
        wx.showLoading({
            title: '正在加载...',
        })
        userList.push(...that.data.userList)
        that.setData({
            pageNum: that.data.pageNum + 1
        })
        getApp().request({
            url: "personal_group_range",
            method: "post",
            data: {
                act_id: that.data.actId,
                page: that.data.pageNum,
            },
            success: res => {
                let userData = res.data.data.list;
                if (userData.length <= 0) {
                    that.setData({
                        showTitle: false
                    })
                } else if (userData.length > 0) {
                    that.setData({
                        showTitle: true
                    })
                    for (let i = 0; i < userData.length; i++) {
                        if (userData[i].is_leader == 1) {
                            userData[i].is_leader = '【团长】'
                        } else if (userData[i].is_leader == 0) {
                            userData[i].is_leader = '【团员】'
                        }
                        userData[i].create_time = utils.formatTime(new Date(userData[i].create_time * 1000))
                    }
                    userList.push(...userData);
                    if (userList.length >= that.data.pageNum*10) {
                        that.setData({
                            isMore: false
                        })
                    } else {
                        that.setData({
                            isMore: true
                        })
                    }
                    that.setData({
                        userList: userList,
                        oriData: res.data.data.list
                    })
                    wx.hideLoading()
                }
                if(res.data.code == 0){
                    wx.hideLoading()
                    wx.showLoading({
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
            url: "personal_group_range",
            method: "post",
            data: {
                act_id: that.data.actId,
                page: that.data.pageNum,
            },
            success: res => {
                let userData = res.data.data.list;
                if (userData.length <= 0) {
                    that.setData({
                        showTitle: false
                    })
                } else if (userData.length > 0) {
                    that.setData({
                        showTitle: true
                    })
                    for (let i = 0; i < userData.length; i++) {
                        if (userData[i].is_leader == 1) {
                            userData[i].is_leader = '【团长】'
                        } else if (userData[i].is_leader == 0) {
                            userData[i].is_leader = '【团员】'
                        }
                        userData[i].create_time = utils.formatTime(new Date(userData[i].create_time * 1000))
                    }
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
                        userList: userData,
                        oriData:res.data.data.list
                    })
                }
            }
        })
    },
})