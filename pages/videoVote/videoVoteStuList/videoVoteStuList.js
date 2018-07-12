let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        showTitle: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url:'my_video_vote_list',
            data:{},
            method:'post',
            success:function(res){
                if(Number(res.data.code)  == 1){
                    if(res.data.data.list <= 0){
                        that.setData({
                            showTitle: false,
                        })
                    }else{
                        that.setData({
                            showTitle: true,
                        })
                    }
                    for(let i = 0;i<res.data.data.list.length;i++){
                        res.data.data.list[i].create_time = formatTime.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                    }
                    that.setData({
                        pageData:res.data.data.list
                    })
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // }
    toInfo:function(e){
        wx.navigateTo({
            url: '../videoVoteUserInfo/videoVoteUserInfo?joinId=' + e.currentTarget.dataset.joinid,
        })
    }
})