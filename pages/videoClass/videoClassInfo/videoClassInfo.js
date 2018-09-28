let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        actId:'',
        videoId:0,
        videoData:'',
        actTag:'',
        content:'',
        isRely:'',
        isAuto:false,
        lock:false,
        commentPage:1,
        commentData: '',
        className: 'moreData',
        btnText: '更多',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let that = this;
        if (options.scene != undefined) {
            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
            })
        } else if (options.scene == undefined) {
            that.setData({
                actId: options.actId,
            })
        }
        // 获取评论列表
        that.getComment();
        // 获取页面数据
        that.getPageData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let that = this;
        that.videoContext = wx.createVideoContext('myVideo')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
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
        that.setData({
            commentPage:1
        })
        // 获取评论列表
        that.getComment();
        // 获取页面数据
        that.getPageData();
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
        return {
            path: 'pages/index/index/?pageId=15&actId=' + that.data.actId
        }
    },
    toIndex:function(){
        getApp().toIndex()
    },
    chooseVideo:function(e){
        let that = this;
        that.setData({
            videoData: that.data.pageData.video[Number(e.currentTarget.dataset.index)].url,
            isAuto: true,
        })
        that.videoContext.play();
    },
    //长按删除评论
    longDel:function(e){
        let that = this;
        wx.showModal({
            title:'删除',
            content:'确认删除评论吗?',
            success:function(res){
                if(res.confirm){
                    getApp().request({
                        url:'org/video_class_delete_comment',
                        data:{
                            id: e.currentTarget.dataset.id
                        },
                        method:'post',
                        success:function(res){
                            if(Number(res.data.code) == 1){
                                wx.showToast({
                                    title: '删除成功',
                                    icon:'success',
                                    success:function(){
                                        that.setData({
                                            content: '',
                                            commentPage:1
                                        })
                                        that.getComment();
                                    }
                                })
                            } else if (Number(res.data.code) == 0){
                                wx.showToast({
                                    title: res.data.msg,
                                    icon:'none',
                                })
                            }
                        }
                    })
                }else if(res.cancel){
                    return 
                }
            }
        })
    },
    touchend:function(){
        let that = this;
        if(that.data.lock){
            setTimeout(()=>{
                that.setData({
                    lock:false
                })
            },100)
        }
    },
    switchRely: function (e) {
        let that = this;
        
        that.setData({
            isRely: e.currentTarget.dataset.id,
            content: '回复 ' + e.currentTarget.dataset.name + ': ',
        })
    },
    //添加一个评论
    addComment:function(e){
        let that = this; 
        getApp().request({
            url: 'visitor_add_comment',
            data: {
                act_id: that.data.actId,
                act_tag: that.data.actTag,
                content: e.detail.value.content,
                reply_id: that.data.isRely,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.showToast({
                        title: '提交成功',
                        success: function () {
                            that.setData({
                                content: '',
                                commentPage:1
                            })
                            that.getComment();
                        }
                    })
                }
            }
        })
    },
    // 获取更多评论数据
    moreData:function(e){
        let that = this;
        let commentData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            commentData.push(...that.data.commentData)
            that.setData({
                commentPage: that.data.commentPage + 1
            })
            getApp().request({
                url: 'comment_list',
                data: {
                    page: that.data.commentPage,
                    act_id: that.data.actId,
                    act_tag: 'video_class',
                },
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
                    if (Number(res.data.code) == 1) {
                        if (res.data.data.list.length) {
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].create_time = formatTime.dateTime(new Date(res.data.data.list[i].create_time * 1000))
                            }
                        }
                        commentData.push(...res.data.data.list)
                        // 更多
                        if (commentData.length >= that.data.commentPage*10) {
                            that.setData({
                                className: 'moreData',
                                btnText: '更多'
                            })
                        } else {
                            that.setData({
                                className: 'moreDataed',
                                btnText: '没有了'
                            })
                        }
                        that.setData({
                            commentData: commentData
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading()
                        wx.showToast({
                            title: '列表请求失败',
                            icon: 'none',
                        })
                    }
                }
            })
        }
    },
    // 获取评论列表
    getComment:function(){
        let that = this;
        getApp().request({
            url: 'comment_list',
            data: {
                page: that.data.commentPage,
                act_id: that.data.actId,
                act_tag: 'video_class',
            },
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
                if (Number(res.data.code) == 1) {
                    if(res.data.data.list.length){
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = formatTime.dateTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                    }
                    // 更多
                    if (res.data.data.list.length >= 10){
                        that.setData({
                            className: 'moreData',
                            btnText: '更多'
                        })
                    }else{
                        that.setData({
                            className: 'moreDataed',
                            btnText: '没有了'
                        })
                    }
                    that.setData({
                        commentData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0) {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: '列表请求失败',
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'visitor_video_class',
            data: {
                id: that.data.actId,
            },
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
                if (Number(res.data.code) == 1) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    res.data.data.create_time = formatTime.dayMonth(new Date(res.data.data.create_time * 1000))

                    that.setData({
                        pageData: res.data.data,
                        videoData: res.data.data.video[0].url,
                        actTag: res.data.data.act_tag
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
})