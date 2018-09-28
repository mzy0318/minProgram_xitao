// pages/manageCenters/oneLessonEdit/oneLessonEdit.js
let util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        startTime: '',
        endTime: '',
        description: '',
        actImage: [],  //活动图片
        actImageId: [],     //活动图片ID
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        actNiceId: '',
        coverImage: '',
        coverImageId: '',
        isForm: true,
        nameInfo: [],
        nameInfoId: [],
        isCover: 'none',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            actNiceId: options.actNiceId,
        })
        
        if (that.data.actNiceId != 'undefined'){
            that.setData({
                isCover: 'inline-block'
            })
        }else{
            that.setData({
                isCover: 'none'
            })
        }


        let toDay = new Date().valueOf();
        let toFuture = new Date().valueOf() + 2592000000
        that.setData({
            startTime: util.formatDate(new Date(toDay)),
            endTime: util.formatDate(new Date(toFuture)),
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let that = this;
        if (that.data.actNiceId != 'undefined') {
            wx.setNavigationBarTitle({
                title: '编辑一元好课活动',
            })
            that.setData({
                isCover: false,
            })
            getApp().request({
                url: 'org/make_lesson_one',
                method: 'get',
                data: {
                    id: that.data.actNiceId
                },
                success: function (res) {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    let joinInfo = [];
                    let joinInfoId = [];
                    let actImage = [];
                    let actImageId = [];
                    if (res.data.data.join_info.length > 0) {
                        for (let i = 0; i < res.data.data.join_info.length; i++) {
                            joinInfo.push(res.data.data.join_info[i].text);
                            joinInfoId.push(res.data.data.join_info[i].require)
                        }
                    }
                    if (res.data.data.act_image.length > 0) {
                        for (let i = 0; i < res.data.data.act_image.length; i++) {
                            actImage.push(res.data.data.act_image[i].url)
                            actImageId.push(res.data.data.act_image[i].id)
                        }
                    }
                    // joinInfo.splice(0, 2);
                    // joinInfoId.splice(0, 2)
                    that.setData({
                        pageData: res.data.data,
                        startTime: res.data.data.start_time,
                        endTime: res.data.data.end_time,
                        actImageId: actImageId,
                        actImage: actImage,
                        description: res.data.data.description,
                        coverImage: res.data.data.cover.url,
                        coverImageId: res.data.data.cover.id,
                        nameInfo: joinInfo,
                        nameInfoId: joinInfoId,
                    })
                }
            })
        } else {
            // that.setData({
            //     isCover: 'none'
            // })
            wx.setNavigationBarTitle({
                title: '发布一元好课活动',
            })
        }
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
    toCourseEdit: function(e) {
        wx.navigateTo({
            url: '../lessonCourseEdit/lessonCourseEdit?actNiceId=' + this.data.actNiceId + '&courseId=' + e.currentTarget.dataset.courseid,
        })

    },
    //提交数据
    formSubmit: function(e) {
        let that = this;
        if (Number(e.detail.target.dataset.id) == 0) {
            let sendData = e.detail.value;
            sendData['id'] = that.data.actNiceId;
            sendData['start_time'] = that.data.startTime;
            sendData['end_time'] = that.data.endTime;
            sendData['pay_status'] = sendData.pay_status ? 1 : 0;
            // sendData['description'] = that.data.description;
            // sendData['act_image'] = that.data.actImageId
            sendData['status'] = that.data.status ? 1 : 0
            sendData['sort'] = 1;
            // sendData['join_info_text'] = that.data.joinInfo;
            // sendData['join_info_require'] = that.data.joinInfoId;
            sendData['cover_image'] = that.data.coverImageId;
            if (that.data.actImageId.length > 0) {
                for (let i = 0; i < that.data.actImageId.length; i++) {
                    sendData['act_image[' + i + ']'] = that.data.actImageId[i];
                }
            }
            // for (let i = 0; i < that.data.joinInfo.length; i++) {
            //     sendData['join_info_text[' + i + ']'] = that.data.joinInfo[i];
            //     sendData['join_info_require[' + i + ']'] = that.data.joinInfoId[i];
            // }
            if (that.data.nameInfo.length > 0) {
                for (let i = 0; i < that.data.nameInfo.length; i++) {
                    // let index = i + 2;
                    sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i];
                    sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i];
                }
            }
            getApp().request({
                url: 'org/make_lesson_one',
                data: sendData,
                method: 'post',
                success: function(res) {
                    if (res.data.frozen == 1) {
                        that.setData({
                            isFrozen: 'frozen',
                        })
                    } else {
                        that.setData({
                            isFrozen: 'empty',
                        })
                    }
                    if (Number(res.data.code) == 1) {
                        wx.navigateTo({
                            url: '../lessonCourseEdit/lessonCourseEdit?actNiceId=' + res.data.data.act_nice_id + '&courseId=undefined',
                        })
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none'
                        })
                    }
                }
            })
        } else if (Number(e.detail.target.dataset.id) == 1) {
            if (that.data.actNiceId == 'undefined') {
                wx.showToast({
                    title: '至少一个课程',
                    icon: 'none'
                })
            }else if (that.data.actNiceId != 'undefined') {
                let sendData = e.detail.value;
                sendData['id'] = that.data.actNiceId;
                sendData['start_time'] = that.data.startTime;
                sendData['end_time'] = that.data.endTime;
                sendData['pay_status'] = sendData.pay_status ? 1 : 0;
                // sendData['description'] = that.data.description;
                // sendData['act_image'] = that.data.actImageId
                sendData['status'] = that.data.status ? 1 : 0
                sendData['sort'] = 1;
                // sendData['join_info_text'] = that.data.joinInfo;
                // sendData['join_info_require'] = that.data.joinInfoId;
                sendData['cover_image'] = that.data.coverImageId;
                if (that.data.actImageId.length > 0) {
                    for (let i = 0; i < that.data.actImageId.length; i++) {
                        sendData['act_image[' + i + ']'] = that.data.actImageId[i];
                    }
                }
                // for (let i = 0; i < that.data.joinInfo.length; i++) {
                //     sendData['join_info_text[' + i + ']'] = that.data.joinInfo[i];
                //     sendData['join_info_require[' + i + ']'] = that.data.joinInfoId[i];
                // }
                if (that.data.nameInfo.length > 0) {
                    for (let i = 0; i < that.data.nameInfo.length; i++) {
                        // let index = i + 2;
                        sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i];
                        sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i];
                    }
                }
                getApp().request({
                    url: 'org/make_lesson_one',
                    data: sendData,
                    method: 'post',
                    success: function(res) {
                        if (res.data.frozen == 1) {
                            that.setData({
                                isFrozen: 'frozen',
                            })
                        } else {
                            that.setData({
                                isFrozen: 'empty',
                            })
                        }
                        if (Number(res.data.code) == 1) {
                            wx.showToast({
                                title: '编辑成功',
                                icon: 'success',
                                success:function(){
                                    console.log('数据类型', typeof that.data.actNiceId)
                                    if (that.data.actNiceId == 'undefined') {
                                        wx.navigateBack({
                                            delta: 3
                                        })
                                    } else if (that.data.actNiceId != 'undefined') {
                                        wx.navigateBack({
                                            delta: 3
                                        })
                                    }
                                    // wx.redirectTo({
                                    //     url: '../../goodLesson/manLessonList/manLessonList',
                                    // })
                                }
                            })
                        } else if (Number(res.data.code) == 0) {
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            })
                        }
                    }
                })
                // wx.navigateBack({
                //     delta:3
                // })
            }
        }
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
    // getDescription: function(e) {
    //     this.setData({
    //         description: e.detail.value,
    //     })
    // },

    //上传活动图片
    choosePic: function() {
        let that = this
        wx.chooseImage({
            success: function(res) {


                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })
                if(size){
                    let arr = [];
                    let actImage = [];
                    actImage.push(...that.data.actImage)
                    actImage.push(...res.tempFilePaths);
                    arr.push(...that.data.actImageId)
                    that.setData({
                        actImage: actImage,
                    })
                    let imageArr = res.tempFilePaths;

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    for (let i = 0; i < imageArr.length; i++) {

                        wx.uploadFile({
                            url: getApp().getHost() + 'upload',
                            filePath: imageArr[i],
                            name: 'file',
                            header: header,
                            success: function (res) {
                                let r = JSON.parse(res.data)
                                if (Number(r.code) == 1) {
                                    arr.push(r.data.imageId);
                                    that.setData({
                                        actImageId: arr
                                    })
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
                    }
                }else{
                    wx.showToast({
                        title: '选择图片必须小于6M',
                        icon: 'none'
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
                
                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })

                if(size){
                    let imagePath = res.tempFilePaths[0]
                    that.setData({
                        isCover: 'inline-block',
                        coverImage: res.tempFilePaths[0],
                    })

                    wx.showLoading({
                        title: '图片上传中',
                    })

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    wx.uploadFile({
                        url: getApp().getHost() + 'upload',
                        filePath: that.data.coverImage,
                        name: 'file',
                        header: header,
                        success: function (res) {
                            let r = JSON.parse(res.data)
                            if (Number(r.code) == 1) {
                                that.setData({
                                    coverImageId: r.data.imageId,
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
                }else{
                    wx.showToast({
                        title: '选择图片必须小于6M',
                        icon: 'none'
                    })
                }
            },
        })
    },
    // 添加表单选项
    addForm: function(e) {
        let that = this;
        if (Number(e.currentTarget.dataset.is) == 1) {
            that.setData({
                isForm: true
            })
        } else if (Number(e.currentTarget.dataset.is) == 0) {
            that.setData({
                isForm: false
            })
        }
    },
    addNameOptions: function(e) {
        let arr = this.data.nameInfo;
        let arrO = this.data.nameInfoId
        arr.push(e.target.dataset.value);
        arrO.push(0);
        this.setData({
            nameInfo: arr,
            nameInfoId: arrO
        })
    },
    jianForm: function(e) {
        let that = this;
        let nameInfo = that.data.nameInfo
        let nameInfoId = that.data.nameInfoId
        nameInfo.splice(e.target.dataset.index, 1)
        nameInfoId.splice(e.target.dataset.index, 1)
        that.setData({
            nameInfo: nameInfo,
            nameInfoId: nameInfoId,
        })
    },
    isMustEdit: function(e) {
        let that = this;
        let nameInfoId = that.data.nameInfoId
        if (e.detail.value) {
            nameInfoId[e.target.dataset.index] = 1
        } else {
            nameInfoId[e.target.dataset.index] = 0
        }
        that.setData({
            nameInfoId: nameInfoId
        })
    },
    showOptions: function(e) {
        this.setData({
            isForm: Boolean(Number(e.target.dataset.is))
        })
    },
    //删除图片
    delImage: function (e) {
        let that = this;
        let index = Number(e.currentTarget.dataset.index)

        let actImage = that.data.actImage;
        let actImageId = that.data.actImageId;

        actImage.splice(index, 1);
        actImageId.splice(index, 1);

        that.setData({
            actImage: actImage,
            actImageId: actImageId,
        })
    }
})