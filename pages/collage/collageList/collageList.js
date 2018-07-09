// pages/collage/collageList.js
let utils = require( '../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        startTime:'',
        endTime:'',
        pageNum: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        getApp().request({
            url:'visitor_personal_group_list',
            method:'post',
            success:function(res){
                if (Number(res.data.code) == 1) {
                    let data = res.data.data.list

                    data = utils.map(data,function(one){
                      one.banner_image_url = utils.rect(one.banner_image_url,500,250)
                      one.start_time = utils.liteDate(one.start_time)
                      one.end_time = utils.liteDate(one.end_time)
                      return one
                    })
                    
                    that.setData({
                        pageData: data,
                    })
                    wx.stopPullDownRefresh()
                } else if (Nmuber(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
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
        let that = this;
        that.setData({
            pageNum: 1
        })
        getApp().request({
            url: 'visitor_personal_group_list',
            method: 'post',
            success: function (res) {
                if(Number(res.data.code)==1){
                    let data = res.data.data.list
                    for (let i = 0; i < data.length; i++) {
                        data[i].start_time = utils.formatTime(new Date(data[i].start_time * 1000))
                        data[i].end_time = utils.formatTime(new Date(data[i].end_time * 1000))
                    }
                    that.setData({
                        pageData: data,
                    })
                    wx.stopPullDownRefresh()
                } else if (Nmuber(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
                
            }
        })
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
    toCollageInfo:function(e){
        wx.navigateTo({
            url: '../collageInfo/collageInfo?actId=' + e.currentTarget.dataset.actid + '&acttag=' + e.currentTarget.dataset.acttag,
        })
    }
})