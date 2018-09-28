// pages/manageCenters/manageCenter/manageCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        islogin: 'block',
        isContent: 'none',
        versionData: '',
        funcOpt: '',
        pageManagData: [{
                name: '更换模板',
                iconfont: 'iconfont icon-genghuanpifu iconSize',
                color: '#1196DB',
                url: '../../baseOptions/schoolModel/schoolModel',
                show:'inline-block',
            },
            {
                name: '打卡作业',
                iconfont: 'iconfont icon-job-task iconSize',
                color: '#870E04',
                url: '../../task/taskManSet/taskManSet',
                show: 'inline-block',
            },
            {
                name: '学员跟进',
                iconfont: 'iconfont icon-genjinjilu iconSize',
                url: '../../courses/courseUserList/courseUserList',
                color: '#02AEA7',
                show: 'inline-block',
            },
            {
                name: '学校简介',
                iconfont: 'iconfont icon-xuexiao iconSize',
                color: '#1196DB',
                url: '../schoolEdit/schoolEdit',
                show: 'inline-block',
            },
        ],
        pageStuData: [{
                name: '私人拼团',
                iconfont: 'iconfont icon-pintuan iconStyle',
                background: '#E3465B',
                url: 'org/personal_group_list',
                pageType: 1,
                tag: 'personal_group',
                show: 'inline-block',
            }, {
                name: '一元上好课',
                iconfont: 'iconfont icon-yiyuanchoujiang iconStyle',
                background: '#FD9D22',
                url: 'org/bargain_list',
                pageType: 2,
                tag: 'lesson_one',
                show: 'inline-block',
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
                pageType: 4,
                tag: 'bargain',
                show: 'inline-block',
            },
            // {
            //     name: '万人拼团',
            //     iconfont: 'iconfont icon-icon1 iconStyle',
            //     background: '#DE4037',
            //     url: 'org/bargain_list',
            //     pageType: 5
            //     show: 'inline-block',
            // }, 
            {
                name: '视频投票',
                iconfont: 'iconfont icon-zan1 iconStyle',
                background: '#8990FA',
                url: 'org/bargain_list',
                pageType: 6,
                tag: 'video_vote',
                show: 'inline-block',
            },
            {
                name: '视频贺卡',
                iconfont: 'iconfont icon-meiguihua iconStyle',
                background: '#1196DB',
                url: 'org/video_card_list',
                pageType: 7,
                tag: 'video_card',
                show: 'inline-block',
            }, {
                name: '活动报名',
                iconfont: 'iconfont icon-sign iconStyle',
                background: '#FF6766',
                url: 'org/bargain_list',
                pageType: 8,
                tag: 'normal',
                show: 'inline-block',
            },
            {
                name: '微视频课堂',
                iconfont: 'iconfont icon-shipin1 iconStyle',
                background: '#FE7FC2',
                url: 'org/bargain_list',
                pageType: 9,
                tag: 'video_class',
                show: 'inline-block',
            },
            // {
            //     name: '视频作业',
            //     iconfont: 'iconfont icon-job-task iconStyle',
            //     background: '#84D23E',
            //     url: 'org/bargain_list',
            //     pageType: 10,
            //     show: 'inline-block',
            // }
            {
                name: '糖果大作战',
                iconfont: 'iconfont icon-heart iconStyle',
                background: '#FE7FC2',
                url: 'org/bargain_list',
                pageType: 13,
                tag: 'sugar',
                show: 'inline-block',
            },
        ],
        phone: '',
        pwd: '',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
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
       
        // 重新登录
        // wx.setStorageSync('loginCode', 3);

        // 判断功能页面功能
        let funcOpt = wx.getStorageSync('funcOpt').function;
        let index = 0;
        for (let i = 0; i < funcOpt.length; i++) {
            funcOpt[i].show = 'inline-block';
            if (funcOpt[i].tag == 'sale_lesson') {
                funcOpt[i].show = 'none';
            } else if (funcOpt[i].tag == 'punch') {
                funcOpt[i].show = 'none';
                index = 1;
            }
        };
        let pageManagData = that.data.pageManagData;
        if(index == 0){
            pageManagData[1].show = 'none';
            that.setData({
                pageManagData: pageManagData
            })
        } else if (index == 1){
            pageManagData[1].show = 'inline-block';
            that.setData({
                pageManagData: pageManagData
            })
        }
        that.setData({
            funcOpt: funcOpt,
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
        // 是否已经登录
        if (wx.getStorageSync('loginCode') == 1) {
            that.setData({
                islogin: 'none',
                isContent: 'block',
            })
        } else {
            wx.setNavigationBarTitle({
                title: '招生小程序登录',
            })
            that.setData({
                islogin: 'block',
                isContent: 'none'
            })
        }
        let pageData = that.data.pageStuData;
        let funcOpt = that.data.funcOpt;
        for (let i = 0; i < funcOpt.length;i++){
            for (let j = 0; j < pageData.length; j++) {
                if (funcOpt[i].tag == pageData[j].tag) {
                    funcOpt[i].iconfont = pageData[j].iconfont
                    funcOpt[i].background = pageData[j].background
                    funcOpt[i].url = pageData[j].url
                    funcOpt[i].pageType = pageData[j].pageType
                }
            }
        }
        that.setData({
            funcOpt: funcOpt,
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
    getPhone: function(e) {
        this.setData({
            phoneNum: e.detail.value,
        })
    },
    getPwd: function(e) {
        this.setData({
            pwdNum: e.detail.value,
        })
    },
    // 登录
    login: function(e) {
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
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    wx.setStorageSync('loginCode', res.data.code)
                    if (Number(res.data.code) == 1) {
                        wx.setNavigationBarTitle({
                            title: '管理中心',
                        })
                        wx.showLoading({
                            title: '正在登录',
                            mask: true,
                        })
                        setTimeout(closeLogin, 2000)

                        function closeLogin() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '登录成功',
                            })
                            that.setData({
                                islogin: 'none',
                                isContent: 'block'
                            })
                        }
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        }
    },
    toManageActive: function(e) {

        let pageType = e.currentTarget.dataset.pagetype

        wx.setStorageSync('pageType', pageType)

        if (Number(pageType) == 1) {
            wx.navigateTo({
                url: '../../collage/collageManList/collageManList',
            })
        } else if (Number(pageType) == 2) {
            wx.navigateTo({
                url: '../../goodLesson/manLessonList/manLessonList?url=' + e.currentTarget.dataset.requireurl,
            })
        } else if (Number(pageType) == 11) {
            wx.navigateTo({
                url: '../../courses/courseUserList/courseUserList',
            })
        } else if (Number(pageType) == 7) {
            wx.navigateTo({
                url: '../../videos/manVideoList/manVideoList',
            })
        } else if (Number(pageType) == 8) {
            wx.navigateTo({
                url: '../../actReg/actRegManList/actRegManList',
            })
        } else if (Number(pageType) == 9) {
            wx.navigateTo({
                url: '../../videoClass/videoClassManList/videoClassManList',
            })
        } else if (Number(pageType) == 6) {
            wx.navigateTo({
                url: '../../videoVote/videoVoteManList/videoVoteManList',
            })
        } else if (Number(pageType) == 12) {
            wx.navigateTo({
                url: '../../task/taskManSet/taskManSet',
            })
        } else if (Number(pageType) == 4){
            wx.navigateTo({
                url: '../../killPrices/killPriceManList/killPriceManList',
            })
        } else if (Number(pageType) == 13){
            wx.navigateTo({
                url: '../../collectAct/collectActManList/collectActManList',
            })
        }
    },
    toEditPage: function(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    exitApp: function() {
        let that = this;
        getApp().request({
            url: 'logout',
            data: {},
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
                    wx.setStorageSync('loginCode', 3);
                    wx.setNavigationBarTitle({
                        title: '招生小程序登录',
                    })
                    that.setData({
                        islogin: 'block',
                        isContent: 'none',
                        phone: '',
                        pwd: '',
                    })
                }
            }
        })
    }
})