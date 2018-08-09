// pages/killPrices/killPricePerson/killPricePerson.js
const util = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        peopleData: '',
        backgroundImage: '',
        endTime: '',
        joinInfo: '',
        joinName:'',
        actId:'',
        joinId:'',
        rangPage:1,
        peopleDataList:'',
        isPay:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pages = getCurrentPages()
        let url = pages[pages.length - 1].route
        let mzy = 'actid:' + options.actId + ':joinid:' + options.joinId;
        if (options.scene != undefined){
            let scene = decodeURIComponent(options.scene);
            let sceneArr = scene.split(':');
            that.setData({
                actId: sceneArr[1],
                joinId: sceneArr[3],
            })
        }else{
            that.setData({
                actId: options.actId,
                joinId: options.joinId,
            })
        }
        
        this.setData({
            joinInfo: options,
            encodeID: 'https://www.zhihuizhaosheng.com/scene_code?org_id=' + getApp().getExtConfig().orgId + '&page=' + url + '&scene=' + mzy
        })
        //页面数据
        that.getPageData()
        // 排行榜数据
        that.getRangeDate()
        
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
        let that = this;
        that.setData({
            rangPage: 1
        });
        that.getPageData();
        that.getRangeDate();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.peopleDataList);
        if (that.data.peopleDataList.length >= that.data.rangPage * 10) {
            that.setData({
                rangPage: rangPage + 1,
            })
            getApp().request({
                url: 'bargain_range',
                data: {
                    act_id: that.data.actId,
                    joiner_id: that.data.joinId,
                    page: that.data.rangPage
                },
                method: 'post',
                success: res => {
                    if (Number(res.data.code) == 1) {
                        pageDataArr.push(...res.data.data.list)
                        this.setData({
                            peopleData: res.data.data,
                            peopleDataList: pageDataArr,
                        })
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                        })
                    }
                }
            });
        } 
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 支付页面
    toPayPage:function(e){
        let that = this;
        wx.navigateTo({
            url: '../../courses/orderInfo/orderInfo?joinId=' + that.data.joinId + '&actTag=' + e.currentTarget.dataset.acttag + '&actId=' + that.data.actId,
        })
       
    },
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    helpHer: function () {
        let that = this;
        getApp().request({
            url: 'bargain',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            method: 'post',
            success: function (res) {
                if (Number(res.data.code)==1) {
                    wx.showToast({
                        title: '帮TA砍了' + res.data.data.reduce+'元',
                        icon: 'success'
                    })
                } else if(Number(res.data.code)==0){
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }

            }
        })
    },
    toBack: function (e) {
        wx.navigateBack({})
    },
    // 刷新
    getJoinerList:function(){
        let that = this;
        that.setData({
            rangPage:1
        })
        that.getRangeDate()
    },
    // 回主页
    toIndex: function () {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    setUrl: function () {
        wx.setClipboardData({
            data: 'data',
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                    icon:'success',
                })
            }
        })
    },
    shareFriends: function () {
        let that = this;
        wx.showLoading({
            title: '正在生成中...',
            mask: true,
        })
        setTimeout(function () {
            wx.hideLoading();

            wx.previewImage({
                urls: [that.data.encodeID],
            })
        }, 1500)
    },
    // 获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url: 'bargain_act',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
            },
            method: 'post',
            success: res => {
                wx.stopPullDownRefresh()
                //能否可能支付

                if (res.data.data.could_pay != undefined){
                    if (res.data.data.could_pay){
                        that.setData({
                            isPay: false,
                        })
                    }else{
                        that.setData({
                            isPay: true,
                        })
                    }
                }
                that.setData({
                    pageData: res.data.data,
                    backgroundImage: res.data.data.act_image[0].url,
                    endTime: util.formatTime(new Date(res.data.data.end_time * 1000)),
                })
                wx.setNavigationBarTitle({
                    title: res.data.data.title,
                })
            }
        });
    },
    // 获取排行数据
    getRangeDate:function(e){
        let that = this;
        getApp().request({
            url: 'bargain_range',
            data: {
                act_id: that.data.actId,
                joiner_id: that.data.joinId,
                page: that.data.rangPage
            },
            method: 'post',
            success: res => {
                if (Number(res.data.code) == 1) {
                    wx.stopPullDownRefresh()
                    that.setData({
                        peopleDataList: res.data.data.list,
                        peopleData: res.data.data,
                    })
                } else if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        });
    }
})