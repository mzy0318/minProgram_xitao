// pages/collage/collageInfo/collageInfo.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isDivShow:true,
        pageData:'',
        collageData:'',
        actId:'',
        joinId:'',
        collagePrice:'',
        priceId:0,
        personNum:0,
        priceInfo:'',
        startTime:'',
        endTime:'',
        status:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.setData({
            actId: options.actId,
        })
        getApp().request({
            url:'personal_group_act',
            data:{
                act_id: options.actId,
                joiner_id:'',
            },
            method:'post',
            success:res=>{
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                })
                that.setData({
                    pageData:res.data.data,
                    collagePrice: res.data.data.act_set[0].price,
                    personNum: res.data.data.act_set[0].person,
                    priceInfo: '凑齐' + res.data.data.act_set[0].person + '人即可享受每人' + res.data.data.act_set[0].price + '元',
                    startTime: utils.formatDate(new Date(res.data.data.start_time)),
                    endTime: utils.formatDate(new Date(res.data.data.end_time)),
                    status: new Date().valueOf() >= res.data.data.end_time?'已结束':'进行中',
                    joinId:res.data.data.id
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
                    collageData:res.data.data.list
                })
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
            url:'personal_group_member',
            data:{
                joiner_id: e.currentTarget.dataset.joinid,
                act_id: this.data.actId
            },
            method:'post',
            success:function(res){
            }
        })
    },
    toCollageSign:function(e){
        let info = JSON.stringify(e.currentTarget.dataset.forminfo);
        if (Boolean(e.currentTarget.dataset.is)){
            wx.navigateTo({
                url: '../collageSignup/collageSignup?actId=' + e.currentTarget.dataset.actid + '&info=' + info,
            })
        }else{
            
        }
    },
    toPersonInfo:function(){
        wx.navigateTo({
            url: '../collagePersonInfo/collagePersonInfo?actId=' + this.data.actId + '&joinId=' + this.data.joinId,
        })
    },
    toIndex:function(){
        getApp().toIndex()
    },
    toBuild: function (e){
        wx.navigateTo({
            url: '../collageBuild/collageBuild?title=' + e.currentTarget.dataset.title + '&info=' + e.currentTarget.dataset.info,
        })
    },
    cellPhone:function(e){
        getApp().tellPhone(e)
    },
    switchTab:function(e){
        let index = e.currentTarget.dataset.index
        this.setData({
            priceId: index,
            collagePrice: this.data.pageData.act_set[index].price,
            personNum: this.data.pageData.act_set[index].person,
            priceInfo: '凑齐' + this.data.pageData.act_set[index].person + '人即可享受每人' + this.data.pageData.act_set[index].price + '元'
        })

    }
})