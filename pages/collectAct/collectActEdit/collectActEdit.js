let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        prizeDate: '',
        prizeTime: '',
        ruleContent: [],
        orgContent: [],
        isContent:true,
        contentIndex:0,
        isForm: true,
        nameInfo: [],
        nameInfoId: [],
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
            prizeDate: format.formatDate(new Date()),
            prizeTime: format.formatDate(new Date()),
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
        } else if (Number(e.target.dataset.id) == 2) {
            that.setData({
                prizeDate: e.detail.value,
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
    // 选中额外报名信息
    addNameOptions: function (e) {
        let that = this;
        let arr = that.data.nameInfo;
        let arrO = that.data.nameInfoId;

        if (arr.includes(e.target.dataset.value)){

        }else{
            arr.push(e.target.dataset.value);
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
        if(that.data.isEdit == 0){
            sendData['id'] = '';
        }else if(that.data.isEdit == 1){

        }
        sendData['start_time'] = that.data.startDate;
        sendData['end_time'] = that.data.endDate;
        sendData['prize_time'] = that.data.prizeDate;
        sendData['act_set'] = {'amount': e.detail.value.amount,'prize': e.detail.value.prize};
        delete sendData.amount;
        delete sendData.prize;
        sendData['rule'] = JSON.stringify(that.data.ruleContent);
        sendData['org_intro'] = JSON.stringify(that.data.orgContent);
        if (that.data.nameInfo.length > 0){
            for (let i = 0; i < that.data.nameInfo.length;i++){
                sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i]
                sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i]
            }
        }
        console.log('sendData', sendData);
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
        if (that.data.contentIndex == 0) {
            // 活动规则图片
            let ruleContent = that.data.ruleContent;
            if (JSON.stringify(ruleContent) == '[]'){

                ruleContent.push({ 'text':'', 'images': [] });

            }else {
                return 
            }
            let images = ruleContent[ruleContent.length - 1].images;
            wx.chooseImage({
                success: function (res) {
                    images.push(...res.tempFilePaths);
                    ruleContent[ruleContent.length - 1].images;
                    that.setData({
                        ruleContent: ruleContent
                    })
                },
            });
        } else if (that.data.contentIndex == 1) {
            // 机构介绍图片
            let orgContent = that.data.orgContent;
            if (JSON.stringify(orgContent) == '[]') {

                orgContent.push({ 'text': '', 'images': [] });

            } else {
                return
            }
            let images = orgContent[orgContent.length - 1].images;
            wx.chooseImage({
                success: function (res) {
                    images.push(...res.tempFilePaths);
                    orgContent[orgContent.length - 1].images;
                    that.setData({
                        orgContent: orgContent
                    })
                },
            });
        }
    },
})