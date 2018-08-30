let formate = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId:'',
        userId:'',
        pageData:'',
        helperData:'',
        helperPage:1,
        rangeData:'',
        rangePage:1,
        countDown: {
            day: 0,
            hour: 0,
            minute: 0,
            socend: 0
        },
        timer: '',
        heplerList:'',
        isMore:true,
        sugarList:[
            {
                name:'rainbow',
                url:'http://cdn.zhihuizhaosheng.com/app-static/sugar/01.png'
            },{
                name: 'strawberry',
                url: 'http://cdn.zhihuizhaosheng.com/app-static/sugar/02.png'
            },{
                name: 'mango',
                url: 'http://cdn.zhihuizhaosheng.com/app-static/sugar/03.png'
            },{
                name: 'watermelon',
                url: 'http://cdn.zhihuizhaosheng.com/app-static/sugar/04.png'
            },{
                name: 'blueberry',
                url: '.http://cdn.zhihuizhaosheng.com/app-static/sugar/05.png'
            },
        ],
        isExchange:true,
        value:'',
        isSugars:true,
        sugarNum:0,
        isShare:true,
        className: 'moreData',
        btnText: '更多',
        classNameR: 'moreData',
        btnTextR: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId: options.actId,
            userId: options.userId
        })
        if(options.isShare == 0){
            that.setData({
                isShare: false,
            })
        } else if (options.isShare == 1){
            that.setData({
                isShare: true,
            })
        }
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
        let helperData = [];
        that.setData({
            helperPage: 1,
            rangePage: 1,
        })
        // 获取用户信息
        that.getUserInfo();
        // 帮助集糖果者
        that.getHelperData();
        //获取活动排行榜
        that.getRange()
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
            rangePage:1,
            helperPage:1,
        })
        clearInterval(that.data.timer)
        // 获取用户信息
        that.getUserInfo();
        // 帮助集糖果者
        that.getHelperData();
        //获取活动排行榜
        that.getRange()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let that = this;
        return {
            path:'pages/index/index?pageId=19&userId=' + that.data.userId + '&actId=' + that.data.actId,
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    // 倒计时
    countDownFun: function (endTime) {
        let that = this;
        let countDown = that.data.countDown;
        let timer;
        let countDownValue = '';
        let index = '';
        if (endTime - new Date().valueOf() > 0) {

            timer = setInterval(function () {

                countDownValue = endTime - new Date().valueOf()
                //日
                countDown.day = Math.floor(countDownValue / (24 * 60 * 60 * 1000));
                //时
                countDown.hour = Math.floor(countDownValue / (1 * 60 * 60 * 1000)) - countDown.day * 24;
                //分
                countDown.minute = Math.floor(countDownValue / (60 * 1000)) - (countDown.day * 24 * 60) - (countDown.hour * 60);
                //秒
                countDown.socend = Math.floor(countDownValue / 1000) - (countDown.day * 24 * 60 * 60) - (countDown.hour * 60 * 60) - (countDown.minute * 60);
                if (countDown.day <= 0) countDown.day = 0;
                if (countDown.hour <= 0) countDown.hour = 0;
                if (countDown.minute <= 0) countDown.minute = 0;
                if (countDown.socend <= 0) countDown.socend = 0;

                if (countDownValue <= 0) {
                    clearInterval(timer)
                }

                that.setData({
                    countDown: countDown,
                })

            }, 1000)

            that.setData({
                timer: timer,
                countDown: countDown,
            })
        } else {
            that.setData({
                countDown: countDown,
                timer: timer,
            })
        }
    },
    // 显示兑换糖果页面
    showAlertDiv:function(e){
        let that = this;
        getApp().request({
            url: 'sugar/exchange',
            data: {
                act_id: that.data.actId,
                amount: e.currentTarget.dataset.num,
            },
            method: 'post',
            success: function (res) {
                if (res.data.code == 1) {
                    wx.showToast({
                        title: res.data.data,
                        icon: 'success',
                    })
                } else if (res.data.code == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 兑换奖励
    exchangeReward:function(e){
        let that = this;
    },
    closeSugars:function(e){
        let that = this;
        that.setData({
            isSugars:true,
        })
    },
    //更多帮助集糖果者
    moreDataR:function(e){
        let that = this;
        let helperData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            helperData.push(...that.data.helperData);
            that.setData({
                helperPage: that.data.helperPage + 1
            })
            getApp().request({
                url: 'sugar/helpers',
                data: {
                    joiner_id: that.data.userId,
                    page: that.data.helperPage,
                },
                method: 'get',
                success: function (res) {
                    if (res.data.code == 1) {
                        wx.stopPullDownRefresh()
                        if (res.data.data.list.length > 0) {
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = formate.yearMonth(new Date(res.data.data.list[i].create_time * 1000));
                                for (let j = 0; j < res.data.data.list[i].sugar.length; j++) {
                                    for (let n = 0; n < that.data.sugarList.length; n++) {
                                        if (res.data.data.list[i].sugar[j] == that.data.sugarList[n].name) {
                                            res.data.data.list[i].sugar[j] = that.data.sugarList[n].url
                                        }
                                    }
                                }
                            }
                        }
                        helperData.push(...res.data.data.list)
                        if (helperData.length >= that.data.helperPage * 10) {
                            that.setData({
                                classNameR: 'moreDataR',
                                btnTextR: '更多'
                            })
                        } else {
                            that.setData({
                                classNameR: 'moreDataRed',
                                btnTextR: '没有了'
                            })
                        }
                        that.setData({
                            helperData: helperData
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
    // 帮助集糖果者
    getHelperData:function(){
        let that = this;
        getApp().request({
            url:'sugar/helpers',
            data: {
                joiner_id: that.data.userId,
                page:that.data.helperPage,
            },
            method:'get',
            success:function(res){
                if(res.data.code == 1){
                    if(res.data.data.list.length>0){
                        for (let i = 0; i < res.data.data.list.length;i++){
                            res.data.data.list[i].create_time = formate.yearMonth(new Date(res.data.data.list[i].create_time*1000));
                            for (let j = 0; j < res.data.data.list[i].sugar.length;j++){
                                for (let n = 0; n < that.data.sugarList.length;n++){
                                    if (res.data.data.list[i].sugar[j] == that.data.sugarList[n].name){
                                        res.data.data.list[i].sugar[j] = that.data.sugarList[n].url
                                    }
                                }
                            }
                        }
                    }
                    if (res.data.data.list.length >= 10){
                        that.setData({
                            classNameR: 'moreDataR',
                            btnTextR: '更多'
                        })
                    }else{
                        that.setData({
                            classNameR: 'moreDataRed',
                            btnTextR: '没有了'
                        })
                    }
                    that.setData({
                        helperData:res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                } else {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 获取用户页面信息
    getUserInfo:function(e){
        let that = this;
        getApp().request({
            url:'sugar',
            data:{
                id:that.data.actId,
                joiner_id:that.data.userId,
            },
            method:'get',
            success:function(res){
                if(res.data.code == 1){
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    that.countDownFun(res.data.data.end_time * 1000)
                    res.data.data.banner_image_url = formate.rect(res.data.data.banner_image_url, 375, 205);
                    res.data.data.joiner.avatar_url = formate.rect(res.data.data.joiner.avatar_url,65,65);
                    res.data.data.start_time = formate.formatDate(new Date(res.data.data.start_time * 1000));
                    res.data.data.end_time = formate.formatDate(new Date(res.data.data.end_time * 1000));
                    // 收集糖果数据
                    if (res.data.data.sugar_array == undefined){
                        that.setData({
                            isSugars: true,
                        })
                    }else{
                        for (let i = 0; i < res.data.data.sugar_array.length;i++){

                            for (let j = 0; j < that.data.sugarList.length;j++){

                                if (res.data.data.sugar_array[i] == that.data.sugarList[j].name){
                                    res.data.data.sugar_array[i] = that.data.sugarList[j].url;
                                }
                            }
                        }
                        that.setData({
                            isSugars: false,
                            sugarNum: res.data.data.sugar_array.length,
                        })
                    }
                    that.setData({
                        pageData:res.data.data,
                    })
                    wx.stopPullDownRefresh()
                }else{
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    },
    // 获取更多数据
    moreData:function(e){
        let that = this;
        let rangeData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            rangeData.push(...that.data.rangeData)
            that.setData({
                rangePage: that.data.rangePage + 1
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
                        rangeData.push(...res.data.data.list)
                        if (rangeData.length >= that.data.rangePage*10) {
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
                            rangeData: rangeData
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    //获取活动排行榜
    getRange: function () {
        let that = this;
        getApp().request({
            url: 'sugar/rank',
            data: {
                act_id: that.data.actId,
                page: that.data.rangePage,
            },
            method: 'get',
            success: function (res) {
                if (res.data.code == 1) {
                    if (res.data.data.list.length >= 10){
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
                        rangeData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                }else{
                    wx.stopPullDownRefresh()
                }
            }
        })
    },
})