// pages/manageCenters/chooseModel/chooseModel.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        pageTheme:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        getApp().request({
            url:'theme/list',
            data:{},
            method:'get',
            success:function(res){
                that.setData({
                    pageData: res.data.data,
                    pageTheme: res.data.data.theme
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
    switchTheme:function(e){
        let pageData = this.data.pageData
        for (let i = 0; i < pageData.catalog.length;i++){
            if (e.currentTarget.dataset.name=='全部'){
                this.setData({
                    pageTheme: pageData.theme
                })
            } else if (e.currentTarget.dataset.name == this.data.pageData.catalog[i].name){
                this.setData({
                    pageTheme: pageData.catalog[i].list,
                })
            }
        }
    },
    toManageEdit:function(e){
        let pageType = wx.getStorageSync('pageType');
        if (pageType==4){
            wx.navigateTo({
                url: '../manageEdit/manageEdit?image=' + e.currentTarget.dataset.image + '&id=undefined',
            })
        } else if (pageType == 1){
            wx.navigateTo({
                url: '../collageEdit/collageEdit?image=' + e.currentTarget.dataset.image + '&id=undefined',
            })
        } else if (pageType == 7){
            wx.navigateTo({
                url: '../videoEdit/videoEdit?image=' + e.currentTarget.dataset.image + '&id=undefined&isEdit=0&bg=' + e.currentTarget.dataset.bg,
            })
        }
        
    }
})