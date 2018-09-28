// pages/videoVote/videoVoteInfo/videoVoteInfo.js
let formatTime = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId: '',
        pageData: '',
        contentIndex: 0,
        optData: [{
            name: '活动介绍'
        }, {
            name: '最新参赛'
        }, {
            name: '投票排行'
        }, {
            name: 'TOP10'
        }],
        isActive: false,
        isTop: true,
        isRank: true,
        isJoin: true,
        topList: '',
        rangeList: '',
        newList: '',
        enCodeImage: '',
        isTitleOne: true,
        isTitleTwo: true,
        isTitleThree: true,
        className: 'infoInputWrap',
        isJoins: 'block',
        empty:'',
        contentIndex:'',
        rangePage:1,
        joinerPage:1,
        classNameR: 'moreData',
        btnTextR: '更多',
        classNameH: 'moreData',
        btnText: '更多',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let url = 'pages/videoVote/videoVoteInfo/videoVoteInfo';


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

        let scene = 'actId=' + that.data.actId;
        that.setData({
            enCodeImage: getApp().getEncodeImage(url, scene),
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
        let that = this;
        that.setData({
            contentIndex: 0,
            isActive: false,
            isTop: true,
            isRank: true,
            isJoin: true,
        })
        that.getPageData()
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
        that.getPageData()
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
            path: 'pages/index/index?pageId=14&actId=' + that.data.actId,
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    // 更多最新参赛数据
    getMoreData:function(e){
        let that = this;
        let newList = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            newList.push(...that.data.newList)
            that.setData({
                joinerPage: that.data.joinerPage + 1
            })
            getApp().request({
                url: 'video_vote_latest_joiner',
                data: {
                    act_video_vote_id: that.data.actId,
                    page: that.data.joinerPage,
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
                        newList.push(...res.data.data.list)
                        if (newList.length >= that.data.joinerPage * 10) {
                            that.setData({
                                classNameH: 'moreData',
                                btnText: '更多'
                            })
                        } else {
                            that.setData({
                                classNameH: 'moreDataed',
                                btnText: '没有了'
                            })
                        }
                        that.setData({
                            newList: newList
                        })
                        wx.hideLoading();
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        }
    },
    // 更多投票排行数据
    getRangeData:function(e){
        let that = this;
        let rangeList = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            rangeList.push(...that.data.rangeList)
            that.setData({
                rangePage: that.data.rangePage + 1
            })
            getApp().request({
                url: 'video_vote_range_joiner',
                data: {
                    act_video_vote_id: that.data.actId,
                    page: that.data.rangePage,
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
                        rangeList.push(...res.data.data.list)
                        if (rangeList.length >= that.data.rangePage * 10) {
                            that.setData({
                                classNameR: 'moreData',
                                btnTextR: '更多'
                            })
                        } else {
                            that.setData({
                                classNameR: 'moreDataed',
                                btnTextR: '没有了'
                            })
                        }
                        that.setData({
                            rangeList: rangeList,
                        })
                        wx.hideLoading();
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }

                }
            })
        }
    },
    showContent: function(e) {
        let that = this;
        that.setData({
            contentIndex: e.currentTarget.dataset.index,
        })
        if (Number(that.data.contentIndex) == 0) {
            // 活动介绍
            that.setData({
                isActive: false,
                isTop: true,
                isRank: true,
                isJoin: true,
                contentIndex:0
            })
        } else if (Number(that.data.contentIndex) == 1) {
            // 最新参赛
            let newList = [];
            that.setData({
                isActive: true,
                isTop: true,
                isRank: true,
                isJoin: false,
                contentIndex: 1,
                joinerPage:1,
            })
            wx.showLoading({
                title: '',
            })
            getApp().request({
                url: 'video_vote_latest_joiner',
                data: {
                    act_video_vote_id: that.data.actId,
                    page: that.data.joinerPage,
                },
                method: 'post',
                success: function(res) {
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
                        if (res.data.data.list.length >= 10){
                            that.setData({
                                classNameH: 'moreData',
                                btnText: '更多'
                            })
                        }else{
                            that.setData({
                                classNameH: 'moreDataed',
                                btnText: '没有了'
                            })
                        }
                        that.setData({
                            newList: res.data.data.list
                        })
                        wx.hideLoading();
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        } else if (Number(that.data.contentIndex) == 2) {
            // 投票排行
            that.setData({
                isActive: true,
                isTop: true,
                isRank: false,
                isJoin: true,
                contentIndex: 2,
                rangePage:1,
            })
            wx.showLoading({
                title: '',
            })
            getApp().request({
                url: 'video_vote_range_joiner',
                data: {
                    act_video_vote_id: that.data.actId,
                    page: that.data.rangePage,
                },
                method: 'post',
                success: function(res) {
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
                        if (res.data.data.list.length >= 10){
                            that.setData({
                                classNameR: 'moreData',
                                btnTextR: '更多'
                            })
                        }else{
                            that.setData({
                                classNameR: 'moreDataed',
                                btnTextR: '没有了'
                            })
                        }
                        that.setData({
                            rangeList: res.data.data.list,
                        })
                        wx.hideLoading();
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }

                }
            })
        } else if (Number(that.data.contentIndex) == 3) {
            // top10
            that.setData({
                isActive: true,
                isTop: false,
                isRank: true,
                isJoin: true,
                contentIndex: 3
            })
            wx.showLoading({
                title: '',
            })
            getApp().request({
                url: 'video_vote_top_joiner',
                data: {
                    act_video_vote_id: that.data.actId,
                },
                method: 'post',
                success: function(res) {
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
                        that.setData({
                            topList: res.data.data.list
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 2) {
                        wx.hideLoading();
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        }
    },
    toIndex: function() {
        getApp().toIndex()
    },
    toInfo: function(e) {
        let that = this;
        wx.navigateTo({
            url: '../videoVoteUserInfo/videoVoteUserInfo?joinId=' + e.currentTarget.dataset.id + '&actId=' + e.currentTarget.dataset.actid,
        })
    },
    toGetInfo: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 1) {
            //搜索
            wx.showLoading({
                title: '正在搜索',
            })
            getApp().request({
                url:'search_video_vote_joiner',
                data:{
                    key:e.detail.value.key,
                    act_video_vote_id:that.data.actId,
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
                            contentIndex:1,
                            isActive: true,
                            isTop: true,
                            isRank: true,
                            isJoin: false,
                            newList:res.data.data,
                            empty: '',
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.id) == 0) {
            //报名
            wx.navigateTo({
                url: '../videoVoteSignup/videoVoteSignup?isEdit=0&actId=' + that.data.actId,
            })
        }
    },
    //保存二维码到本地
    saveEncodeImage: function () {
        let that = this;
        wx.downloadFile({
            url: that.data.enCodeImage,
            success: function (res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (res) {
                        console.log(res)
                    }
                })
            }
        })
    },
    // 获取页面数据
    getPageData: function() {
        let that = this;
        getApp().request({
            url: 'visitor_video_vote',
            data: {
                id: that.data.actId,
            },
            method: 'post',
            success: function(res) {
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
                    if ((res.data.data.enlist_end_time * 1000) < new Date().valueOf()) {
                        that.setData({
                            isJoins: 'none',
                            className: 'infoInputWrap widthInput',
                        })
                    } else {
                        that.setData({
                            isJoins: 'block',
                            className: 'infoInputWrap',
                        })
                    }
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