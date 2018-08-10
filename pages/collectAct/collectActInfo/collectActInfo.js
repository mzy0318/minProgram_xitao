let formate = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId: '',
        pageData: '',
        rangeData: '',
        rangePage: 1,
        isJoiner: true,
        nameInfo: [],
        countDown: {
            day: 0,
            hour: 0,
            minute: 0,
            socend: 0
        },
        timer: '',
        userId:'',
        btnText:'我要报名',
        isText:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;

        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
            })
        }else{
            that.setData({
                actId: options.actId,
            })
        }
        // 请求页面数据
        that.getPapeData();
        //获取活动排行榜
        that.getRange()
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
        let that = this;
        clearInterval(that.data.timer)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let that = this;
        clearInterval(that.data.timer)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        let that = this;
        that.setData({
            nameInfo: [],
        })
        clearInterval(that.data.timer)
        // 请求页面数据
        that.getPapeData();
        //获取活动排行榜
        that.getRange()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.rangeData)
        if (that.data.rangeData.length >= that.data.rangePage * 10) {
            that.setData({
                rangePage: that.data.rangePage + 1,
            })
            getApp().request({
                url: 'sugar/rank',
                data: {
                    act_id: that.data.actId,
                    page: that.data.rangePage,
                },
                method: 'get',
                success: function (res) {
                    if (res.data.code == 1) {
                        wx.stopPullDownRefresh()
                        pageDataArr.push(...res.data.data.list)
                        that.setData({
                            rangeData: pageDataArr,
                        })
                    }
                }
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 显示/关闭报名页面
    showJoiner: function(e) {
        let that = this;
        if (e.currentTarget.dataset.id == 1) {
            // 我要报名
            if(that.data.userId == 0){
                that.setData({
                    isJoiner: false
                })
            }else{
                wx.navigateTo({
                    url: '../collectActUserInfo/collectActUserInfo?userId=' + that.data.userId + '&actId=' + that.data.actId,
                })
            }
        } else if (e.currentTarget.dataset.id == 0) {
            // 关闭报名页面
            that.setData({
                isJoiner: true
            })
        }
    },
    // 倒计时
    countDownFun: function(endTime) {
        let that = this;
        let countDown = that.data.countDown;
        let timer;
        let countDownValue = '';
        if (endTime > new Date().valueOf()) {
            timer = setInterval(function() {
                countDownValue = new Date(endTime - new Date().valueOf());
                if (endTime - new Date().valueOf() <= 86400000) {
                    countDown.day = 0
                } else {
                    countDown.day = countDownValue.getDate()
                }
                if (endTime - new Date().valueOf() <= 3600000) {
                    countDown.hour = 0
                } else {
                    countDown.hour = countDownValue.getHours()
                }
                if (endTime - new Date().valueOf() <= 60000) {
                    countDown.minute = 0
                } else {
                    countDown.minute = countDownValue.getMinutes()
                }
                if (endTime - new Date().valueOf() <= 1000) {
                    countDown.socend = 0
                } else {
                    countDown.socend = countDownValue.getSeconds()
                }
                that.setData({
                    countDown: countDown,
                    timer: timer,
                })
            }, 1000)

        } else {
            that.setData({
                countDown: countDown,
                timer: timer,
            })
        }
    },
    // 参加报名活动
    joinAct: function(e) {
        let that = this;
        let sendData = e.detail.value;
        sendData['act_id'] = that.data.actId;
        getApp().request({
            url: 'sugar/join',
            data: sendData,
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.showLoading({
                        title: '正在报名',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000);

                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '报名成功',
                            icon: 'success',
                            success: function() {
                                // 请求页面数据
                                that.getPapeData();
                                wx.navigateTo({
                                    url: '../collectActUserInfo/collectActUserInfo?userId=' + res.data.data.joiner_id + '&actId=' + res.data.data.act_id,
                                })
                                that.setData({
                                    isJoiner: true
                                })

                            }
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
    // 到个人信息页面
    toUserInfo: function(e) {
        let that = this;
        wx.navigateTo({
            url: '../collectActUserInfo/collectActUserInfo?userId=' + e.currentTarget.dataset.userid + '&actId=' + that.data.actId,
        })
    },
    //获取活动排行榜
    getRange: function() {
        let that = this;
        getApp().request({
            url: 'sugar/rank',
            data: {
                act_id: that.data.actId,
                page: that.data.rangePage,
            },
            method: 'get',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.stopPullDownRefresh()
                    that.setData({
                        rangeData: res.data.data.list
                    })
                }
            }
        })
    },
    // 获取活动信息
    getPapeData: function(e) {
        let that = this;
        getApp().request({
            url: 'sugar',
            data: {
                id: that.data.actId,
                joiner_id:'',
            },
            method: 'get',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    wx.stopPullDownRefresh();
                    let nameInfo = that.data.nameInfo
                    that.countDownFun(res.data.data.end_time * 1000)
                    res.data.data.banner_image_url = formate.rect(res.data.data.banner_image_url, 375, 205);
                    res.data.data.start_time = formate.formatDate(new Date(res.data.data.start_time * 1000));
                    res.data.data.end_time = formate.formatDate(new Date(res.data.data.end_time * 1000));
                    if (res.data.data.join_info.length > 0) {
                        for (let i = 0; i < res.data.data.join_info.length; i++) {
                            nameInfo.push({
                                name: res.data.data.join_info[i].text,
                                nameId: res.data.data.join_info[i].require
                            })
                        }
                    }
                    that.setData({
                        pageData: res.data.data,
                        nameInfo: nameInfo,
                        userId: res.data.data.self_joiner_id,
                    })
                    if (res.data.data.self_joiner_id != 0){
                        that.setData({
                            btnText:'我的主页',
                            isText:true,
                        })
                    } else if (res.data.data.self_joiner_id == 0){
                        that.setData({
                            btnText: '我要报名',
                            isText:false
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})