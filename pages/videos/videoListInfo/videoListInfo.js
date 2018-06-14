// pages/videos/videoListInfo/videoListInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        videoUrl:'',
        videoImage:'',
        manaUser:[
            {
                name:'机构主页',
                method:'toIndex',
                width:'20%',
            },{
                name:'拍摄祝福',
                method: 'setVideo',
                width: '20%',
            },{
                name:'分享朋友圈',
                method: '',
                width: '20%',
            },{
                name:'我要制作',
                method: 'setVideo',
                width: '20%',
            }
        ],
        user:[
            {
                name: '机构主页',
                method: 'toIndex',
                width: '33.33%',
            },{
                name: '分享朋友圈',
                method: '',
                width: '33.33%',
            },
        ],
        optionsContent:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (Number(options.userType)==0){
            that.setData({
                optionsContent: that.data.manaUser
            })
        } else if (Number(options.userType) == 1){
            that.setData({
                optionsContent: that.data.user
            })
        }
        getApp().request({
            url:'visitor_video_card',
            data:{
                id: options.id
            },
            method:'post',
            success:function(res){
                that.setData({
                    pageData: res.data.data,
                    videoUrl: res.data.data.video
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.title,
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
    toIndex:function(){
        getApp().toIndex()
    },
    setVideo:function(){
        let that = this;
        wx.chooseVideo({

            success:function(res){
                that.setData({
                    videoUrl: res.tempFilePath,
                    videoImage: res.thumbTempFilePath,
                })
            },
            fail:function(res){
            }
        })
    },
    toVideosEdit:function(e){
        wx.navigateTo({
            url: '../../manageCenters/videoEdit/videoEdit?id=' + e.currentTarget.dataset.actid+'&isEdit=0',
        })
    }
})