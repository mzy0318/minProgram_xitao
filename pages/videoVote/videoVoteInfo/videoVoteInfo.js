// pages/videoVote/videoVoteInfo/videoVoteInfo.js
let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId:'',
        pageData:'',
        contentIndex:0,
        optData:[
            {
                name:'活动介绍'
            },{
                name: '最新参赛'
            },{
                name: '投票排行'
            },{
                name: 'TOP10'
            }
        ],
        isActive:false,
        isTop:true,
        isRank:true,
        isJoin:true,
        topList:'',
        rangeList:'',
        newList:'',
        enCodeImage:'',
        isTitleOne: true,
        isTitleTwo: true,
        isTitleThree: true,
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let url = 'pages/videoVote/videoVoteInfo/videoVoteInfo';
        let scene = 'actId=' + options.actId;
        that.setData({
            actId:options.actId,
            enCodeImage: getApp().getEncodeImage(url, scene),
        })
        getApp().request({
            url:'visitor_video_vote',
            data:{
                id: that.data.actId,
            },
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    res.data.data.enlist_end_time = formatTime.formatTime(new Date(res.data.data.enlist_end_time * 1000));
                    res.data.data.enlist_start_time = formatTime.formatTime(new Date(res.data.data.enlist_start_time * 1000));
                    res.data.data.vote_end_time = formatTime.formatTime(new Date(res.data.data.vote_end_time * 1000));
                    res.data.data.vote_start_time = formatTime.formatTime(new Date(res.data.data.vote_start_time*1000));
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
                        pageData:res.data.data
                    })
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
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
    showContent:function(e){
        let that = this;
        that.setData({
            contentIndex: e.currentTarget.dataset.index
        })
        if (Number(that.data.contentIndex) == 0){
            // 活动介绍
            that.setData({
                isActive:false,
                isTop:true,
                isRank: true,
                isJoin: true,
            })
        } else if (Number(that.data.contentIndex) == 1){
            // 最新参赛
            that.setData({
                isActive: true,
                isTop:true,
                isRank: true,
                isJoin: false,
            })
            wx.showLoading({
                title: '',
            })
            getApp().request({
                url:'video_vote_latest_joiner',
                data:{
                    act_video_vote_id: that.data.actId,
                    page: 1,
                },
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        that.setData({
                            newList:res.data.data.list
                        })
                        wx.hideLoading();
                    } else if (Number(res.data.code) == 0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none'
                        })
                    }
                }
            })
        } else if (Number(that.data.contentIndex) == 2){
            // 投票排行
            that.setData({
                isActive: true,
                isTop: true,
                isRank: false,
                isJoin: true,
            })
            wx.showLoading({
                title: '',
            })
            getApp().request({
                url: 'video_vote_range_joiner',
                data: {
                    act_video_vote_id: that.data.actId,
                    page: 1,
                },
                method: 'post',
                success: function (res) {
                    if(Number(res.data.code) == 1){
                        that.setData({
                            rangeList:res.data.data.list,
                        })
                        wx.hideLoading();
                    } else if (Number(res.data.code) == 0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                    }

                }
            })
        } else if (Number(that.data.contentIndex) == 3){
            // top10
            that.setData({
                isActive: true,
                isTop: false,
                isRank: true,
                isJoin: true,
            })
            wx.showLoading({
                title: '',
            })
            getApp().request({
                url:'video_vote_top_joiner',
                data:{
                    act_video_vote_id:that.data.actId,
                },
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        that.setData({
                            topList: res.data.data.list
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 2){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none'
                        })
                    }
                }
            })
        }
    },
    toIndex:function(){
        getApp().toIndex()
    },
    toInfo:function(e){
        let that = this;
        wx.navigateTo({
            url: '../videoVoteUserInfo/videoVoteUserInfo?joinId=' + e.currentTarget.dataset.id,
        })
    }
})