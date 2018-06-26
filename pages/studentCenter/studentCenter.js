// pages/studentCenter/studentCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageStuData: [
            {
                name: '我的订单',
                iconfont: 'iconfont icon-zuoye iconStyle',
                background: '#A145AF',
                url: '../studentManage/orderList/orderList',
                pageTypeStu:1,
            },{
                name: '预约试听',
                iconfont: 'iconfont icon-weibiaoti- iconStyle',
                background: '#FFCF0B',
                url: '../courses/stuCourseList/stuCourseList',
                pageTypeStu: 2,
            },{
                name: '私人拼团',
                iconfont: 'iconfont icon-pintuan iconStyle',
                background: '#E3465B',
                url: '../killPrices/killPersonList/killPersonList',
                pageTypeStu: 3,
            }, {
                name: '一元上好课',
                iconfont: 'iconfont icon-yiyuanchoujiang iconStyle',
                background: '#FD9D22',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 4,
            }, {
                name: '视频点赞',
                iconfont: 'iconfont icon-aixin iconStyle',
                background: '#84D23E',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 5,
            }, {
                name: '帮我砍学费',
                iconfont: 'iconfont icon-kanjia iconStyle',
                background: '#00D4BE',
                url:'../killPrices/killPersonList/killPersonList',
                pageTypeStu: 6,
            }, {
                name: '万人拼团',
                iconfont: 'iconfont icon-icon1 iconStyle',
                background: '#DE4037',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 7,
            }, {
                name: '视频投票',
                iconfont: 'iconfont icon-zan1 iconStyle',
                background: '#8990FA',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 8,
            }, 
            // {
            //     name: '视频贺卡',
            //     iconfont: 'iconfont icon-meiguihua iconStyle',
            //     background: '#1196DB',
            //     url: '../killPrices/killPriceList/killPriceList',
            //     pageTypeStu: 9,
            // }, 
            {
                name: '活动报名',
                iconfont: 'iconfont icon-sign iconStyle',
                background: '#FF6766',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 10,
            }, {
                name: '微视频课堂',
                iconfont: 'iconfont icon-shipin1 iconStyle',
                background: '#FE7FC2',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 11,
            }, {
                name: '视频作业',
                iconfont: 'iconfont icon-job-task iconStyle',
                background: '#84D23E',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 12,
            }
        ],
        userInfo:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userInfo: JSON.parse(wx.getStorageSync('userInfo'))
        })
        console.log(this.data.userInfo)
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
    toOptionPage:function(e){
        wx.setStorageSync('pageTypeStu', e.currentTarget.dataset.pagetypestu)
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
})