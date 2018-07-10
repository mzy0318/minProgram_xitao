// pages/manageCenters/lessonCourseEdit/lessonCourseEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        courseId: 0,
        coverImage: '',
        couveImageId:'',
        actNiceId:'',
        pageData:'',
        isCover:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.setData({
            actNiceId: Number(options.actNiceId),
            courseId: options.courseId,
        })
        if (that.data.courseId != 'undefined'){
            wx.setNavigationBarTitle({
                title: '编辑活动课程',
            })
            getApp().request({
                url:'org/make_lesson_course',
                mehtod:'get',
                data:{
                    act_nice_course_id: that.data.courseId
                },
                success:function(res){
                    
                    that.setData({
                        isCover:false,
                        coverImage: res.data.data.cover.url,
                        pageData:res.data.data,
                        couveImageId: res.data.data.cover.id
                    })
                }
            })
        }else{
            wx.setNavigationBarTitle({
                title: '发布活动课程',
            })
            that.setData({
                isCover: true,
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
    submitData: function (e) {
        let that = this
        let sendData = e.detail.value;
        sendData['sort'] = 1;
        sendData['act_nice_course_id'] = that.data.courseId == 'undefined' ?'': that.data.courseId;
        sendData['cover_image'] = that.data.couveImageId;
        sendData['act_nice_id'] = that.data.actNiceId
        getApp().request({
            url:'org/make_lesson_course',
            data: sendData,
            method:'post',
            success:function(res){
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                })
                wx.navigateTo({
                    url: '../oneLessonEdit/oneLessonEdit?actNiceId=' + that.data.actNiceId,
                })
                // wx.navigateBack({})
            }
        })
    },
    addActimg: function () {
        let that = this
        wx.chooseImage({
            count: 1,
            success: function (res) {
                that.setData({
                    isCover: false,
                    coverImage: res.tempFilePaths[0]
                })
                let imgPath = res.tempFilePaths[0]
                wx.showLoading({
                    title: '图片上传中...',
                    mask:true,
                })
                getApp().request({
                    url: "org/policy",
                    method: "post",
                    data: {
                        "type": "image"
                    },
                    success: function (res) {
                        let n = imgPath.lastIndexOf('.');
                        let imgPathO = imgPath.substring(n)
                        let sendData = {
                            "key": res.data.data.dir + getApp().imageAddress(imgPath) + imgPathO,
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
                            filePath: imgPath,
                            formData: sendData,
                            success: function (res) {
                                // wx.showLoading({
                                //     title: '图片上传中',
                                //     mask:true,
                                // })

                                // setTimeout(function () {
                                //     wx.hideLoading()
                                // }, 5000)
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
                                            // return
                                            wx.showToast({
                                                title: '上传到服务器出错',
                                                icon: 'none'
                                            })
                                        }else if(Number(r.code)==1){
                                            //得到图片的id和地
                                            that.setData({
                                                couveImageId: r.data.imageId
                                            })
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '图片上传成功',
                                                icon:'success',
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
})