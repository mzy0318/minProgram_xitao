// pages/orderInfo/orderInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        initNum: 1,
        className: 'orderInfoNumJianFalse',
        pageData: '',
        actId: '',
        actTag: '',
        isActive: '', //是不可以添加
        addClassName: 'orderInfoNumAdd',
        isAllow: '',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId: options.actId,
            actTag: options.actTag,
            joinId: options.joinId,
        })
        getApp().request({
            url: 'product',
            data: {
                act_id: that.data.actId,
                act_tag: that.data.actTag,
            },
            method: 'post',
            success: function(res) {
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if (Number(res.data.code) == 1) {
                    that.setData({
                        pageData: res.data.data,
                        isActive: res.data.data.allow_edit_amount
                    })
                    if (that.data.isActive) {
                        that.setData({
                            addClassName: 'orderInfoNumAdd'
                        })
                    } else {
                        that.setData({
                            addClassName: 'orderInfoNumJianFalse'
                        })
                    }
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
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
    // onShareAppMessage: function () {

    // },

    jianBtn: function(res) {

        if (this.data.initNum - 1 <= 1) {

            this.setData({
                className: 'orderInfoNumJianFalse',
                initNum: 1,
            })

        } else {

            this.setData({

                initNum: this.data.initNum - 1,

            })
        }

    },

    addBtn: function(res) {
        let that = this;
        let n = this.data.initNum + 1
        if (that.data.isActive) {
            if (n > 1) {

                this.setData({
                    className: 'orderInfoNumJian'
                })
            }

            this.setData({

                initNum: n,
            })

        } else {

            return
        }
    },
    orderSubmit: function(res) {
        let that = this;
        res.detail.value['act_id'] = that.data.actId
        res.detail.value['act_tag'] = that.data.actTag
        res.detail.value['amount'] = that.data.initNum;
        res.detail.value['joiner_id'] = that.data.joinId ? that.data.joinId:'';
        if (res.detail.value.nickname == ''){
            wx.showToast({
                title: '姓名不能为空',
                icon:'none',
            })
        } else if (res.detail.value.phone == ''){
            wx.showToast({
                title: '电话不能为空',
                icon: 'none',
            })
        }else{
            wx.navigateTo({
                url: '../orderInfoPay/orderInfoPay?actId=' + res.detail.value.act_id + '&actTag=' + res.detail.value.act_tag + '&amount=' + res.detail.value.amount + '&joinId=' + res.detail.value.joiner_id + '&nickname=' + res.detail.value.nickname + '&note=' + res.detail.value.note + '&phone=' + res.detail.value.phone + '&isInfo=0',
            });
        }
    }
})