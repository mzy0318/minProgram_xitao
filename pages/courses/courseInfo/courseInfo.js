let app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        lessonInfo: '',
        isShow: true,
        pageData:'',
        actId:'',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;

        if (options.scene != undefined) {
            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
            })
        } else if (options.scene == undefined) {
            that.setData({
                actId: options.id,
            })
        }

        getApp().request({
            url: 'visitor_sale_lesson',
            data: {
                id: that.data.actId,
            },
            method: 'post',
            success: function (res) {
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
        let that = this;
        return {
            path: 'pages/index/index?pageId=20&actId=' + that.data.actId
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    handleShow: function () {
        this.setData({
            isShow: false
        })
    },
    handleHidden: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.is)==1){
            e.detail.value['lesson_id'] = that.data.pageData.id;
            getApp().request({
                url: 'sale_lesson_appoint',
                data: e.detail.value,
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.showToast({
                            title: '预约成功',
                            icon: 'none',
                        })
                        that.setData({
                            isShow: true
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.is) == 0){
            that.setData({
                isShow: true
            })
        }
    },
    toIndex: function () {
        getApp().toIndex()

    },
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    map: function (e) {
        console.log(e.currentTarget.dataset)
        app.map(e.currentTarget.dataset.latitude,e.currentTarget.dataset.longitude,e.currentTarget.dataset.name,e.currentTarget.dataset.address,)
    },
    toOrderInfo: function (e) {
        let that = this;
        if (that.data.allow_pay){
            wx.navigateTo({
                url: '../orderInfo/orderInfo?actId=' + e.currentTarget.dataset.id + '&actTag=' + e.currentTarget.dataset.acttag,
            })
        }else{
            // wx.showModal({
            //     title: '提示',
            //     content: '管理员没有开启支付',
            // })
            wx.navigateTo({
                url: '../orderInfo/orderInfo?actId=' + e.currentTarget.dataset.id + '&actTag=' + e.currentTarget.dataset.acttag,
            })
        }   
    },
})