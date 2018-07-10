let md5 = require('./utils/md5.js')
let uuid = require('./utils/uuid.js')

App({

    visitorId: '',
    onLaunch: function (options) {
        // 课程分类
        wx.setStorageSync('classId', 0)
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                this.userCode = res.code;
                // wx.request({
                //     url: 'https://www.zhihuizhaosheng.com/' + wx.getExtConfigSync().version + '/login',
                //     data: {
                //         code: res.code,
                //         org_id: wx.getExtConfigSync().orgId,
                //     },
                //     method: 'POST',
                //     success: function (res) {
                //         console.log('隐藏登录', res)
                //     }
                // })
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                // console.log('授权结果',res)
                wx.getUserInfo({
                    success: res => {
                        // console.log('用户信息',res)
                        this.globalData.userInfo = res.userInfo

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                    }
                })
            }
        }),
        wx.getUserInfo({
            success: res => {
                // console.log('用户信息', res)
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                }
            }
        })
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
    dev: false,
    getHost: () => {
        // console.log('getApp().getExtConfig()', getApp().getExtConfig())
        var online = "https://www.zhihuizhaosheng.com/" + getApp().getExtConfig().version+"/";
        var dev = "http://192.168.1.112:8888/"+ getApp().getExtConfig().version+"/";
        return  dev;
    },
    hasLogin: false,//默认app是未登录状态
    request: param => {
        var host = getApp().getHost();

        var data = param.data || {};
        var success = param.success || function () { };
        var url = param.url || "";
        url = host + url;
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

        if (param.url == "login") {
            return
        }

        var othis = this;
        console.log('url', url)
        console.log('data',data)
        if (getApp().hasLogin) {
            //直接执行请求
            wx.request({
                url: url,
                data: data,
                method: method,
                header: header,
                'success': r => {
                    if (r.header["Set-Cookie"]) {
                        wx.setStorageSync('cookie', r.header["Set-Cookie"]);
                    }

                    /**
                     * 放开此初始，同时注释掉110行，可以：
                     * 1 统一处理错误信息，每个请求都会少些处理错误代码
                     * 2 避免不优雅的res.data.data写法，对象嵌套过深，容易犯错
                     */
                    // if(r.data.code == 0){
                    //   wx.showModal({
                    //     title: '错误提示',
                    //     content: r.data.msg,
                    //   })
                    // }else{
                    //   success(r.data)
                    // }

                    success(r);
                }
            });
        } else {
            wx.login({
                success: res => {
                    if (res.errMsg != "login:ok") {
                        wx.showModal({
                            title: '错误提示',
                            content: res.errMsg,
                        })
                        return
                    } else {
                        console.log("code:", res.code);
                        // othis.visitorId = res.code.
                    }
                    wx.request({
                        'url': host + "login",
                        'data': { "code": res.code, "org_id": getApp().getExtConfig().orgId },
                        'method': "POST",
                        'header': header,
                        'success': r => {
                            if (r.data.code == 0) {
                                wx.showModal({
                                    title: '提示',
                                    content: r.data.msg,
                                })
                            } else {
                                wx.setStorageSync('visitorId', r.data.data.visitor_id)
                                if (r.header["Set-Cookie"]) {
                                    wx.setStorageSync('cookie', r.header["Set-Cookie"]);
                                }

                                getApp().hasLogin = true

                                //然后执行请求
                                getApp().request(param)
                            }
                        },
                    })
                }
            })
        }
    },
    map: function (latitude, longitude, name, address) {
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28,
            name: name,
            address: address,
        })
    },
    //拨打电话
    tellPhone: function (e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phonenum,
        })
    },
    //进入首页
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    //随机数
    randomNum: function () {
        return Math.floor(Math.random() * (10000 - 0 + 1)) + 0;
    },
    showToast:function(msg){
        wx.showToast({
            title: msg,
            icon:'none',
            mask: true,
        })
    },
    // 删除活动
    delActive:function(actId,actTag,url){
        getApp().request({
            url:'org/delete_act',
            data:{
                act_id: actId,
                act_tag: actTag
            },
            method:'post',
            success:function(res){
                if(Number(res.data.code)==1){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                        mask:true,
                    })
                    wx.navigateTo({
                        url: url,
                    })
                }
            }
        })
    },
    // 获取二维码
    getEncodeImage:function(url,mzy){
        return 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
    },
    // 生成图片地址
    imageAddress:function(name){
        return md5.hexMD5(new Date().getTime() + name + uuid.uuid()) 
    }
})