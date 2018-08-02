// pages/task/taskInviTeacher/taskInviTeacher.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIndex:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            isIndex:options.isIndex
        })
        if(that.data.isIndex == 1){
            that.toJoinTeacher();
        } else if (that.data.isIndex == 0){
            
            return 
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
    onShareAppMessage: function() {
        return {
            path: 'pages/index/index?pageId=17'
        }
    },
    // 检测自己是否为老师
    toJoinTeacher: function() {
        let that = this;
        // 检测自己是否为教师
        getApp().request({
            url: 'punch_course/is_teacher',
            data: {},
            method: 'get',
            success: function(res) {
                let avatar_url = res.data.data.avatar_url;
                if (Number(res.data.code) == 1) {
                    wx.setStorageSync('isTeacher', 1)
                    wx.setStorageSync('teacherId', res.data.data.teacher_id)
                    if (res.data.data.is_teacher) {
                        wx.showModal({
                            title: '恭喜您,匹配成功',
                            content: '',
                            showCancel: false,
                            success: function(data) {
                                if (data.confirm) {
                                    wx.navigateBack({})
                                }
                            }
                        })
                    } else {
                        wx.setStorageSync('isTeacher', 0)
                        wx.navigateTo({
                            url: '../taskTeacherEdit/taskTeacherEdit?isEdit=0&url=' + avatar_url,
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