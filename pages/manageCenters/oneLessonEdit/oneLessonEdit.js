// pages/manageCenters/oneLessonEdit/oneLessonEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        startTime: '2018-06-06',
        endTime: '2018-08-06',
        description: '',
        actImage: [],
        actImageId: [],
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        actNiceId: '',
        coverImage: '',
        coverImageId: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            actNiceId: options.actNiceId,
        })
        let that = this
        if (options.actNiceId != 'undefined') {
            getApp().request({
                url: 'org/make_lesson_one',
                method: 'get',
                data: {
                    id: options.actNiceId
                },
                success: function(res) {
                    that.setData({
                        pageData: res.data.data,
                        startTime: res.data.data.start_time,
                        endTime: res.data.data.end_time,
                        actImageId: res.data.data.act_image,
                        description: res.data.data.description,
                        coverImageId: res.data.data.cover_image
                    })
                }
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
    onShareAppMessage: function() {

    },
    toCourseEdit: function(e) {
        if (this.data.actNiceId == 'undefined') {
            wx.showToast({
                title: '请先发布当前活动',
                icon: 'none'
            })
        } else {
            wx.navigateTo({
                url: '../lessonCourseEdit/lessonCourseEdit?actNiceId=' + this.data.actNiceId + '&courseId=' + e.currentTarget.dataset.courseid,
            })
        }
    },
    lessonEditBtn: function() {},
    formSubmit: function(e) {
        let that = this;
        let sendData = e.detail.value;
        sendData['id'] = that.data.actNiceId;
        sendData['start_time'] = that.data.startTime;
        sendData['end_time'] = that.data.endTime;
        sendData['pay_status'] = sendData.pay_status ? 1 : 0;
        sendData['description'] = that.data.description;
        // sendData['act_image'] = that.data.actImageId
        sendData['status'] = that.data.status ? 1 : 0
        sendData['sort'] = 1;
        sendData['join_info_text'] = that.data.joinInfo;
        sendData['join_info_require'] = that.data.joinInfoId;
        sendData['cover_image'] = that.data.coverImageId;

        for (let i = 0; i < that.data.actImageId.length; i++) {
            sendData['act_image[' + i + ']'] = that.data.actImageId[i];
        }

        getApp().request({
            url: 'org/make_lesson_one',
            data: sendData,
            method: 'post',
            success: function(res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
                if (res.data.code == 1 && that.data.actNiceId !== 'undefined') {
                    wx.navigateTo({
                        url: '../../goodLesson/manLessonList/manLessonList',
                    })
                } else if (that.data.actNiceId == 'undefined') {
                    that.setData({
                        actNiceId: res.data.data.act_nice_id
                    })
                    wx.navigateTo({
                        url: '../oneLessonEdit/oneLessonEdit?actNiceId=' + res.data.data.act_nice_id,
                    })
                }
            }
        })

    },
    getStartTime: function(e) {
        this.setData({
            startTime: e.detail.value
        })
    },
    getEndTime: function(e) {
        this.setData({
            endTime: e.detail.value
        })
    },
    getDescription: function(e) {
        this.setData({
            description: e.detail.value,
        })
    },
    choosePic: function() {
        let that = this
        wx.chooseImage({
            success: function(res) {
                let imageArr = res.tempFilePaths
                that.setData({
                    actImage: res.tempFilePaths
                })
                let arr = []
                for (let i = 0; i < imageArr.length; i++) {

                    let n = imageArr[i].lastIndexOf('.');

                    imageArr[i] = imageArr[i].substring(n)

                    getApp().request({
                        url: 'org/policy',
                        method: 'post',
                        data: {
                            "type": "image"
                        },
                        success: function(res) {
                            let sendData = {
                                "key": res.data.data.dir + new Date().valueOf() + getApp().randomNum() + '_' + getApp().randomNum() + imageArr[i],
                                "OSSAccessKeyId": res.data.data.accessid,
                                "host": res.data.data.host,
                                "expire": res.data.data.expire,
                                "signature": res.data.data.signature,
                                "policy": res.data.data.policy,
                                'success_action_status': '200'
                            }
                            wx.showLoading({
                                title: '图片上传中',
                            })

                            setTimeout(function() {
                                wx.hideLoading()
                            }, 5000)
                            wx.uploadFile({
                                url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                                name: 'file',
                                filePath: that.data.actImage[i],
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
                                            arr.push(r.data.imageId)
                                            that.setData({
                                                actImageId: arr
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
    chooseCoverPic: function(e) {
        let that = this
        wx.chooseImage({
            count: 1,
            success: function(res) {
                let imagePath = res.tempFilePaths[0]
                that.setData({
                    coverImage: res.tempFilePaths[0],
                })
                let n = imagePath.lastIndexOf('.');

                imagePath = imagePath.substring(n)

                getApp().request({
                    url: 'org/policy',
                    method: 'post',
                    data: {
                        "type": "image"
                    },
                    success: function(res) {
                        let sendData = {
                            "key": res.data.data.dir + new Date().valueOf() + getApp().randomNum() + '_' + getApp().randomNum() + imagePath,
                            "OSSAccessKeyId": res.data.data.accessid,
                            "host": res.data.data.host,
                            "expire": res.data.data.expire,
                            "signature": res.data.data.signature,
                            "policy": res.data.data.policy,
                            'success_action_status': '200'
                        }
                        wx.showLoading({
                            title: '图片上传中',
                        })

                        setTimeout(function() {
                            wx.hideLoading()
                        }, 5000)
                        wx.uploadFile({
                            url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                            name: 'file',
                            filePath: that.data.coverImage,
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
                                        that.setData({
                                            coverImageId: r.data.imageId
                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            },
        })
    }
})