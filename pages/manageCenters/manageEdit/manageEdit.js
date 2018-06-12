// pages/manageCenters/manageEdit/manageEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:true,
        isHidden:false,
        isShowO: true,
        isHiddenO: false,
        getbargainType:'',
        getBargainLimitType:'',
        startDate: '2016-09-01',
        endDate: '2016-09-01',
        rule:'',
        nameInfo:['姓名','电话'],
        nameInfoId:[1,1],
        isOptions:true,
        imageData:null,
        editTitle:undefined,
        backgroundImage:' ',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this
        if (options.id=='undefined'){
            this.setData({
                backgroundImage: options.image
            })
        }else{
            getApp().request({
                url: 'org/make_bargain',
                data: {
                    id: options.id
                },
                method: 'get',
                success: function (res) {
                    that.setData({
                        editTitle: res.data.data.title,
                        startDate: res.data.data.start_time,
                        endDate: res.data.data.end_time,
                        backgroundImage: res.data.data.banner_image_url
                    })
                }
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
    onShareAppMessage: function () {

    },
    switchTab: function (e) {
        this.setData({
            isShow:!this.data.isShow,
            isHidden:!this.data.isHidden,
            getbargainType: e.currentTarget.dataset.value,
        })
    },
    switchTabO: function (e) {
        this.setData({
            isShowO: !this.data.isShowO,
            isHiddenO: !this.data.isHiddenO,
            getBargainLimitType: e.currentTarget.dataset.value
        })
    },
    getFormData:function(e){
        let sendData = {
            title: e.detail.value.title,
            original_price: e.detail.value.original_price,
            now_price: e.detail.value.now_price,
            pay_status: e.detail.value.pay_status?1:0,
            start_time: this.data.startDate,
            end_time: this.data.endDate,
            joiner_limit: e.detail.value.joiner_limit,
            telephone: e.detail.value.telephone,
            address: e.detail.value.address,
            rule: this.data.rule,
            join_info_require: this.data.nameInfoId,
            join_info_text: this.data.nameInfo,
            act_image: this.data.imageData ? this.data.imageData:[],
            bargain_type: this.data.getbargainType ? this.data.getbargainType:1,
            bargain_limit_type: this.data.getBargainLimitTyp ? this.data.getBargainLimitType:1,
            bargain_param: e.detail.value.bargain_paramO ? e.detail.value.bargain_paramO : e.detail.value.bargain_paramT,
            banner_image_url: this.data.backgroundImage,
            status: e.detail.value.joiner_limit?1:0,
        }
        getApp().request({
            url: 'org/make_bargain',
            data: sendData,
            method:'post',
            success: res => {
                wx.showToast({
                    title: res.data.msg,
                    icon:'none'
                })
                if(res.data.code==1){
                    wx.navigateTo({
                        url: '../manageActive/manageActive',
                    })
                }
            }
        })
    },
    getStartTime:function(e){
        this.setData({
            startDate: e.detail.value
        })
    },
    getEndTime: function (e) {
        this.setData({
            endDate: e.detail.value
        })
    },
    getRule:function(e){
        this.setData({
            rule: e.detail.value
        })
    },
    addNameOptions:function(e){
        let arr = this.data.nameInfo;
        let arrO = this.data.nameInfoId
        arr.push(e.target.dataset.value);
        arrO.push(0);
        this.setData({
            nameInfo: arr,
            nameInfoId: arrO
        })
    },
    showOptions:function(e){
        this.setData({
            isOptions:Boolean(Number(e.target.dataset.is))
        })
    },
    getImage:function(e){
        let that = this
        wx.chooseImage({
            success: function(res) {
                that.setData({
                    imageData: res.tempFilePaths
                })

            },
        })
    },
})