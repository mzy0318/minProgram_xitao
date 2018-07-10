// pages/videoClass/videoClassUserList/videoClassUserList.js
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
        
        getApp().request({
            url:'visitor_video_class_list',
            data:{
                tag:'',
                catalog:'',
                page:1,
            },
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    that.setData({
                        pageData: res.data.data
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
    // 功能
    toOptions:function(e){
        if (Number(e.currentTarget.dataset.id) == 0){
            getApp().toIndex()
        } else if (Number(e.currentTarget.dataset.id) == 1){
            wx.navigateTo({
                url: '../../courses/course/course',
            })
        }
    },
    goManList: function () {
        wx.navigateTo({
            url: '../videoClassManList/videoClassManList',
        })
    },
    toInfo:function(){
        wx.navigateTo({
            url: '../videoClassInfo/videoClassInfo',
        })
    }
})