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
            joinId: options.joinId,
        });
        if (Number(that.data.isEdit) == 0){
            that.setData({
                isShow:false
            })
            wx.setNavigationBarTitle({
                title: '参加报名',
            })
            // 请求页面展示性数据
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
            wx.setNavigationBarTitle({
                title: '修改报名信息',
            })
            // 编辑前先请求用户数据
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
        var showMessage = '';
        var showResult = '';
        if (Number(that.data.isEdit) == 1){
            sendData['cover_image'] = that.data.coverImageId;
            sendData['video'] = that.data.videoId;
            sendData['act_video_vote_id'] = that.data.actId;
            sendData['video_vote_joiner_id'] = that.data.joinId;
            showMessage = '正在保存';
            showResult = '保存成功'
        } else if (Number(that.data.isEdit) == 0){
            sendData['cover_image'] = that.data.coverImageId;
            sendData['video'] = that.data.videoId;
            sendData['act_video_vote_id'] = that.data.actId; 
            sendData['video_vote_joiner_id'] = '';
            showMessage = '正在报名';
            showResult = '报名成功'
        }

        getApp().request({
            url: 'join_video_vote',
            data: sendData,
            method: 'post',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: showMessage,
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: showResult,
                            icon: 'success',
                            success: function () {
                                wx.navigateBack({})
                            }
                        })
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
    chooseImage:function(){
        let that = this;
        wx.chooseImage({
            count: 1,
            success: function (res) {

                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })

                if(size){
                    that.setData({
                        isCover: false,
                        coverImage: res.tempFilePaths[0]
                    })
                    let imagePath = res.tempFilePaths[0]

                    wx.showLoading({
                        title: '图片上传中...',
                        mask: true,
                    })
                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    getApp().uploadFile({
                        url: 'upload',
                        filePath: that.data.coverImage,
                        success: function (res) {
                            if (Number(res.code) == 1) {
                                that.setData({
                                    coverImageId: res.data.imageId,
                                });
                                wx.hideLoading();
                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'success'
                                })
                            } else {
                                wx.showToast({
                                    title: res.msg,
                                    icon: 'none',
                                })
                            }
                        }
                    }, header)
                }else{
                    wx.showToast({
                        title: '选择图片必须小于6M',
                        icon: 'none'
                    })
                }
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
                        isVideo: false,
                        video: res.tempFilePath,
                        videoImage: res.thumbTempFilePath
                    })

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    wx.uploadFile({
                        url: getApp().getHost() + 'upload',
                        filePath: videoPath,
                        name: 'file',
                        header: header,
                        formData: {
                            size: Number(size),
                            duration: Number(duration.toFixed(0)),
                        },
                        success: function (res) {
                            let r = JSON.parse(res.data)
                            if (Number(r.code) == 1) {
                                clearInterval(timer)
                                that.setData({
                                    videoId: r.data.videoId,
                                });
                                wx.hideLoading();
                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'success'
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
                        icon: 'none'
                    })
                }
            }
        })
    }
})