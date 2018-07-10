// pages/goodLesson/manLessonList/manLessonList.js
var utils = require("../../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageNum:1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let that = this
        // getApp().request({
        //     url:'org/lesson_one_list',
        //     data:{
        //         page:that.data.pageNum,
        //     },
        //     method:'post',
        //     success:function(res){
        //         if(Number(res.data.code) == 1){
        //             that.setData({
        //                 pageData: res.data.data
        //             })
        //         } else if (Number(res.data.code) == 0){
        //             wx.showToast({
        //                 title: res.data.msg,
        //                 icon:'none',
        //             })
        //         }
        //     }
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    loadData:function(){
      let that = this
      getApp().request({
        url: 'org/lesson_one_list',
        data: {
          page: that.data.pageNum,
        },
        method: 'post',
        success: function (res) {
          wx.stopPullDownRefresh()

          if (Number(res.data.code) == 1) {
            res.data.data = utils.map(res.data.data,function(one){
              one.cover.url = utils.rect(one.cover.url,200,100)
              return one
            })
            that.setData({
              pageData: res.data.data
            })
          } else if (Number(res.data.code) == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
          }
        }
      })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loadData()
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
      this.loadData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.pageData)
        if (that.data.pageData.length >= that.data.pageNum * 10){
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'org/lesson_one_list',
                data: {
                    page: that.data.pageNum,
                },
                method: 'post',
                success: function (res) {
                    pageDataArr.push(...res.data.data)
                    that.setData({
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
    // onShareAppMessage: function () {
    //     return {
    //         path:'pages/index/index'
    //     }
    // },
    delActive:function(e){
        getApp().request({
            url:'org/delete_act',
            data:{
                act_id: e.currentTarget.dataset.id,
                act_tag: e.currentTarget.dataset.acttag
            },
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        success:function(){
                            wx.redirectTo({
                                url: '../manLessonList/manLessonList',
                            })
                        }
                    })
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        // success: function () {
                        //     wx.redirectTo({
                        //         url: '../manLessonList/manLessonList',
                        //     })
                        // }
                    })
                }
            }
        })
    },
    toLessonEdit:function(e){
        wx.navigateTo({
            url: '../../manageCenters/oneLessonEdit/oneLessonEdit?actNiceId=' + e.currentTarget.dataset.id,
        })
    },
    taBack:function(){
        wx.navigateBack({
        })
    },
    toLessonInfo:function(e){
        wx.navigateTo({
            url: '../lessonListInfo/lessonListInfo?actId=' + e.currentTarget.dataset.id,
        })
    },
    toLessonPeople:function(e){
        wx.navigateTo({
            url: '../goodLessonPeople/goodLessonPeople?id=' + e.currentTarget.dataset.id,
        })
    },
    sharePage:function(e){
        wx.navigateTo({
            url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/goodLesson/lessonListInfo/lessonListInfo',
        })
    }
})