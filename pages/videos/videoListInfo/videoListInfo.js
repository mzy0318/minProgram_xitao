// pages/videos/videoListInfo/videoListInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        videoUrl: '',
        videoImage: '',
        manaUser: [
            {
                name: '机构主页',
                method: 'toIndex',
                width: '33.33%',
            },
            // {
            //     name: '拍摄祝福',
            //     method: 'setVideo',
            //     width: '20%',
            // },
            {
                name: '分享朋友圈',
                method: 'toSharePage',
                width: '33.33%',
            },
            // {
            //     name: '我也要制作',
            //     method: 'setVideo',
            //     width: '20%',
            // }
        ],
        user: [
            {
                name: '机构主页',
                method: 'toIndex',
                width: '33.33%',
            },
            {
                name: '分享朋友圈',
                method: 'toSharePage',
                width: '33.33%',
            }, 
        ],
        optionsContent: '',
        actId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;

        if (options.scene != undefined) {  
            let scene = decodeURIComponent(options.scene);
            console.log('scene', scene)
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
                optionsContent: that.data.user,
            })
        } else if (options.scene == undefined) {

            that.setData({
                actId: options.id,
            });
            if (Number(options.userType) == 0) {
                that.setData({
                    optionsContent: that.data.manaUser
                })
            } else if (Number(options.userType) == 1) {
                that.setData({
                    optionsContent: that.data.user
                })
            }
        }
        getApp().request({
            url: 'visitor_video_card',
            data: {
                id: that.data.actId
            },
            method: 'post',
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    that.setData({
                        pageData: res.data.data,
                        videoUrl: res.data.data.video.url
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
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
    onShareAppMessage: function() {
        let that = this;
        if(res.from == 'menu'){
            return {
                path:'pages/index/index?pageId=6&actId='+that.data.actId
            }
        }
    },
    toIndex: function() {
        getApp().toIndex()
    },
    setVideo: function() {
        let that = this;
        wx.chooseVideo({

            success: function(res) {
                that.setData({
                    videoUrl: res.tempFilePath,
                    videoImage: res.thumbTempFilePath,
                })
            },
            fail: function(res) {}
        })
    },
    toVideosEdit: function(e) {
        wx.navigateTo({
            url: '../../manageCenters/videoEdit/videoEdit?id=' + e.currentTarget.dataset.actid + '&isEdit=0',
        })
    },
    toSharePage:function(e){
        let url = encodeURIComponent(e.currentTarget.dataset.url)
        wx.navigateTo({
            url: '../videoSharePage/videoSharePage?actid=' + e.currentTarget.dataset.actid + '&url=' + url + '&title=' + e.currentTarget.dataset.title,
        })
    }
})