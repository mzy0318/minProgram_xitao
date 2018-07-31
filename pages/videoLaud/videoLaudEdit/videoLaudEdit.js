let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startDate:'',
        endDate:'',
        startTime: '',
        endTime:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let currentDate = new Date().valueOf()+604800000;
        // 开始日期  截止日期
        that.setData({
            startDate: format.formatDate(new Date()),
            endDate: format.formatDate(new Date(currentDate)),
            startTime: format.formatDate(new Date()),
            endTime: format.formatDate(new Date(currentDate)),
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
    // 获取日期
    getDate:function(e){
        let that = this;
        if (Number(e.target.dataset.id) == 0){
            // 开始日期
            that.setData({
                startDate: e.detail.value,
            })
        } else if (Number(e.target.dataset.id) == 1){
            // 结束日期
            that.setData({
                endDate: e.detail.value,
            })
        }
    }
})