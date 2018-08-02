// pages/task/taskManSet/taskManSet.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:[
            {
                title:'您可以发布课程和作业',
                btnOpt:[
                    {
                        name:'发布课程',
                        id:1
                    },{
                        name: '课程管理',
                        id: 2
                    }
                ],
            },{
                title: '邀请老师,让所有老师参与进来',
                btnOpt: [
                    {
                        name: '邀请老师',
                        id: 3,
                    }, {
                        name: '老师管理',
                        id:4,
                    }
                ],
            },{
                title: '对学员进行管理',
                btnOpt: [
                    {
                        name: '学员管理',
                        id: 5
                    }, {
                        name: '积分设置',
                        id: 6
                    }
                ],
            }
        ],
        isTeacher:true,
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
        let isTeacher = wx.getStorageSync('isTeacher');
        if(isTeacher == 1){
            that.setData({
                isTeacher: false,
            })
        } else if (isTeacher == 0){
            that.setData({
                isTeacher: true,
            })
        }
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
    optionsBtn:function(e){
        if (Number(e.currentTarget.dataset.id) == 1){
            //发布课程
            wx.navigateTo({
                url: '../taskCourseEdit/taskCourseEdit?isEdit=0',
            })
        } else if (Number(e.currentTarget.dataset.id) == 2){
            //课程管理
            wx.navigateTo({
                url: '../taskManList/taskManList',
            })
        } else if (Number(e.currentTarget.dataset.id) == 3){
            //邀请老师
            wx.navigateTo({
                url: '../taskInviTeacher/taskInviTeacher?isIndex=0',
            })
        } else if (Number(e.currentTarget.dataset.id) == 4){
            //老师管理
            wx.navigateTo({
                url: '../taskTeacherList/taskTeacherList?role=teacher',
            })
        } else if (Number(e.currentTarget.dataset.id) == 5){
            //学员管理
            wx.navigateTo({
                url: '../taskTeacherList/taskTeacherList?role=student',
            })
        } else if (Number(e.currentTarget.dataset.id) == 6){
            //积分设置
            wx.navigateTo({
                url: '../taskFractionEdit/taskFractionEdit',
            })
        } else if (Number(e.currentTarget.dataset.id) == 7){
            //设置我的资料
            let teacherId = wx.getStorageSync('teacherId')
            wx.navigateTo({
                url: '../taskTeacherEdit/taskTeacherEdit?isEdit=1&userId=' + teacherId,
            })
        }
    }
})