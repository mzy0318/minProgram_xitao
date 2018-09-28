// pages/task/taskFractionEdit/taskFractionEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status:0,
        pageData:'',
        isChecked:true,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url:'org/punch_course/score_rule',
            data:{},
            method:'get',
            success:function(res){
                if(Number(res.data.code) == 1){
                    that.setData({
                        pageData:res.data.data,
                        isChecked: res.data.data.status == 0?true:false,
                        status: res.data.data.status,
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
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
    switchStatus:function(e){
        let that = this;
        that.setData({
            status: e.detail.value?0:1
        })
    },
    subScoreSet:function(e){
        let that = this;
        let sendData = e.detail.value;
        sendData['status'] = that.data.status
        getApp().request({
            url:'org/punch_course/score_rule',
            data: sendData,
            method:'post',
            success:function(res){
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if(Number(res.data.code) == 1){
                    wx.showLoading({
                        title: '正在保存',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)

                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            success: function () {
                                wx.navigateBack({})
                            }
                        })
                    }
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }       
        })
    },
})