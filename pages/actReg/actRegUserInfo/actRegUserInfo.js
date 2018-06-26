let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:true,
        pageData:'',
        userInfo:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url:'org/normal_joiner_list',
            data:{
                act_id: options.actId,
                act_tag: options.actTag,
                page:1,
            },
            method:'post',
            success:function(res){
                for(let i = 0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time))
                }
                that.setData({
                    pageData:res.data.data.list,
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

    },
    makePhone:function(e){
        getApp().tellPhone(e)
    },
    isShowInfo:function(e){
        let that = this
        if (Number(e.currentTarget.dataset.num)==-1){
            that.setData({
                isShow:true
            })
        } else if (Number(e.currentTarget.dataset.num) == 0){
            that.setData({
                isShow: false,
                userInfo: e.currentTarget.dataset.userdata,
            })
            console.log(that.data.userInfo)
        }
    }
})