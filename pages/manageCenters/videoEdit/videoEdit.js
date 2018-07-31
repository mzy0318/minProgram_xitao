// pages/manageCenters/videoEdit/videoEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        videoUrlO: '',
        videoId: '',
        videoImage: '',
        title:'',
        actId:'',
        bannerImage:'',
        bgImage:'',
        isEdit:'',
        id:'',
        isSave:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (Number(options.isEdit) == 1) {
            that.setData({
                isEdit: options.isEdit,
                id: options.id,
            })
            getApp().request({
                url: 'org/add_video_card',
                method: 'get',
                data: {
                    id: Number(options.id)
                },
                success: function (res) {
                    that.setData({
                        pageData: res.data.data,
                        videoUrlO: res.data.data.video.url ? res.data.data.video.url:'',
                        videoId: res.data.data.video_id,
                        title:res.data.data.title,
                        videoImage: '',
                        actId: Number(options.id),
                        bannerImage:res.data.data.banner_image_url,
                        bgImage: res.data.data.bg_image_url
                    });
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                }
            })
        } else if (Number(options.isEdit) == 0){
            that.setData({
                isEdit: options.isEdit
            })
            wx.setNavigationBarTitle({
                title: getApp().globalData.userInfo.nickName + '的祝福视频',
            })
            that.setData({
                title: getApp().globalData.userInfo.nickName + '的祝福视频',
                bannerImage: options.image,
                bgImage: options.bg,
            })
        }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

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
        if (that.data.isSave == 1){

        } else if(that.data.isSave == 0){
            wx.showModal({
                title: '提示',
                content: '上传视频才可以保存贺卡,确定退出?',
                success: function (res) {
                    if (res.confirm) {
                        if (Number(that.data.isEdit) == 1) {

                        } else if (Number(that.data.isEdit) == 0) {
                            wx.navigateBack({})
                        }
                    } else if (res.cancel) {
                        wx.navigateTo({
                            url: '../../manageCenters/videoEdit/videoEdit?isEdit=' + that.data.isEdit + '&image=' + that.data.bannerImage + '&bg=' + that.data.bgImage + '&id=' + that.data.id,
                        })
                    }
                }
            })
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // },
    toIndex: function () {
        getApp().toIndex()
    },
    setVideo: function () {
        let that = this;
        wx.chooseVideo({
            success: function (res) {

                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;
                var time = 30;
                if ((Number(res.size) < 73400320) && (Number(res.duration) < 60)){
                    wx.showLoading({
                        title: '请耐心等待',
                        mask: true,
                    })
                    let timer = setInterval(timeSub, 1000);
                    function timeSub() {
                        time -= 1;
                        if (time <= 0) {
                            clearInterval(timer)
                            wx.hideLoading(),
                                wx.showToast({
                                    title: '请重新上传视频',
                                    icon: 'none',
                                })
                        }
                    }
                    that.setData({
                        videoUrlO: res.tempFilePath,
                        videoImage: res.thumbTempFilePath
                    })

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    wx.uploadFile({
                        url: getApp().getHost() + 'upload',
                        filePath: that.data.videoUrlO,
                        name: 'file',
                        header: header,
                        formData:{
                            size: Number(size),
                            duration: Number(duration.toFixed(0)),
                        },
                        success: function (res) {
                            let r = JSON.parse(res.data)
                            if (Number(r.code) == 1) {
                                that.setData({
                                    videoId: r.data.videoId,
                                })
                                clearInterval(timer)
                                var actId = '';
                                if (Number(that.data.isEdit) == 1) {
                                    actId = that.data.id
                                } else if (Number(that.data.isEdit) == 0) {
                                    actId = '';
                                }
                                getApp().request({
                                    url: 'org/add_video_card',
                                    data: {
                                        title: that.data.title,
                                        video_id: r.data.videoId,
                                        banner_image_url: that.data.bannerImage,
                                        id: actId,
                                    },
                                    method: 'post',
                                    success: function (res) {
                                        if (Number(res.data.code) == 1) {
                                            wx.hideLoading()
                                            that.setData({
                                                isSave: 1
                                            })
                                            wx.showToast({
                                                title: '贺卡保存成功',
                                                icon: 'success',
                                                success: function () {
                                                    if (Number(that.data.isEdit) == 1) {
                                                        wx.navigateBack({
                                                            delta: 1,
                                                        })
                                                    } else if (Number(that.data.isEdit) == 0) {
                                                        wx.navigateBack({
                                                            delta: 2,
                                                        })
                                                    }
                                                }
                                            })
                                        } else if (Number(res.data.code) == 0) {
                                            wx.showToast({
                                                title: res.code.msg,
                                                icon: 'none'
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
                } else if ((Number(res.size) >= 73400320) || (Number(res.duration) >= 60)){
                    wx.showToast({
                        title: '视频大于70M或长度大于60s,请重新选择',
                        icon:'none'
                    })
                }
            }
        })
    }
})