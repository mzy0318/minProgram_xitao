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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options',options)
        let that = this
        let pages = getCurrentPages()
        let url = pages[pages.length - 1].route
        let mzy = 'actid=' + options.actId + '&joinid=' + options.joinId;
        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            console.log('获取到的scene', scene)
            that.setData({
                actId: options.query.actid,
                joinId: options.query.joinid,
            })
        } else if (options.scene == undefined){
            that.setData({
                actId: options.actId,
                joinId: options.joinId,
            })
        }
        that.setData({
            encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
        })
        

        getApp().request({
            url:'personal_group_act',
            data:{
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            method:'post',
            success:function(res){
                if (Number(res.data.code) == 1){
                    wx.setNavigationBarTitle({
                        title: res.data.data.app_name,
                    })
                    res.data.data.start_time = getTime.formatDate(new Date(res.data.data.start_time * 1000))
                    res.data.data.end_time = getTime.formatDate(new Date(res.data.data.end_time * 1000))
                    that.setData({
                        pageData: res.data.data
                    })
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
        getApp().request({
            url: 'personal_group_member',
            data: {
                act_id: options.actId,
                joiner_id: options.joinId,
            },
            method: 'post',
            success: function (res) {
                if(Number(res.data.code)==1){
                    for(let i = 0;i<res.data.data.list.length;i++){
                        res.data.data.list[i].create_time = getTime.formatTime(new Date(res.data.data.list[i].create_time*1000))
                    }
                    that.setData({
                        personInfo:res.data.data.list
                    })
                    if (res.data.data.list.length>0){
                        that.setData({
                            isData: true
                        })
                    }else{
                        that.setData({
                            isData: false
                        })
                    }
                }else{
                    that.setData({
                        isData:true
                    })
                }
                
            }
        })
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
    }
})