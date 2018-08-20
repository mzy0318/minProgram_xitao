// pages/videos/videoSharePage/videoSharePage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoImage:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let sendData = {};
        wx.setNavigationBarTitle({
            title: options.title,
        })
        sendData['id'] = options.actid;
        sendData['page'] = 'pages/videos/videoListInfo/videoListInfo';
        sendData['banner_url'] = options.url;
        sendData['org_id'] = String(getApp().getExtConfig().orgId);
        that.setData({
            videoImage: 'https://www.zhihuizhaosheng.com/video_card_placard?id=' + sendData.id + '&page=' + sendData.page + '&org_id=' + sendData.org_id + '&banner_url=' + sendData.banner_url,
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
    // onShareAppMessage: function () {

    // },
    toBack:function(){
        wx.navigateBack({})
    },
    priveImage:function(){
        let that = this;
        wx.previewImage({
            urls: [that.data.videoImage],
        })
    }
})