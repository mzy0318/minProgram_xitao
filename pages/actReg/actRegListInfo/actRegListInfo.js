// pages/actReg/actRegListInfo/actRegListInfo.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        status: '',
        btnText:'',
        btnClass:'',
        statusClass:'',
        actId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        if (options.scene != undefined) {

            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
            })
        } else if (options.scene == undefined) {
            that.setData({
                actId: options.actId,
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
        let that = this
        getApp().request({
            url: 'normal_act',
            method: 'post',
            data: {
                id: that.data.actId,
            },
            success: function (res) {
                if (Date.parse(res.data.data.end_time) > new Date().valueOf()) {
                    that.setData({
                        btnText: '我要报名',
                        btnClass: 'startBtn',
                        statusClass: 'startClass'
                    })
                } else if (Date.parse(res.data.data.end_time) < new Date().valueOf()) {
                    that.setData({
                        btnText: '已结束',
                        btnClass: 'stopbtn',
                        statusClass: 'stopClass'
                    })
                } else if (Date.parse(res.data.data.start_time) > new Date().valueOf()) {
                    that.setData({
                        btnText: '未开始',
                        btnClass: 'stopbtn',
                        statusClass: 'waitClass'
                    })
                }
                for (let i = 0; i < res.data.data.act_image.length; i++) {
                    res.data.data.act_image[i].url = utils.rect(res.data.data.act_image[i].url, 355, 200)
                }
                res.data.data.cover_image.url = utils.rect(res.data.data.cover_image.url,375,175)
                that.setData({
                    pageData: res.data.data,
                    status: res.data.data.time_status
                })
            }
        })
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
        getApp().request({
            url: 'normal_act',
            method: 'post',
            data: {
                id: that.data.actId,
            },
            success: function (res) {
                if (Date.parse(res.data.data.end_time) > new Date().valueOf()) {
                    that.setData({
                        btnText: '我要报名',
                        btnClass: 'startBtn',
                        statusClass: 'startClass'
                    })
                } else if (Date.parse(res.data.data.end_time) < new Date().valueOf()) {
                    that.setData({
                        btnText: '已结束',
                        btnClass: 'stopbtn',
                        statusClass: 'stopClass'
                    })
                } else if (Date.parse(res.data.data.start_time) > new Date().valueOf()) {
                    that.setData({
                        btnText: '未开始',
                        btnClass: 'stopbtn',
                        statusClass: 'waitClass'
                    })
                }
                for (let i = 0; i < res.data.data.act_image.length;i++){
                    res.data.data.act_image[i].url = utils.rect(res.data.data.act_image[i].url, 355, 200)
                }
                res.data.data.cover_image.url = utils.rect(res.data.data.cover_image.url, 375, 175)
                that.setData({
                    pageData: res.data.data,
                    status: res.data.data.time_status
                })
                wx.stopPullDownRefresh()
            }
        })
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
        if(res.from == 'menu'){
            return {
                path: 'pages/index/index?pageId=10&actId=' + that.data.actId
            }
        }
    },
    makePhone: function(e) {
        getApp().tellPhone(e)
    },
    toIndexPage: function() {
        getApp().toIndex()
    },
    toSignPage: function(e) {
        let that = this;
        let info = JSON.stringify(e.currentTarget.dataset.info)
        if (Date.parse(that.data.pageData.end_time) < new Date().valueOf()) {
            
        } else if (Date.parse(that.data.pageData.end_time) > new Date().valueOf()) {
            wx.navigateTo({
                url: '../actRegSignUp/actRegSignUp?actId=' + e.currentTarget.dataset.id + '&info=' + info,
            })
        } else if (Date.parse(that.data.pageData.end_time) > new Date().valueOf()){

        }
    }
})