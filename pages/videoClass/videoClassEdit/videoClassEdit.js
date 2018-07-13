// pages/videoClass/videoClassEdit/videoClassEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverImage: '',
        coverImageId:'',
        videos:'',
        videosId:'',
        isEdit: '',
        actId: '',
        pageData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            isEdit: Number(options.isEdit),
            actId: options.actId,
        })
        if (that.data.isEdit == 1) {
            wx.setNavigationBarTitle({
                title: '编辑微视频',
            })
            getApp().request({
                url: 'org/add_video_class',
                data: {
                    id: that.data.actId,
                },
                method: 'get',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        let videos = [];
                        let videosId = [];
                        if (res.data.data.video.length > 0) {
                            for (let i = 0; i < res.data.data.video.length; i++) {
                                videos.push(res.data.data.video[i].url)
                                videosId.push(res.data.data.video[i].id)
                            }
                        }
                        that.setData({
                            pageData: res.data.data,
                            coverImage: res.data.data.cover.url,
                            coverImageId: res.data.data.cover_image,
                            videos: videos,
                            videosId: videosId,
                        })
                    }
                }
            })
        } else if (that.data.isEdit == 0) {
            wx.setNavigationBarTitle({
                title: '发布微视频',
            })
        }
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function() {

    // },
    submitData: function(e) {
        let that = this;
        let sendData = e.detail.value;
        sendData['cover_image'] = that.data.coverImageId;
        if(that.data.videosId.length > 0){
            for (let i = 0; i < that.data.videosId.length;i++){
                sendData['video[' + i + ']'] = String(that.data.videosId[i])
            }
        }
        if (Number(that.data.isEdit) == 1){
            sendData['id'] = that.data.actId;
        } else if (Number(that.data.isEdit) == 0){
            sendData['id'] = '';
        }
        getApp().request({
            url:'org/add_video_class',
            data:sendData,
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.showLoading({
                        title: '正在发布',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon:'success',
                            success:function(){
                                wx.navigateBack({})
                            }
                        })
                    }
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    },
    // 删除视频
    delVideo: function (e) {
        let that = this;
        let index = Number(e.currentTarget.dataset.index)

        let videos = that.data.videos;
        let videosId = that.data.videosId;

        videos.splice(index, 1);
        videosId.splice(index, 1);

        that.setData({
            videos: videos,
            videosId: videosId,
        })
    },
    uploadImage: function () {
        let that = this;
        wx.chooseImage({
            success: function (res) {
                that.setData({
                    coverImage: res.tempFilePaths[0]
                })
                let imagePath = res.tempFilePaths[0]

                let n = imagePath.lastIndexOf('.');

                imagePath = imagePath.substring(n);
                wx.showLoading({
                    title: '图片上传中...',
                    mask: true,
                })
                getApp().request({
                    url: 'org/policy',
                    method: 'post',
                    data: {
                        "type": "image"
                    },
                    success: function (res) {
                        let sendData = {
                            "key": res.data.data.dir + getApp().imageAddress(that.data.coverImage) + imagePath,
                            "OSSAccessKeyId": res.data.data.accessid,
                            "host": res.data.data.host,
                            "expire": res.data.data.expire,
                            "signature": res.data.data.signature,
                            "policy": res.data.data.policy,
                            'success_action_status': '200'
                        }
                        wx.uploadFile({
                            url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                            name: 'file',
                            filePath: that.data.coverImage,
                            formData: sendData,
                            success: function (res) {
                                getApp().request({
                                    url: "org/exchange",
                                    data: {
                                        "key": sendData.key,
                                        "type": "image",
                                    },
                                    method: "post",
                                    success: function (r) {
                                        r = r.data
                                        if (r.code == 0) {
                                            // console.log("上传到服务器出错");
                                            wx.showToast({
                                                title: '上传到服务器出错',
                                                icon: 'none'
                                            })
                                        } else if (Number(r.code) == 1) {
                                            that.setData({
                                                coverImageId: r.data.imageId
                                            })
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '图片上传成功',
                                                icon: 'success',
                                            })
                                        }
                                    }
                                });
                            }
                        })
                    }
                })
            },
        })
    },
    //上传视频
    uploadVideo:function(){
        let that = this;
        wx.chooseVideo({
            success: function (res) {
                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;
                var time = 30;

                let videos = [];
                let videosId = [];
                videos.push(...that.data.videos);
                videos.push(res.tempFilePath);
                videosId.push(...that.data.videosId)
                that.setData({
                    videos: videos,
                    videoImage: res.thumbTempFilePath
                })

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
                getApp().request({
                    url: "org/policy",
                    method: "post",
                    data: {
                        "type": "video"
                    },
                    success: function (res) {
                        let n = videoPath.lastIndexOf('.');
                        let videoPathO = videoPath.substring(n)
                        let sendData = {
                            "key": res.data.data.dir + getApp().imageAddress(videoPath) + videoPathO,
                            "OSSAccessKeyId": res.data.data.accessid,
                            "host": res.data.data.host,
                            "expire": res.data.data.expire,
                            "signature": res.data.data.signature,
                            "policy": res.data.data.policy,
                            'success_action_status': '200'
                        }
                        wx.uploadFile({
                            url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                            name: 'file',
                            filePath: videoPath,
                            formData: sendData,
                            success: function (res) {
                                getApp().request({
                                    url: "org/exchange",
                                    data: {
                                        "key": sendData.key,
                                        "type": "video",
                                        size: Number(size),
                                        duration: Number(duration.toFixed(0)),
                                    },
                                    method: "post",
                                    success: function (res) {
                                        if(Number(res.data.code) == 1){
                                            clearInterval(timer)
                                            videosId.push(res.data.data.videoId);
                                            that.setData({
                                                videosId: videosId
                                            });
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '视频上传成功',
                                                icon:'success',
                                            })
                                        } else if(Number(res.data.code) == 0){
                                            wx.showToast({
                                                title: res.data.msg,
                                                icon:'none'
                                            })
                                        }
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    }
})