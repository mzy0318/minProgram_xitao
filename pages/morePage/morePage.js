// pages/morePage/morePage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:[
            {
                name:'学校介绍',
                iconfont:'iconfont icon-xuexiao iconfontStyle iconfontSize',
                url:'../baseOptions/schoolInfo/schoolInfo',
                background:'#1055CC',
            },{
                name: '课程导航',
                iconfont: 'iconfont icon-daohang iconfontStyle iconfontSize',
                url: '../courses/course/course',
                background: '#1055CC',
            },{
                name: '师资力量',
                iconfont: 'iconfont icon-shizi iconfontStyle iconfontSize',
                url: '../baseOptions/teachers/teachers',
                background: '#1055CC',
            },{
                name: '学员风采',
                iconfont: 'iconfont icon-qiyefengcai iconfontStyle iconfontSize',
                url: '../baseOptions/studentStyle/studentStyle',
                background: '#1055CC',
            },{
                name: '活动报名',
                iconfont: 'iconfont icon-baoming iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#1055CC',
                style:'margin-left:20rpx;margin-top:20rpx; iconfontSize'
            },{
                name: '联系我们',
                iconfont: 'iconfont icon-lianxi iconfontStyle iconfontSize',
                url: '../baseOptions/contactUs/contactUs',
                background: '#1055CC',
            },{
                name: '意见建议',
                iconfont: 'iconfont icon-yijian iconfontStyle iconfontSize',
                url: '../baseOptions/opinions/opinions',
                background: '#1055CC',
            },{
                name: '帮我砍价',
                iconfont: 'iconfont icon-kanjia iconfontStyle iconfontSize',
                url: '../killPrices/killPrice/killPrice',
                background: '#00D4BE',
            },{
                name: '视频点赞',
                iconfont: 'iconfont icon-aixin iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#84D23E',
            },{
                name: '1元好课',
                iconfont: 'iconfont icon-yiyuanchoujiang iconfontStyle iconfontSize',
                url: '../goodLesson/goodLessonList/goodLessonList',
                background: '#FD9D22',
            },{
                name: '视频投票',
                iconfont: 'iconfont icon-zan1 iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#8990FA',
            },{
                name: '视频课堂',
                iconfont: 'iconfont icon-z-shipin iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#FE7FC2',
            },{
                name: '视频作业',
                iconfont: 'iconfont icon-shipin1 iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#84D23E',
            },{
                name: '万人拼团',
                iconfont: 'iconfont icon-pintuan iconfontStyle iconfontSize',
                url: '../collage/collageList/collageList',
                background: '#DE4037',
            },{
                name: '私人拼团',
                iconfont: 'iconfont icon-icon1 iconfontStyle iconfontSize',
                url: '../collage/collageList/collageList',
                background: '#DE4037',
            }, {
                name: '视频贺卡',
                iconfont: 'iconfont icon-shipin iconfontStyle iconfontSize',
                url: '../videos/userVideoList/userVideoList',
                background: '#8990FA',
            }, {
                name: '校区导航',
                iconfont: 'iconfont icon-xiaoqu iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#1055CC',
            }, {
                name: '打卡作业',
                iconfont: 'iconfont icon-job-task iconfontStyle iconfontSize',
                url: '../baseOptions/schoolInfo/schoolInfo',
                background: '#4A86E8',
            },
        ]
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
    toPage:function(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
})