let format = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData: '',
        statusText:'活动进行中',
        statusColor:'green',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
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
        that.getPageData();
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
    // 查看报名列表
    toJoinList:function(e){
        let that = this;
        wx.navigateTo({
            url: '../collectActJoinerList/collectActJoinerList?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 页面功能
    pageOpt: function(e) {
        let that = this;
        if (e.currentTarget.dataset.id == 0) {
            //返回
            wx.navigateBack({})
        } else if (e.currentTarget.dataset.id == 1) {
            //新建活动
            wx.navigateTo({
                url: '../../manageCenters/chooseModel/chooseModel',
            })
        }
    },
    // 活动详情页面
    toActInfo: function(e) {
        let that = this;
        wx.navigateTo({
            url: '../collectActInfo/collectActInfo?actId=' + e.currentTarget.dataset.actid,
        })
    },
    // 活动功能
    actOpts: function(e) {
        let that = this;
        if (e.currentTarget.dataset.id == 0) {
            // 删除
            getApp().request({
                url: 'org/sugar/delete',
                data: {
                    id: e.currentTarget.dataset.actid,
                },
                method: 'post',
                success: function(res) {
                    if (res.data.code == 1) {
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
                                success: function() {
                                    that.getPageData()
                                }
                            })
                        }
                    }
                }
            })
        } else if (e.currentTarget.dataset.id == 1) {
            //编辑
            wx.navigateTo({
                url: '../collectActEdit/collectActEdit?isEdit=1&actId=' + e.currentTarget.dataset.actid,
            })
        } else if (e.currentTarget.dataset.id == 2) {
            //分享
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?actId=' + e.currentTarget.dataset.actid + '&title=' + e.currentTarget.dataset.title + '&page=pages/collectAct/collectActInfo/collectActInfo&actTag=' + e.currentTarget.dataset.acttag,
            })
        }
    },
    // 获取页面数据
    getPageData: function(e) {
        let that = this;
        getApp().request({
            url: 'org/sugar/list',
            data: {},
            method: 'get',
            success: function(res) {
                if (res.data.code == 1) {
                    wx.stopPullDownRefresh()

                    for (let i = 0; i < res.data.data.list.length; i++) {
                        if (res.data.data.list[i].end_time*1000 > new Date().valueOf()){
                            res.data.data.list[i].statusText = '活动进行中';
                            res.data.data.list[i].statusColor = 'green';
                        } else if (res.data.data.list[i].end_time * 1000 <= new Date().valueOf()){
                            res.data.data.list[i].statusText = '活动已结束';
                            res.data.data.list[i].statusColor = 'red';
                        }
                        res.data.data.list[i].start_time = format.formatTime(new Date(res.data.data.list[i].start_time*1000));
                        res.data.data.list[i].end_time = format.formatTime(new Date(res.data.data.list[i].end_time*1000));
                        res.data.data.list[i].banner_image_url = format.rect(res.data.data.list[i].banner_image_url,200,100)
                    }
                    that.setData({
                        pageData: res.data.data.list
                    })
                }
            }
        })
    }
})