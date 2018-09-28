// pages/task/taskStuHome/taskStuHome.js
let formate = require('../../../utils/util.js')
const innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        optNum:0,
        isScore:true,//积分
        isZan:true,
        isInfo:true,
        isWork:false,
        baseInfo:'',//学员基本信息
        userId:'',
        homeWorkData:'',//学员作业
        homeWorkId:'',
        homePage:1,
        homeList:'',
        scoreList:'',//积分列表
        scoreRule:'',//积分规则
        score:'',//学员当前积分
        scorePage:1,
        bottomModel:'',//触底类型
        zanList:[],
        zan:'',
        zanPage:1,
        homeNum: -1,
        otherVideo:'',
        audioUrl:'',
        btnText: 0,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            userId:options.userId,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let that = this;
        that.videoContext = wx.createVideoContext('myVideo');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this;
        // 获取学员作业
        that.getStuHomework();
        //获取学员基本信息
        that.getBaseData();
    },
    onHide:function(){
        let that = this;
        that.setData({
            homeNum: -1,
        })
        innerAudioContext.stop()
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let that = this;
        that.setData({
            homeNum: -1,
        })
        innerAudioContext.stop()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    //全屏查看视频
    previewVideo: function (e) {
        let that = this;
        that.setData({
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
    switchOpt:function(e){
        let that = this;
        that.setData({
            optNum: Number(e.currentTarget.dataset.index),
        })
        if (Number(e.currentTarget.dataset.index) == 0){
            //作业
            that.setData({
                isScore: true,//积分
                isZan: true, //点赞
                isWork: false,//作业
                bottomModel:0,
                homePage:1,
            })

        } else if (Number(e.currentTarget.dataset.index) == 1){
            wx.showLoading({
                title: '正在加载',
            })
            //点赞
            that.setData({
                isScore: true,//积分
                isZan: false,//点赞
                isWork: true,//作业
                isInfo:true,
                bottomModel:1,
                zanPage:1,
                homeNum: -1,
            })
            // 获取点赞列表
            that.getZanList()
        } else if (Number(e.currentTarget.dataset.index) == 2){
            wx.showLoading({
                title: '正在加载',
            })
            //积分
            that.setData({
                isScore: false,//积分
                isZan: true,//点赞
                isWork: true,//作业
                isInfo: true,
                bottomModel:2,
                scorePage:1,
                homeNum: -1,
            })
            //获取学员积分列表
            that.getStuScore();
        }
    },
    //查看图片
    previewImage:function(e){
        getApp().previewImage(e.currentTarget.dataset.url)
    },
    infoOpt:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //更多功能
            if (e.currentTarget.dataset.index == that.data.homeNum) {
                that.setData({
                    homeNum: -1,
                })
            } else {
                that.setData({
                    homeNum: e.currentTarget.dataset.index,
                })
            }
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            let status = 0
            //点赞功能
            if (Boolean(e.currentTarget.dataset.zan) == true){
                status = 1
            } else if (Boolean(e.currentTarget.dataset.zan) == false){
                status = 0
            }
            getApp().request({
                url:'punch_course/thumb',
                data:{
                    homework_id: e.currentTarget.dataset.homeid,
                    status: status,
                },
                method:'post',
                success:function(res){
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if(Number(res.data.code) == 1){
                        that.setData({
                            isInfo:true,
                            homePage:1,
                            homeNum: -1,
                        })
                        that.getStuHomework();
                        that.getBaseData();
                    }else{
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                        that.setData({
                            homeNum: -1,
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //评论
            wx.navigateTo({
                url: '../taskStuHomeInfo/taskStuHomeInfo?stuId=' + e.currentTarget.dataset.stuid + '&courseId=' + e.currentTarget.dataset.courseid + '&time=' + e.currentTarget.dataset.time,
            })
        }
    },
    // 播放语音
    playAudio:function(e){
        let that = this;
        innerAudioContext.src = e.currentTarget.dataset.url;
        innerAudioContext.play();
        that.setData({
            audioUrl: e.currentTarget.dataset.id
        })
        innerAudioContext.onEnded(()=>{
            that.setData({
                audioUrl:'',
            })
        })
    },
    // 更多列表数据
    moreData:function(e){
        let that = this;
        if (that.data.bottomModel == 2){
            // 积分列表
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                let pageData = [];
                pageData.push(...that.data.scoreList);
                that.setData({
                    scorePage: that.data.scorePage + 1
                })
                getApp().request({
                    url: 'punch_course/student_score',
                    data: {
                        student_id: that.data.userId,
                        page: that.data.scorePage,
                    },
                    method: 'get',
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
                            if (res.data.data.data.length > 0) {
                                for (let i = 0; i < res.data.data.data.length; i++) {
                                    res.data.data.data[i].create_time = formate.formatTime(new Date(res.data.data.data[i].create_time * 1000));
                                }
                            }
                            pageData.push(...res.data.data.data)
                            // 更多
                            if (pageData.length >= that.data.scorePage*10) {
                                that.setData({
                                    btnText: 1,
                                })
                            } else {
                                that.setData({
                                    btnText: 0,
                                })
                            }
                            that.setData({
                                scoreList: pageData,
                            })
                            wx.hideLoading()
                        } else {
                            wx.hideLoading()
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                            })
                        }
                    }
                })
            }
        } else if (that.data.bottomModel == 1){
            // 点赞列表
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                let pageData = [];
                pageData.push(...that.data.zanList)
                that.setData({
                    zanPage: that.data.zanPage + 1,
                })
                getApp().request({
                    url: 'punch_course/student_thumb',
                    data: {
                        student_id: that.data.userId,
                        page: that.data.zanPage,
                    },
                    method: 'get',
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

                            if (res.data.data.list.length > 0) {
                                for (let i = 0; i < res.data.data.list.length; i++) {
                                    res.data.data.list[i].create_time = formate.formatTime(new Date(res.data.data.list[i].create_time * 1000));
                                }
                            }
                            pageData.push(...res.data.data.list)
                            //更多
                            if (pageData.length >= that.data.zanPage*10) {
                                that.setData({
                                    btnText: 1,
                                })
                            } else {
                                that.setData({
                                    btnText: 0,
                                })
                            }
                            that.setData({
                                zanList: pageData
                            })
                            wx.hideLoading()
                        } else {
                            wx.hideLoading()
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                            })
                        }
                    }
                })
            }
        } else if (that.data.bottomModel == 0){
            // 作业列表
            if (e.currentTarget.dataset.text == 0) {

            } else if (e.currentTarget.dataset.text == 1) {
                wx.showLoading({
                    title: '正在加载...',
                })
                let pageData = [];
                pageData.push(...that.data.homeList)
                that.setData({
                    homePage: that.data.homePage + 1
                })
                getApp().request({
                    url: 'punch_course/student_homework',
                    data: {
                        student_id: that.data.userId,
                        page: that.data.homePage,
                    },
                    method: 'get',
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
                            res.data.data.avatar_url = formate.rect(res.data.data.avatar_url, 40, 40)
                            if (res.data.data.homework.length > 0) {
                                for (let i = 0; i < res.data.data.homework.length; i++) {
                                    if (res.data.data.homework[i].thumb_person == '') {

                                        res.data.data.homework[i].isZanList = true;
                                    } else {
                                        res.data.data.homework[i].isZanList = false;
                                    }
                                    res.data.data.homework[i].create_time = formate.formatTime(new Date(res.data.data.homework[i].create_time * 1000));
                                    res.data.data.homework[i].thumb_person = res.data.data.homework[i].thumb_person.split(',');
                                    for (let j = 0; j < res.data.data.homework[i].image.length; j++) {
                                        res.data.data.homework[i].image[j].url = formate.rect(res.data.data.homework[i].image[j].url, 100, 100)
                                    }
                                }
                            }
                            pageData.push(...res.data.data.homework)
                            // 更多
                            if (pageData.length >= that.data.homePage*10) {
                                that.setData({
                                    btnText: 1,
                                })
                            } else {
                                that.setData({
                                    btnText: 0,
                                })
                            }
                            that.setData({
                                homeWorkData: res.data.data,
                                homeList: pageData,
                            })
                            wx.hideLoading()
                        } else {
                            wx.hideLoading()
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none',
                            })
                        }
                    }
                })
            }
        }
    },
    // 获取学员积分列表
    getStuScore:function(){
        let that = this;
        getApp().request({
            url: 'punch_course/student_score',
            data: {
                student_id: that.data.userId,
                page: that.data.scorePage,
            },
            method: 'get',
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
                    if (res.data.data.data.length > 0) {
                        for (let i = 0; i < res.data.data.data.length; i++) {
                            res.data.data.data[i].create_time = formate.formatTime(new Date(res.data.data.data[i].create_time * 1000));
                        }
                    }
                    // 更多
                    if(res.data.data.data.length >= 10){
                        that.setData({
                            btnText: 1,
                        })
                    }else{
                        that.setData({
                            btnText: 0,
                        })
                    }
                    that.setData({
                        scoreList: res.data.data.data,
                        scoreRule: res.data.data.score_rule,
                        score: res.data.data.score,
                    })
                    wx.hideLoading()
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 获取学员作业
    getStuHomework:function(){
        let that = this;
        getApp().request({
            url: 'punch_course/student_homework',
            data: {
                student_id: that.data.userId,
                page: that.data.homePage,
            },
            method: 'get',
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
                    res.data.data.avatar_url = formate.rect(res.data.data.avatar_url, 40, 40)
                    if (res.data.data.homework.length > 0) {
                        for (let i = 0; i < res.data.data.homework.length; i++) {
                            if (res.data.data.homework[i].thumb_person == ''){

                                res.data.data.homework[i].isZanList = true;
                            }else{
                                res.data.data.homework[i].isZanList = false;
                            }
                            res.data.data.homework[i].create_time = formate.formatTime(new Date(res.data.data.homework[i].create_time * 1000));
                            res.data.data.homework[i].thumb_person = res.data.data.homework[i].thumb_person.split(',');
                            for (let j = 0; j < res.data.data.homework[i].image.length; j++) {
                                res.data.data.homework[i].image[j].url = formate.rect(res.data.data.homework[i].image[j].url, 100, 100)
                            }
                        }
                    }
                    // 更多
                    if(res.data.data.homework.length >= 10){
                        that.setData({
                            btnText: 1,
                        })
                    }else{
                        that.setData({
                            btnText: 0,
                        })
                    }
                    that.setData({
                        homeWorkData: res.data.data,
                        homeList: res.data.data.homework,
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    // 获取点赞列表
    getZanList:function(){
        let that = this;
        getApp().request({
            url: 'punch_course/student_thumb',
            data: {
                student_id: that.data.userId,
                page: that.data.zanPage,
            },
            method: 'get',
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

                    if (res.data.data.list.length > 0) {
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = formate.formatTime(new Date(res.data.data.list[i].create_time * 1000));
                        }
                    }
                    //更多
                    if(res.data.data.list.length >= 10){
                        that.setData({
                            btnText: 1,
                        })
                    }else{
                        that.setData({
                            btnText: 0,
                        })
                    }
                    that.setData({
                        zanList: res.data.data.list
                    })
                    wx.hideLoading()
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    //获取学员基本信息
    getBaseData:function(){
        let that = this;
        getApp().request({
            url: 'punch_course/student_home',
            data: {
                student_id: that.data.userId
            },
            method: 'get',
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
                    res.data.data.avatar_url = formate.rect(res.data.data.avatar_url, 75, 75)
                    that.setData({
                        baseInfo: res.data.data,
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    }
})