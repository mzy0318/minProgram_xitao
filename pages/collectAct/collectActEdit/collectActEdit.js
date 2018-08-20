let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        // prizeDate: '',
        prizeTime: '',
        actSet: [1,1,1,1],  //优惠设置
        ruleContent: [],
        orgContent: [],
        isContent:true,
        contentIndex:0,
        isForm: true,
        nameInfo: [],
        nameInfoId: [],
        bannerImage:'',
        actId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let currentDate = new Date().valueOf() + 604800000;
        // 开始日期  截止日期
        that.setData({
            startDate: format.formatDate(new Date()),
            startTime: format.formatDate(new Date()),
            endDate: format.formatDate(new Date(currentDate)),
            endTime: format.formatDate(new Date(currentDate)),
            isEdit:options.isEdit,
        })
        if(that.data.isEdit == 0){
            wx.setNavigationBarTitle({
                title: '发布新活动',
            })
            that.setData({
                bannerImage:options.image,
            })
        } else if (that.data.isEdit == 1){
            wx.setNavigationBarTitle({
                title: '编辑活动',
            })
            that.setData({
                actId:options.actId
            })
            getApp().request({
                url:'org/sugar',
                data:{
                    id:that.data.actId,
                },
                method:'get',
                success:function(res){
                    if(res.data.code == 1){
                        let nameInfo = [];
                        let nameInfoId = [];
                        let actSet = that.data.actSet;
                        if (res.data.data.join_info.length>0){
                            for (let i = 0; i < res.data.data.join_info.length;i++){
                                nameInfo.push({ name: res.data.data.join_info[i].text, id: res.data.data.join_info[i].require})
                                nameInfoId.push(res.data.data.join_info[i].require)
                            }
                        }
                        if (res.data.data.act_set.length > 0){
                            for (let i = 0; i < res.data.data.act_set.length;i++){
                                actSet[i] = res.data.data.act_set[i]
                            }
                        }
                        that.setData({
                            bannerImage: res.data.data.banner_image_url,
                            pageData:res.data.data,
                            ruleContent: res.data.data.rule,
                            orgContent: res.data.data.org_intro,
                            nameInfo: nameInfo,
                            nameInfoId: nameInfoId,
                            startDate: format.formatDate(new Date(res.data.data.start_time*1000)),
                            endDate: format.formatDate(new Date(res.data.data.end_time * 1000)),
                            actSet: actSet,
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
    // 添加优惠设置
    // addActset:function(e){
    //     let that = this;
    //     if (e.target.dataset.id == '1'){
    //         let actSet = that.data.actSet;
    //         actSet.push({display:false});
    //         that.setData({
    //             actSet: actSet,
    //         })
    //     } else if (e.target.dataset.id == '0'){
    //         let actSet = that.data.actSet;
    //         actSet[e.target.dataset.index].display = true
    //         that.setData({
    //             actSet: actSet,
    //         })
    //     }
    //     console.log('actSet', that.data.actSet)
    // },
    // 获取日期
    getDate: function(e) {
        let that = this;
        if (Number(e.target.dataset.id) == 0) {
            // 开始日期
            that.setData({
                startDate: e.detail.value,
            })
        } else if (Number(e.target.dataset.id) == 1) {
            // 结束日期
            that.setData({
                endDate: e.detail.value,
            })
        }
    },
    // 添加文字
    addText:function(e){
        let that = this;
        that.setData({
            isContent:false,
            contentIndex: e.currentTarget.dataset.contentindex,
        })
    },
    // 添加额外报名信息
    showOptions: function (e) {
        this.setData({
            isForm: Boolean(Number(e.target.dataset.is))
        })
    },
    //显示额外报名页面
    addForm: function (e) {
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
    // 删除报名信息
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
    // 报名信息是否为必填
    isMustEdit: function (e) {
        let that = this;
        let nameInfo = that.data.nameInfo;
        let nameInfoId = that.data.nameInfoId
        if (e.detail.value) {
            nameInfo[e.target.dataset.index].id = 1
            nameInfoId[e.target.dataset.index] = 1
        } else {
            nameInfo[e.target.dataset.index].id = 0
            nameInfoId[e.target.dataset.index] = 0
        }
        that.setData({
            nameInfo: nameInfo,
            nameInfoId: nameInfoId
        })
    
    },
    // 选中额外报名信息
    addNameOptions: function (e) {
        let that = this;
        let arr = that.data.nameInfo;
        let arrO = that.data.nameInfoId;
        let isTrue = '';
        for(let i = 0;i<arr.length;i++){
            if (e.target.dataset.value == arr[i].name){
                isTrue = true
            }else{
                isTrue = false
            }
        }
        if (isTrue){

        }else{
            arr.push({name:e.target.dataset.value,id:0});
            arrO.push(0);
            that.setData({
                nameInfo: arr,
                nameInfoId: arrO
            })
        }
    },
    // 输入文字
    getText: function(e) {
        let that = this;
        if(that.data.contentIndex == 0){
            // 活动规则文字
            let ruleContent = that.data.ruleContent;
            ruleContent.push({ 'text': e.detail.value.content, 'images': [] });
            that.setData({
                isContent: true,
                ruleContent: ruleContent,
            })
        } else if (that.data.contentIndex == 1){
            // 机构介绍文字
            let orgContent = that.data.orgContent;
            orgContent.push({ 'text': e.detail.value.content, 'images': [] });
            that.setData({
                isContent: true,
                orgContent: orgContent,
            })
        }
    },
    // 发布活动
    submitData: function(e) {
        let that = this;
        let sendData = e.detail.value;
        let actSet = [];
        if(that.data.isEdit == 0){
            sendData['id'] = '';
        }else if(that.data.isEdit == 1){
            sendData['id'] = that.data.actId;
        }
        sendData['start_time'] = that.data.startDate;
        sendData['end_time'] = that.data.endDate;
        sendData['rule'] = JSON.stringify(that.data.ruleContent);
        sendData['org_intro'] = JSON.stringify(that.data.orgContent);
        sendData['banner_image_url'] = that.data.bannerImage;
        if (that.data.nameInfo.length > 0){
            for (let i = 0; i < that.data.nameInfo.length;i++){
                sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i].name
                sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i]
            }
        }
        for (let i = 0; i < that.data.actSet.length;i++){
            if (sendData['amount' + i] != ''){
                actSet.push({ amount: parseInt(sendData['amount' + i]), prize: sendData['prize' + i]})
            }
            delete sendData['amount' + i];
            delete sendData['prize' + i];
        }
        sendData['act_set'] = JSON.stringify(actSet);
        getApp().request({
            url:'org/sugar/add',
            data: sendData,
            method:'post',
            success:function(res){
                if(res.data.code == 1){
                    wx.showLoading({
                        title: '正在发布',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000);
                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            success: function () {
                                if(that.data.isEdit == 0){
                                    wx.navigateBack({delta:2})
                                } else if (that.data.isEdit == 1){
                                    wx.navigateBack({})
                                }
                            }
                        })
                    }
                }
            }
        })
    },
    // 添加图片
    chooseImage: function (e) {
        let that = this;
        that.setData({
            contentIndex: e.currentTarget.dataset.contentindex,
        });
        if (e.currentTarget.dataset.contentindex == 0) {
            // 活动规则图片
            let ruleContent = that.data.ruleContent;
            if (JSON.stringify(ruleContent) == '[]'){
                ruleContent.push({ 'text':'', 'images': [] });
            }
            let images = ruleContent[ruleContent.length - 1].images;
            wx.chooseImage({
                success: function (res) {
                    let imgArr = res.tempFiles;
                    let size = imgArr.every((item, index, arr) => {
                        return item.size < 6291456
                    })
                    if(size){

                        wx.showLoading({
                            title: '图片上传中...',
                            mask: true,
                        })

                        var header = {};
                        header.Cookie = wx.getStorageSync('cookie');
                        header['Content-Type'] = 'multipart/form-data';

                        for (let i = 0; i < imgArr.length; i++){
                            getApp().uploadFile({
                                url: 'upload',
                                filePath: imgArr[i].path,
                                success: function (res) {
                                    if (Number(res.code) == 1) {
                                        images.push(res.data.res);
                                        that.setData({
                                            ruleContent: ruleContent
                                        })
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
                        }
                    }else{
                        wx.showToast({
                            title: '选择图片必须小于6M',
                            icon: 'none'
                        })
                    }
                },
            });
        } else if (e.currentTarget.dataset.contentindex == 1) {
            // 机构介绍图片
            let orgContent = that.data.orgContent;
            if (JSON.stringify(orgContent) == '[]') {
                orgContent.push({ 'text': '', 'images': [] });
            }
            let images = orgContent[orgContent.length - 1].images;
            wx.chooseImage({
                success: function (res) {

                    let imgArr = res.tempFiles;
                    let size = imgArr.every((item, index, arr) => {
                        return item.size < 6291456
                    })
                    if (size) {

                        wx.showLoading({
                            title: '图片上传中...',
                            mask: true,
                        })

                        var header = {};
                        header.Cookie = wx.getStorageSync('cookie');
                        header['Content-Type'] = 'multipart/form-data';

                        for (let i = 0; i < imgArr.length; i++) {
                            getApp().uploadFile({
                                url: 'upload',
                                filePath: imgArr[i].path,
                                success: function (res) {
                                    if (Number(res.code) == 1) {
                                        images.push(res.data.res);
                                        that.setData({
                                            orgContent: orgContent
                                        })
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
                        }
                    } else {
                        wx.showToast({
                            title: '选择图片必须小于6M',
                            icon: 'none'
                        })
                    }
                },
            });
        }
    },
})