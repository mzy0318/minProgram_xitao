//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        orgId: 0,
        modeCode: 'eight',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        contentHeight: 0,
        optionsUrl: [{
            tag: 'school_intro',
            url: '../baseOptions/schoolInfo/schoolInfo', //学校简介
        },
        {
            tag: 'lesson_navi',
            url: '../courses/course/course', //课程导航
        },
        {
            tag: 'campus',
            url: '../baseOptions/schoolList/schoolList', //机构导航
        },
        {
            tag: 'teacher',
            url: '../baseOptions/teachers/teachers', //师资力量
        },
        {
            tag: 'student',
            url: '../baseOptions/studentStyle/studentStyle', //学员风采
        },
        {
            tag: 'enlist',
            url: '../actReg/actRegUserList/actRegUserList', //活动报名
        },
        {
            tag: 'contact',
            url: '../baseOptions/contactUs/contactUs', //联系我们
        },
        {
            tag: 'feedback',
            url: '../baseOptions/opinions/opinions', //意见建议
        },
        {
            tag: 'more',
            url: '../morePage/morePage', //更多
        },
        {
            tag: 'bargain',
            url: '../killPrices/killPrice/killPrice', //帮我砍价
        },
        {
            tag: 'group',
            url: '../collage/collageList/collageList', //拼团
        },
        {
            tag: 'lesson_one',
            url: '../goodLesson/goodLessonList/goodLessonList', //一元好课
        },
        {
            tag: 'video_card',
            url: '../videos/userVideoList/userVideoList', //视频贺卡
        },
        {
            tag: 'video_class',
            url: '../videoClass/videoClassUserList/videoClassUserList', //视频课堂
        },
        {
            tag: 'punch',
            url: '../task/taskUserList/taskUserList', //打卡作业
        },
        {
            tag: 'video_vote',
            url: '../videoVote/videoVoteUserList/videoVoteUserList', //视频投票
        },
        ],
        pageData: '',
        isGetUser: false,
        paintData: [{
            backgroundColor: 'rgba(72,182,231,0.8)',
            width: '210rpx',
        }, {
            backgroundColor: 'rgba(46,181,166,0.8)',
            width: '210rpx',
        }, {
            backgroundColor: 'rgba(238,168,47,0.8)',
            width: '210rpx',
        }, {
            backgroundColor: 'rgba(240,118,41,0.8)',
            width: '210rpx',
        }, {
            backgroundColor: 'rgba(242,231,77,0.8)',
            width: '430rpx',
        }, {
            backgroundColor: 'rgba(243,108,149,0.8)',
            width: '210rpx',
        }, {
            backgroundColor: 'rgba(117,202,72,0.8)',
            width: '210rpx',
        }, {
            backgroundColor: 'rgba(145,88,221,0.8)',
            width: '210rpx',
        }],
        fiveBgColor:[
            {
                backgroundColor: '#FF81C1'
            },{
                backgroundColor: '#FE6568'
            }, {
                backgroundColor: '#FD9D22'
            }, {
                backgroundColor: '#4CC6ED'
            }, {
                backgroundColor: '#FE6668'
            }, {
                backgroundColor: '#4CC6ED'
            }, {
                backgroundColor: '#00D3BD'
            }, {
                backgroundColor: '#FF81C1'
            }
        ],
        sevenBgColor: [
            {
                backgroundColor: '#FF65AE'
            }, {
                backgroundColor: '#AF48E1'
            }, {
                backgroundColor: '#FF6668'
            }, {
                backgroundColor: '#4CC6ED'
            }, {
                backgroundColor: '#FF597F'
            }, {
                backgroundColor: '#00D3BD'
            }, {
                backgroundColor: '#EE51C4'
            }, {
                backgroundColor: '#FAC963'
            }
        ],
    },
    //事件处理函数
    onLoad: function (options) {
        let that = this;
        // 是否为教师
        wx.setStorageSync('isTeacher', 0)
        //获取设备高度
        wx.setStorageSync('devHeight', wx.getSystemInfoSync().windowHeight);
        that.setData({
            contentHeight: Number(wx.getStorageSync('devHeight')) - 175
        })
        //  分享从主页向目标页面跳转
        if (Number(options.pageId) == 1) {
            wx.navigateTo({
                url: '../killPrices/killPriceInfo/killPriceInfo?id=' + options.actId,
            })
        } else if (Number(options.pageId) == 2) {
            wx.navigateTo({
                url: '../collage/collageInfo/collageInfo?actId=' + options.actId,
            })
        } else if (Number(options.pageId) == 3) {
            wx.navigateTo({
                url: '../collage/collagePersonInfo/collagePersonInfo?actId=' + options.actId + '&joinId=' + options.joinId,
            })
        } else if (Number(options.pageId) == 4) {
            wx.navigateTo({
                url: '../goodLesson/lessonListInfo/lessonListInfo?actId=' + options.actId,
            })
        } else if (Number(options.pageId) == 5) {
            wx.navigateTo({
                url: '../killPrices/killPriceListInfo/killPriceListInfo?actId=' + options.actId,
            })
        } else if (Number(options.pageId) == 6) {
            wx.navigateTo({
                url: '../videos/videoListInfo/videoListInfo?id=' + options.actId,
            })
        } else if (Number(options.pageId) == 7) {
            wx.navigateTo({
                url: '../baseOptions/schoolInfo/schoolInfo',
            })
        } else if (Number(options.pageId) == 8) {
            wx.navigateTo({
                url: '../baseOptions/opinions/opinions',
            })
        } else if (Number(options.pageId) == 9) {
            wx.navigateTo({
                url: '../baseOptions/teachers/teachers',
            })
        } else if (Number(options.pageId) == 10) {
            wx.navigateTo({
                url: '../actReg/actRegListInfo/actRegListInfo?actId=' + options.actId,
            })
        } else if (Number(options.pageId) == 11) {
            wx.navigateTo({
                url: '../baseOptions/schoolList/schoolList',
            })
        } else if (Number(options.pageId) == 12) {
            wx.navigateTo({
                url: '../baseOptions/studentStyle/studentStyle',
            })
        } else if (Number(options.pageId) == 13) {
            wx.navigateTo({
                url: '../baseOptions/contactUs/contactUs',
            })
        } else if (Number(options.pageId) == 14) {
            wx.navigateTo({
                url: '../videoVote/videoVoteInfo/videoVoteInfo?actId=' + options.actId,
            })
        } else if (Number(options.pageId) == 15) {
            wx.navigateTo({
                url: '../videoVote/videoVoteUserInfo/videoVoteUserInfo?joinId=' + options.joinId,
            })
        } else if (Number(options.pageId) == 16) {
            wx.navigateTo({
                url: '../videoClass/videoClassInfo/videoClassInfo?actId=' + options.actId,
            })
        } else if (Number(options.pageId) == 17) {
            // 打卡作业  加入老师
            wx.navigateTo({
                url: '../task/taskTeacherEdit/taskTeacherEdit?isIndex=1',
            })
        } else if (Number(options.pageId) == 18) {
            wx.navigateTo({
                url: '../task/taskUserListInfo/taskUserListInfo?courseId=' + options.courseId + '&pwd=' + options.pwd,
            })
        } else if (Number(options.pageId) == 19) {
            // 集糖果个人页面
            wx.navigateTo({
                url: '../collectAct/collectActUserInfo/collectActUserInfo?actId=' + options.actId + '&userId=' + options.userId +'isShare=1',
            })
        } else if (Number(options.pageId) == 20) {
            //课程销售
            wx.navigateTo({
                url: '../courses/courseInfo/courseInfo?id=' + options.actId,
            })
        } else if (Number(options.pageId) == 21) {
            //砍价个人页面
            wx.navigateTo({
                url: '../killPrices/killPricePerson/killPricePerson?actId=' + options.actId + '&joinId=' + options.joinId,
            })
        }
        wx.showLoading({
            title: '',
            mask: true,
        })
        wx.showShareMenu({
            withShareTicket: true
        })
        if (wx.getStorageSync('userInfo') != '') {
            that.setData({
                isGetUser: true,
            })
        }
    },
    onShow: function () {
        let that = this;
        that.getData()
        // 选择模板
        if (Number(wx.getStorageSync('schoolModel')) == 2) {
            that.setData({
                modeCode: 'eight'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 6) {
            that.setData({
                modeCode: 'fourteen'
            })
        } else if ( Number(wx.getStorageSync('schoolModel')) == 18 ) {
            that.setData({
                modeCode: 'thirteen'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 3 ) {
            that.setData({
                modeCode: 'ten'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 17) {
            that.setData({
                modeCode: 'six'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 23) {
            that.setData({
                modeCode: 'twelve'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 24) {
            that.setData({
                modeCode: 'three'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 22) {
            that.setData({
                modeCode: 'eleven'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 12) {
            that.setData({
                modeCode: 'fiveteen'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 21) {
            that.setData({
                modeCode: 'five'
            })
        } else if (Number(wx.getStorageSync('schoolModel')) == 25) {
            that.setData({
                modeCode: 'four'
            })
        }
    },
    redirectPage: function (res) {
        wx.navigateTo({
            url: res.target.dataset.url,
        })
    },
    nav: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    getUserInfo: function (e) {
        let that = this;
        wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
        that.setData({
            isGetUser: true
        })
    },
    toContentPage: function (e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url,
        })
    },
    onPullDownRefresh: function () {
        let that = this
        that.getData()
    },
    toCourseInfo: function (e) {
        wx.navigateTo({
            url: '../courses/courseInfo/courseInfo?id=' + e.currentTarget.dataset.id,
        })
    },
    // 获取页面数据
    getData: function () {
        let that = this;
        getApp().request({
            url: "home",
            method: "post",
            data: {},
            success: res => {
                wx.hideLoading()
                for (let i = 0; i < res.data.data.home_icon.length; i++) {  
                    res.data.data.home_icon[i].backgroundColor = that.data.paintData[i].backgroundColor;  
                    res.data.data.home_icon[i].fiveBgColor = that.data.fiveBgColor[i].backgroundColor; 
                    res.data.data.home_icon[i].sevenBgColor = that.data.sevenBgColor[i].backgroundColor; 
                    res.data.data.home_icon[i].width = that.data.paintData[i].width;
                    for (let j = 0; j < that.data.optionsUrl.length; j++) {
                        if (res.data.data.home_icon[i].tag == that.data.optionsUrl[j].tag) {
                            res.data.data.home_icon[i].url = that.data.optionsUrl[j].url
                        }
                    }
                }
                that.setData({
                    pageData: res.data.data
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                });
                wx.setNavigationBarColor({
                    frontColor: res.data.data.navi_font_color,
                    backgroundColor: res.data.data.navi_background_color,
                })
                wx.stopPullDownRefresh()
            }
        })
    }
})