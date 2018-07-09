// pages/manageCenters/manageCenter/manageCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        islogin:'block',
        isContent:'none',
        versionData:'',
        pageManagData:[
            {
                name:'更换模板',
                iconfont: 'iconfont icon-genghuanpifu iconSize',
                color:'#1196DB',
                url: '../../baseOptions/schoolModel/schoolModel',
            },
            //{
            //     name: '打卡作业',
            //     iconfont: 'iconfont icon-job-task iconSize',
            //     color: '#870E04',
            //     url: '../schoolEdit/schoolEdit',
            // }
            {
                name: '学校简介',
                iconfont: 'iconfont icon-xuexiao iconSize',
                color: '#1196DB',
                url:'../schoolEdit/schoolEdit',
            },
        ],
        pageStuData:[
            {
                name: '私人拼团',
                iconfont: 'iconfont icon-pintuan iconStyle',
                background:'#E3465B',
                url: 'org/personal_group_list',
                pageType:1
            },{
                name: '一元上好课',
                iconfont: 'iconfont icon-yiyuanchoujiang iconStyle',
                background: '#FD9D22',
                url: 'org/bargain_list',
                pageType: 2
            },
            // {
            //     name: '视频点赞',
            //     iconfont: 'iconfont icon-aixin iconStyle',
            //     background: '#84D23E',
            //     url: 'org/bargain_list',
            //     pageType: 3
            // },
            {
                name: '帮我砍学费',
                iconfont: 'iconfont icon-kanjia iconStyle',
                background: '#00D4BE',
                url: 'org/bargain_list',
                pageType: 4
            },{
                name: '学员跟进',
                iconfont: 'iconfont icon-genjinjilu iconStyle',
                url: 'org/bargain_list',
                background: '#02AEA7',
                pageType:11,
            },
            // {
            //     name: '万人拼团',
            //     iconfont: 'iconfont icon-icon1 iconStyle',
            //     background: '#DE4037',
            //     url: 'org/bargain_list',
            //     pageType: 5
            // }, 
            // {
            //     name: '视频投票',
            //     iconfont: 'iconfont icon-zan1 iconStyle',
            //     background: '#8990FA',
            //     url: 'org/bargain_list',
            //     pageType: 6
            // }, 
            {
                name: '视频贺卡',
                iconfont: 'iconfont icon-meiguihua iconStyle',
                background: '#1196DB',
                url: 'org/video_card_list',
                pageType: 7
            }, {
                name: '活动报名',
                iconfont: 'iconfont icon-sign iconStyle',
                background: '#FF6766',
                url: 'org/bargain_list',
                pageType: 8
            }, 
            // {
            //     name: '微视频课堂',
            //     iconfont: 'iconfont icon-shipin1 iconStyle',
            //     background: '#FE7FC2',
            //     url: 'org/bargain_list',
            //     pageType: 9
            // }, 
            // {
            //     name: '视频作业',
            //     iconfont: 'iconfont icon-job-task iconStyle',
            //     background: '#84D23E',
            //     url: 'org/bargain_list',
            //     pageType: 10
            // }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;

        // if(wx.getStorageSync('loginCode')==1){
        //     this.setData({
        //         islogin: 'none',
        //     })
        // }else{
        //     wx.setNavigationBarTitle({
        //         title: '智慧招生小程序',
        //     })
        //     this.setData({
        //         islogin: 'block',
        //     })
        // }
        let version = wx.getExtConfigSync();
        that.setData({
            versionData: wx.getExtConfigSync(),
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
        if (wx.getStorageSync('loginCode') == 1) {
            this.setData({
                islogin: 'none',
                isContent:'block',
            })
        } else {
            wx.setNavigationBarTitle({
                title: '智慧招生小程序',
            })
            this.setData({
                islogin: 'block',
                isContent:'none'
            })
        }
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
    getPhone: function (e) {
        this.setData({
            phoneNum: e.detail.value,
        })
    },
    getPwd: function (e) {
        this.setData({
            pwdNum: e.detail.value,
        })
    },
    login: function (e) {
        let that = this;
        let senddata = e.detail.value
        if (senddata.phone == '') {
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none'
            })
        } else if (senddata.password == '') {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
        } else {
            getApp().request({
                url: 'login_org',
                data: senddata,
                method: 'post',
                success: res => {
                    wx.setStorageSync('loginCode', res.data.code)
                    if(Number(res.data.code)==1){
                        wx.setNavigationBarTitle({
                            title: '管理中心',
                        })
                        wx.showLoading({
                            title:'正在登录',
                            mask:true,
                        })
                        setTimeout(closeLogin,2000)
                        function closeLogin (){
                            wx.hideLoading()
                            wx.showToast({
                                title: '登录成功',
                            })
                            that.setData({
                                islogin: 'none',
                                isContent: 'block'
                            })
                        }
                    } else if (Number(res.data.code)==0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none'
                        })
                    }
                }
            })
        }
    },
    toManageActive:function(e){

        let pageType = e.currentTarget.dataset.pagetype

        wx.setStorageSync('pageType', pageType)
        
        if (pageType == '1' || pageType == '4'){
            wx.navigateTo({
                url: '../manageActive/manageActive?url=' + e.currentTarget.dataset.requireurl,
            })
        } else if (pageType == '2'){
            wx.navigateTo({
                url: '../../goodLesson/manLessonList/manLessonList?url=' + e.currentTarget.dataset.requireurl,
            })
        } else if (pageType == '11'){
            wx.navigateTo({
                url: '../../courses/courseUserList/courseUserList',
            })
        } else if (pageType == '7'){
            wx.navigateTo({
                url: '../../videos/manVideoList/manVideoList',
            })
        }else if(pageType=='8'){
            wx.navigateTo({
                url: '../../actReg/actRegManList/actRegManList',
            })
        }
    },
    toEditPage:function(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
})