// pages/studentCenter/studentCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseData: [{
                name: '我的订单',
                iconfont: 'iconfont icon-zuoye iconStyle',
                background: '#A145AF',
                url: '../studentManage/orderList/orderList',
                pageTypeStu: 1,
            },
            {
                name: '预约试听',
                iconfont: 'iconfont icon-weibiaoti- iconStyle',
                background: '#FFCF0B',
                url: '../courses/stuCourseList/stuCourseList',
                pageTypeStu: 2,
            },
        ],
        pageStuData: [{
                name: '私人拼团',
                iconfont: 'iconfont icon-pintuan iconStyle',
                background: '#E3465B',
                url: '../killPrices/killPersonList/killPersonList',
                pageTypeStu: 3,
                tag: 'personal_group',
                show:'inline-block',
            },
            {
                name: '一元上好课',
                iconfont: 'iconfont icon-yiyuanchoujiang iconStyle',
                background: '#FD9D22',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 4,
                tag: 'lesson_one',
                show: 'inline-block',
            },
            // {
            //     name: '视频点赞',
            //     iconfont: 'iconfont icon-aixin iconStyle',
            //     background: '#84D23E',
            //     url: '../killPrices/killPriceList/killPriceList',
            //     pageTypeStu: 5,
            // },
            {
                name: '帮我砍学费',
                iconfont: 'iconfont icon-kanjia iconStyle',
                background: '#00D4BE',
                url: '../killPrices/killPersonList/killPersonList',
                pageTypeStu: 6,
                tag: 'bargain',
                show: 'inline-block',
            },
            // {
            //     name: '万人拼团',
            //     iconfont: 'iconfont icon-icon1 iconStyle',
            //     background: '#DE4037',
            //     url: '../killPrices/killPriceList/killPriceList',
            //     pageTypeStu: 7,
            // },
            {
                name: '视频投票',
                iconfont: 'iconfont icon-zan1 iconStyle',
                background: '#8990FA',
                url: '../videoVote/videoVoteStuList/videoVoteStuList',
                pageTypeStu: 8,
                tag: 'video_vote',
                show: 'inline-block',
            },
            // {
            //     name: '视频贺卡',
            //     iconfont: 'iconfont icon-meiguihua iconStyle',
            //     background: '#1196DB',
            //     url: '../killPrices/killPriceList/killPriceList',
            //     pageTypeStu: 9,
            // }, 
            {
                name: '活动报名',
                iconfont: 'iconfont icon-sign iconStyle',
                background: '#FF6766',
                url: '../killPrices/killPriceList/killPriceList',
                pageTypeStu: 10,
                tag: 'normal',
                show: 'inline-block',
            },
            {
                name: '微视频课堂',
                iconfont: 'iconfont icon-shipin1 iconStyle',
                background: '#FE7FC2',
                url: '../videoClass/videoClassStuList/videoClassStuList',
                pageTypeStu: 11,
                tag: 'video_class',
                show: 'inline-block',
            },
            // {
            //     name: '视频作业',
            //     iconfont: 'iconfont icon-job-task iconStyle',
            //     background: '#84D23E',
            //     url: '../killPrices/killPriceList/killPriceList',
            //     pageTypeStu: 12,
            // }
        ],
        userInfo: '',
        funcOpt: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        // 获取页面功能
        let funcOpt = wx.getStorageSync('funcOpt').function;
        
        for (let i = 0; i < funcOpt.length; i++) {
            funcOpt[i].show = 'inline-block'
            if (funcOpt[i].tag == 'sale_lesson') {
                funcOpt[i].show = 'none'
            } else if (funcOpt[i].tag == 'punch') {
                funcOpt[i].show = 'none'
            } else if (funcOpt[i].tag == "video_card") {
                funcOpt[i].show = 'none'
            }
        }
        that.setData({
            funcOpt: funcOpt
        })
        // 版本号
        let version = wx.getExtConfigSync();
        let funcOptId = wx.getStorageSync('funcOpt').function_id;
        let versionText = '';
        if (Number(funcOptId) == 1) {
            versionText = ' 基础版'
        } else if (Number(funcOptId) == 2) {
            versionText = ' 营销版'
        } else if (Number(funcOptId) == 3) {
            versionText = ' 豪华版'
        }
        that.setData({
            versionData: version.version + versionText,
        });
        // 获取用户信息
        wx.getSetting({
            success: res => {
                // console.log('授权结果', res);
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            // console.log('用户信息', res)
                            getApp().globalData.userInfo = res.userInfo
                            that.setData({
                                userInfo: res.userInfo
                            })
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                } else {
                    that.setData({
                        userInfo: {
                            nickName: '访客',
                            avatarUrl: 'https://wise.oss-cn-hangzhou.aliyuncs.com/icon/default_avatar.png'
                        }
                    })
                }
            }
        });
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
        let pageData = that.data.pageStuData;
        let funcOpt = that.data.funcOpt;
        for (let i = 0; i < funcOpt.length;i++){
            for (let j = 0; j < pageData.length; j++) {
                if (funcOpt[i].tag == pageData[j].tag) {
                    funcOpt[i].iconfont = pageData[j].iconfont
                    funcOpt[i].background = pageData[j].background
                    funcOpt[i].url = pageData[j].url
                    funcOpt[i].pageTypeStu = pageData[j].pageTypeStu;
                }
            }
        }
        that.setData({
            funcOpt: funcOpt
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
    toOptionPage: function(e) {
        wx.setStorageSync('pageTypeStu', e.currentTarget.dataset.pagetypestu)
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    }
})