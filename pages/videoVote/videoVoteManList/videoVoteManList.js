let formatTime = require('../../../utils/util.js')
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
        // 获取页面数据
        that.getPageData()
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
        // 获取页面数据
        that.getPageData()
    },

    // /**
    //  * 页面上拉触底事件的处理函数
    //  */
    // onReachBottom: function () {

    // },
    // 返回
    toback: function () {
        wx.navigateBack({})
    },
    // 查看活动参加列表
    toJoinerList:function(e){
        let that = this;
        wx.navigateTo({
            url: '../videoVoteJoinerList/videoVoteJoinerList?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 活动详情页面
    toPageInfo:function(e){
        let that = this;
        wx.navigateTo({
            url: '../videoVoteInfo/videoVoteInfo?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url:'org/video_vote/list',
            data:{},
            method:'get',
            success:function(res){
                if(res.data.code == 1){
                    wx.stopPullDownRefresh()
                    if(res.data.data.list.length > 0){
                        for (let i = 0; i < res.data.data.list.length;i++){
                            res.data.data.list[i].enlist_end_time = formatTime.formatDate(new Date(res.data.data.list[i].enlist_end_time * 1000));
                            res.data.data.list[i].enlist_start_time = formatTime.formatDate(new Date(res.data.data.list[i].enlist_start_time * 1000));
                        }
                    }
                    that.setData({
                        pageData:res.data.data.list
                    })
                }
            },
        })
    }
})