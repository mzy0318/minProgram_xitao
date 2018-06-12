// pages/courseClass/courseClass.js
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        lessonClassData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            lessonClassData: wx.getStorageSync('lessonClassData'),
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
    toCourse: function () {
        wx.navigateBack({

        })
    },
    toCourseNav:function(e){
        let arr = [];
        let lessonAllData =  wx.getStorageSync('lessonAllData')        
        for (let i = 0; i < lessonAllData.length;i++){

            if (lessonAllData[i].lesson_catalog_id == e.currentTarget.dataset.id){

                arr.push(lessonAllData[i]);
            }
        }
        wx.setStorageSync('lessonData', arr);
        app.globalData.lessonClassName = e.currentTarget.dataset.name
        wx.navigateTo({
            url: '../course/course',
        })
    },
    toClearCourse:function(){
        wx.removeStorageSync('lessonData');
        app.globalData.lessonClassName = '课程筛选';
        wx.navigateTo({
            url: '../course/course',
        })
    }
})