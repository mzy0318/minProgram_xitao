// pages/killPrices/killPersonList/killPersonList.js
let util = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList:'',
        isPersonInfo:true,
        personInfo:'',
        showTitle: true,
        killPage:1,
        collagePage:1,
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (pageTypeStu == 6){
            getApp().request({
                url: "my_bargain_list",
                method: "post",
                data: {
                    page: that.data.killPage
                },
                success: res => {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if (res.data.code == 0) {
                        wx.stopPullDownRefresh()
                    }else{
                        let data = res.data.data;
                        wx.setNavigationBarTitle({
                            title: '砍价报名列表',
                        })

                        if (data.list.length > 0) {
                            for (let i = 0; i < data.list.length; i++) {
                                data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time * 1000))
                            }
                        }
                        if (data.list.length >= 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            userList: data.list
                        })
                    }
                }
            })
        }else if(pageTypeStu == 3) {
            getApp().request({
                url: "my_personal_group_list",
                method: "post",
                data: {
                    page:that.data.collagePage,
                },
                success: res => {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if (res.data.code == 0) {
                        wx.stopPullDownRefresh()
                    }else{
                        let data = res.data.data;
                        wx.setNavigationBarTitle({
                            title: '我的私人拼团',
                        })

                        if (data.list.length > 0) {
                            for (let i = 0; i < data.list.length; i++) {
                                data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time * 1000))
                            }
                        }
                        if (data.list.length >= 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            userList: data.list
                        })
                    }
                }
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
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (pageTypeStu == 6) {
            that.setData({
                killPage:1
            })
            getApp().request({
                url: "my_bargain_list",
                method: "post",
                data: {
                    page: that.data.killPage,
                },
                success: res => {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if (res.data.code == 0) {
                        wx.stopPullDownRefresh()
                    }else{
                        let data = res.data.data;
                        wx.setNavigationBarTitle({
                            title: '砍价报名列表',
                        })
                        if (data.list.length > 0) {
                            for (let i = 0; i < data.list.length; i++) {
                                data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time * 1000))
                            }
                        }
                        if (data.list.length >= 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            userList: data.list
                        })
                        wx.stopPullDownRefresh()
                    }
                }
            })
        } else if (pageTypeStu == 3) {
            that.setData({
                collagePage:1
            })
            getApp().request({
                url: "my_personal_group_list",
                method: "post",
                data: {
                    page: that.data.collagePage,
                },
                success: res => {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if(res.data.code == 0){
                        wx.stopPullDownRefresh()
                    }else{
                        let data = res.data.data;
                        wx.setNavigationBarTitle({
                            title: '我的私人拼团',
                        })
                        that.setData({
                            showTitle: true
                        })
                        if (data.list.length > 0) {
                            for (let i = 0; i < data.list.length; i++) {
                                data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time * 1000))
                            }
                        }
                        if (data.list.length >= 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        this.setData({
                            userList: data.list
                        })
                        wx.stopPullDownRefresh()
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
    toKillPriceInfo:function(e){
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (Number(pageTypeStu) == 6) {
            wx.navigateTo({
                url: '../killPricePerson/killPricePerson?joinId=' + e.currentTarget.dataset.joinid + '&actId=' + e.currentTarget.dataset.actid,
            })
        } else if (Number(pageTypeStu) == 3) {
            wx.navigateTo({
                url: '../../collage/collagePersonInfo/collagePersonInfo?joinId=' + e.currentTarget.dataset.joinid + '&actId=' + e.currentTarget.dataset.actid,
            })
        }
    },
    toListInfo:function(e){
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu')
        if (pageTypeStu == 6){
            wx.navigateTo({
                url: '../killPriceStuListInfo/killPriceStuListInfo?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinerid,
            })
        } else if (pageTypeStu == 3){
            //拼团
            let userInfo = that.data.userList[e.currentTarget.dataset.index];
            if (typeof userInfo.start_time == 'string'){

            } else if (typeof userInfo.start_time == 'number'){
                userInfo.start_time = util.formatTime(new Date(userInfo.start_time * 1000));
                userInfo.end_time = util.formatTime(new Date(userInfo.end_time * 1000));
            }
            userInfo.is_leader = userInfo.is_leader?'团长':'团员';
            that.setData({
                isPersonInfo:false,
                personInfo: userInfo
            })
        }
    },
    hiddenInfo:function(){
        this.setData({
            isPersonInfo: true,
        })
    },
    //获取更多数据
    moreData:function(e){
        let that = this;
        let pageTypeStu = wx.getStorageSync('pageTypeStu');
        let userList = [];
        if (pageTypeStu == 6){
            // 砍价
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                userList.push(...that.data.userList);
                that.setData({
                    killPage: that.data.killPage + 1
                })
                getApp().request({
                    url: "my_bargain_list",
                    method: "post",
                    data: {
                        page: that.data.killPage
                    },
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
                        let data = res.data.data;
                        wx.setNavigationBarTitle({
                            title: '砍价报名列表',
                        })
                        if(data.list.length > 0){
                            for (let i = 0; i < data.list.length; i++) {
                                data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time * 1000))
                            }
                        }
                        userList.push(...data.list)
                        if (userList.length >= that.data.killPage * 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            userList: userList
                        })
                        wx.hideLoading()
                        
                        if (res.data.code == 0) {
                            wx.hideLoading()
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            })
                        }
                    }
                })
            }
            
        } else if (pageTypeStu == 3){
            // 拼团
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                userList.push(...that.data.userList);
                that.setData({
                    collagePage: that.data.collagePage + 1
                })
                getApp().request({
                    url: "my_personal_group_list",
                    method: "post",
                    data: {
                        page: that.data.collagePage,
                    },
                    success: res => {
                        if (res.data.frozen == 1) {
                            that.setData({
                                isFrozen: 'frozen',
                            })
                        } else {
                            that.setData({
                                isFrozen: 'empty',
                            })
                        }
                        let data = res.data.data;
                        wx.setNavigationBarTitle({
                            title: '我的私人拼团',
                        })
                        that.setData({
                            showTitle: true
                        })
                        if (data.list.length > 0){
                            for (let i = 0; i < data.list.length; i++) {
                                data.list[i].create_time = util.formatTime(new Date(data.list[i].create_time * 1000))
                            }
                        }
                        userList.push(...data.list)
                        if (userList.length >= that.data.collagePage * 10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            userList: userList
                        })
                        wx.hideLoading()
                        
                        if(res.data.code == 0){
                            wx.hideLoading()
                        }
                    }
                })
            }
            
        }
    },
})