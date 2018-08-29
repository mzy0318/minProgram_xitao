// pages/goodLesson/goodLessonPeople/goodLessonPeople.js
let getTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId:'',
        pageData:'',
        personInfo:'',
        isPersonInfo:true,
        showTitle:true,
        pageNum:1,
        btnText: 0
    }, 

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actId: options.id,
        });
        that.getPageData()
        
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
        let that = this;
        that.setData({
            pageNum:1
        })
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
    // onShareAppMessage: function() {

    // },
    tellPhone:function(e){
        getApp().tellPhone(e)
    },
    toPriceListInfo:function(e){
        let that = this;
        that.setData({
            personInfo: that.data.pageData[Number(e.currentTarget.dataset.index)],
            isPersonInfo:false
        })
        console.log(that.data.personInfo)
    },
    hiddenInfo:function(){
        let that = this;
        that.setData({
            isPersonInfo: true
        })
    },
    toPricePerson:function(e){
        wx.navigateTo({
            url: '../lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    // 获取更多数据
    moreData:function(e){
        let that = this;
        let pageData = [];
        if (e.currentTarget.dataset.text == 0) {

        } else if (e.currentTarget.dataset.text == 1) {
            wx.showLoading({
                title: '正在加载...',
            })
            pageData.push(...that.data.pageData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            getApp().request({
                url: 'org/lesson_one_joiner_list',
                data: {
                    act_nice_id: that.data.actId,
                    page: that.data.pageNum,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        if (res.data.data.length > 0) {
                            for (let i = 0; i < res.data.data.length; i++) {
                                res.data.data[i].create_time = getTime.formatTime(new Date(res.data.data[i].create_time * 1000))
                            }
                        }
                        pageData.push(...that.data.pageData)
                        // 更多
                        if (pageData.length >= that.data.pageNum*10) {
                            that.setData({
                                btnText: 1
                            })
                        } else {
                            that.setData({
                                btnText: 0
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
                            icon: 'none'
                        })
                    }
                }
            })
        }
    },
    // 获取页面数据
    getPageData:function(){
        let that = this;
        getApp().request({
            url: 'org/lesson_one_joiner_list',
            data: {
                act_nice_id: that.data.actId,
                page: that.data.pageNum,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    if(res.data.data.length > 0){
                        for (let i = 0; i < res.data.data.length; i++) {
                            res.data.data[i].create_time = getTime.formatTime(new Date(res.data.data[i].create_time * 1000))
                        }
                    }
                    // 更多
                    if(res.data.data.length >= 10){
                        that.setData({
                            btnText:1
                        })
                    }else{
                        that.setData({
                            btnText: 0
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
                        icon: 'none'
                    })
                }
            }
        })
    },
})