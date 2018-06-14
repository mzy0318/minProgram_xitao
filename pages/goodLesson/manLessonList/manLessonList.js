// pages/goodLesson/manLessonList/manLessonList.js
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
        let that = this
        getApp().request({
            url:'org/lesson_one_list',
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
    delActive:function(e){
        getApp().request({
            url:'org/delete_act',
            data:{
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.acttag
            },
            method:'post',
            success:function(res){
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                })
                wx.navigateTo({
                    url: '../manLessonList/manLessonList',
                })
            }
        })
    },
    toLessonEdit:function(e){
        wx.navigateTo({
            url: '../../manageCenters/oneLessonEdit/oneLessonEdit?actNiceId=' + e.currentTarget.dataset.id,
        })
    },
    taBack:function(){
        wx.navigateBack({
        })
    },
    toLessonInfo:function(e){
        wx.navigateTo({
            url: '../lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.id,
        })
    }
})