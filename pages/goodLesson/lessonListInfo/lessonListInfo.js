// pages/goodLesson/lessonListInfo/lessonListInfo.js
let utils = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        isSignUp: true,
        courseid: '',
        nameOf: '',
        isFrozen: 'empty',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this


        if (options.scene != undefined) {

            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                courseid: scene.slice(n + 1),
            })
        } else if (options.scene == undefined) {
            that.setData({
                courseid: options.actId,
            })
        }


        // 获取页面信息
        getApp().request({
            url: 'lesson_one_act',
            data: {
                act_nice_id: that.data.courseid,
            },
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
                if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
                res.data.data.start_time = utils.formatDate(new Date(res.data.data.start_time * 1000))
                res.data.data.end_time = utils.formatDate(new Date(res.data.data.end_time * 1000));
                let nameOf = [];
                let joinInfo = JSON.parse(res.data.data.join_info)
                for (let i = 0; i < joinInfo.length; i++) {
                    nameOf.push(joinInfo[i].text)
                }

                res.data.data.cover.url = utils.rect(res.data.data.cover.url, 400, 300)

                res.data.data.courses = utils.map(res.data.data.courses, function(one) {
                    one.cover.url = utils.rect(one.cover.url, 200, 200)
                    return one
                })

                // res.data.data.act_image = utils.map(res.data.data.act_image, function(one) {
                //     one.url = utils.rect(one.url, 200, 200)
                //     return one
                // })

                that.setData({
                    pageData: res.data.data,
                    nameOf: nameOf,
                })
                if (res.data.data.title) {
                    wx.setNavigationBarTitle({
                        title: res.data.data.title
                    })
                }
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
    onShareAppMessage: function(res) {
        let that = this;
        return {
            path: 'pages/index/index?pageId=4&actId=' + that.data.courseid,
        }
    },
    //查看图片
    previewImages: function (e) {
        let that = this;
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    tellPhone: e => {
        getApp().tellPhone(e)
    },
    toIndex: () => {
        getApp().toIndex();
    },
    isShow: function(e) {
        let that = this;
        that.setData({
            isSignUp: Boolean(Number(e.currentTarget.dataset.is)),
            courseid: e.currentTarget.dataset.courseid,
        })
    },
    submitInfo: function(e) {
        let that = this
        let sendData = e.detail.value;
        sendData['act_nice_course_id'] = this.data.courseid
        for (let i = 0; i < that.data.nameOf.length; i++) {
            sendData['info[' + i + ']'] = sendData[i];
            delete sendData[i]
        }
        getApp().request({
            url: 'join_lesson_one',
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
                let respons = res;
                if (Number(res.data.code) == 1) {
                    wx.showLoading({
                        title: '正在报名..',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)

                    function closeLogin() {
                        wx.hideLoading()
                        if (respons.data.data.need_pay){
                            wx.showModal({
                                title: '提示',
                                content: '报名成功,请付款.',
                                showCancel:false,
                                success:function(res){ 
                                    if(res.confirm){
                                        wx.navigateTo({
                                            url: '../../courses/orderInfo/orderInfo?joinId=' + respons.data.data.joiner_id + '&actTag=' + respons.data.data.act_tag + '&actId=' + respons.data.data.act_nice_course_id,
                                        })
                                    }
                                }
                            })
                        }else {
                            wx.showToast({
                                title: '感谢报名,稍后我们会跟您联系',
                                icon:'none'
                            })
                        }
                       
                        that.setData({
                            isSignUp: true
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
    }
})