let formatTime = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverImage:'',    //封面图片地址
        coverImageId:'',  //封面图片ID
        video:'',   //视频地址
        videoId:'', //视频地址Id
        isCover:true,
        isVideo:true,
        actId:'',
        pageData:'',
        isEdit:'',
        isShow:false,
        joinId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            actId:options.actId,
            isEdit: options.isEdit,
            joinId: options.joinId
        });
        if (Number(that.data.isEdit) == 0){
            that.setData({
                isShow:false
            })
            getApp().request({
                url: 'visitor_video_vote',
                data: {
                    id: that.data.actId,
                },
                method: 'post',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        res.data.data.enlist_end_time = formatTime.formatTime(new Date(res.data.data.enlist_end_time * 1000));
                        res.data.data.enlist_start_time = formatTime.formatTime(new Date(res.data.data.enlist_start_time * 1000));
                        res.data.data.vote_end_time = formatTime.formatTime(new Date(res.data.data.vote_end_time * 1000));
                        res.data.data.vote_start_time = formatTime.formatTime(new Date(res.data.data.vote_start_time * 1000));
                        if ((res.data.data.status1 != 1) && (res.data.data.title1 != '')) {
                            that.setData({
                                isTitleOne: false
                            })
                        }else{
                            that.setData({
                                isTitleOne: true
                            })
                        }
                        if ((res.data.data.status2 != 1) && (res.data.data.title2 != '')) {
                            that.setData({
                                isTitleTwo: false
                            })
                        }else {
                            that.setData({
                                isTitleTwo: true
                            })
                        }
                        if ((res.data.data.status3 != 1) && (res.data.data.title3 != '')) {
                            that.setData({
                                isTitleThree: false
                            })
                        }else{
                            that.setData({
                                isTitleThree: true
                            })
                        }
                        that.setData({
                            pageData: res.data.data,
                        })
                    }
                }
            })
        } else if (Number(that.data.isEdit) == 1){
            that.setData({
                isShow: true
            })
            getApp().request({
                url:'join_video_vote',
                data:{
                    video_vote_joiner_id:that.data.joinId,
                },
                method:'get',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        that.setData({
                            pageData:res.data.data,
                            coverImage: res.data.data.cover.url,    //封面图片地址
                            coverImageId: res.data.data.cover_image,  //封面图片ID
                            video: res.data.data.video.url,   //视频地址
                            videoId: res.data.data.video.id, //视频地址Id
                            isCover: false,
                            isVideo: false,
                        })
                    } else if (Number(res.data.code) == 0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                    }
                }
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
    addActive:function(e){
        let that = this;
        let sendData = e.detail.value;
        sendData['cover_image'] = that.data.coverImageId;
        sendData['video'] = that.data.videoId;
        sendData['act_video_vote_id'] = that.data.actId
        getApp().request({
            url:'join_video_vote',
            data:sendData,
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.showLoading({
                        title: '正在报名',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '报名成功',
                            icon:'success',
                            success:function(){

                            }
                        })
                    }
                } else if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    },
    chooseImage:function(){
        let that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {

                that.setData({
                    isCover:false,
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
    chooseVideo:function(){
        let that = this;
        wx.chooseVideo({
            success: function (res) {
                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;

                wx.showLoading({
                    title: '视频上传中',
                    mask: true,
                })

                that.setData({
                    isVideo:false,
                    video: res.tempFilePath,
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
                                            that.setData({
                                                videoId: res.data.data.videoId
                                            })
                                            wx.hideLoading();
                                            wx.showToast({
                                                title: '视频上传成功',
                                                icon:'success'
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