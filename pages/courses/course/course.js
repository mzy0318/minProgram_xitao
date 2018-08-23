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
        pageNum:1,
        isHot:true,
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            lessonClassName: app.globalData.lessonClassName
        })
        getApp().request({
            url: 'recruit/sale_lesson/sale_lesson_list',
            data: {
                page: that.data.pageNum,
            },
            success: res => {
                if (res.data.data.host_lesson.length <= 0){
                    that.setData({
                        isHot:true,
                    })
                }else{
                    that.setData({
                        isHot: false,
                    })
                }
                if (res.data.data.lesson.length >= 10){
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
                    courseData: res.data.data,
                    lessonData: res.data.data.lesson,
                })
                wx.setStorageSync('lessonAllData', res.data.data.lesson);
                let lessonClassData = res.data.data.catalog;
                lessonClassData.unshift({ 'id': 0, 'name': '全部' });
                that.setData({
                    lessonClassData: lessonClassData,
                })

            }
        })
        that.setData({
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
    // onShareAppMessage: function () {
    // },
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
    //筛选课程
    toCourseNav: function (e) {
        let that = this;
        that.setData({
            classId: e.currentTarget.dataset.index,
            pageNum:1
        })

        wx.setStorageSync('classId', e.currentTarget.dataset.index)
        if (e.currentTarget.dataset.index == 0){
            getApp().request({
                url: 'recruit/sale_lesson/sale_lesson_list',
                data: {
                    page: that.data.pageNum,
                },
                success: res => {
                    if (res.data.data.lesson.length >= 10) {
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
                    this.setData({
                        courseData: res.data.data,
                        lessonData: res.data.data.lesson,
                    })
                    wx.setStorageSync('lessonAllData', res.data.data.lesson);
                    let lessonClassData = res.data.data.catalog;
                    lessonClassData.unshift({ 'id': 0, 'name': '全部' });
                    that.setData({
                        lessonClassData: lessonClassData,
                    })

                }
            })
        }else{
            getApp().request({
                url: 'recruit/sale_lesson/sale_lesson_list',
                data: {
                    page: that.data.pageNum,
                    catalog_id: e.currentTarget.dataset.index
                },
                success: res => {
                    if (res.data.data.lesson.length >= 10) {
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
                        lessonData: res.data.data.lesson,
                    })
                    wx.setStorageSync('lessonAllData', res.data.data.lesson);
                }
            })
        }


        if (e.currentTarget.dataset.name == '全部') {
            that.setData({
                lessonClassName:'课程筛选'
            })
        } else {
            that.setData({
                lessonClassName: e.currentTarget.dataset.name
            })
        }
        that.setData({
            isShow:true
        })
    },
    // 返回
    toCourse: function () {
        let that = this;
        that.setData({
            isShow: true
        })
    },
    //清空
    toClearCourse: function () {
        let that = this;
        wx.removeStorageSync('lessonData');
        that.setData({
            lessonClassName: '课程筛选',
            classId:0,
        })
        wx.setStorageSync('classId', 0);
        getApp().request({
            url: 'recruit/sale_lesson/sale_lesson_list',
            data: {
                page:1
            },
            success: res => {
                if (res.data.data.host_lesson.length <= 0) {
                    that.setData({
                        isHot: true,
                    })
                } else {
                    that.setData({
                        isHot: false,
                    })
                }
                if (res.data.data.lesson.length >= 10) {
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
                    courseData: res.data.data,
                    lessonData: res.data.data.lesson
                })
                wx.setStorageSync('lessonAllData', res.data.data.lesson);
            }
        })
        that.setData({
            isShow: true
        })
    },
    //更多数据
    moreData:function(e){
        let that = this;
        let lessonData = [];
        let index = wx.getStorageSync('classId');
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            lessonData.push(...that.data.lessonData)
            that.setData({
                pageNum: that.data.pageNum + 1
            })
            if (index == 0){
                getApp().request({
                    url: 'recruit/sale_lesson/sale_lesson_list',
                    data: {
                        page: that.data.pageNum,
                    },
                    success: res => {
                        lessonData.push(...res.data.data.lesson)
                        if (lessonData.length >= that.data.pageNum*10) {
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
                        this.setData({
                            courseData: res.data.data,
                            lessonData: lessonData,
                        })
                        wx.setStorageSync('lessonAllData', res.data.data.lesson);
                        let lessonClassData = res.data.data.catalog;
                        lessonClassData.unshift({ 'id': 0, 'name': '全部' });
                        that.setData({
                            lessonClassData: lessonClassData,
                        })
                    }
                })
            }else{
                getApp().request({
                    url: 'recruit/sale_lesson/sale_lesson_list',
                    data: {
                        page: that.data.pageNum,
                        catalog_id: index,
                    },
                    success: res => {

                        lessonData.push(...res.data.data.lesson)
                        if (lessonData.length >= that.data.pageNum * 10) {
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
                            lessonData: lessonData,
                        })
                        wx.setStorageSync('lessonAllData', res.data.data.lesson);
                    }
                })
            }
        }
    },
})