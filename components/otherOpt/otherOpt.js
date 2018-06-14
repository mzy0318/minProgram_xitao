Component({
    properties: {
        actid: {
            type: String,
            value: ''
        },
        acttag: {
            type: String,
            value: ''
        },
        banImage: {
            type: String,
            value: ''
        },
        backImage: {
            type: String,
            value: '',
        },
        bgMusicId: {
            type: String,
            value: '',
        },
        bgMusic:{
            type: String,
            value: '',
        }
    },
    data: {
        isOption: true,
        iconClose: 'iconfont icon-close iconStyle',
        iconOpen: 'iconfont icon-menu iconStyle',
        actionOptions: false,
        bottomOption: true,  //底部功能
        isCommon: true,
        isMusicClass: true,
        musicData: '',
        isModel: true,
        isMusicClass: true,
        bannerImage: '',
        backgroundImage: '',
        musicClassIndex: 0,
        backgroundMusicId:'',
    },
    attached: function () {
        let that = this;
        if (Number(wx.getStorageSync('loginCode')) == 1) {
            that.setData({
                actionOptions: false
            })
        } else {
            that.setData({
                actionOptions: true
            })
        }
        that.setData({
            bannerImage: that.properties.banImage,
            backgroundMusicId: that.properties.bgMusicId,
            backgroundImage: that.properties.backImage,
        })
    },
    methods: {
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
                data: {
                },
                method: 'post',
                success: res => {
                    this.setData({
                        musicClass: res.data.data,
                        musicData: res.data.data[0].list
                    })
                }
            })
        },
        switchTabs: function (e) {

            for (let i = 0; i < this.data.musicClass.length; i++) {
                if (e.currentTarget.dataset.name == this.data.musicClass[i].name) {
                    this.setData({
                        musicData: this.data.musicClass[i].list,
                        musicClassIndex: i
                    })
                }
            }
        },
        changeMusic: function (e) {
            let that = this;
            let getMusicDetail = { backgroundMusic: e.currentTarget.dataset.music };
            let getMusicOption = {};
            that.triggerEvent('getMusic', getMusicDetail, getMusicOption);
            that.setData({
                backgroundMusicId: e.currentTarget.dataset.musicid,
            })
        },
        //更改模板样式
        changeModel: function (e) {
            let that = this
            let getImageDetail = { bgImage: e.currentTarget.dataset.bimage, bannerImage: e.currentTarget.dataset.image };
            let getImageOption = {};
            that.triggerEvent('getImage', getImageDetail, getImageOption);
            that.setData({
                bannerImage: e.currentTarget.dataset.image,
                backgroundImage: e.currentTarget.dataset.bimage,
            })
        },
        comfireSubmit: function (e) {
            let that = this;
            // 提交背景音乐
            getApp().request({
                url: 'org/edit_music',
                data: {
                    act_id: that.properties.actid,
                    music_id: that.data.backgroundMusicId,
                    tag: that.properties.acttag,
                },
                method: 'post',
                success: function (res) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            });
            //提交模板
            getApp().request({
                url: 'org/edit_banner',
                data: {
                    act_id: that.properties.actid,
                    banner_image_url: that.data.bannerImage,
                    tag: that.properties.acttag,
                },
                method: 'post',
                success: function (res) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                    that.setData({
                        isCommon: true,
                        bottomOption: true,
                    })
                }
            });
            // 提交背景图片
            getApp().request({
                url:'org/edit_background',
                data:{
                    act_id: that.properties.actid,
                    bg_image_url: that.data.backgroundImage,
                    tag: that.properties.acttag,
                },
                method:'post',
                success:function(){

                }
            })
        },
        upDataImg: function (e) {
            let that = this;
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    let getBackgroundImageDetail = { bgImage: res.tempFilePaths[0]};
                    let getBackgroundImageOption = {};
                    that.triggerEvent('getBackgroundImage', getBackgroundImageDetail, getBackgroundImageOption);
                    that.setData({
                        backgroundImage: res.tempFilePaths[0],
                    })
                }
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
                data: {
                },
                method: 'post',
                success: res => {
                    this.setData({
                        musicClass: res.data.data,
                        musicData: res.data.data[0].list
                    })
                }
            })
        },
        toEditPage: function () {
            let that = this;
            // wx.navigateTo({
            //     url: '../../manageCenters/manageActive/manageActive',
            // })
            let pageType = wx.getStorageSync('pageType')
            if (pageType == 4) {
                wx.navigateTo({
                    url: '../manageEdit/manageEdit?id=' + that.properties.actid,
                })
            } else if (pageType == 1) {
                wx.navigateTo({
                    url: '../../manageCenters/collageEdit/collageEdit?id=' + that.properties.actid,
                })
            }
        },
        // 退出后背景图片恢复原来
        cancelImage: function () {
            let that = this
            let getImageDetail = { bgImage: that.properties.backImage, bannerImage: that.properties.banImage };
            let getImageOption = {};
            that.triggerEvent('getImage', getImageDetail, getImageOption);
            let getMusicDetail = { backgroundMusic: that.properties.bgMusic };
            let getMusicOption = {};
            that.triggerEvent('getMusic', getMusicDetail, getMusicOption);
            this.setData({
                isCommon: true,
                bottomOption: true,
                musicClassIndex: 0,
            })
        },

    }
})