// pages/goodLesson/lessonListInfo/lessonListInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        isSignUp:true,
        courseid:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        getApp().request({
            url:'lesson_one_act',
            data:{
                act_nice_id: options.actId,
            },
            method:'post',
            success:function(res){
                that.setData({
                    pageData:res.data.data
                })
                if (res.data.data.title){
                    wx.setNavigationBarTitle({
                        title: res.data.data.title
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
    tellPhone:e=>{
        getApp().tellPhone(e)
    },
    toIndex:()=>{
        getApp().toIndex();
    },
    isShow:function(e){
        let that = this;
        that.setData({
            isSignUp: Boolean(Number(e.currentTarget.dataset.is)),
            courseid: e.currentTarget.dataset.courseid,
        })
    },
    submitInfo:function(e){
        let that = this
        e.detail.value['act_nice_course_id'] = this.data.courseid
        getApp().request({
            url:'join_lesson_one',
            data: e.detail.value,
            method:'post',
            success:function(res){
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                })
                if(res.data.code==1){
                    that.setData({
                        isSignUp:true
                    })
                }
            }
        })
    }
})