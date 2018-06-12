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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            joinInfo: options,
            joinName: options.nickName
        })
        getApp().request({
            url: 'bargain_act',
            data: {
                act_id: JSON.parse(options.personInfo).actid,
                joiner_id: JSON.parse(options.personInfo).joinerid,
            },
            method: 'post',
            success: res => {
                let innerAudioContext = wx.createInnerAudioContext();
                innerAudioContext.autoplay = true;
                innerAudioContext.src = res.data.data.music;
                innerAudioContext.onPlay(() => {
                    console.log('开始播放')
                })
                innerAudioContext.onError((res) => {
                    console.log(res.errMsg)
                    console.log(res.errCode)
                })
                this.setData({
                    pageData: res.data.data,
                    backgroundImage: res.data.data.act_image[0].url,
                    endTime: util.formatTime(new Date(res.data.data.end_time)),
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.title,
                })
            }
        });
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: JSON.parse(options.personInfo).actid,
                joiner_id: JSON.parse(options.personInfo).joinerid,
                page: 1
            },
            method: 'post',
            success: res => {
                this.setData({
                    peopleData: res.data.data
                })
            }
        });
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
        return {
            title: this.data.peopleData.title,
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    helpHer: function () {
        getApp().request({
            url: 'bargain',
            data: {
                act_id: JSON.parse(this.data.joinInfo.personInfo).actid,
                joiner_id: JSON.parse(this.data.joinInfo.personInfo).joinerid,
            },
            method: 'post',
            success: function (res) {
                if (res.data.data != null) {
                    wx.showToast({
                        title: '这次帮TA砍了' + res.data.data.reduce,
                        icon: 'success'
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }

            }
        })
    },
    toBack: function (e) {
        wx.navigateTo({
            url: '../killPriceInfo/killPriceInfo?id=' + e.currentTarget.dataset.id,
        })
    },
    getJoinerList:function(){
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: JSON.parse(this.data.joinInfo.personInfo).actid,
                joiner_id: JSON.parse(this.data.joinInfo.personInfo).joinerid,
                page: 1
            },
            method: 'post',
            success: res => {
                console.log(res)
                this.setData({
                    peopleData: res.data.data
                })
            }
        })
    },
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
    }
})