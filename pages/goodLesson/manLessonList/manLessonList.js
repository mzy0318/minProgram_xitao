// pages/goodLesson/manLessonList/manLessonList.js
var utils = require("../../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        that.setData({
            pageNum:1
        })
        that.loadData()
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
        that.loadData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
    // 删除活动
    delActive:function(e){
        let that = this;
        getApp().request({
            url:'org/delete_act',
            data:{
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.acttag
            },
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        success:function(){
                            that.loadData()
                        }
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    toLessonEdit:function(e){
        wx.navigateTo({
            url: '../../manageCenters/oneLessonEdit/oneLessonEdit?actNiceId=' + e.currentTarget.dataset.id,
        })
    },
    taBack:function(){
        wx.navigateBack({})
    },
    toLessonInfo:function(e){
        wx.navigateTo({
            url: '../lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    toLessonPeople:function(e){
        wx.navigateTo({
            url: '../goodLessonPeople/goodLessonPeople?id=' + e.currentTarget.dataset.id,
        })
    },
    sharePage:function(e){
        wx.navigateTo({
            url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/goodLesson/lessonListInfo/lessonListInfo&actTag=' + e.currentTarget.dataset.acttag,
        })
    },
    // 获取更多的数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            pageData.push(...that.data.push)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'org/lesson_one_list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        res.data.data = utils.map(res.data.data, function (one) {
                            one.cover.url = utils.rect(one.cover.url, 200, 100)
                            return one
                        })
                        pageData.push(...res.data.data)
                        if (pageData.length >= that.data.pageNum*10) {
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
                            pageData: res.data.data
                        })
                        wx.hideLoading()
                    } else if (Number(res.data.code) == 0) {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }
    },
    // 获取页面数据
    loadData: function () {
        let that = this
        getApp().request({
            url: 'org/lesson_one_list',
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    res.data.data = utils.map(res.data.data, function (one) {
                        one.cover.url = utils.rect(one.cover.url, 200, 100)
                        return one
                    })
                    if(res.data.data.length >= 10){
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
                        pageData: res.data.data
                    })
                    wx.stopPullDownRefresh()
                } else if (Number(res.data.code) == 0) {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
})