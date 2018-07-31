// pages/manageCenters/manageEdit/manageEdit.js
let util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        actId:'',
        isShow: true,
        isHidden: false,
        isShowO: true,
        isHiddenO: false,
        getbargainType: '',
        getBargainLimitType: '',
        startDate: '',
        endDate: '',
        rule: '',
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        nameInfo:[],
        nameInfoId:[],
        isOptions: true,
        imageData: '',  //图片数组
        actImg0: '',   //图片ID数组
        editTitle: undefined,
        backgroundImage: ' ',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this
        that.setData({
            actId: options.id,
        })
        let toDay = new Date().valueOf();
        let toFuture = new Date().valueOf() + 2592000000
        that.setData({
            startDate: util.formatDate(new Date(toDay)),
            endDate: util.formatDate(new Date(toFuture)),
        })
        if (String(options.id) == 'undefined') {
            this.setData({
                backgroundImage: options.image
            })
        } else {
            getApp().request({
                url: 'org/make_bargain',
                data: {
                    id: options.id
                },
                method: 'get',
                success: function(res) {
                    let joinInfo = [];
                    let joinInfoId = [];
                    let imageData = [];
                    let imageDataId = [];
                    for (let i = 0; i < res.data.data.join_info.length; i++) {
                        joinInfo.push(res.data.data.join_info[i].text);
                        joinInfoId.push(res.data.data.join_info[i].require)

                        // joinInfo.splice(0, 2);
                        // joinInfoId.splice(0, 2)
                    }
                    for (let i = 0; i < res.data.data.act_image.length;i++){
                        imageData.push( res.data.data.act_image[i].url),
                        imageDataId.push(res.data.data.act_image[i].id)
                    }
                    that.setData({
                        pageData:res.data.data,
                        editTitle: res.data.data.title,
                        startDate: res.data.data.start_time,
                        endDate: res.data.data.end_time,
                        backgroundImage: res.data.data.banner_image_url,
                        nameInfo: joinInfo,
                        nameInfoId: joinInfoId,
                        imageData: imageData,
                        actImg0: imageDataId,
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
    switchTab: function(e) {
        this.setData({
            isShow: !this.data.isShow,
            isHidden: !this.data.isHidden,
            getbargainType: e.currentTarget.dataset.value,
        })
    },
    switchTabO: function(e) {
        this.setData({
            isShowO: !this.data.isShowO,
            isHiddenO: !this.data.isHiddenO,
            getBargainLimitType: e.currentTarget.dataset.value
        })
    },
    getFormData: function(e) {
        let that = this;
        let sendData = {
            id: that.data.actId,

            title: e.detail.value.title,
            original_price: e.detail.value.original_price,
            now_price: e.detail.value.now_price,
            pay_status: e.detail.value.pay_status ? 1 : 0,
            start_time: this.data.startDate,
            end_time: this.data.endDate,
            joiner_limit: e.detail.value.joiner_limit,
            telephone: e.detail.value.telephone,
            address: e.detail.value.address,
            rule: e.detail.value.rule,
            // join_info_require: this.data.nameInfoId,
            // join_info_text: this.data.nameInfo,
            bargain_type: this.data.getbargainType ? this.data.getbargainType : 1,
            bargain_limit_type: this.data.getBargainLimitTyp ? this.data.getBargainLimitType : 1,
            bargain_param: e.detail.value.bargain_paramO ? e.detail.value.bargain_paramO : e.detail.value.bargain_paramT,
            banner_image_url: this.data.backgroundImage,
            status: e.detail.value.joiner_limit ? 1 : 0,
        }
        for (let i = 0; i < that.data.actImg0.length; i++){
            sendData['act_image[' + i + ']'] = that.data.actImg0[i];
        }
        // for (let i = 0; i < that.data.joinInfo.length; i++) {
        //     sendData['join_info_text[' + i + ']'] = that.data.joinInfo[i];
        //     sendData['join_info_require[' + i + ']'] = that.data.joinInfoId[i];
        // }
        for (let i = 0; i < that.data.nameInfo.length; i++) {
            // let index = i + 2;
            sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i];
            sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i];
        }
        getApp().request({
            url: 'org/make_bargain',
            data: sendData,
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {

                    wx.showLoading({
                        title: '正在发布',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)
                    
                    function closeLogin() {

                        wx.hideLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon:'success'
                        })
                        if (String(that.data.actId) == 'undefined') {

                            wx.navigateBack({ delta: 2 });

                        } else {

                            wx.navigateBack({})
                        }
                    }
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            }
        })
    },
    getStartTime: function(e) {
        this.setData({
            startDate: e.detail.value
        })
    },
    getEndTime: function(e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    getRule: function(e) {
        this.setData({
            rule: e.detail.value
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
    showOptions: function(e) {
        this.setData({
            isOptions: Boolean(Number(e.target.dataset.is))
        })
    },
    // 活动图片上传
    getImage: function(e) {
        let that = this
        wx.chooseImage({
            success: function(res) {

                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })

                if(size){
                    let actImage = [];  //图片数组
                    let actImg = [];  //图片数组ID
                    actImg.push(...that.data.actImg0)
                    actImage.push(...that.data.imageData)
                    actImage.push(...res.tempFilePaths)
                    that.setData({
                        imageData: actImage
                    })
                    let imgPath = res.tempFilePaths;  //图片数组

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
                                        actImg0: actImg,
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
    jianForm: function (e) {
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
    isMustEdit: function (e) {
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
    // 删除图片
    delImage: function (e) {

        let that = this;
        let index = Number(e.currentTarget.dataset.index)

        let actImage = that.data.imageData;
        let actImageId = that.data.actImg0;
        
        actImage.splice(index, 1);
        actImageId.splice(index, 1);

        that.setData({
            imageData: actImage,
            actImg0: actImageId,
        })
    }
})