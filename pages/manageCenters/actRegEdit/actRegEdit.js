let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        nameInfo: [],
        nameInfoId: [],
        endTime: '',
        coverImage: '',
        coverImageID: '',
        actImage: '',  //活动图片
        actImageID: '',  //活动图片ID数组
        actId: '',
        isForm: true,
        isCover:'none',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let toDay = new Date().valueOf() + 2592000000;
        if (options.actId == 'undefined') {
            that.setData({
                isCover: 'none',
                actId: '',
                endTime: utils.formatDate(new Date(toDay))
            })
        } else {
            that.setData({
                isCover: 'inline-block',
                actId: options.actId,
            })
            getApp().request({
                url: 'org/make_normal',
                data: {
                    id: options.actId
                },
                method: 'get',
                success: function(res) {
                    let actImg = [];
                    let actId = [];
                    let joinInfo = [];
                    let joinInfoId = [];
                    for (let i = 0; i < res.data.data.act_image.length; i++) {
                        actImg.push(res.data.data.act_image[i].url)
                        actId.push(res.data.data.act_image[i].id)
                    }

                    for (let i = 0; i < res.data.data.join_info.length; i++) {
                        joinInfo.push(res.data.data.join_info[i].text);
                        joinInfoId.push(res.data.data.join_info[i].require)
                    }
                    that.setData({
                        pageData: res.data.data,
                        actImage: actImg,
                        actImageID: actId,
                        endTime: res.data.data.end_time,
                        coverImageID: res.data.data.cover_image.id,
                        coverImage: res.data.data.cover_image.url,
                        nameInfo: joinInfo,
                        nameInfoId: joinInfoId
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
    // onShareAppMessage: function() {

    // },
    getEndTime: function(e) {
        let that = this;
        that.setData({
            endTime: e.detail.value
        })
    },
    // 上传封面图片
    chooseCoverPic: function() {
        let that = this;
        wx.chooseImage({
            count: 1,
            success: function(res) {

                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })
                if(size){
                    that.setData({
                        isCover: 'inline-block',
                        coverImage: res.tempFilePaths[0]
                    })
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
                                    coverImageID: res.data.imageId,
                                });
                                wx.hideLoading();
                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'success'
                                })
                            } else if (Number(res.code) == 0) {
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
                    actImage.push(...that.data.actImage);
                    actImage.push(...res.tempFilePaths);
                    arr.push(...that.data.actImageID)
                    that.setData({
                        actImage: actImage,
                    })
                    wx.showLoading({
                        title: '图片上传中',
                        mask: true,
                    })
                    let imageArr = res.tempFilePaths

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    for (let i = 0; i < imageArr.length; i++) {

                        getApp().uploadFile({
                            url: 'upload',
                            filePath: imageArr[i],
                            success: function (res) {
                                if (Number(res.code) == 1) {
                                    arr.push(res.data.imageId);
                                    that.setData({
                                        actImageID: arr
                                    })
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
                    }
                }else {
                    wx.showToast({
                        title: '选择图片必须小于6M',
                        icon: 'none'
                    })
                }

            },
        })
    },
    formSubmit: function(e) {
        let that = this;
        let sendData = e.detail.value;
        sendData['id'] = that.data.actId;
        sendData['cover_image'] = that.data.coverImageID;
        sendData['start_time'] = utils.formatDate(new Date());
        sendData['end_time'] = that.data.endTime;
        sendData['sort'] = 0;
        // sendData['join_info_require'] = that.data.joinInfoId;
        // sendData['join_info_text'] = that.data.joinInfo;
        // sendData['act_image'] = that.data.actImageID;
        sendData['status'] = sendData.status ? 0 : 1;
        sendData['pay_status'] = sendData.pay_status ? 0 : 1;
        for (let i = 0; i < that.data.actImageID.length; i++) {
            sendData['act_image[' + i + ']'] = that.data.actImageID[i];
        }
        // for (let i = 0; i < that.data.joinInfoId.length; i++) {
        //     sendData['join_info_require[' + i + ']'] = that.data.joinInfoId[i];
        //     sendData['join_info_text[' + i + ']'] = that.data.joinInfo[i];
        // }
        for (let i = 0; i < that.data.nameInfo.length; i++) {
            // let index = i + 2;
            sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i];
            sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i];
        }

        getApp().request({
            url: 'org/make_normal',
            method: 'post',
            data: sendData,
            success: function(res) {
                if (Number(res.data.code) == 1) {
                    // wx.navigateTo({
                    //     url: '../../actReg/actRegManList/actRegManList',
                    // })
                    wx.showLoading({
                        title: '正在发布',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {

                        wx.hideLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            success:function(){
                                wx.navigateBack({})
                            }
                        })
                    }
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
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
    showOptions: function(e) {
        this.setData({
            isForm: Boolean(Number(e.target.dataset.is))
        })
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
    // 删除图片
    delImage: function (e) {
        let that = this;
        let index = Number(e.currentTarget.dataset.index)

        let actImage = that.data.actImage;
        let actImageId = that.data.actImageID;

        actImage.splice(index, 1);
        actImageId.splice(index, 1);

        that.setData({
            actImage: actImage,
            actImageID: actImageId,
        })
    },
})