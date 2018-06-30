// pages/baseOptions/schoolModelInfo/schoolModelInfo.js
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
        that.setData({
            pageData: JSON.parse(options.modelInfo)
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
    submitSchoolModel:function(){
        let that = this;
        getApp().request({
            url: 'org/template_set',
            data: {
                id: that.data.pageData.id
            },
            method: 'post',
            success: function (res) {
                if(Number(res.data.code)==1){
                    wx.setStorageSync('schoolModel', that.data.pageData.id)
                    wx.showLoading({
                        title: '正在更新模板',
                        mask:true,
                        success:function(){
                            
                        }
                    })

                    setTimeout(function () {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            success:function(){
                                getApp().toIndex();
                            }
                        })
                    }, 2000)
                }else{
                    setTimeout(function () {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }, 1000)
                }
            }
        })
    }
})