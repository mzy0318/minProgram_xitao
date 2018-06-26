// pages/orderInfo/orderInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        initNum: 1,
        className: 'orderInfoNumJianFalse',
        pageData:'',
        actId:'',
        actTag:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            actId: options.actId,
            actTag: options.actTag,
        })
        getApp().request({
            url:'product',
            data:{
                act_id: options.actId,
                act_tag: options.actTag,
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

    jianBtn: function (res) {

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

    addBtn: function (res) {

        let n = this.data.initNum + 1

        if (n > 1) {

            this.setData({

                className: 'orderInfoNumJian'
            })
        }

        this.setData({

            initNum: n,
        })
    },
    orderSubmit:function(res){
        let that = this;
        res.detail.value['act_id'] = that.data.actId
        res.detail.value['act_tag'] = that.data.actTag
        res.detail.value['amount'] = that.data.initNum
        getApp().request({
            url:'generate_order',
            method:'post',
            data: res.detail.value,
            success:function(res){
                let payInfo = JSON.stringify(res.data.data)
                wx.navigateTo({
                    url: '../orderInfoPay/orderInfoPay?payInfo=' + payInfo,
                })
            }
        })
    }
})