// pages/killPrices/killPriceInfo/killPriceInfo.js
const util = require('../../../utils/util.js');
const innerAudioContext = wx.createInnerAudioContext()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: true,
        isHidden: false,
        isClosed: 'none',
        pageData: null,
        startTime: '',
        endTime: '',
        activeId: '',
        userName: '',
        userPhone: '',
        isOption: true,
        iconClose: 'iconfont icon-close iconStyle',
        iconOpen: 'iconfont icon-menu iconStyle',
        bannerImage: '',
        backgroundImage: '',
        bottomOption: true, //底部功能
        musicClass: null,
        musicData: null,
        musicClassIndex: 0,
        isMusicClass: true,
        isModel: true,
        isCommon: true,
        killPricePeople: '',
        actionOptions: true,
        backgroundMusic: '',//背景音乐
        musicId: '',//背景音乐ID
        activeImage: '',
        nameInfo: '',
        actId: '',
        modelNum:'',
        scrollWidth:'',
        musicNum:'',
        showMusic:true,
        animationClass: 'musicControl',
        btnBgImage: '../../../icon/optBtn.png',
        rangPage:1,
        actTag:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log('options',options)
        if (wx.getStorageSync('loginCode') == 1) {
            this.setData({
                actionOptions: false
            })
        } else {
            this.setData({
                actionOptions: true
            })
        }

        if (options.scene != undefined) {
            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                actId: scene.slice(n + 1),
            })
        } else if (options.scene == undefined) {
            that.setData({
                actId: options.id,
            })
        }
        // 获取活动actTag
        that.setData({
            actTag:options.actTag,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        getApp().request({
            url: 'bargain_act',
            data: {
                act_id: that.data.actId,
                joiner_id: '0',
            },
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    //背景音乐
                    innerAudioContext.src = res.data.data.music;
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
                    innerAudioContext.onError((res) => {
                        console.log(res)
                    })
                    let nameInfo = []
                    for (let i = 0; i < res.data.data.join_info.length; i++) {
                        nameInfo.push(res.data.data.join_info[i].text)
                    }
                    that.setData({
                        pageData: res.data.data,
                        startTime: util.formatTime(new Date(res.data.data.start_time * 1000)),
                        endTime: util.formatTime(new Date(res.data.data.end_time * 1000)),
                        activeId: that.data.actId,
                        bannerImage: res.data.data.banner_image_url,
                        backgroundImage: res.data.data.bg_image_url,
                        backgroundMusic: res.data.data.music,  //背景音乐
                        musicId: res.data.data.music_id,  //背景音乐ID
                        activeImage: res.data.data.act_image,
                        nameInfo: nameInfo,
                    })
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        mask: true,
                    })
                }
            }
        })
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: that.data.actId,
                joiner_id: '0',
                page: that.data.rangPage,
            },
            method: 'post',
            success: data => {
                if (data.data.code == 1) {
                    this.setData({
                        killPricePeople: data.data.data,
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {

        
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
        let that = this;
        innerAudioContext.stop()
        that.setData({
            animationClass: 'musicControl'
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */



    //停止播放音乐
    stopMusic:function(){
        innerAudioContext.stop()
    },
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
            rangPage: 1
        })
        getApp().request({
            url: 'bargain_act',
            data: {
                act_id: that.data.actId,
                joiner_id: '0',
            },
            method: 'post',
            success: res => {
                let nameInfo = []
                for (let i = 0; i < res.data.data.join_info.length; i++) {
                    nameInfo.push(res.data.data.join_info[i].text)
                }
                that.setData({
                    pageData: res.data.data,
                    startTime: util.formatTime(new Date(res.data.data.start_time*1000)),
                    endTime: util.formatTime(new Date(res.data.data.end_time*1000)),
                    activeId: options.id,
                    bannerImage: res.data.data.banner_image_url,
                    backgroundImage: res.data.data.bg_image_url,
                    backgroundMusic: res.data.data.music,
                    musicId: res.data.data.music_id,
                    activeImage: res.data.data.act_image,
                    nameInfo: nameInfo,
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.title,
                })
            }
        })
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: that.data.actId,
                joiner_id: '0',
                page: that.data.rangPage
            },
            method: 'post',
            success: data => {
                this.setData({
                    killPricePeople: data.data.data,
                })
                wx.stopPullDownRefresh()
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.killPricePeople);
        if (that.data.killPricePeople.length >= that.data.rangPage * 10){
            that.setData({
                rangPage: rangPage+1,
            })
            getApp().request({
                url: 'bargain_range',
                data: {
                    act_id: that.data.actId,
                    joiner_id: '0',
                    page: that.data.rangPage
                },
                method: 'post',
                success: data => {
                    pageDataArr.push(...data.data.data)
                    this.setData({
                        killPricePeople: pageDataArr,
                    })
                }
            })
        } 
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        let that = this;
        if (res.from == 'menu'){
            return {
                path: 'pages/index/index?pageId=1&actId=' + that.data.actId
            }
        }
    },
    priceRankOne: function () {
        this.setData({
            isShow: true,
            isHidden: false
        })
    },
    priceRankTwo: function () {
        this.setData({
            isShow: false,
            isHidden: true,
        })
    },
    isClose: function (e) {
        this.setData({
            isClosed: e.currentTarget.dataset.display,
        })
    },
    toIndex: function () {
        wx.switchTab({
            url: '../../index/index',
        })
    },
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    toPricePerson: function (e) {
        let that = this;
        console.log('e.currentTarget.dataset.joinid', e.currentTarget.dataset.joinid)
        wx.navigateTo({
            url: '../killPricePerson/killPricePerson?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinid,
        })
    },
    joinActive: function (e) {
        let that = this;
        let sendData = e.detail.value;
        for (let i = 0; i < that.data.nameInfo.length; i++) {
            sendData['info[' + i + ']'] = sendData[i]
            delete sendData[i]
        }
        sendData['act_id'] = that.data.activeId;
        getApp().request({
            url: 'join_bargain',
            data: sendData,
            method: 'post',
            success: res => {
                let pageInfo = JSON.stringify(res.data.data);
                let respons = res;
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: '正在提交...',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {

                        wx.hideLoading();

                        wx.showToast({
                            title: '提交成功',
                            success:function(){
                                that.setData({
                                    isClosed: 'none',
                                })
                                wx.navigateTo({
                                    url: '../killPricePerson/killPricePerson?actId=' + respons.data.data.act_id + '&joinId=' + respons.data.data.joiner_id,
                                })
                            }
                        });
                    }
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
    getNickName: function (e) {
        this.setData({
            userName: e.detail.value
        })
    },
    getPhone: function (e) {
        this.setData({
            userPhone: e.detail.value
        })
    },
    isOptions: function () {
        this.setData({
            isOption: !this.data.isOption
        })
    },
    // 切换模板
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
    // 取消功能
    cancelImage: function (e) {
        let that = this;
        if (e.currentTarget.dataset.type == 'bgImage'){
            that.setData({
                backgroundImage: this.data.pageData.bg_image_url,
                bottomOption: true,
            })
        } else if (e.currentTarget.dataset.type == 'Banner'){
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
    // 获取滚动高度
    onPageScroll:function(e){
        let that = this;
        that.setData({
            scrollWidth: e.scrollTop,
        })
    },
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
    // 确认
    comfireSubmit: function (e) {
        let that = this;
        if (e.currentTarget.dataset.type == 'Banner'){
            // 更换背景音乐
            getApp().request({
                url: 'org/edit_music',
                data: {
                    act_id: e.currentTarget.dataset.id,
                    music_id: this.data.musicId,
                    tag: that.data.actTag,
                },
                method: 'post',
                success: function (res) {
                    console.log('res',res)
                    if(Number(res.data.code) == 1){
                        wx.showToast({
                            title: '更换成功',
                            icon: 'none',
                        })
                        //更换banner图
                        getApp().request({
                            url: 'org/edit_banner',
                            data: {
                                act_id: e.currentTarget.dataset.id,
                                banner_image_url: that.data.bannerImage,
                                tag: that.data.actTag,
                            },
                            method: 'post',
                            success: function (res) {
                                if (Number(res.data.code) == 1) {
                                    wx.showToast({
                                        title: '更换成功',
                                        icon: 'none',
                                    })
                                    that.setData({
                                        isCommon: true,
                                        bottomOption: true,
                                    })
                                }

                            }
                        })
                    }
                    that.setData({
                        isCommon: true,
                        bottomOption: true,
                    })
                }
            });
        } else if (e.currentTarget.dataset.type == 'bgImage'){
            // 更换背景图

            let imagePath = that.data.backgroundImage
            let n = imagePath.lastIndexOf('.');
            imagePath = imagePath.substring(n);

            var header = {};
            header.Cookie = wx.getStorageSync('cookie');
            header['Content-Type'] = 'multipart/form-data';

            wx.uploadFile({
                url: getApp().getHost() + 'upload',
                filePath: that.data.backgroundImage,
                name: 'file',
                header: header,
                success: function (res) {
                    let r = JSON.parse(res.data)
                    if (Number(r.code) == 1) {

                        getApp().request({
                            url: 'org/edit_background',
                            data: {
                                act_id: e.currentTarget.dataset.id,
                                tag: that.data.actTag,
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
    toEditPage: function (e) {
        let that = this;
        wx.navigateTo({
            url:'../../manageCenters/manageEdit/manageEdit?id='+e.currentTarget.dataset.id,
        })
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
    // 音乐控制
    stopMusic: function () {
        let that = this;
        innerAudioContext.stop()
        that.setData({
            animationClass: 'musicControl'
        })
    }
})