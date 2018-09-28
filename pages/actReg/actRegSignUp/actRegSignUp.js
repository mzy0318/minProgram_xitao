// pages/actReg/actRegSignUp/actRegSignUp.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        actId: '',
        formInfo:'',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            actId: options.actId,
            formInfo: JSON.parse(options.info)
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
    submitInfo: function (e) {
        let that = this;
        e.detail.value['act_id'] = that.data.actId
        for (let i = 0; i < that.data.formInfo.length;i++){
            e.detail.value['info[' + i + ']'] = e.detail.value[i]
            delete e.detail.value[i];
        }
        getApp().request({
            url: 'join_normal',
            data: e.detail.value,
            method: 'post',
            success: function (res) {
                let respons = res;
                if(Number(res.data.code)==1){
                    wx.showLoading({
                        title: '正在报名...',
                        mask: true,
                    })

                    setTimeout(closeLogin, 2000);

                    function closeLogin() {
                        wx.hideLoading()
                        if(respons.data.data.need_pay){
                            wx.showModal({
                                title: '提示',
                                content: '报名成功,请付款.',
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.navigateTo({
                                            url: '../../courses/orderInfo/orderInfo?joinId=' + respons.data.data.joiner_id + '&actTag=' + respons.data.data.tag + '&actId=' + respons.data.data.act_id,
                                        })
                                    }
                                }
                            })
                        }else{
                            that.setData({
                                isShow: true
                            })
                        }
                    }
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    },
    toBackPage:function(){
        let that = this;
        wx.navigateBack({})
        that.setData({
            isShow: false
        })
    }
})