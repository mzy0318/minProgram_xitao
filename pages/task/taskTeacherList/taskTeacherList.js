// pages/task/taskTeacherList/taskTeacherList.js
let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPhone:true, //是否显示电话
        role:'',
        pageData:'',
        pageNum:1,
        url:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            role:options.role,
        })
        if(that.data.role == 'student'){
            that.setData({
                isPhone: true,
                url:'org/punch_course/students'
            })
            wx.setNavigationBarTitle({
                title: '学员列表',
            })
        } else if (that.data.role == 'teacher'){
            that.setData({
                isPhone: false,
                url: 'org/punch_course/teachers'
            })
            wx.setNavigationBarTitle({
                title: '教师列表',
            })
        }
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
        let that = this;
        that.getTeacherList();
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

    // }
    editPersonInfo:function(e){
        let that = this;
        if(that.data.role == 'teacher'){
            wx.navigateTo({
                url: '../taskTeacherListInfo/taskTeacherListInfo?role=teacher&userId=' + e.currentTarget.dataset.userid,
            })
        } else if (that.data.role == 'student'){
            wx.navigateTo({
                url: '../taskTeacherListInfo/taskTeacherListInfo?role=student&userId=' + e.currentTarget.dataset.userid,
            })
        }
    },
    // 搜索
    bindKeyInput:function(e){
        let that = this;
        that.setData({
            pageNum:1
        })
        that.getTeacherList(e.detail.value)
    },
    //获取教师列表
    getTeacherList:function(key){
        let that = this;
        getApp().request({
            url: that.data.url,
            data: {
                page: that.data.pageNum,
                key:key||'',
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    if (res.data.data.list.length > 0){
                        for (let i = 0; i < res.data.data.list.length;i++){
                            res.data.data.list[i].avatar_url = format.rect(res.data.data.list[i].avatar_url,30,30)
                        }
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    }
})