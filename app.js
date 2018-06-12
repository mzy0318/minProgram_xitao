//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        //获取用户信息
        // wx.getSetting({
        //     success: res => {
        //         console.log(res)
        //         wx.getUserInfo({
        //             success: res => {
        //                 this.globalData.userInfo = res.userInfo

        //                 // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //                 // 所以此处加入 callback 以防止这种情况
        //                 if (this.userInfoReadyCallback) {
        //                     this.userInfoReadyCallback(res)
        //                 }
        //             }
        //         })
        //     }
        // })
        this.globalData.host = "http://www.zhihuizhaosheng.com/" + this.getExtConfig().version + "/";
    },

    config: null,
    //获取ext.json文件内容
    getExtConfig: function () {

        if (this.config === null) {

            this.config = wx.getExtConfigSync();
        }

        return this.config;
    },

    globalData: {
        userInfo: null,
        lessonClassName: '课程筛选',
        lessonClassData: null,
    },
    request: param => {
        var data = param.data || {};
        var success = param.success || function () { };
        var url = param.url || "";
        url = getApp().globalData.host + url;
        var method = param.method || "GET";
        method = method.toUpperCase();

        var header = {};
        var cookie = wx.getStorageSync('cookie');
        if (cookie) {
            header.Cookie = cookie;
        }

        if (method == "POST") {
            header["Content-Type"] = "application/x-www-form-urlencoded";
        }
        console.log('url', url)
        console.log('data', data)
        wx.request({
            url: url,
            data: data,
            method: method,
            header: header,
            'success': r => {
                if (r.header["Set-Cookie"]) {
                    wx.setStorageSync('cookie', r.header["Set-Cookie"]);
                }
                success(r);
            }
        });
    },
    map: function () {
        let latitude = 34.752901;
        let longitude = 113.683063
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            name: '智慧招生小程序',
            address: '郑州市紫金山路裕鸿国际D座2011',
        })
    },
    tellPhone: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phonenum,
        })
    },
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    randomNum: function () {
        return Math.floor(Math.random() * (10000 - 0 + 1)) + 0;
    },
})