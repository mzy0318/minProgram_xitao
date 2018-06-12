// pages/killPrices/killPriceInfo/killPriceInfo.js
const util = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow:true,
        isHidden:false,
        isClosed:'none',
        pageData:null,
        startTime:'',
        endTime:'',
        activeId:'',
        userName:'',
        userPhone:'',
        isOption:true,
        iconClose: 'iconfont icon-close iconStyle',
        iconOpen: 'iconfont icon-menu iconStyle',
        bannerImage:'',
        backgroundImage: '',
        bottomOption:true,  //底部功能
        musicClass:null,
        musicData:null,
        musicClassIndex:0,
        isMusicClass:true,
        isModel:true,
        isCommon:true,
        killPricePeople:'',
        actionOptions:true,
        backgroundMusic:'',
        musicId:'',
        activeImage:'',
        },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getStorageSync('loginCode')==1){
            this.setData({
                actionOptions:false
            })
        }else{
            this.setData({
                actionOptions: true
            })
        }
        
        
        getApp().request({
            url: 'bargain_act',
            data: {
                act_id: options.id,
                joiner_id:'0',
            },
            method: 'post',
            success: res => {
                this.setData({
                    pageData:res.data.data,
                    startTime: util.formatTime(new Date(res.data.data.start_time)),
                    endTime: util.formatTime(new Date(res.data.data.end_time)),
                    activeId: options.id,
                    bannerImage: res.data.data.banner_image_url,
                    backgroundImage: res.data.data.bg_image_url,
                    backgroundMusic: res.data.data.music,
                    musicId: res.data.data.music_id,
                    activeImage: res.data.data.act_image[0].url
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.title,
                })
            }
        })
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: options.id,
                joiner_id: '0',
                page:'1'
            },
            method: 'post',
            success: data => {
                console.log(data.data.data)
                this.setData({
                    killPricePeople: data.data.data,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
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
    priceRankOne:function(){
        this.setData({
            isShow:true,
            isHidden: false
        })
    },
    priceRankTwo: function () {
        this.setData({
            isShow: false,
            isHidden: true,
        })
    },
    isClose:function(e){
        this.setData({
            isClosed: e.currentTarget.dataset.display,
        })
    },
    toIndex:function(){
        wx.switchTab({
            url: '../../index/index',
        })
    },
    tellPhone:function(e){
        getApp().tellPhone(e)
    },
    toPricePerson:function(e){
        let personInfo = JSON.stringify(e.currentTarget.dataset)
        wx.navigateTo({
            url: '../killPricePerson/killPricePerson?personInfo=' + personInfo + '&nickName=' + e.currentTarget.dataset.nickname,
        })
    },
    joinActive:function(){
        getApp().request({
            url: 'join_bargain',
            data: {
                phone: this.data.userPhone,
                nickname: this.data.userName,
                act_id: this.data.activeId,
                info:''
            },
            method: 'post',
            success: res => {
                console.log(res)
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                })
            }
        })
    },
    getNickName:function(e){
        this.setData({
            userName: e.detail.value
        })
    },
    getPhone: function (e) {
        this.setData({
            userPhone: e.detail.value
        })
    },
    isOptions:function(){
        this.setData({
            isOption:!this.data.isOption
        })
    },
    switchModel:function(e){
        if (e.currentTarget.dataset.url =='org/music_list'){
            this.setData({
                isMusicClass: false,
                isModel:true,
                isCommon:false
            })
        } else if (e.currentTarget.dataset.url == 'org/banner_list'){
            this.setData({
                isMusicClass: true,
                isModel: false,
                isCommon:false
            })
        }
        
        getApp().request({
            url: e.currentTarget.dataset.url,
            data: {
            },
            method: 'post',
            success: res => {
                this.setData({
                    musicClass:res.data.data,
                    musicData: res.data.data[0].list
                })
            }
        })
    },
    upDataImg:function(e){
        let that = this;
        wx.chooseImage({
            count: 1, 
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:function(res){
                if (e.currentTarget.dataset.type =='banner'){
                    // wx.uploadFile({
                    //     url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                    //     filePath: res.tempFilePaths[0],
                    //     name: "file",
                    //     formData: {
                    //         "user": "test"
                    //     }
                    // })
                    that.setData({
                        bannerImage: res.tempFilePaths[0],
                        bottomOption: false
                    })
                }else{
                    that.setData({
                        backgroundImage: res.tempFilePaths[0],
                        bottomOption: false
                    })
                }
                
            }
        })
    },
    cancelImage:function(){
        this.setData({
            bannerImage: this.data.pageData.banner_image_url,
            backgroundImage: this.data.pageData.bg_image_url,
            backgroundMusic: this.data.pageData.music,
            isCommon: true,
            bottomOption: true,
        })
    },
    changeMusic:function(e){
        this.setData({
            backgroundMusic: e.currentTarget.dataset.music,
            musicId: e.currentTarget.dataset.musicid
        })
    },
    changeModel: function (e) {
        this.setData({
            bannerImage: e.currentTarget.dataset.image, 
            backgroundImage: e.currentTarget.dataset.bimage,
        })
    },
    comfireSubmit: function (e) {
        let that = this;
        getApp().request({
            url:'org/edit_music',
            data:{
                act_id: e.currentTarget.dataset.id,
                music_id: this.data.musicId,
                tag: wx.getStorageSync('actTag'),
            },
            method:'post',
            success:function(res){
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                })
                // that.setData({
                //     isCommon: true,
                //     bottomOption: true,
                // })
            }
        });
        getApp().request({
            url: 'org/edit_banner',
            data: {
                act_id: e.currentTarget.dataset.id,
                banner_image_url: this.data.bannerImage,
                tag: wx.getStorageSync('actTag'),
            },
            method: 'post',
            success: function (res) {
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                })
                that.setData({
                    isCommon: true,
                    bottomOption: true,
                })
            }
        })
    },
    toEditPage:function(){
        wx.navigateTo({
            url: '../../manageCenters/manageActive/manageActive',
        })
    },
    switchTabs:function(e){
        
        for (let i = 0; i < this.data.musicClass.length;i++){
            if (e.currentTarget.dataset.name == this.data.musicClass[i].name){
                this.setData({
                    musicData: this.data.musicClass[i].list,
                    musicClassIndex:i
                })
            }
        }
    },
})