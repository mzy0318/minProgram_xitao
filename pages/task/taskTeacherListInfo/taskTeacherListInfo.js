// pages/task/taskTeacherListInfo/taskTeacherListInfo.js
let formateTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        role: '',
        isStu: true,
        devHeight: '',
        isScore: true,
        scoreTitle: '',
        pageData: '',
        userId: '',
        url: '',
        scoreModel: '',
        scoreNum: '',
        note: '',
        scoreData: '',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        // 获取页面高度
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    devHeight: res.windowHeight
                })
            }
        })
        that.setData({
            role: options.role, //获取角色类型
            userId: options.userId
        })

        if (that.data.role == 'student') {
            // 学员
            that.setData({
                isStu: false,
                url: 'org/punch_course/student',
            })
            wx.setNavigationBarTitle({
                title: '查看学员资料',
            })
        } else if (that.data.role == 'teacher') {
            // 教师
            that.setData({
                isStu: true,
                url: 'org/punch_course/teacher',
            })
            wx.setNavigationBarTitle({
                title: '查看教师资料',
            })
        }

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
        that.getTeacherInfo();
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
    // onShareAppMessage: function() {

    // }
    bottomOpts: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //修改
            if (that.data.role == 'teacher') {
                wx.navigateTo({
                    url: '../taskTeacherEdit/taskTeacherEdit?isEdit=1&userId=' + e.currentTarget.dataset.userid,
                })
            } else if (that.data.role == 'student') {
                wx.navigateTo({
                    url: '../taskStudentEdit/taskStudentEdit?isEdit=1&userId=' + e.currentTarget.dataset.userid,
                })
            }
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //加积分
            that.setData({
                isScore: false,
                scoreTitle: '增加学员积分',
                scoreModel: 1,
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //减积分
            if (Number(that.data.pageData.score) <= 0) {
                wx.showToast({
                    title: '减少积分不能少于0',
                    icon: 'none'
                })
            } else {
                that.setData({
                    isScore: false,
                    scoreTitle: '减少学员积分',
                    scoreModel: 0,
                })
            }
        } else if (Number(e.currentTarget.dataset.id) == 3) {
            //主页
            wx.navigateTo({
                url: '../taskStuHome/taskStuHome?userId=' + that.data.userId,
            })
        }
    },
    //提交积分
    stuScore: function(e) {
        let that = this;
        let sendData = e.detail.value;
        if (that.data.scoreModel == 0) {
            //减积分
            let score = Math.abs(sendData.score);
            if (score > that.data.pageData.score) {
                wx.showToast({
                    title: '所减积分大于当前积分',
                    icon: 'none',
                })
                return
            } else {
                sendData.score = 0 - score;
            }

        } else if (that.data.scoreModel == 1) {
            //加积分
            let score = Math.abs(sendData.score);
        }

        sendData['student_id'] = that.data.userId;


        getApp().request({
            url: 'org/punch_course/student_score',
            data: sendData,
            method: 'post',
            success: function(res) {
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: '正在修改',
                        mask: true,
                    })
                    setTimeout(closeLogin, 1500)

                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '修改成功',
                            icon: 'success',
                            success: function() {
                                that.getTeacherInfo();
                                that.setData({
                                    isScore: true,
                                    note: '',
                                    scoreData: '',
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
    },
    scoreOpt: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //取消
            that.setData({
                isScore: true,
                scoreTitle: '',
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //确认
        }
    },
    //获取教师资料
    getTeacherInfo: function() {
        let that = this;
        getApp().request({
            url: that.data.url,
            data: {
                id: that.data.userId
            },
            method: 'get',
            success: function(res) {
                if (res.data.frozen == 1) {
                    that.setData({
                        isFrozen: 'frozen',
                    })
                } else {
                    that.setData({
                        isFrozen: 'empty',
                    })
                }
                if (Number(res.data.code) == 1) {
                    res.data.data.create_time = formateTime.formatTime(new Date(res.data.data.create_time * 1000));
                    res.data.data.avatar_url = formateTime.rect(res.data.data.avatar_url,100,100)
                    that.setData({
                        pageData: res.data.data
                    })
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