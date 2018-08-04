// pages/collectAct/collectActManList/collectActManList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.getPageData();
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
        that.getPageData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
    // 页面功能
    pageOpt:function(e){
        let that = this;
        if (e.currentTarget.dataset.id == 0){
            //返回
            wx.navigateBack({})
        } else if (e.currentTarget.dataset.id == 1){
            wx.navigateTo({
                url: '../collectActEdit/collectActEdit?isEdit=0',
            })
        }
    },
    // 活动详情页面
    toActInfo:function(e){
        let that = this;
        wx.navigateTo({
            url: '../collectActInfo/collectActInfo',
        })
    },
    // 活动功能
    actOpts:function(e){
        let that = this;
        if (e.currentTarget.dataset.id == 0){
            // 删除
            getApp().request({
                url:'org/sugar/delete',
                data:{
                    id: e.currentTarget.dataset.actid,
                },
                method:'post',
                success:function(res){
                    if(res.data.code == 1){
                        wx.showLoading({
                            title: '正在删除',
                            mask: true,
                        })
                        setTimeout(closeLogin, 2000);
                        function closeLogin() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                success: function () {
                                    that.getPageData()
                                }
                            })
                        }
                    }
                }
            })
        } else if (e.currentTarget.dataset.id == 1){
            //编辑
            wx.navigateTo({
                url: '../collectActEdit/collectActEdit?isEdit=1&actId=' + e.currentTarget.dataset.actid,
            })
        } else if (e.currentTarget.dataset.id == 2){
            //分享
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/collectAct/collectActInfo/collectActInfo&actTag=' + e.currentTarget.dataset.acttag,
            })
        }
    },
    // 获取页面数据
    getPageData:function(e){
        let that = this;
        getApp().request({
            url:'org/sugar/list',
            data:{},
            method:'get',
            success:function(res){
                if(res.data.code == 1){
                    
                }
            }
        })
    }
})