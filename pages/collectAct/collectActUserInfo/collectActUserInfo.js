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
        sugarList:[
            {
                name:'rainbow',
                url:'../../../icon/01.png'
            },{
                name: 'strawberry',
                url: '../../../icon/02.png'
            },{
                name: 'mango',
                url: '../../../icon/03.png'
            },{
                name: 'watermelon',
                url: '../../../icon/04.png'
            },{
                name: 'blueberry',
                url: '../../../icon/05.png'
            },
        ]
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
        // 获取用户信息
        that.getUserInfo();
        // 帮助集糖果者
        that.getHelperData();
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
        return {
            path:'pages/index/index?pageId=19&userId=' + that.data.userId + '&actId=' + that.data.actId,
        }
    },
    // 倒计时
    countDownFun: function (endTime) {
        let that = this;
        let countDown = that.data.countDown;
        let timer;
        let countDownValue = '';
        if (endTime > new Date().valueOf()) {
            timer = setInterval(function () {
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
    // 帮助集糖果者
    getHelperData:function(){
        let that = this;
        getApp().request({
            url:'sugar/helpers',
            data: {
                joiner_id: that.data.userId,
                page:1,
            },
            method:'get',
            success:function(res){
                if(res.data.code == 1){
                    wx.stopPullDownRefresh()
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
                    that.setData({
                        helperData:res.data.data.list
                    })
                } else {
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
                    wx.stopPullDownRefresh()
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    that.countDownFun(res.data.data.end_time * 1000)
                    res.data.data.banner_image_url = formate.rect(res.data.data.banner_image_url, 375, 205);
                    res.data.data.joiner.avatar_url = formate.rect(res.data.data.joiner.avatar_url,65,65);
                    res.data.data.start_time = formate.formatDate(new Date(res.data.data.start_time * 1000));
                    res.data.data.end_time = formate.formatDate(new Date(res.data.data.end_time * 1000));
                    that.setData({
                        pageData:res.data.data
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
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
                    wx.stopPullDownRefresh()
                    that.setData({
                        rangeData: res.data.data.list
                    })
                }
            }
        })
    },
})