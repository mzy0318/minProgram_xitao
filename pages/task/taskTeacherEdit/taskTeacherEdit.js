let formate = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sexArr:['男','女'],
        index:0,
        startDate: '',
        jobName:'老师',
        coverImage: '',
        coverImageId:'',
        isEdit:'',
        userId:'',
        pageData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let startDate = new Date().valueOf();
        that.setData({
            startDate: '1990-01-01',
            isEdit:Number(options.isEdit),
        })
        //设置页面标题
        if(Number(that.data.isEdit) == 0){
            that.setData({
                jobName:'教师',
                startDate: '1990-01-01',
                coverImage:options.url,
            })
            wx.setNavigationBarTitle({
                title: '加入教师',
            })
        } else if (Number(that.data.isEdit) == 1){
            that.setData({
                userId:options.userId,
            })
            wx.setNavigationBarTitle({
                title: '更改教师资料',
            });
            getApp().request({
                url:'org/punch_course/teacher',
                data:{
                    id:that.data.userId,
                },
                post:'get',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        that.setData({
                            startDate: res.data.data.birthday,
                            pageData:res.data.data,
                            jobName: res.data.data.title,
                            index: res.data.data.gender,
                            coverImage: formate.rect(res.data.data.avatar_url,150,150)
                        })
                    }
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

    // }
    switchSex:function(e){
        let that = this;
        if (e.currentTarget.dataset.id == 0){
            that.setData({
                index: Number(e.detail.value)
            })
        } else if (e.currentTarget.dataset.id == 1){
            that.setData({
                startDate: e.detail.value
            })
        }
    },
    // 选择头像
    chooseImage:function(){
        let that = this;
        wx.chooseImage({
            count:1,
            success: function(res) {
                that.setData({
                    coverImage:res.tempFilePaths[0],
                })
                //判定图片大小
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })
                //定义header内容
                var header = {};
                header.Cookie = wx.getStorageSync('cookie');
                header['Content-Type'] = 'multipart/form-data';

                if(size){
                    wx.showLoading({
                        title: '图片上传中...',
                        mask: true,
                    })
                    getApp().uploadFile({
                        url: 'upload',
                        filePath: that.data.coverImage,
                        success: function (res) {
                            if (Number(res.code) == 1) {
                                that.setData({
                                    coverImage: formate.rect(res.data.res, 150, 150),
                                    coverImageId: res.data.imageId,
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
    joinTeacher:function(e){
        let that = this;
        let url = '';
        e.detail.value['gender'] = that.data.index;
        e.detail.value['birthday'] = that.data.startDate;  
        e.detail.value['avatar_url'] = that.data.coverImage;
        let title = '';
        let titleEnd = ''
        if (that.data.isEdit) {
            title = '正在更改';
            titleEnd = '更改成功';
            e.detail.value['id'] = that.data.userId;
            url = 'org/punch_course/teacher'
        } else {
            title = '正在加入';
            titleEnd = '加入成功';
            delete e.detail.value['title'];
            url ='punch_course/add_teacher'
        }
        getApp().request({
            url:url,
            data: e.detail.value,
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.setStorageSync('isTeacher', 1)
                    wx.showLoading({
                        title: title,
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: titleEnd,
                            icon:'success',
                            success:function(){
                                wx.navigateBack({})
                            }
                        })
                    }
                }else {
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none',
                    })
                }
            }
        })
    }
})