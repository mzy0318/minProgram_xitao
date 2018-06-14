// pages/collage/collageInfo/collageInfo.js
let utils = require('../../../utils/util.js');
const innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isDivShow: true,
        pageData: '',
        collageData: '',
        actId: '',
        actTag: '',
        joinId: '',
        collagePrice: '',
        priceId: 0,
        personNum: 0,
        priceInfo: '',
        startTime: '',
        endTime: '',
        status: '',
        bannerImage: '',
        backImage: '',
        bgMusic: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            actId: options.actId,
            actTag: options.acttag
        })
        getApp().request({
            url: 'personal_group_act',
            data: {
                act_id: options.actId,
                joiner_id: '',
            },
            method: 'post',
            success: res => {
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                })
                that.setData({
                    pageData: res.data.data,
                    collagePrice: res.data.data.act_set[0].price,
                    personNum: res.data.data.act_set[0].person,
                    priceInfo: '凑齐' + res.data.data.act_set[0].person + '人即可享受每人' + res.data.data.act_set[0].price + '元',
                    startTime: utils.formatDate(new Date(res.data.data.start_time)),
                    endTime: utils.formatDate(new Date(res.data.data.end_time)),
                    status: new Date().valueOf() >= res.data.data.end_time ? '已结束' : '进行中',
                    joinId: res.data.data.id,
                    bannerImage: res.data.data.banner_image_url,
                    backImage: res.data.data.bg_image_url,
                    bgMusic: res.data.data.music,
                });
                // 背景音乐
                innerAudioContext.autoplay = true
                innerAudioContext.src = that.data.bgMusic
                innerAudioContext.play();
                innerAudioContext.onPlay(() => {
                    console.log('开始播放')
                })
                innerAudioContext.onError((res) => {
                    console.log(res.errMsg)
                    console.log(res.errCode)
                })
            }
        })
        // 拼团列表
        getApp().request({
            url: 'personal_group_range',
            data: {
                act_id: options.actId,
                page: 1,
            },
            method: 'post',
            success: res => {
                that.setData({
                    collageData: res.data.data.list
                })
            }
        });
        // wx.request({
        //     url:'https://api.weixin.qq.com/wxa/get_qrcode?access_token=10_v7H1fJ4112ZsD3y9KZaw9mNpvk91L_RRm3_AP1poccNt935uQx6ddai8b9fF3BOjjLfLr9a0FyFvfBsslulOwcoF2eH0vVRHeouPxFCHOOaxx7pmlQuHBzFPPD4JjsN8hOXl2bOhv7Ls_gQ4PNMeAEAFDC&path=page%2Findex%3Faction%3D1',
        //     method:'GET',
        //     header:{
        //         'content-type':'json'
        //     },
        //     success:function(res){
        //         console.log(res)
        //     }
        // })
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
            title: '私人拼团'
        }
    },
    toSignUp: function () {
        wx.navigateTo({
            url: '../collageSignup/collageSignup',
        })
    },
    isDivBox: function (e) {
        this.setData({
            isDivShow: Boolean(Number(e.currentTarget.dataset.is)),
        })
        getApp().request({
            url: 'personal_group_member',
            data: {
                joiner_id: e.currentTarget.dataset.joinid,
                act_id: this.data.actId
            },
            method: 'post',
            success: function (res) {
            }
        })
    },
    toCollageSign: function (e) {
        let info = JSON.stringify(e.currentTarget.dataset.forminfo);
        if (Boolean(e.currentTarget.dataset.is)) {
            wx.navigateTo({
                url: '../collageSignup/collageSignup?actId=' + e.currentTarget.dataset.actid + '&info=' + info,
            })
        } else {

        }
    },
    toPersonInfo: function () {
        wx.navigateTo({
            url: '../collagePersonInfo/collagePersonInfo?actId=' + this.data.actId + '&joinId=' + this.data.joinId,
        })
    },
    toIndex: function () {
        getApp().toIndex()
    },
    toBuild: function (e) {
        wx.navigateTo({
            url: '../collageBuild/collageBuild?title=' + e.currentTarget.dataset.title + '&info=' + e.currentTarget.dataset.info,
        })
    },
    cellPhone: function (e) {
        getApp().tellPhone(e)
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
    getImage: function (e) {
        let that = this
        that.setData({
            bannerImage: e.detail.bannerImage,
            backImage: e.detail.bgImage,
        })
    },
    getMusic: function (e) {
        let that = this;
        innerAudioContext.src = e.detail.backgroundMusic
        innerAudioContext.play()
    },
    getBackgroundImage:function(e){
        let that = this;
        that.setData({
            backImage: e.detail.bgImage,
        })
    }
})