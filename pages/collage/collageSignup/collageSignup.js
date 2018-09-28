// pages/collage/collageSignUp/collageSignup.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: false,
        formInfo:'',
        actId:'',
        btnID:'',
        joinerId:'',
        isJoin:true,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        this.setData({
            formInfo: JSON.parse(options.info),
            actId: options.actId,
            btnID: Number(options.btnId),
            joinerId: options.joinerId
        })
        if (that.data.btnID == 1){
            that.setData({
                isJoin:true,
            })
        } else if (that.data.btnID == 0){
            that.setData({
                isJoin: false,
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
    toBackPage: function (e) {
        wx.navigateBack({
        })
        this.setData({
            isShow: false
        })
    },
    submitInfo: function (e) {
        let that = this;
        let arr = []
        let sendData = {};
        if (that.data.btnID == 0){
            // 发起新团
            sendData['nickname'] = e.detail.value.nickname
            sendData['phone'] = e.detail.value.phone
            sendData['act_id'] = that.data.actId
            sendData['person_amount'] = e.detail.value.person_amount;
            for (let i = 0; i < that.data.formInfo.length; i++) {
                // arr.push(e.detail.value[i])
                sendData['info[' + i + ']'] = e.detail.value[i]
            }
            // sendData['info[]'] = arr;
            sendData['joiner_id'] ='',
            getApp().request({
                url: 'join_personal_group',
                data: sendData,
                method: 'post',
                success: function (res) {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    } else if (Number(res.data.code) == 1) {

                        wx.showLoading({
                            title: '正在开团...',
                            mask: true,
                        })

                        setTimeout(closeLogin, 2000);

                        function closeLogin() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '开团成功',
                                success:function(){
                                    wx.navigateBack({})
                                }
                            })
                        }
                    }
                }
            })
        } else if (that.data.btnID == 1){
            // 参加拼团
            sendData['nickname'] = e.detail.value.nickname
            sendData['phone'] = e.detail.value.phone
            sendData['act_id'] = this.data.actId   
            sendData['person_amount'] = 0;   
            for (let i = 0; i < that.data.formInfo.length; i++) {
                sendData['info[' + i + ']'] = e.detail.value[i]
            }
            sendData['joiner_id'] = that.data.joinerId,
                getApp().request({
                    url: 'join_personal_group',
                    data: sendData,
                    method: 'post',
                    success: function (res) {
                        if (res.data.frozen == 1) {
                            that.setData({
                                isFrozen: 'frozen',
                            })
                        } else {
                            that.setData({
                                isFrozen: 'empty',
                            })
                        }
                        if (Number(res.data.code) == 0) {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            })
                        } else if (Number(res.data.code) == 1) {

                            wx.showLoading({
                                title: '正在参团...',
                                mask: true,
                            })
                            setTimeout(closeLogin, 2000)
                            function closeLogin() {
                                wx.hideLoading()
                                wx.showToast({
                                    title: '参团成功',
                                    success:function(){
                                        wx.navigateBack({})
                                    }
                                })
                            }
                        }
                    }
                })
        }
        
    }
})