// pages/task/taskUserList/taskUserList.js
let formate = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum:1,
        pageData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
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
        let that = this;
        that.getDataList()
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
        let that = this;
        that.setData({
            pageNum:1
        })
        that.getDataList()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageData = [];
        pageData.push(...that.data.pageData)
        if(that.data.pageData.length >= that.data.pageNum*10){
            that.setData({
                pageNum:that.data.pageNum + 1
            })
            getApp().request({
                url: 'punch_course/list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'get',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        let list = res.data.data.list
                        if (list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].end_time * 1000 > new Date().valueOf()) {
                                    list[i].status = '进行中';
                                    list[i].bgColor = '#336799'
                                } else {
                                    list[i].status = '已结束';
                                    list[i].bgColor = '#7b7b7b'
                                }
                            }
                        }
                        pageData.push(...list)
                        that.setData({
                            pageData: pageData,
                        })
                    }
                }
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    //   onShareAppMessage: function () {

    //   }
    optToInfo: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //排行榜
            wx.navigateTo({
                url: '../taskRankList/taskRankList?courseId=' + e.currentTarget.dataset.courseid,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //邀请好友
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?title=' + e.currentTarget.dataset.title + '&actId=' + e.currentTarget.dataset.actid + '&page=pages/task/taskUserListInfo/taskUserListInfo&actTag=' + e.currentTarget.dataset.acttag,
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //打卡日历
            wx.navigateTo({
                url: '../taskDate/taskDate?courseId=' + e.currentTarget.dataset.courseid + '&timeString=' + e.currentTarget.dataset.timestring + '&title=' + e.currentTarget.dataset.title + '&pwd=' + e.currentTarget.dataset.pwd,
            })
        }
    },
    toInfo: function (e) {
        wx.navigateTo({
            url: '../taskUserListInfo/taskUserListInfo?courseId=' + e.currentTarget.dataset.courseid + '&isDate=0&pwd=' + e.currentTarget.dataset.pwd + '&endTime=' + e.currentTarget.dataset.endtime + '&startTime=' + e.currentTarget.dataset.starttime + '&title=' + e.currentTarget.dataset.title,
        })
    },
    getDataList:function(){
        let that = this;
        getApp().request({
            url: 'punch_course/list',
            data: {
                page: that.data.pageNum,
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
                    let list = res.data.data.list
                    if (list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].end_time * 1000 > new Date().valueOf()) {
                                list[i].status = '进行中';
                                list[i].bgColor = '#336799'
                            } else {
                                list[i].status = '已结束';
                                list[i].bgColor = '#7b7b7b'
                            }
                        }
                    }
                    that.setData({
                        pageData: list,
                    })
                }
            }
        })
    }
})