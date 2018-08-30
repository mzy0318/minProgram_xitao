// pages/collage/collagePersonInfo/collagePersonInfo.js
let getTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        personInfo:'',
        isData:true,
        actId:'',
        joinId:'',
        priceId: 0,
        isPay: true,
        isAlert: true,
        isMore:true,
        rangePage:1,
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        let pages = getCurrentPages()

        let url = pages[pages.length - 1].route

        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            let sceneArr = scene.split(':')
            that.setData({
                actId: sceneArr[1],
                joinId: sceneArr[3],
            })
        } else if (options.scene == undefined){
            that.setData({
                actId: options.actId,
                joinId: options.joinId,
            })
        }
        let mzy = 'actid:' + that.data.actId + ':joinid:' + that.data.joinId;
        that.setData({
            encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
        })
        //获取页面数据
        that.getPageData();
        // 获取我的团员
        that.getRangeData();
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
        let that = this
        that.setData({
            rangePage:1
        })
        //获取页面数据
        that.getPageData();
        // 获取我的团员
        that.getRangeData()
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
        let that = this;
        return {
            path: 'pages/index/index?pageId=3&actId=' + that.data.actId + '&joinId=' + that.data.joinId
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    // 去支付
    toPayPage: function (e) {
        let that = this;
        wx.navigateTo({
            url: '../../courses/orderInfo/orderInfo?joinId=' + e.currentTarget.dataset.joinid + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + e.currentTarget.dataset.actid,
        })
        innerAudioContext.stop()
    },
    // 砍价成功后的弹窗
    alertBtn: function (e) {
        let that = this;
        if (e.currentTarget.dataset.id == 0) {
            that.setData({
                isAlert: true,
            })
        } else if (e.currentTarget.dataset.id == 1) {
            wx.navigateTo({
                url: '../../courses/orderInfo/orderInfo?joinId=' + that.data.joinId + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + that.data.actId,
            })
            innerAudioContext.stop()
            that.setData({
                isAlert: true,
            })
        }
    },
    toCollageJoin: function (e) {
        let formInfo = JSON.stringify(e.currentTarget.dataset.forminfo)
        wx.navigateTo({
            url: '../collageSignup/collageSignup?actId=' + e.currentTarget.dataset.actid + '&info=' + formInfo,
        })
    },
    toIndex: function () {
        getApp().toIndex()
    },
    switchTab: function (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            priceId: index,
            collagePrice: this.data.pageData.act_set[index].price,
            personNum: this.data.pageData.act_set[index].person,
            priceInfo: '凑齐' + this.data.pageData.act_set[index].person + '人即可享受每人' + this.data.pageData.act_set[index].price + '元'
        })

    },
    shareFriends: function () {
        let that = this;
        wx.showLoading({
            title: '正在生成中...',
            mask: true,
        })
        setTimeout(function () {
            wx.hideLoading();

            wx.previewImage({
                urls: [that.data.encodeID],
            })
        }, 1500)
    },
    //获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url: 'personal_group_act',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
                    wx.setNavigationBarTitle({
                        title: res.data.data.app_name,
                    })
                    res.data.data.start_time = getTime.formatDate(new Date(res.data.data.start_time * 1000))
                    res.data.data.end_time = getTime.formatDate(new Date(res.data.data.end_time * 1000));
                    res.data.data.cover.url = getTime.rect(res.data.data.cover.url, 325, 155);
                    // 是否去支付
                    if (res.data.data.could_pay != undefined) {
                        if (res.data.data.could_pay) {
                            that.setData({
                                isPay: false,
                                isAlert: false,
                            })
                        } else {
                            that.setData({
                                isPay: true,
                                isAlert: true,
                            })
                        }
                    }
                    that.setData({
                        pageData: res.data.data
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
    //获取更多团队成员
    moreData:function(e){
        let that = this;
        let personInfo = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            personInfo.push(...that.data.personInfo)
            that.setData({
                rangePage: that.data.rangePage + 1
            })
            getApp().request({
                url: 'personal_group_member',
                data: {
                    act_id: that.data.actId,
                    joiner_id: that.data.joinId,
                    page: that.data.rangePage
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = getTime.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                        personInfo.push(...res.data.data.list)
                        // 更多数据
                        // 无记录
                        if (personInfo.length > 0) {
                            that.setData({
                                isData: true
                            })
                        } else {
                            that.setData({
                                isData: false
                            })
                        }
                        if (personInfo.length >= that.data.rangePage * 10) {
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

                        that.setData({
                            personInfo: personInfo
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                        that.setData({
                            isData: true
                        })
                    }

                }
            })
        }
        
        
    },
    //获取团队成员
    getRangeData:function(e){
        let that = this;
        getApp().request({
            url: 'personal_group_member',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
                page:that.data.rangePage
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].create_time = getTime.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                    }
                    if (res.data.data.list.length > 0) {
                        that.setData({
                            isData: true
                        })
                    } else {
                        that.setData({
                            isData: false
                        })
                    }
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
                    that.setData({
                        personInfo: res.data.data.list
                    })
                } else {
                    that.setData({
                        isData: true
                    })
                }

            }
        })
    },
})