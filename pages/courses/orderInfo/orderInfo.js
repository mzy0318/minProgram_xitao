// pages/orderInfo/orderInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        initNum: 1,
        className: 'orderInfoNumJianFalse',
        nowPrice:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        this.setData({
            nowPrice: options.nowPrice,
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
})