let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        endTime: '2018-08-06',
        coverImage: '',
        coverImageID: '',
        actImage: '',
        actImageID: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url: 'org/make_normal',
            data: {
                id: options.actId
            },
            method: 'get',
            success: function(res) {
                let actImg = [];
                let actId = [];
                for (let i = 0; i < res.data.data.act_image.length; i++) {
                    actImg.push(res.data.data.act_image[i].url)
                    actId.push(res.data.data.act_image[i].id)
                }
                that.setData({
                    pageData: res.data.data,
                    actImage: actImg,
                    actImageID: actId,
                    endTime: res.data.data.end_time,
                    coverImageID: res.data.data.cover_image.id,
                    coverImage: res.data.data.cover_image.url,

                })
            }

        })
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
    getEndTime: function(e) {
        let that = this;
        that.setData({
            endTime: e.detail.value
        })
    },
    chooseCoverPic: function() {
        let that = this;
        wx.chooseImage({
            count: 1,
            success: function(res) {
                that.setData({
                    coverImage: res.tempFilePaths[0]
                })
                let imagePath = res.tempFilePaths[0]
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
                                            coverImageID: r.data.imageId
                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            },
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
                                                actImageID: arr
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
    formSubmit: function(e) {
        let that = this;
        let sendData = e.detail.value;
        sendData['id'] = '';
        sendData['cover_image'] = that.data.coverImageID;
        sendData['start_time'] = utils.formatDate(new Date());
        sendData['end_time'] = that.data.endTime;
        sendData['sort'] = 0;
        sendData['join_info_require'] = that.data.joinInfoId;
        sendData['join_info_text'] = that.data.joinInfo;
        // sendData['act_image'] = that.data.actImageID;
        sendData['status'] = sendData.status ? 0 : 1;
        sendData['pay_status'] = sendData.pay_status ? 0 : 1;
        for (let i = 0; i < that.data.actImageID.length; i++) {
            sendData['act_image[' + i + ']'] = that.data.actImageID[i];
        }
        console.log('sendData', sendData);
        getApp().request({
            url: 'org/make_lesson_one',
            method: 'post',
            data: sendData,
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    wx.navigateTo({
                        url: '../../actReg/actRegManList/actRegManList',
                    })
                }
            }
        })
    }
})