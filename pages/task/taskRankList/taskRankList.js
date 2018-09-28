// pages/task/taskRankList/taskRankList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        optNum: 0,
        isScore: true,//积分
        isInfo: true,
        isWork: false,
        isZan: true,//点赞
        courseId:'',
        jobPage:1,
        pageData:'',
        scorePage:1,
        model:0,
        zanPage:1,
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            courseId: options.courseId,
        })
        // 作业
        that.getJobRank();
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
        let that = this;
        if (that.data.model == 0){
            //作业
            let pageDataArr = [];
            pageDataArr.push(...that.data.pageData);
            if (that.data.pageData.length >= that.data.jobPage * 10){
                that.setData({
                    jobPage: that.data.jobPage + 1,
                })
                getApp().request({
                    url: 'punch_course/homework_rank',
                    data: {
                        punch_course_id: that.data.courseId,
                        page: that.data.jobPage,
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
                            wx.stopPullDownRefresh(),
                                wx.hideLoading(),
                                pageDataArr.push(...res.data.data.list)
                                that.setData({
                                    pageData: pageDataArr,
                                })
                        }
                    }
                })
            }
        } else if (that.data.model == 2){
            let pageDataArr = [];
            pageDataArr.push(...that.data.pageData);
            if (that.data.pageData.length >= that.data.scorePage * 10){
                that.setData({
                    scorePage: that.data.scorePage + 1,
                })
                getApp().request({
                    url: 'punch_course/score_rank',
                    data: {
                        punch_course_id: that.data.courseId,
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
                            wx.stopPullDownRefresh(),
                                wx.hideLoading(),
                                pageDataArr.push(...res.data.data.list)
                                that.setData({
                                    pageData: pageDataArr,
                                })
                        }
                    }
                })
            }
        } else if (that.data.model == 1){
            let pageDataArr = [];
            pageDataArr.push(...that.data.pageData);
            if (that.data.pageData.length >= that.data.zanPage * 10){
                that.setData({
                    zanPage: that.data.zanPage + 1,
                })
                getApp().request({
                    url: 'punch_course/thumb_rank',
                    data: {
                        punch_course_id: that.data.courseId,
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
                            wx.stopPullDownRefresh(),
                                wx.hideLoading(),
                                pageDataArr.push(...res.data.data.list)
                            that.setData({
                                pageData: pageDataArr,
                            })
                        }
                    }
                })
            }
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
    switchOpt: function (e) {
        let that = this;
        that.setData({
            optNum: Number(e.currentTarget.dataset.index),
        })
        if (Number(e.currentTarget.dataset.index) == 0) {
            //作业
            wx.showLoading({
                title: '正在加载',
            })
            that.setData({
                isScore: true,//积分
                isZan: true, //点赞
                isWork: false,//作业
                model: 0,
                jobPage:1,
            })
            that.getJobRank();

        } else if (Number(e.currentTarget.dataset.index) == 1) {
            //点赞
            wx.showLoading({
                title: '正在加载',
            })
            that.setData({
                isScore: true,//积分
                isZan: false,//点赞
                isWork: true,//作业
                isInfo: true,
                model: 1,
                zanPage:1,
            })
            that.getZanList()
        } else if (Number(e.currentTarget.dataset.index) == 2) {
            //积分
            wx.showLoading({
                title: '正在加载',
            })
            that.setData({
                isScore: false,//积分
                isZan: true,//点赞
                isWork: true,//作业
                isInfo: true,
                model: 2,
                scorePage:1,
            })
            that.getScoreList();
        }
    },
    // 获取作业列表
    getJobRank:function(e){
        let that = this;
        getApp().request({
            url:'punch_course/homework_rank',
            data:{
                punch_course_id: that.data.courseId,
                page: that.data.jobPage,
            },
            method:'get',
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
                    wx.stopPullDownRefresh()
                    wx.hideLoading()
                    that.setData({
                        pageData:res.data.data.list
                    })
                }
            }
        })
    },
    //获取积分列表
    getScoreList:function(e){
        let that = this;
        getApp().request({
            url:'punch_course/score_rank',
            data:{
                punch_course_id: that.data.courseId,
                page: that.data.scorePage,
            },
            method:'get',
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
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
                    wx.hideLoading()
                    that.setData({
                        pageData: res.data.data.list
                    })
                }
            }
        })
    },
    // 获取点赞列表
    getZanList:function(){
        let that = this;
        getApp().request({
            url: 'punch_course/thumb_rank',
            data: {
                punch_course_id: that.data.courseId,
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
                    wx.stopPullDownRefresh()
                        wx.hideLoading()
                        that.setData({
                            pageData: res.data.data.list
                        })
                }
            }
        })
    }
})