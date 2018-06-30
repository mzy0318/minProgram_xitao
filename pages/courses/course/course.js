// pages/course/course.js

let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseData:null,
        lessonClassName: '',
        lessonData: wx.getStorageSync('lessonData'),
        isShow:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        this.setData({
            lessonClassName: app.globalData.lessonClassName
        })
        if (app.globalData.lessonClassName != '全部'){
            that.setData({
                lessonData: wx.getStorageSync('lessonAllData')
            })
        }else {
            getApp().request({
                url: 'recruit/sale_lesson/sale_lesson_list',
                data: {},
                success: res => {
                    this.setData({
                        courseData: res.data.data,
                        lessonData: res.data.data.lesson
                    })
                    wx.setStorageSync('lessonAllData', res.data.data.lesson)
                }
            })
        }
        getApp().request({
            url: 'recruit/sale_lesson/sale_lesson_list',
            data: {},
            success: res => {
                this.setData({
                    courseData: res.data.data,
                    lessonData: res.data.data.lesson
                })
                wx.setStorageSync('lessonAllData', res.data.data.lesson)
            }
        })
        let lessonClassData = wx.getStorageSync('lessonClassData');
        lessonClassData.unshift({ 'id': 0, 'name': '全部' });
        this.setData({
            lessonClassData: lessonClassData,
            classId: wx.getStorageSync('classId')
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
    toCourseClass: function () {
        let that = this;
        wx.setStorageSync('lessonClassData', this.data.courseData.catalog)
        that.setData({
            isShow:false
        })
    },
    toCourseInfo:function(e){
        wx.removeStorageSync('lessonInfo', e.currentTarget.dataset.lessoninfo)
        wx.navigateTo({
            url: '../courseInfo/courseInfo?id=' + e.currentTarget.dataset.id,
        })
    },
    toCourseNav: function (e) {
        let that = this;
        that.setData({
            classId: e.currentTarget.dataset.index,
        })
        wx.setStorageSync('classId', e.currentTarget.dataset.index)
        // let index = e.currentTarget.dataset.index
        let arr = [];

        let lessonAllData = wx.getStorageSync('lessonAllData');

        for (let i = 0; i < lessonAllData.length; i++) {

            if (lessonAllData[i].lesson_catalog_id == e.currentTarget.dataset.id) {

                arr.push(lessonAllData[i]);
            }
        }
        wx.setStorageSync('lessonData', arr);

        if (e.currentTarget.dataset.name == '全部') {
            that.setData({
                lessonClassName:'课程筛选'
            })
            // app.globalData.lessonClassName = '课程筛选'
        } else {
            that.setData({
                lessonClassName: e.currentTarget.dataset.name
            })
            // app.globalData.lessonClassName = e.currentTarget.dataset.name
        }
        that.setData({
            isShow:true
        })
    },
    toCourse: function () {
        let that = this;
        // wx.setStorageSync('classId', 0)
        // 
        that.setData({
            isShow: true
        })
    },
    toClearCourse: function () {
        let that = this;
        wx.removeStorageSync('lessonData');
        // app.globalData.lessonClassName = '课程筛选';
        that.setData({
            lessonClassName: '课程筛选',
            classId:0,
        })
        wx.setStorageSync('classId', 0);
        // wx.navigateTo({
        //     url: '../course/course',
        // })
        // wx.navigateBack({})
        getApp().request({
            url: 'recruit/sale_lesson/sale_lesson_list',
            data: {},
            success: res => {
                that.setData({
                    courseData: res.data.data,
                    lessonData: res.data.data.lesson
                })
                wx.setStorageSync('lessonAllData', res.data.data.lesson)
            }
        })
        that.setData({
            isShow: true
        })
    }
})