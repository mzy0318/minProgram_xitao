// pages/manageCenters/manageActive/manageActive.js
var utils = require("../../../utils/util.js")
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
        del:1,
        isData:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;

        that.setData({
            url: options.url
        })

        // let pageType = wx.getStorageSync('pageType')
        // if (Number(pageType) == 1) {
        //     that.setData({
        //         btnText: '发布新拼团'
        //     })
        // } else if (Number(pageType) == 4) {
        //     that.setData({
        //         btnText: '发布新砍价'
        //     })
        // }
        // getApp().request({
        //     url: that.data.url,
        //     data: {
        //         page: that.data.pageNum,
        //     },
        //     method: 'post',
        //     success: res => {
        //         if (Number(pageType) == 1){
        //             for (let i = 0; i < res.data.data.list.length;i++){
        //                 res.data.data.list[i].coverImage = res.data.data.list[i].cover.url
        //             }
        //             // that.setData({
        //             //     coverImage: res.data.data.cover.url
        //             // })
        //         } else if (Number(pageType) == 4){
        //             for (let i = 0; i < res.data.data.list.length; i++) {
        //                 res.data.data.list[i].coverImage = res.data.data.list[i].banner_image_url
        //             }
        //         }
        //         this.setData({
        //             pageData: res.data.data.list
        //         })
        //         if (Number(res.data.code) == 0){
        //             wx.showToast({
        //                 title: res.data.msg,
        //                 icon: 'none',
        //             })
        //         }
        //     }
        // })
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
        let that = this;

        let pageType = wx.getStorageSync('pageType')
        if (Number(pageType) == 1) {
            that.setData({
                btnText: '发布新拼团'
            })
        } else if (Number(pageType) == 4) {
            that.setData({
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
                if (Number(pageType) == 1) {
                    if (res.data.data.list.length <= 0){
                        that.setData({
                            isData:false
                        })
                    }else{
                        that.setData({
                            isData: true
                        })
                    }
                    for (let i = 0; i < res.data.data.list.length; i++) {
                      res.data.data.list[i].coverImage = utils.rect(res.data.data.list[i].cover.url,200,100)
                    }
                    // that.setData({
                    //     coverImage: res.data.data.cover.url
                    // })
                } else if (Number(pageType) == 4) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                      res.data.data.list[i].coverImage = utils.rect(res.data.data.list[i].banner_image_url,200,100)
                    }
                }
                this.setData({
                    pageData: res.data.data.list
                })
                if (Number(res.data.code) == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
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
                if (Number(pageType) == 1) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].coverImage = res.data.data.list[i].cover.url
                    }
                    // that.setData({
                    //     coverImage: res.data.data.cover.url
                    // })
                } else if (Number(pageType) == 4) {
                    for (let i = 0; i < res.data.data.list.length; i++) {
                        res.data.data.list[i].coverImage = res.data.data.list[i].banner_image_url
                    }
                }
                this.setData({
                    pageData: res.data.data.list
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

                    // this.setData({
                    //     pageData: res.data.data.list
                    // })
                    pageDataArr.push(...res.data.data.list);
                    if (Number(pageType) == 1) {
                        for (let i = 0; i < pageDataArr.length; i++) {
                            pageDataArr[i].coverImage = pageDataArr[i].cover.url
                        }
                        // that.setData({
                        //     coverImage: res.data.data.cover.url
                        // })
                    } else if (Number(pageType) == 4) {
                        for (let i = 0; i < pageDataArr.length; i++) {
                            pageDataArr[i].coverImage = pageDataArr[i].banner_image_url
                        }
                    }
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
    // onShareAppMessage: function(res) {
    //     if (res.from === 'button') {
    //         // 来自页面内转发按钮
    //         console.log(res);
    //         return {
    //             path: '/pages/index/index'
    //         }
    //     }
    // },
    toback: function() {
        wx.navigateBack({

        })
    },
    toPersonList: function(e) {
        let pageType = wx.getStorageSync('pageType');
        if (Number(pageType == 1)){
            wx.setStorageSync('pageTypeStu', 3)
        } else if (Number(pageType == 4)){
            wx.setStorageSync('pageTypeStu', 6)
        } 
        
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
        let that = this;
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
                    if(Number(res.data.code)==1){
                        wx.showToast({
                            title: '删除成功',
                            icon:'success',
                            success:function(){
                                wx.redirectTo({
                                    url: '../manageActive/manageActive?url=org/bargain_list',
                                })
                            }
                        })
                    } else if (Number(res.data.code) == 0){
                        wx.showToast({
                            title: res.data.msg,
                            title:'none'
                        })
                    }
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
                    if (Number(res.data.code) == 1) {
                        wx.showToast({
                            title: '删除成功',
                            icon: 'success',
                            success:function(){
                                wx.redirectTo({
                                    url: '../manageActive/manageActive?url=org/personal_group_list',
                                })
                            }
                        })
                    } else if (Number(res.data.code) == 0) {
                        wx.showToast({
                            title: res.data.msg,
                            title: 'none'
                        })
                    }
                    // wx.navigateTo({
                    //     url: '../manageActive/manageActive?url=org/personal_group_list',
                    // })
                }
            })
        }
    },
    toKillPirce: function(e) {
        wx.setStorageSync('actTag', e.currentTarget.dataset.acttag)
        let pageType = wx.getStorageSync('pageType')
        //砍价活动
        if (Number(pageType) == 4) {
            wx.navigateTo({
                url: '../../killPrices/killPriceInfo/killPriceInfo?id=' + e.currentTarget.dataset.id + '&acttag=' + e.currentTarget.dataset.acttag,
            })
            //私人拼团
        } else if (Number(pageType) == 1) {
            wx.navigateTo({
                url: '../../collage/collageInfo/collageInfo?actId=' + e.currentTarget.dataset.id + '&acttag=' + e.currentTarget.dataset.acttag,
            })
        }

    },
    toSharePage:function(e){
        let pageType = wx.getStorageSync('pageType')
        
        //砍价活动
        if (Number(pageType) == 4) {
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/killPrices/killPriceInfo/killPriceInfo',
            })
            //私人拼团
        } else if (Number(pageType) == 1) {
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/collage/collageInfo/collageInfo',
            })
        }

    },
    getImage:function(e){
        let pageType = wx.getStorageSync('pageType')
            //砍价活动
        if (Number(pageType) == 4) {
            let url = 'pages/killPrices/killPriceInfo/killPriceInfo';
            let mzy = 'actid=' + e.currentTarget.dataset.id;
            wx.downloadFile({
                url: getApp().getEncodeImage(url, mzy),
                success: function (res) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }
            })
            //私人拼团
        } else if (Number(pageType) == 1) {
            let url = 'pages/collage/collageInfo/collageInfo';
            let mzy = 'actid=' + e.currentTarget.dataset.id;
            wx.downloadFile({
                url: getApp().getEncodeImage(url, mzy),
                success: function (res) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }
            })
        }
    }
})