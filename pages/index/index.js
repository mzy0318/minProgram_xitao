//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        orgId: 0,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        ojbArr:[
            {
                name: '学校介绍',
                url:'../baseOptions/schoolInfo/schoolInfo'
            },{
                name: '课程导航',
                url: '../courses/course/course'
            },{
                name: '师资力量',
                url: '../baseOptions/teachers/teachers'
            },{
                name: '学员风采',
                url: '../baseOptions/studentStyle/studentStyle'
            },{
                name: '联系我们',
                url: '../baseOptions/contactUs/contactUs'
            },{
                name: '意见建议',
                url: '../baseOptions/opinions/opinions'
            }, {
                name: '更多',
                url: '../morePage/morePage'
            }
        ],
        pageData:'',
        isGetUser:false,
    },
    //事件处理函数
    onLoad: function () {
        let that = this;
        if (wx.getStorageSync('userInfo')!=''){
            that.setData({
                isGetUser: true,
            })
        }
        getApp().request({
            url: "home",
            method: "post",
            data: {},
            success: res => {
                that.setData({
                    pageData:res.data.data
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.app_name,
                });
                wx.setNavigationBarColor({
                    frontColor: res.data.data.navi_font_color,
                    backgroundColor: res.data.data.navi_background_color,
                })
            }
        })
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // console.log("host:",getApp().globalData.host)
                // console.log("org_id:", getApp().config.orgId,"code:",res.code)
                getApp().request({
                    url: "login",
                    method:"post",
                    data: {
                        code: res.code,
                        org_id: getApp().config.orgId,
                    },
                    success: r => {
                        var cookie = wx.getStorageSync('cookie');
                        // getApp().request({
                        //     url: "login_status",
                        //     success: r => {
                        //         console.log("login status:", r);
                        //     },
                        // });
                    }
                })
            }
        })


        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    redirectPage: function (res) {
        wx.navigateTo({
            url: res.target.dataset.url,
        })
    },
    nav:function(){
        wx.navigateTo({
            url: '../morePage/morePage',
        })
    },
    getUserInfo:function(e){
        let that = this;
        wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
        that.setData({
            isGetUser:true
        })

    }
})
