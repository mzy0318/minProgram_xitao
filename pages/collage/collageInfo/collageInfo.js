// pages/collage/collageInfo/collageInfo.js
let utils = require('../../../utils/util.js');
let innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isDivShow: true,
        pageData: '',
        collageData: '',
        actId: '',
        actTag: '',
        joinId: '',
        collagePrice: '',
        priceId: 0,
        personNum: 0,
        priceInfo: '',
        startTime: '',
        endTime: '',
        status: '',
        bannerImage: '',
        backgroundImage: '',
        bgMusic: '',
        backgroundMusic:'',
        encodeID:'',
        isButton:true,
        myPerson:'',
        isData:true,
        bottomOption: true, //底部功能
        isCommon: true,
        musicClass:'',//音乐分类
        musicData:'',
        musicClassIndex: 0,
        isMusicClass: true,
        musicNum: '',
        isModel: true,
        modelNum: '',
        actionOptions: true,
        isOption: true,
        iconClose: 'iconfont icon-close iconStyle',
        iconOpen: 'iconfont icon-menu iconStyle',
        showMusic:true,
        animationClass:'musicControl',
        btnBgImage:'../../../icon/optBtn.png',
        isStopMusic: true,
        isPay:true,
        rangePage:1,
        isAlert: true,
        isMore:true,
        memberPage:1,
        className: 'moreData',
        btnText: '更多'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
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

        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            let sceneArr = scene.split(':')
            that.setData({
                actId: sceneArr[1],
                actTag: sceneArr[3],
            })
        } else if (options.scene == undefined){
            that.setData({
                actId: options.actId,
                actTag: options.actTag,
            })
        }
        
        let pages = getCurrentPages()
        let url = pages[pages.length - 1].route
        let mzy = 'actid:' + options.actId + ':actTag:' + options.actTag;
        that.setData({
            encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        // 拼团列表
        that.getRangeData()
        // 页面数据
        that.getpageData()
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
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this;
        that.setData({
            rangePage:1
        })
        // 拼团列表
        that.getRangeData()
        // 页面数据
        that.getpageData()
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
        let that = this;
        return {
            path: 'pages/index/index?actId=' + that.data.actId + '&pageId=2'
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    // 去支付
    toPayPage:function(e){
        let that = this;
        wx.navigateTo({
            url: '../../courses/orderInfo/orderInfo?joinId=' + e.currentTarget.dataset.joinid + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + e.currentTarget.dataset.actid,
        })
        innerAudioContext.stop()
    },
    // 砍价成功后的弹窗
    alertBtn: function (e) {
        let that = this;
        if (e.currentTarget.dataset.id == 0) {
            that.setData({
                isAlert: true,
            })
        } else if (e.currentTarget.dataset.id == 1) {
            wx.navigateTo({
                url: '../../courses/orderInfo/orderInfo?joinId=' + that.data.joinId + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + that.data.actId,
            })
            innerAudioContext.stop()
            that.setData({
                isAlert: true,
            })
        }
    },
    toSignUp: function () {
        wx.navigateTo({
            url: '../collageSignup/collageSignup',
        })
    },
    // 获取更多团员数据
    getMemberData:function(e){
        let that = this;
        let myPerson = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            myPerson.push(...that.data.myPerson)
            that.setData({
                memberPage: that.data.memberPage + 1
            })
            getApp().request({
                url: 'personal_group_member',
                data: {
                    joiner_id: e.currentTarget.dataset.joinid,
                    act_id: that.data.actId,
                    page: that.data.memberPage,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        for (let i = 0; i < res.data.data.list.length; i++) {
                            res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                        }
                        myPerson.push(...res.data.data.list)
                        // 更多数据
                        if (myPerson.length >= that.data.memberPage * 10) {
                            that.setData({
                                isMoreM: false
                            })
                        } else {
                            that.setData({
                                isMoreM: true,
                            })
                        }
                        that.setData({
                            myPerson: myPerson,
                        })
                        wx.hideLoading()
                        if (res.data.data.list.length > 0) {
                            that.setData({
                                classNameR: 'moreDataR',
                                btnTextR: '更多'
                            })
                        } else {
                            that.setData({
                                classNameR: 'moreDataRed',
                                btnTextR: '没有了'
                            })
                        }
                    } else {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            })
        }
        
        
    },
    // 获取团员数据
    isDivBox: function (e) {
        let that = this;
        that.setData({
            isDivShow: Boolean(Number(e.currentTarget.dataset.is)),
            memberPage:1
        })
        getApp().request({
            url: 'personal_group_member',
            data: {
                joiner_id: e.currentTarget.dataset.joinid,
                act_id: that.data.actId,
                page: that.data.memberPage,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].create_time = utils.formatTime(new Date(res.data.data.list[i].create_time * 1000))
                    }
                    // 更多数据
                    if (res.data.data.list.length >= 10){
                        that.setData({
                            classNameR: 'moreDataR',
                            btnTextR: '更多'
                        })
                    }else{
                        that.setData({
                            classNameR: 'moreDataRed',
                            btnTextR: '没有了'
                        })
                    }
                    that.setData({
                        myPerson: res.data.data.list
                    })
                    if (res.data.data.list.length > 0) {
                        that.setData({
                            isData: true
                        })
                    } else {
                        that.setData({
                            isData: false
                        })
                    }
                } else {

                }
            }
        })
    },
    // 参加拼团活动
    toCollageSign: function (e) {
        let info = JSON.stringify(e.currentTarget.dataset.forminfo);
        if (e.currentTarget.dataset.is){
            wx.navigateTo({
                url: '../collageSignup/collageSignup?actId=' + e.currentTarget.dataset.actid + '&info=' + info + '&btnId=' + e.currentTarget.dataset.btnid + '&joinerId=' + e.currentTarget.dataset.joinerid,
            })
        }else{
            return 
        }
    },
    toPersonInfo: function () {
        wx.navigateTo({
            url: '../collagePersonInfo/collagePersonInfo?actId=' + this.data.actId + '&joinId=' + this.data.joinId,
        })
    },
    toIndex: function () {
        getApp().toIndex()
    },
    toBuild: function (e) {
        wx.navigateTo({
            url: '../collageBuild/collageBuild?title=' + e.currentTarget.dataset.title + '&info=' + e.currentTarget.dataset.info,
        })
    },
    cellPhone: function (e) {
        getApp().tellPhone(e)
    },
    switchTab: function (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            priceId: index,
            collagePrice: this.data.pageData.act_set[index].price,
            personNum: this.data.pageData.act_set[index].person,
            priceInfo: '凑齐' + this.data.pageData.act_set[index].person + '人即可享受每人' + this.data.pageData.act_set[index].price + '元'
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
                        // 更换背景音乐
                        getApp().request({
                            url: 'org/edit_music',
                            data: {
                                act_id: e.currentTarget.dataset.id,
                                music_id: that.data.musicId,
                                tag: that.data.actTag,
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
    // 获取滚动高度
    onPageScroll: function (e) {
        let that = this;
        that.setData({
            scrollWidth: e.scrollTop,
        })
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
        innerAudioContext.stop()
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
            url: '../../manageCenters/collageEdit/collageEdit?isEdit=1&id=' + e.currentTarget.dataset.id,
        })
    },
    shareFriends:function(){
        let that = this;
        wx.showLoading({
            title: '正在生成中...',
            mask:true,
        })
        setTimeout(function(){
            wx.hideLoading();

            wx.previewImage({
                urls: [that.data.encodeID],
            })
        },1500)
    },
    // 音乐控制
    stopMusic:function(){
        let that = this;
        innerAudioContext.stop()
    },
    //更多拼团列表
    getMoreRangeData:function(e){
        let that = this;
        let collageData = [];
        if (e.currentTarget.dataset.text == '没有了') {

        } else if (e.currentTarget.dataset.text == '更多') {
            wx.showLoading({
                title: '正在加载...',
            })
            collageData.push(...that.data.collageData)
            that.setData({
                rangePage: that.data.rangePage + 1
            })
            getApp().request({
                url: 'personal_group_range',
                data: {
                    act_id: that.data.actId,
                    page: that.data.rangePage,
                },
                method: 'post',
                success: function (res) {
                    if (res.data.code == 1) {
                        collageData.push(...res.data.data.list);
                        if (collageData.length >= that.data.rangePage * 10) {
                            that.setData({
                                className: 'moreData',
                                btnText: '更多'
                            })
                        } else {
                            that.setData({
                                className: 'moreDataed',
                                btnText: '没有了'
                            })
                        }
                        that.setData({
                            collageData: collageData,
                        })
                        wx.hideLoading()
                    } else {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            });
        }
    },
    // 获取拼团列表
    getRangeData:function(){
        let that = this;
        let collageData = [];
        getApp().request({
            url: 'personal_group_range',
            data: {
                act_id: that.data.actId,
                page: that.data.rangePage,
            },
            method: 'post',
            success: res => {
                if (res.data.data.list >= 10){
                    that.setData({
                        className: 'moreData',
                        btnText: '更多'
                    })
                }else{
                    that.setData({
                        className: 'moreDataed',
                        btnText: '没有了'
                    })
                }
                that.setData({
                    collageData: res.data.data.list
                })
            }
        });
    },
    // 获取页面数据 
    getpageData:function(e){
        let that = this;
        getApp().request({
            url: 'personal_group_act',
            data: {
                act_id: that.data.actId,
                joiner_id: '',
            },
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
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

                    wx.setNavigationBarTitle({
                        title: res.data.data.app_name,
                    })
                    if (res.data.data.joiner_id == undefined) {
                        that.setData({
                            isButton: true
                        })
                    } else if (res.data.data.joiner_id != undefined) {
                        that.setData({
                            isButton: false
                        })
                    }
                    // 是否去支付
                    if (res.data.data.could_pay != undefined) {
                        if (res.data.data.could_pay) {
                            that.setData({
                                isPay: false,
                                isAlert: false,
                            })
                        } else {
                            that.setData({
                                isPay: true,
                                isAlert: true,
                            })
                        }
                    }
                    // 处理图片问题
                    res.data.data.cover.url = utils.rect(res.data.data.cover.url, 325, 155);
                    // if (res.data.data.act_image.length > 0) {
                    //     for (let i = 0; i < res.data.data.act_image.length; i++) {
                    //         res.data.data.act_image[i].url = utils.rect(res.data.data.act_image[i].url, 325, 155)
                    //     }
                    // }

                    that.setData({
                        pageData: res.data.data,
                        collagePrice: res.data.data.act_set[0].price,
                        personNum: res.data.data.act_set[0].person,
                        priceInfo: '凑齐' + res.data.data.act_set[0].person + '人即可享受每人' + res.data.data.act_set[0].price + '元',
                        startTime: utils.formatDate(new Date(res.data.data.start_time * 1000)),
                        endTime: utils.formatDate(new Date(res.data.data.end_time * 1000)),
                        status: new Date().valueOf() >= res.data.data.end_time * 1000 ? '已结束' : '进行中',
                        joinId: res.data.data.joiner_id ? res.data.data.joiner_id : '',
                        bannerImage: res.data.data.banner_image_url,
                        backgroundImage: res.data.data.bg_image_url ? res.data.data.bg_image_url : '',
                        backgroundMusic: res.data.data.music,
                        musicId: res.data.data.music_id,
                        actTag: res.data.data.act_tag,
                    });
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    }
})
