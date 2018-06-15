// pages/actReg/actRegManList/actRegManList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url:'org/normal_list',
            data:{
                page:'1'
            },
            method:'post',
            success:function(res){
                that.setData({
                    pageData:res.data.data
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
    toLessonInfo:function(e){
        wx.navigateTo({
            url: '../actRegListInfo/actRegListInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    toLessonEdit:function(e){
        wx.navigateTo({
            url: '../../manageCenters/actRegEdit/actRegEdit?actId=' + e.currentTarget.dataset.id,
        })
    },
    delActive:function(e){
        getApp().request({
            url:'org/delete_act',
            data:{
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.acttag
            },
            method:'post',
            success:function(res){
                if(Number(res.data.code)==1){
                    wx.navigateTo({
                        url: '../../actReg/actRegManList/actRegManList',
                    })
                }
            }
        })
    }
})