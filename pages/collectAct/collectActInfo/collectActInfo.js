let formate = require('../../../utils/util.js')
let innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actId: '',
        actTag:'',
        pageData: '',
        rangeData: '',
        rangePage: 1,
        isJoiner: true,
        nameInfo: [],
        countDown: {
            day: 0,
            hour: 0,
            minute: 0,
            socend: 0
        },
        timer: '',
        userId:'',
        btnText:'我要报名',
        isText:false,
        className: 'moreData',
        btnTextR: '更多',
        bottomOption: true, //底部功能
        actionOptions: true,
        isOption: true,
        isCommon: true,
        musicClass: '',//音乐分类
        musicData: '',
        musicClassIndex: 0,
        isMusicClass: true,
        backgroundMusic: '',
        musicNum: '',
        isModel: true,
        animationClass: 'musicControl',
        showMusic: true,
        isStopMusic: true,
        bannerImage: '',
        backgroundImage: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            rangePage: 1
        })
        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
            })
        }else{
            that.setData({
                actId: options.actId,
            })
        }
        // 显示其他功能按钮
        if (wx.getStorageSync('loginCode') == 1) {
            this.setData({
                actionOptions: false
            })
            getApp().request({
                url: 'org/music_list',
                data: {},
                method: 'post',
                success: res => {
                    that.setData({
                        musicClass: res.data.data,
                        musicData: res.data.data[0].list
                    })
                }
            })
        } else {
            this.setData({
                actionOptions: true
            })
        }
        // 请求页面数据
        that.getPapeData();
        //获取活动排行榜
        that.getRange()
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
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        let that = this;
        // console.log('hidden')
        // clearInterval(that.data.timer)
        // innerAudioContext.stop()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        let that = this;
        clearInterval(that.data.timer)
        innerAudioContext.stop()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        let that = this;
        that.setData({
            nameInfo: [],
            rangePage:1
        })
        clearInterval(that.data.timer)
        // 请求页面数据
        that.getPapeData();
        //获取活动排行榜
        that.getRange()
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
        let that = this;
        return {
            path: 'pages/index/index?pageId=22&actId=' + that.data.actId
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    // 显示/关闭报名页面
    showJoiner: function(e) {
        let that = this;
        if (e.currentTarget.dataset.id == 1) {
            // 我要报名
            if(that.data.userId == 0){
                that.setData({
                    isJoiner: false
                })
            }else{
                wx.navigateTo({
                    url: '../collectActUserInfo/collectActUserInfo?userId=' + that.data.userId + '&actId=' + that.data.actId +'&isShare=0',
                })
            }
        } else if (e.currentTarget.dataset.id == 0) {
            // 关闭报名页面
            that.setData({
                isJoiner: true
            })
        }
    },
    // 倒计时
    countDownFun: function(endTime) {
        let that = this;
        let countDown = that.data.countDown;
        let timer;
        let countDownValue = '';
        let index = '';
        if (endTime - new Date().valueOf() > 0) {

            timer = setInterval(function() {

                countDownValue = endTime - new Date().valueOf()
                //日
                countDown.day = Math.floor(countDownValue / (24 * 60 * 60 *1000));
                //时
                countDown.hour = Math.floor(countDownValue / (1 * 60 * 60 * 1000)) - countDown.day * 24;
                //分
                countDown.minute = Math.floor(countDownValue / (60 * 1000)) - (countDown.day * 24 * 60) - (countDown.hour*60);
                //秒
                countDown.socend = Math.floor(countDownValue / 1000) - (countDown.day * 24 * 60 * 60) - (countDown.hour * 60 * 60) - (countDown.minute * 60);
                if (countDown.day <= 0) countDown.day = 0;
                if (countDown.hour <= 0) countDown.hour = 0;
                if (countDown.minute <= 0) countDown.minute = 0;
                if (countDown.socend <= 0) countDown.socend = 0;

                if (countDownValue <= 0){
                    clearInterval(timer)
                }
                console.log('执行中...')
                that.setData({
                    countDown: countDown,
                })
            }, 1000)

            that.setData({
                timer:timer,
                countDown: countDown,
            })
        } else {
            that.setData({
                countDown: countDown,
                timer: timer,
            })
        }
    },
    // 参加报名活动
    joinAct: function(e) {
        let that = this;
        let sendData = e.detail.value;
        sendData['act_id'] = that.data.actId;
        getApp().request({
            url: 'sugar/join',
            data: sendData,
            method: 'post',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.showLoading({
                        title: '正在报名',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000);

                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '报名成功',
                            icon: 'success',
                            success: function() {
                                // 请求页面数据
                                that.getPapeData();
                                wx.navigateTo({
                                    url: '../collectActUserInfo/collectActUserInfo?userId=' + res.data.data.joiner_id + '&actId=' + res.data.data.act_id,
                                })
                                that.setData({
                                    isJoiner: true
                                })

                            }
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
    // 到个人信息页面
    toUserInfo: function(e) {
        let that = this;
        wx.navigateTo({
            url: '../collectActUserInfo/collectActUserInfo?userId=' + e.currentTarget.dataset.userid + '&actId=' + that.data.actId +'&isShare=0',
        })
    },
    // 获取更多数据
    moreData:function(e){
        let that = this;
        let rangeData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            rangeData.push(...that.data.rangeData)
            that.setData({
                rangePage: that.data.rangePage + 1
            })
            getApp().request({
                url: 'sugar/rank',
                data: {
                    act_id: that.data.actId,
                    page: that.data.rangePage,
                },
                method: 'get',
                success: function (res) {
                    if (res.data.code == 1) {
                        rangeData.push(...res.data.data.list)
                        if (rangeData.length >= that.data.rangePage*10) {
                            that.setData({
                                className: 'moreData',
                                btnTextR: '更多'
                            })
                        } else {
                            that.setData({
                                className: 'moreDataed',
                                btnTextR: '没有了'
                            })
                        }
                        that.setData({
                            rangeData: rangeData
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                    }
                }
            })
        }
    },
    //获取活动排行榜
    getRange: function() {
        let that = this;
        getApp().request({
            url: 'sugar/rank',
            data: {
                act_id: that.data.actId,
                page: that.data.rangePage,
            },
            method: 'get',
            success: function(res) {
                if (res.data.code == 1) {
                    if (res.data.data.list.length >= 10){
                        that.setData({
                            className: 'moreData',
                            btnTextR: '更多'
                        })
                    }else{
                        that.setData({
                            className: 'moreDataed',
                            btnTextR: '没有了'
                        })
                    }
                    that.setData({
                        rangeData: res.data.data.list
                    })
                    wx.stopPullDownRefresh()
                }else{
                    wx.stopPullDownRefresh()
                }
            }
        })
    },
    // 获取活动信息
    getPapeData: function(e) {
        let that = this;
        getApp().request({
            url: 'sugar',
            data: {
                id: that.data.actId,
                joiner_id:'',
            },
            method: 'get',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                    wx.stopPullDownRefresh();
                    let nameInfo = that.data.nameInfo
                    that.countDownFun(res.data.data.end_time * 1000)
                    res.data.data.banner_image_url = formate.rect(res.data.data.banner_image_url, 375, 205);
                    res.data.data.start_time = formate.formatDate(new Date(res.data.data.start_time * 1000));
                    res.data.data.end_time = formate.formatDate(new Date(res.data.data.end_time * 1000));
                    if (res.data.data.join_info.length > 0) {
                        for (let i = 0; i < res.data.data.join_info.length; i++) {
                            nameInfo.push({
                                name: res.data.data.join_info[i].text,
                                nameId: res.data.data.join_info[i].require
                            })
                        }
                    }
                    // 背景音乐
                    innerAudioContext.src = res.data.data.music,
                        innerAudioContext.play();
                    innerAudioContext.onPlay(() => {
                        that.setData({
                            showMusic: false,
                            animationClass: 'musicControl viewRotate'
                        })
                    })
                    innerAudioContext.onStop(() => {
                        that.setData({
                            animationClass: 'musicControl'
                        })
                    })
                    innerAudioContext.onEnded(()=>{
                        that.setData({
                            animationClass: 'musicControl'
                        })
                    })
                    that.setData({
                        pageData: res.data.data,
                        nameInfo: nameInfo,
                        userId: res.data.data.self_joiner_id,
                        bannerImage: res.data.data.banner_image_url,
                        backgroundImage: res.data.data.bg_image_url,
                    })
                    if (res.data.data.self_joiner_id != 0){
                        that.setData({
                            btnText:'我的主页',
                            isText:true,
                        })
                    } else if (res.data.data.self_joiner_id == 0){
                        that.setData({
                            btnText: '我要报名',
                            isText:false
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
    },
    isOptions: function () {
        this.setData({
            isOption: !this.data.isOption
        })
    },
    switchModel: function (e) {
        if (e.currentTarget.dataset.url == 'org/music_list') {
            this.setData({
                isMusicClass: false,
                isModel: true,
                isCommon: false
            })
        } else if (e.currentTarget.dataset.url == 'org/banner_list') {
            this.setData({
                isMusicClass: true,
                isModel: false,
                isCommon: false
            })
        }

        getApp().request({
            url: e.currentTarget.dataset.url,
            data: {},
            method: 'post',
            success: res => {
                this.setData({
                    musicClass: res.data.data,
                    musicData: res.data.data[0].list
                })
            }
        })
    },
    // 选择背景图片
    upDataImg: function (e) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    backgroundImage: res.tempFilePaths[0],
                    bottomOption: false,
                    isCommon: true,
                })
            }
        })
    },
    // 编辑功能
    toEditPage: function (e) {
        let that = this;
        wx.navigateTo({
            url: '../collectActEdit/collectActEdit?isEdit=1&actId=' + e.currentTarget.dataset.id,
        })
    },
    // 取消功能
    cancelImage: function (e) {
        let that = this;
        if (e.currentTarget.dataset.type == 'bgImage') {
            that.setData({
                backgroundImage: this.data.pageData.bg_image_url,
                bottomOption: true,
            })
        } else if (e.currentTarget.dataset.type == 'Banner') {
            this.setData({
                bannerImage: this.data.pageData.banner_image_url,
                backgroundImage: this.data.pageData.bg_image_url,
                backgroundMusic: this.data.pageData.music,
                isCommon: true,
                bottomOption: true,
            })
            innerAudioContext.src = that.data.backgroundMusic;
            innerAudioContext.play()
        }
    },
    // 确认功能
    comfireSubmit: function (e) {
        let that = this;
        if (e.currentTarget.dataset.type == 'Banner') {
            //更换模板
            getApp().request({
                url: 'org/edit_banner',
                data: {
                    act_id: that.data.actId,
                    banner_image_url: that.data.bannerImage,
                    tag: 'sugar',
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.showToast({
                            title: '更换成功',
                            icon: 'none',
                        })
                        // 更换背景音乐
                        getApp().request({
                            url: 'org/edit_music',
                            data: {
                                act_id: that.data.actId,
                                music_id: that.data.musicId,
                                tag: 'sugar',
                            },
                            method: 'post',
                            success: function (res) {
                                if (Number(res.data.code) == 1) {
                                }
                            }
                        });
                        that.setData({
                            isCommon: true,
                            bottomOption: true,
                        })
                    } else if (Number(res.data.code) == 0) {
                        console.log(res.data.msg)
                    }

                }
            })
        } else if (e.currentTarget.dataset.type == 'bgImage') {
            // 更换背景图
            let imagePath = that.data.backgroundImage

            var header = {};
            header.Cookie = wx.getStorageSync('cookie');
            header['Content-Type'] = 'multipart/form-data';

            wx.uploadFile({
                url: getApp().getHost() + 'upload',
                filePath: imagePath,
                name: 'file',
                header: header,
                success: function (res) {
                    let r = JSON.parse(res.data)
                    if (Number(r.code) == 1) {
                        that.setData({
                            coverImageID: r.data.imageId,
                        });
                        getApp().request({
                            url: 'org/edit_background',
                            data: {
                                act_id: that.data.actId,
                                tag: 'sugar',
                                bg_image_url: r.data.res,
                            },
                            method: 'post',
                            success: function (res) {
                                if (Number(res.data.code) == 1) {
                                    wx.showToast({
                                        title: '更换成功',
                                        icon: 'success',
                                        success: function () {
                                            that.setData({
                                                isCommon: true,
                                                bottomOption: true,
                                            })
                                        }
                                    })
                                }
                            }
                        })

                    } else {
                        wx.showToast({
                            title: r.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }
    },
    switchTabs: function (e) {
        let that = this;
        for (let i = 0; i < this.data.musicClass.length; i++) {
            if (e.currentTarget.dataset.name == this.data.musicClass[i].name) {
                this.setData({
                    musicData: this.data.musicClass[i].list,
                    musicClassIndex: i
                })
            }
        }
    },
    // 选择音乐
    changeMusic: function (e) {
        let that = this;
        this.setData({
            backgroundMusic: e.currentTarget.dataset.music,
            musicId: e.currentTarget.dataset.musicid,
            musicNum: e.currentTarget.dataset.index,
        })
        innerAudioContext.src = that.data.backgroundMusic;
        innerAudioContext.play()

    },
    // 切换模板
    changeModel: function (e) {
        let that = this;
        if (that.data.scrollWidth > 0) {
            wx.pageScrollTo({
                scrollTop: 0,
            })
        }
        this.setData({
            bannerImage: e.currentTarget.dataset.image,
            backgroundImage: e.currentTarget.dataset.bimage,
            modelNum: e.currentTarget.dataset.index
        })
    },
    //停止播放音乐
    stopMusic: function () {
        let that = this;
        innerAudioContext.stop()
    },
    // 获取滚动高度
    onPageScroll: function (e) {
        let that = this;
        that.setData({
            scrollWidth: e.scrollTop,
        })
    },
    //停止/播放音乐
    isStopMusic: function () {
        let that = this;
        that.setData({
            isStopMusic: !that.data.isStopMusic,
        })
        if (that.data.isStopMusic) {
            innerAudioContext.src = that.data.backgroundMusic;
            innerAudioContext.play()
        } else {
            innerAudioContext.stop()
        }
    },
})