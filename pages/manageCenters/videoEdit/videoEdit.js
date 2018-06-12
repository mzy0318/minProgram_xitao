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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (Number(options.isEdit)==1) {
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
                        bgImage: res.data.databg_image_url
                    });
                    wx.setNavigationBarTitle({
                        title: res.data.data.title,
                    })
                }
            })
        } else if (Number(options.isEdit) == 0){
            wx.setNavigationBarTitle({
                title: JSON.parse(wx.getStorageSync('userInfo')).nickName + '的祝福视频',
            })
            that.setData({
                title: JSON.parse(wx.getStorageSync('userInfo')).nickName + '的祝福视频',
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
        wx.showModal({
            title: '上传视频可以保存当前贺卡',
            content: '这是一个模态弹窗',
            success: function (res) {
                if (res.confirm) {
                    return false
                } else if (res.cancel) {
                   return false
                }
            }
        })
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
    onShareAppMessage: function () {

    },
    toIndex: function () {
        getApp().toIndex()
    },
    setVideo: function () {
        let that = this;
        wx.chooseVideo({
            success: function (res) {
                console.log(res)
                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;

                that.setData({
                    videoUrlO: res.tempFilePath,
                    videoImage: res.thumbTempFilePath
                })
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
                            "key": res.data.data.dir + new Date().valueOf() + getApp().randomNum() + videoPathO,
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
                                wx.showLoading({
                                    title: '视频上传中',
                                    mask: true,
                                })

                                setTimeout(function () {
                                    wx.hideLoading()
                                }, 5000)
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
                                        that.setData({
                                            videoId: res.data.data.videoId
                                        })
                                        getApp().request({
                                            url:'org/add_video_card',
                                            data:{
                                                title:that.data.title,
                                                video_id: res.data.data.videoId,
                                            },
                                            method:'post',
                                            success:function(res){
                                                wx.showToast({
                                                    title: '贺卡保存成功',
                                                })
                                                if(res.data.code==1){
                                                    wx.navigateTo({
                                                        url: '../../videos/manVideoList/manVideoList',
                                                    })
                                                }
                                            }
                                        })
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