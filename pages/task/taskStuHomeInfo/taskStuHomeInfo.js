// pages/task/taskStuHomeInfo/taskStuHomeInfo.js
let formate = require('../../../utils/util.js')
const innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isInfo:true,
        courseId:'',
        pageData:'',
        stuId:'',
        time:'',
        pageNum:1,
        zanList:'',
        commentList:'',
        isZanList:true,
        audioUrl:'',
        btnText: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let time = options.time;
        time = time.split(' ');
        that.setData({
            courseId: options.courseId,
            stuId: options.stuId,
            time: time[0]
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        that.videoContext = wx.createVideoContext('myVideo');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        that.setData({
            pageNum: 1,
        })
        that.getPageData();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        let that = this;
        that.setData({
            isInfo:true,
        })
        innerAudioContext.stop()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        let that = this;
        that.setData({
            isInfo: true,
        })
        innerAudioContext.stop()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
            pageNum: 1,
        })
        that.getPageData();
    },
    // 更多评论列表
    moreData:function(e){
        let that = this;
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            wx.showLoading({
                title: '正在加载...',
            })
            let pageData = [];
            pageData.push(...that.data.commentList);
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'punch_course/comment',
                data: {
                    student_id: that.data.stuId,
                    punch_course_id: that.data.courseId,
                    date: that.data.time,
                    page: that.data.pageNum,
                },
                method: 'get',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        let zanList = res.data.data.thumb_person.split(',');
                        pageData.push(...res.data.data.comments);
                        if (pageData.length >= that.data.pageNum*10){
                            that.setData({
                                btnText: 1
                            })
                        }else{
                            that.setData({
                                btnText: 0
                            })
                        }
                        that.setData({
                            pageData: res.data.data,
                            zanList: zanList,
                            commentList: pageData,
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    //查看图片
    previewImage: function (e) {
        getApp().previewImage(e.currentTarget.dataset.url)
    },
    //全屏查看视频
    previewVideo: function (e) {
        let that = this;
        that.setData({
            isOther: true,
            isOtherDisplay: 'display',
            otherVideo: e.currentTarget.dataset.url,
        })
        that.videoContext.play();
        that.videoContext.requestFullScreen({ direction: 0 });
    },
    // 视频播放结束后退出全屏
    stopVideo: function (e) {
        let that = this;
        that.videoContext.exitFullScreen();
    },
    // 播放语音
    playAudio: function (e) {
        let that = this;
        innerAudioContext.src = e.currentTarget.dataset.url;
        innerAudioContext.play();
        that.setData({
            audioUrl: e.currentTarget.dataset.id
        })
        innerAudioContext.onEnded(() => {
            that.setData({
                audioUrl: '',
            })
        })
    },
    infoOpt: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //更多功能
            that.setData({
                isInfo: !that.data.isInfo,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //点赞/取消点赞
            let status = 0
            if (Boolean(e.currentTarget.dataset.iszan)){
                status = 1
            }else{
                status = 0
            }
            getApp().request({
                url:'punch_course/thumb',
                data:{
                    homework_id: e.currentTarget.dataset.homeid,
                    status:status,
                },
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        that.setData({
                            pageNum:1,
                            isInfo:true,
                        })
                        that.getPageData();

                    }else{
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //评论
            wx.navigateTo({
                url: '../taskReply/taskReply?isMark=0&homeId=' + e.currentTarget.dataset.homeid,
            })
        }
    },
    //获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url: 'punch_course/comment',
            data: {
                student_id: that.data.stuId,
                punch_course_id: that.data.courseId,
                date: that.data.time,
                page: that.data.pageNum,
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    // 是否显示点赞列表
                    if (res.data.data.thumb_person == ''){
                        that.setData({
                            isZanList: true,
                        })
                    }else{
                        that.setData({
                            isZanList: false,
                        })
                    }
                    // 改变我的作业内容图片大小
                    if (res.data.data.homework.image.length > 0){
                        for (let i = 0; i < res.data.data.homework.image.length;i++){
                            res.data.data.homework.image[i].url = formate.rect(res.data.data.homework.image[i].url,100,100)
                        }
                    }
                    // 改变评论列表的图片大小
                    if (res.data.data.comments.length > 0){
                        for (let i = 0; i < res.data.data.comments.length;i++){
                            if (res.data.data.comments[i].image.length > 0){
                                for (let j = 0; j < res.data.data.comments[i].image.length;j++){
                                    res.data.data.comments[i].image[j].url = formate.rect(res.data.data.comments[i].image[j].url, 100, 100)
                                }
                            }
                        }
                    }
                    // 格式化时间
                    res.data.data.homework.create_time = formate.formatTime(new Date(res.data.data.homework.create_time*1000))
                    //更多
                    if (res.data.data.comments.length > 10){
                        that.setData({
                            btnText: 1
                        })
                    }else{
                        that.setData({
                            btnText: 0
                        })
                    }
                    that.setData({
                        pageData: res.data.data,
                        zanList: res.data.data.thumb_person,
                        commentList: res.data.data.comments
                    })
                    wx.stopPullDownRefresh()
                } else {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    }
})