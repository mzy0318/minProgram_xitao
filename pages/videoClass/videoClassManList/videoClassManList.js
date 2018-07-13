// pages/videoClass/videoClassManList/videoClassManList.js
let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isOptions: true,
        pageData: '',
        pageNum: 1,
        actId: '',
        actTag: '',
        title: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { },

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
        that.getData(that.data.pageNum)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        let that = this;
        that.setData({
            isOptions: true,
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        let that = this;
        that.setData({
            isOptions: true,
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
            pageNum: 1
        })
        that.getData(that.data.pageNum)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageData = [];
        pageData.push(...that.data.pageData);
        if (that.data.pageData.length >= that.data.pageNum * 10) {
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            that.getData(that.data.pageNum)
        } else {
            return false
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    showOpt: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //显示菜单
            that.setData({
                isOptions: false,
                actId: e.currentTarget.dataset.actid,
                title: e.currentTarget.dataset.title,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //菜单隐藏
            that.setData({
                isOptions: true
            })
        } else if (Number(e.currentTarget.dataset.id) == 3) {
            //返回
            wx.navigateBack({})
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //新建视频
            wx.navigateTo({
                url: '../videoClassEdit/videoClassEdit?actId=undefined&isEdit=0',
            })
        }
    },
    actOption: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //编辑
            wx.navigateTo({
                url: '../videoClassEdit/videoClassEdit?actId=' + that.data.actId + '&isEdit=1',
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //删除
            getApp().request({
                url: 'org/delete_video_class',
                data: {
                    id: that.data.actId,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {

                        wx.showLoading({
                            title: '正在删除',
                            mask: true,
                        })
                        setTimeout(closeLogin, 1500)

                        function closeLogin(){
                            wx.hideLoading()
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                success: function () {
                                    wx.redirectTo({
                                        url: '../videoClassManList/videoClassManList',
                                    })
                                }
                            })
                        }
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //查看
            wx.navigateTo({
                url: '../videoClassInfo/videoClassInfo?actId=' + that.data.actId,
            })
        } else if (Number(e.currentTarget.dataset.id) == 3) {
            //分享
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?title=' + that.data.title + '&actId=' + that.data.actId +'&page=pages/videoClass/videoClassInfo/videoClassInfo',
            })
        }
    },
    //请求数据
    getData: function (num) {
        let that = this;
        getApp().request({
            url: 'visitor_video_class_list',
            data: {
                tag: '',
                catalog: '',
                page: num,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].create_time = formatTime.formatDate(new Date(res.data.data.list[i].create_time * 1000))
                    }
                    that.setData({
                        pageData: res.data.data.list
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