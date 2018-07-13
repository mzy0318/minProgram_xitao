let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        joinId:'',
        pageData:'',
        isTitleOne: true,
        isTitleTwo: true,
        isTitleThree: true,
        encodeImage:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let url = 'pages/videoVote/videoVoteUserInfo/videoVoteUserInfo';
        let scene = 'joinId=' + options.joinId
        that.setData({
            encodeImage: getApp().getEncodeImage(url, scene)
        })

        if (options.scene != undefined) {
            let scene = decodeURIComponent(options.scene);
            console.log('获取到的scene', scene)
            that.setData({
                joinId: options.scene.joinId,
            })
        } else if (options.scene == undefined) {
            that.setData({
                joinId: options.joinId,
            })
        }
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
        let that = this;
        that.getUserInfo()
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
        let that = this;
        that.getUserInfo()
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
        return {
            path: 'pages/index/index?pageId=15&joinId=' + that.data.joinId
        }
    },
    btnOptions:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            // 我要投票
            getApp().request({
                url:'vote_video_vote',
                data:{
                    video_vote_joiner_id: that.data.joinId,
                },
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        wx.showToast({
                            title: '投票成功',
                            icon:'success'
                        })
                    } else if (Number(res.data.code) == 0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            //我要报名
            wx.navigateTo({
                url: '../videoVoteSignup/videoVoteSignup?actId=' + e.currentTarget.dataset.id + '&isEdit=' + e.currentTarget.dataset.is + '&joinId=' + e.currentTarget.dataset.joinid,
            })
        } else if (Number(e.currentTarget.dataset.id) == 2){
            //分享拉票
        } else if (Number(e.currentTarget.dataset.id) == 3){
            //我的封面
            wx.previewImage({
                urls: [that.data.pageData.cover.url],
            })
        }
    },
    toIndex:function(){
        getApp().toIndex({})
    },
    viewImage:function(e){
        let that = this;
        wx.previewImage({
            urls: [that.data.encodeImage],
        })
    },
    getUserInfo:function(){
        let that = this;
        getApp().request({
            url: 'video_vote_detail',
            data: {
                video_vote_joiner_id: that.data.joinId,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.nickname,
                    })
                    res.data.data.enlist_end_time = formatTime.formatTime(new Date(res.data.data.enlist_end_time * 1000));
                    res.data.data.enlist_start_time = formatTime.formatTime(new Date(res.data.data.enlist_start_time * 1000));
                    res.data.data.vote_end_time = formatTime.formatTime(new Date(res.data.data.vote_end_time * 1000));
                    res.data.data.vote_start_time = formatTime.formatTime(new Date(res.data.data.vote_start_time * 1000));
                    if ((res.data.data.status1 != 1) && (res.data.data.title1 != '')) {
                        that.setData({
                            isTitleOne: false
                        })
                    } else {
                        that.setData({
                            isTitleOne: true
                        })
                    }
                    if ((res.data.data.status2 != 1) && (res.data.data.title2 != '')) {
                        that.setData({
                            isTitleTwo: false
                        })
                    } else {
                        that.setData({
                            isTitleTwo: true
                        })
                    }
                    if ((res.data.data.status3 != 1) && (res.data.data.title3 != '')) {
                        that.setData({
                            isTitleThree: false
                        })
                    } else {
                        that.setData({
                            isTitleThree: true
                        })
                    }
                    that.setData({
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})