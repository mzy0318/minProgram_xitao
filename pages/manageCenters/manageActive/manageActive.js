// pages/manageCenters/manageActive/manageActive.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        btnText: '',
        url:'',
        pageNum:1,
        coverImage:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.setData({
            url: options.url
        })

        let pageType = wx.getStorageSync('pageType')
        if (Number(pageType) == 1) {
            this.setData({
                btnText: '发布新拼团'
            })
        } else if (Number(pageType) == 4) {
            this.setData({
                btnText: '发布新砍价'
            })
        }
        getApp().request({
            url: options.url,
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: res => {
                if (Number(pageType) == 1){
                    for (let i = 0; i < res.data.data.list.length;i++){
                        res.data.data.list[i].coverImage = res.data.data.list[i].cover.url
                    }
                    // that.setData({
                    //     coverImage: res.data.data.cover.url
                    // })
                } else if (Number(pageType) == 4){
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].coverImage = res.data.data.list[i].banner_image_url
                    }
                }
                this.setData({
                    pageData: res.data.data.list
                })
                if (Number(res.data.code) == 0){
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
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
        let that = this;
        that.setData({
            url: that.data.url
        })

        let pageType = wx.getStorageSync('pageType')
        if (pageType == 1) {
            this.setData({
                btnText: '发布新拼团'
            })
        } else if (pageType == 4) {
            this.setData({
                btnText: '发布新砍价'
            })
        }
        getApp().request({
            url: that.data.url,
            data: {
                page: that.data.pageNum,
            },
            method: 'post',
            success: res => {
                this.setData({
                    pageData: res.data.data
                })
                wx.stopPullDownRefresh()
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let that = this
        let pageType = wx.getStorageSync('pageType');
        let pageDataArr = [];
        pageDataArr.push(...that.data.pageData)
        if (pageType == 1) {
            this.setData({
                btnText: '发布新拼团'
            })
        } else if (pageType == 4) {
            this.setData({
                btnText: '发布新砍价'
            })
        }
        if (that.data.pageData.length >= that.data.pageNum * 10){
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: that.data.url,
                data: {
                    page: that.data.pageNum,
                },
                method: 'post',
                success: res => {
                    pageDataArr.push(...res.data.data)
                    this.setData({
                        pageData: pageDataArr
                    })
                }
            })
        }else{
            wx.showToast({
                title: '到底啦',
                icon: 'none'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    toback: function() {
        wx.navigateBack({

        })
    },
    toPersonList: function(e) {
        wx.navigateTo({
            url: '../../killPrices/killPriceList/killPriceList?id=' + e.currentTarget.dataset.id,
        })
    },
    tomanageEdit: function(e) {
        let pageType = wx.getStorageSync('pageType')
        if (pageType == 4) {
            wx.navigateTo({
                url: '../manageEdit/manageEdit?id=' + e.currentTarget.dataset.id,
            })
        } else if (pageType == 1) {
            wx.navigateTo({
                url: '../collageEdit/collageEdit?id=' + e.currentTarget.dataset.id,
            })
        }
    },
    toChooseModel: function() {
        wx.navigateTo({
            url: '../chooseModel/chooseModel',
        })
    },
    delActive: function(e) {
        let pageType = wx.getStorageSync('pageType')
        if (Number(pageType) == 4) {
            getApp().request({
                url: 'org/delete_act',
                data: {
                    act_id: e.currentTarget.dataset.actid,
                    act_tag: e.currentTarget.dataset.acttag,
                },
                method: 'post',
                success: function(res) {
                    wx.navigateTo({
                        url: '../manageActive/manageActive?url=org/bargain_list',
                    })
                }
            })
        } else if (Number(pageType) == 1) {
            getApp().request({
                url: 'org/delete_act',
                data: {
                    act_id: e.currentTarget.dataset.actid,
                    act_tag: e.currentTarget.dataset.acttag,
                },
                method: 'post',
                success: function(res) {
                    wx.navigateTo({
                        url: '../manageActive/manageActive?url=org/personal_group_list',
                    })
                }
            })
        }
    },
    toKillPirce: function(e) {
        wx.setStorageSync('actTag', e.currentTarget.dataset.acttag)
        let pageType = wx.getStorageSync('pageType')
        //砍价活动
        if (pageType == 4) {
            wx.navigateTo({
                url: '../../killPrices/killPriceInfo/killPriceInfo?id=' + e.currentTarget.dataset.id,
            })
            //私人拼团
        } else if (pageType == 1) {
            wx.navigateTo({
                url: '../../collage/collageInfo/collageInfo?actId=' + e.currentTarget.dataset.id + '&acttag=' + e.currentTarget.dataset.acttag,
            })
        }

    }
})