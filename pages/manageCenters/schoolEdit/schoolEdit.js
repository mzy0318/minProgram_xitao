// pages/manageCenters/schoolEdit/schoolEdit.js
var utils = require("../../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        envImage: '',  //环境图片
        envImageId: '', //环境图片ID
        honorImage: '',   //荣誉图片
        honorImageId: '',  //荣誉图片ID
        schoolVideo: '',
        schoolVideoId: '',
        isVideo: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        getApp().request({
            url: 'school/intro',
            data: {
                orgid: getApp().getExtConfig().orgId
            },
            success: res => {
                if (res.data.data.brand == null) {
                    that.setData({
                        isVideo: true,
                    })
                } else {
                    that.setData({
                        isVideo: false,
                    })
                }
                let honorImageId = [];
                let honorImage = [];
                let envImageId = [];
                let envImage = [];
                if (res.data.data.environment.length>0){

                    for (let i = 0; i < res.data.data.environment.length; i++) {
                        envImageId.push(res.data.data.environment[i].id)
                        envImage.push(res.data.data.environment[i].url)
                    }
                }
                if (res.data.data.honor.length > 0){

                    for (let i = 0; i < res.data.data.honor.length;i++){
                        honorImageId.push(res.data.data.honor[i].id)
                        honorImage.push(res.data.data.honor[i].url)
                    }
                    // honorImageId.push(res.data.data.honor[0].id)
                }
                that.setData({
                    pageData: res.data.data,
                    envImage: envImage,
                    honorImage: honorImage,
                    schoolVideo: res.data.data.brand.url,
                    schoolVideoId:res.data.data.brand.id,
                    honorImageId: honorImageId,
                    envImageId: envImageId,
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
    // onShareAppMessage: function() {

    // },
    // 学校环境图片
    envPic: function() {
        let that = this;
        wx.chooseImage({
            success: function(res) {

                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item,index,arr)=>{
                    return  item.size < 6291456
                })
                
                if(size){
                    let actImg = [];
                    let actImage = [];
                    actImg.push(...that.data.envImageId);
                    actImage.push(...that.data.envImage);
                    actImage.push(...res.tempFilePaths);
                    that.setData({
                        envImage: actImage,
                    })
                    let imgPath = res.tempFilePaths;
                    wx.showLoading({
                        title: '图片上传中...',
                        mask: true,
                    })

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    for (let i = 0; i < imgPath.length; i++) {

                        wx.uploadFile({
                            url: getApp().getHost() + 'upload',
                            filePath: imgPath[i],
                            name: 'file',
                            header: header,
                            success: function (res) {
                                let r = JSON.parse(res.data)
                                if (Number(r.code) == 1) {
                                    actImg.push(r.data.imageId);
                                    that.setData({
                                        envImageId: actImg
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
                        icon:'none'
                    })
                }
            },
        })
    },
    // 学校荣誉图片上传
    honorPic: function() {
        let that = this;
        wx.chooseImage({
            success: function(res) {

                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })
                if(size){
                    let actImg = [];
                    let honorImage = [];
                    actImg.push(...that.data.honorImageId);
                    honorImage.push(...that.data.honorImage)
                    honorImage.push(...res.tempFilePaths)
                    that.setData({
                        honorImage: honorImage,
                    })
                    wx.showLoading({
                        title: '图片上传中...',
                        mask: true,
                    })
                    let imgPath = res.tempFilePaths;

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    for (let i = 0; i < imgPath.length; i++) {
                        wx.uploadFile({
                            url: getApp().getHost() + 'upload',
                            filePath: imgPath[i],
                            name: 'file',
                            header: header,
                            success: function (res) {
                                let r = JSON.parse(res.data)
                                if (Number(r.code) == 1) {
                                    actImg.push(r.data.imageId);
                                    that.setData({
                                        honorImageId: actImg
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
    //学校视频上传
    chooseVideo: function() {
        let that = this;
        wx.chooseVideo({
            success: function(res) {
                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;

                var header = {};
                header.Cookie = wx.getStorageSync('cookie');
                header['Content-Type'] = 'multipart/form-data';

                if ((Number(res.size) < 73400320) && (Number(res.duration) < 60)){
                    var time = 30;
                    that.setData({
                        isVideo: false,
                    })
                    that.setData({
                        schoolVideo: res.tempFilePath
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
                    wx.uploadFile({
                        url: getApp().getHost() + 'upload',
                        filePath: that.data.schoolVideo,
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
                                    schoolVideoId: r.data.videoId,
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
    },
    submitSchoolInfo: function(res) {
        let that = this;

        // res.detail.value['environment'] = that.data.envImageId;
        // res.detail.value['honor'] = that.data.honorImageId;
        res.detail.value['brand'] = that.data.schoolVideoId ? that.data.schoolVideoId : ''

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
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: '正在保存',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000);

                    function closeLogin() {

                        wx.hideLoading()

                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            mask:true,
                            success: function () {
                                getApp().toIndex()
                            }
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
    // 删除图片功能
    delImage: function (e) {
        let that = this;
        let index = Number(e.currentTarget.dataset.index);
        //学校环境图片
        if (Number(e.currentTarget.dataset.id) == 0){

            let actImage = that.data.envImage;
            let actImageId = that.data.envImageId;

            actImage.splice(index, 1);
            actImageId.splice(index, 1);

            that.setData({
                envImage: actImage,
                envImageId: actImageId,
            })
        //学校荣誉图片
        } else if (Number(e.currentTarget.dataset.id) == 1){

            let actImage = that.data.honorImage;
            let actImageId = that.data.honorImageId;

            actImage.splice(index, 1);
            actImageId.splice(index, 1);

            that.setData({
                honorImage: actImage,
                honorImageId: actImageId,
            })
        }
    },
})