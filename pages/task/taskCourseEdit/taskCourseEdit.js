// pages/task/taskCourseEdit/taskCourseEdit.js
let formate = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startDate: '',
        endDate: '',
        pageHeight: '', //页面高度
        isTeacher: true,
        isStatus: true,
        isEdit: '', // 编辑还是发布
        actId: '',
        statusList: ['默认可以查看其他学员的作业', '必须提交作业后才能显示作业', '提交作业后只能课程老师可见'],
        status: '',
        statusId: '',
        teacherList: '',
        teacher: [],
        teacherId: [],
        pageData: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            isEdit: Number(options.isEdit),
        })
        if (that.data.isEdit) {
            // 编辑
            that.setData({
                actId: options.actId,
            })
            wx.setNavigationBarTitle({
                title: '编辑课程内容',
            })
            getApp().request({
                url: 'org/punch_course/add',
                data: {
                    id: that.data.actId,
                },
                method: 'get',
                success: function(res) {
                    if (Number(res.data.code) == 1) {
                        let teacher = that.data.teacher;
                        let teacherId = that.data.teacherId;
                        if (res.data.data.teachers.length>0){
                            for (let i = 0; i < res.data.data.course.teachers.length;i++){
                                teacher.push(res.data.data.course.teachers[i].realname)
                                teacherId.push(res.data.data.course.teachers[i].id)
                            }
                        }
                        res.data.data.course.start_time = formate.formatDate(new Date(res.data.data.course.start_time * 1000))
                        res.data.data.course.end_time = formate.formatDate(new Date(res.data.data.course.end_time * 1000))
                        that.setData({
                            pageData: res.data.data.course,
                            startDate: res.data.data.course.start_time,
                            endDate: res.data.data.course.end_time,
                            teacher: teacher,
                            teacherId: teacherId,
                            statusId: res.data.data.course.status,
                            status: that.data.statusList[res.data.data.course.status],
                        })
                    }
                }
            })
        } else {
            let startDate = new Date().valueOf();
            let endDate = new Date().valueOf() + 604800000;

            //发布一个课程
            wx.setNavigationBarTitle({
                title: '发布课程',
            })
            that.setData({
                status: that.data.statusList[0],
                statusId:0,
            })
            that.setData({
                startDate: formate.formatDate(new Date(startDate)),
                endDate: formate.formatDate(new Date(endDate)),
            })
        }

        // 获取教师列表
        getApp().request({
            url: 'org/punch_course/add',
            data: '',
            method: 'get',
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    that.setData({
                        teacherList: res.data.data.teachers
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
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
            pageHeight: Number(wx.getStorageSync('devHeight'))
        })
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    //显示老师列表
    showTeacher: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.is) == 0) {
            that.setData({
                isTeacher: true,
            })
        } else if (Number(e.currentTarget.dataset.is) == 1) {
            that.setData({
                isTeacher: false,
            })
        }
    },
    //获取教师
    getTeacher: function(e) {
        let that = this;
        let teacher = that.data.teacher;
        let teacherId = that.data.teacherId;

        if (teacherId.includes(e.currentTarget.dataset.info.id)) {
            return
        } else {
            teacher.push(e.currentTarget.dataset.info.realname);
            teacherId.push(e.currentTarget.dataset.info.id);
            that.setData({
                teacher: teacher,
                teacherId: teacherId
            })
        }

    },
    //删除教师
    delTeacher: function(e) {
        let that = this;
        let teacher = that.data.teacher;
        let teacherId = that.data.teacherId;
        wx.showModal({
            title: '',
            content: '您是否删除',
            success: function(res) {
                if (res.confirm) {

                    teacher.splice(e.currentTarget.dataset.index, 1);
                    teacherId.splice(e.currentTarget.dataset.index, 1);

                    that.setData({
                        teacher: teacher,
                        teacherId: teacherId
                    })
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    //显示状态列表
    showStatus: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.is) == 0) {
            that.setData({
                isStatus: true,
            })
        } else if (Number(e.currentTarget.dataset.is) == 1) {
            that.setData({
                isStatus: false,
            })
        }
    },
    //切换状态
    switchStatus: function(e) {
        let that = this;
        that.setData({
            status: that.data.statusList[e.currentTarget.dataset.index],
            statusId: e.currentTarget.dataset.index,
            isStatus: true,
        })
    },
    //获取时间
    getTime: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //开始日期
            that.setData({
                startDate: e.detail.value
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //结束日期
            that.setData({
                endDate: e.detail.value
            })
        }
    },
    // 保存一个课程
    addCourse: function(e) {

        let that = this;
        let sendData = e.detail.value;
        let title = '';
        let titleEnd = ''

        sendData['start_time'] = that.data.startDate;
        sendData['end_time'] = that.data.endDate;
        sendData['status'] = that.data.statusId;

        if (that.data.teacherId.length > 0) {
            for (let i = 0; i < that.data.teacherId.length; i++) {
                sendData['teachers[' + i + ']'] = that.data.teacherId[i];
            }
        }


        if (that.data.isEdit == 1) {
            sendData['id'] = that.data.actId;
            title = '正在保存编辑';
            titleEnd = '保存成功';
        } else if (that.data.isEdit == 0) {
            sendData['id'] = '';
            title = '正在保存';
            titleEnd = '保存成功'
        }

        getApp().request({
            url: 'org/punch_course/add',
            data: sendData,
            method: 'post',
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: title,
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)

                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: titleEnd,
                            icon: 'success',
                            success: function() {
                                wx.navigateBack({})
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
    }
})