// pages/killPrices/killPricePerson/killPricePerson.js
const util = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        peopleData: '',
        backgroundImage: '',
        endTime: '',
        joinInfo: '',
        joinName:'',
        actId:'',
        joinId:'',
        rangPage:1,
        peopleDataList:'',
        isPay:true,
        isAlert:true,
        widthV:0,
        widthP:0,
        isClosed: 'none',
        nameInfo: '',
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pages = getCurrentPages()
        let url = pages[pages.length - 1].route
        let mzy = 'actid:' + options.actId + ':joinid:' + options.joinId;
        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            let sceneArr = scene.split(':');
            that.setData({
                actId: sceneArr[1],
                joinId: sceneArr[3],
            })
        }else{
            that.setData({
                actId: options.actId,
                joinId: options.joinId,
            })
        }
        this.setData({
            joinInfo: options,
            encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
        })
        //页面数据
        that.getPageData()
        // 排行榜数据
        that.getRangeDate()
        
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
            rangPage: 1
        });
        that.getPageData();
        that.getRangeDate();
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
        return {
            path: 'pages/index/index?pageId=21&actId=' + that.data.actId + '&joinId=' + that.data.joinId
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    // 支付页面
    toPayPage:function(e){
        let that = this;
        wx.navigateTo({
            url: '../../courses/orderInfo/orderInfo?joinId=' + that.data.joinId + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + that.data.actId,
        })
       
    },
    // 砍价成功后的弹窗
    alertBtn:function(e){
        let that = this;
        if (e.currentTarget.dataset.id == 0){
            that.setData({
                isAlert:true,
            })
        } else if (e.currentTarget.dataset.id == 1){
            wx.navigateTo({
                url: '../../courses/orderInfo/orderInfo?joinId=' + that.data.joinId + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + that.data.actId,
            })
            that.setData({
                isAlert: true,
            })
        }
    },
    // 查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    helpHer: function () {
        let that = this;
        getApp().request({
            url: 'bargain',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code)==1) {
                    wx.showToast({
                        title: '帮TA砍了' + res.data.data.reduce+'元',
                        icon: 'success'
                    })
                } else if(Number(res.data.code)==0){
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }

            }
        })
    },
    toBack: function (e) {
        wx.navigateBack({})
    },
    // 刷新
    getJoinerList:function(){
        let that = this;
        that.setData({
            rangPage:1
        })
        that.getRangeDate()
    },
    // 回主页
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    setUrl: function () {
        wx.setClipboardData({
            data: 'data',
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                    icon:'success',
                })
            }
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
    // 获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url: 'bargain_act',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            method: 'post',
            success: res => {
                let widthV = '',widthP = '';
                wx.stopPullDownRefresh()
                //能否可能支付

                if (res.data.data.could_pay != undefined){
                    if (res.data.data.could_pay){
                        that.setData({
                            isPay: false,
                            isAlert: false,
                        })
                    }else{
                        that.setData({
                            isPay: true,
                            isAlert: true,
                        })
                    }
                }
                // 进度条
                if (res.data.data.current_price == res.data.data.original_price){
                    widthV = '0%'
                    widthP = '0%'
                } else if ((res.data.data.original_price - res.data.data.current_price) == res.data.data.now_price){
                    widthV = '100%'
                    widthP = '72%'
                }else{
                    let value = (res.data.data.original_price - res.data.data.current_price) / (res.data.data.original_price - res.data.data.now_price) * 100;
                    if(value >= 100){
                        widthV = '100%'
                        widthP = '72%'
                    }else{
                        widthV = Math.floor(value) + '%'
                        widthP = Math.floor(Math.floor(value) * 0.72) + '%'
                    }
                }
                let nameInfo = []
                for (let i = 0; i < res.data.data.join_info.length; i++) {
                    nameInfo.push(res.data.data.join_info[i].text)
                }
                that.setData({
                    pageData: res.data.data,
                    endTime: util.formatTime(new Date(res.data.data.end_time * 1000)),
                    widthV: widthV,
                    widthP: widthP,
                    nameInfo: nameInfo,
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.title,
                })
            }
        });
    },
    // 更多排行数据
    moreData:function(e){
        let that = this;
        let peopleDataList = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            peopleDataList.push(...that.data.peopleDataList)
            that.setData({
                rangPage: that.data.rangPage + 1
            })
            getApp().request({
                url: 'bargain_range',
                data: {
                    act_id: that.data.actId,
                    joiner_id: that.data.joinId,
                    page: that.data.rangPage
                },
                method: 'post',
                success: res => {
                    if (Number(res.data.code) == 1) {
                        peopleDataList.push(...res.data.data.list)
                        if (peopleDataList.length >= that.data.rangPage * 10) {
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
                            peopleDataList: peopleDataList,
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            });
        }
    },
    // 获取排行数据
    getRangeDate:function(e){
        let that = this;
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
                page: that.data.rangPage
            },
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh();
                    if (res.data.data.list.length >= 10) {
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
                        peopleDataList: res.data.data.list,
                        peopleData: res.data.data,
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        });
    },
    isClose: function (e) {
        let that = this;
        that.setData({
            isClosed: e.currentTarget.dataset.display,
        })
    },
    // 参加活动
    joinActive: function (e) {
        let that = this;
        let sendData = e.detail.value;
        for (let i = 0; i < that.data.nameInfo.length; i++) {
            sendData['info[' + i + ']'] = sendData[i]
            delete sendData[i]
        }
        sendData['act_id'] = that.data.actId;
        getApp().request({
            url: 'join_bargain',
            data: sendData,
            method: 'post',
            success: res => {
                let pageInfo = JSON.stringify(res.data.data);
                let respons = res;
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: '正在报名',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {

                        wx.hideLoading();

                        wx.showToast({
                            title: '报名成功',
                            success: function () {
                                that.setData({
                                    isClosed: 'none',
                                })
                                that.getPageData();
                                // 获取砍价排行榜
                                that.getRangeData();
                                wx.navigateTo({
                                    url: '../killPricePerson/killPricePerson?actId=' + respons.data.data.act_id + '&joinId=' + respons.data.data.joiner_id,
                                })
                            }
                        });
                    }
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
})