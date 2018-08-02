Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
        bgColor:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        that.getCourseList();
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
            pageNum: 1
        });
        that.getCourseList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.pageData)
        if (that.data.pageData.length >= that.data.pageNum * 10){
            that.setData({
                pageNum: that.data.pageNum + 1,
            });
            getApp().request({
                url: 'org/punch_course/list',
                data: {
                    page: that.data.pageNum
                },
                method: 'get',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            if ((res.data.data.list[i].end_time*1000) > new Date().valueOf()) {
                                res.data.data.list[i].status = '进行中';
                                res.data.data.list[i].bgColor = '#336799';
                            } else {
                                res.data.data.list[i].status = '已结束'
                                res.data.data.list[i].bgColor = '#7b7b7b';
                            }
                        }
                        pageDataArr.push(...res.data.data.list)
                        that.setData({
                            pageData: pageDataArr,
                        })
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }else{
            wx.showToast({
                title: '到底啦',
                icon: 'none'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    optionsBtn:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //邀请学员
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?title=' + e.currentTarget.dataset.title + '&actId=' + e.currentTarget.dataset.actid + '&page=pages/task/taskUserListInfo/taskUserListInfo&actTag=' + e.currentTarget.dataset.acttag,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //打卡日历
            wx.navigateTo({
                url: '../taskDate/taskDate?courseId=' + e.currentTarget.dataset.courseid + '&timeString=' + e.currentTarget.dataset.timestring + '&title=' + e.currentTarget.dataset.title + '&pwd=' + e.currentTarget.dataset.pwd,
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            //编辑课程
            wx.navigateTo({
                url: '../taskCourseEdit/taskCourseEdit?isEdit=1&actId=' + e.currentTarget.dataset.actid,
            })
        } else if (Number(e.currentTarget.dataset.id) == 3) {
            //删除课程
            getApp().request({
                url:'org/punch_course/delete',
                data:{
                    id: e.currentTarget.dataset.actid
                },
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        wx.showToast({
                            title: '删除成功',
                            icon:'success',
                            success:function(){
                                wx.redirectTo({
                                    url: '../taskManList/taskManList',
                                })
                            }
                        })
                    }
                }
            })
        } 
    },
    // 作业详情页面
    toInfo:function(e){
        wx.navigateTo({
            url: '../taskUserListInfo/taskUserListInfo?courseId=' + e.currentTarget.dataset.courseid + '&isDate=0&pwd=' + e.currentTarget.dataset.pwd + '&endTime=' + e.currentTarget.dataset.endtime + '&startTime=' + e.currentTarget.dataset.starttime + '&title=' + e.currentTarget.dataset.title,
        })
    },
    // 搜索
    inputkey:function(e){
        let that = this;
        that.setData({
            pageNum:1
        })
        that.getCourseList(e.detail.value)
    },
    // 获取课程列表
    getCourseList:function(title){
        let that = this;
        getApp().request({
            url: 'org/punch_course/list',
            data: {
                page: that.data.pageNum,
                title:title||'',
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        if ((res.data.data.list[i].end_time*1000) > new Date().valueOf()) {
                            res.data.data.list[i].status = '进行中';
                            res.data.data.list[i].bgColor = '#336799';
                        } else {
                            res.data.data.list[i].status = '已结束';
                            res.data.data.list[i].bgColor = '#7b7b7b';
                        }
                    }
                    that.setData({
                        pageData: res.data.data.list
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