// pages/manageCenters/schoolEdit/schoolEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        envImage: '',
        honorImage: '',
        envImageId: '',
        honorImageId: '',
        schoolVideo: '',
        schoolVideoId: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
    onShareAppMessage: function() {

    },
    // 学校环境图片
    envPic: function() {
        let that = this;
        wx.chooseImage({
            success: function(res) {
                that.setData({
                    envImage: res.tempFilePaths,
                })
                let imgPath = res.tempFiles;
                let actImg = [];
                for (let i = 0; i < imgPath.length; i++) {
                    getApp().request({
                        url: "org/policy",
                        method: "post",
                        data: {
                            "type": "image"
                        },
                        success: function(res) {
                            let sendData = {
                                "key": res.data.data.dir + imgPath[i].path,
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
                                filePath: imgPath[i].path,
                                formData: sendData,
                                success: function(res) {
                                    getApp().request({
                                        url: "org/exchange",
                                        data: {
                                            "key": sendData.key,
                                            "type": "image",
                                        },
                                        method: "post",
                                        success: function(r) {
                                            r = r.data
                                            if (r.code == 0) {
                                                console.log("上传到服务器出错");
                                                return
                                            }
                                            //得到图片的id和地址
                                            actImg.push(r.data.imageId)
                                            that.setData({
                                                envImageId: actImg,
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            },
        })
    },
    honorPic: function() {
        let that = this;
        wx.chooseImage({
            success: function(res) {
                that.setData({
                    honorImage: res.tempFilePaths,
                })
                let imgPath = res.tempFiles;
                let actImg = [];
                for (let i = 0; i < imgPath.length; i++) {
                    getApp().request({
                        url: "org/policy",
                        method: "post",
                        data: {
                            "type": "image"
                        },
                        success: function(res) {
                            let sendData = {
                                "key": res.data.data.dir + imgPath[i].path,
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
                                filePath: imgPath[i].path,
                                formData: sendData,
                                success: function(res) {
                                    getApp().request({
                                        url: "org/exchange",
                                        data: {
                                            "key": sendData.key,
                                            "type": "image",
                                        },
                                        method: "post",
                                        success: function(r) {
                                            r = r.data
                                            if (r.code == 0) {
                                                console.log("上传到服务器出错");
                                                return
                                            }
                                            //得到图片的id和地址
                                            actImg.push(r.data.imageId)
                                            that.setData({
                                                honorImageId: actImg,
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            },
        })
    },
    chooseVideo: function() {
        let that = this;
        wx.chooseVideo({
            success: function(res) {
                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;
                that.setData({
                    schoolVideo: res.tempFilePath
                })
                getApp().request({
                    url: "org/policy",
                    method: "post",
                    data: {
                        "type": "video"
                    },
                    success: function(res) {
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
                            success: function(res) {
                                wx.showLoading({
                                    title: '视频上传中',
                                    mask: true,
                                })

                                setTimeout(function() {
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
                                    success: function(res) {
                                        that.setData({
                                            schoolVideoId: res.data.data.videoId
                                        })
                                        // getApp().request({
                                        //     url: 'org/add_video_card',
                                        //     data: {
                                        //         title: that.data.title,
                                        //         video_id: res.data.data.videoId,
                                        //     },
                                        //     method: 'post',
                                        //     success: function (res) {
                                        //         wx.showToast({
                                        //             title: '视频保存成功',
                                        //         })
                                        //         // if (res.data.code == 1) {
                                        //         //     wx.navigateTo({
                                        //         //         url: '../../videos/manVideoList/manVideoList',
                                        //         //     })
                                        //         // }
                                        //     }
                                        // })
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    },
    submitSchoolInfo: function(res) {
        let that = this;

        // res.detail.value['environment'] = that.data.envImageId;
        // res.detail.value['honor'] = that.data.honorImageId;
        res.detail.value['brand'] = that.data.schoolVideoId

        for (let i = 0; i < that.data.honorImageId.length; i++) {
            res.detail.value['honor[' + i + ']'] = that.data.honorImageId[i];
        }

        for (let i = 0; i < that.data.envImageId.length; i++) {
            res.detail.value['environment[' + i + ']'] = that.data.envImageId[i];
        }

        getApp().request({
            url: 'school/intro',
            data: res.detail.value,
            method: 'post',
            success: function(res) {
                if (Number(res.data.code == 1)) {
                    getApp().showToast(res.data.msg)
                    getApp().toIndex()
                } else {
                    getApp().showToast(res.data.msg)
                }
            }
        })
    }
})