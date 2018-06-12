// pages/collage/collagePersonInfo/collagePersonInfo.js
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
        console.log('options', options)
        let that = this
        getApp().request({
            url:'personal_group_act',
            data:{
                act_id: options.actId,
                joiner_id: options.joinId,
            },
            method:'post',
            success:function(res){
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                })
                that.setData({
                    pageData:res.data.data
                })
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
    toCollageJoin: function () {
        wx.navigateTo({
            url: '../collageSignup/collageSignup',
        })
    },
    toIndex: function () {
        getApp().toIndex()
    }
})