// pages/killPrices/killPriceList/killPriceList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList:'',
        isPersonInfo:true,
        personInfo:'',
        oriData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let pageType = wx.getStorageSync('pageType');
    
        if (pageType == 4){
            getApp().request({
                url: "org/bargain_joiner_list",
                method: "post",
                data: {
                    id: options.id
                },
                success: res => {
                    wx.setNavigationBarTitle({
                        title: '砍价报名列表',
                    })
                    this.setData({
                        userList: res.data.data.list
                    })
                }
            })
        } else if (pageType == 1){
            getApp().request({
                url: "personal_group_range",
                method: "post",
                data: {
                    act_id: options.id,
                    page:'1',
                },
                success: res => {
                    let userData = res.data.data.list;

                    for (let i = 0; i < userData.length; i++) {
                        if (userData[i].is_leader == 1) {
                            userData[i].is_leader = '团长'
                        } else if (userData[i].is_leader == 0) {
                            userData[i].is_leader = '团员' 
                        }
                    }
                    wx.setNavigationBarTitle({
                        title: '私人拼团报名列表',
                    })
                    this.setData({
                        userList: userData,
                        oriData: res.data.data.list,
                    })
                    console.log('res.data.data.list', res.data.data.list)
                }
            })
        } else if (pageType == 2){
            getApp().request({
                url:'',
                method:'',
                data:{},
                success:function(){
                    
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
    tellPhone: function (e) {
        getApp().tellPhone(e)
    },
    toPricePerson: function (e) {
        let sendData = JSON.stringify(e.currentTarget.dataset)
        let pageType = wx.getStorageSync('pageType');
        if (pageType==4){
            wx.navigateTo({
                url: '../killPricePerson/killPricePerson?personInfo=' + sendData,
            })
        } else if (pageType == 1){
            wx.navigateTo({
                url: '../../collage/collagePersonInfo/collagePersonInfo?actId=' + e.currentTarget.dataset.actid + '&joinId=' + e.currentTarget.dataset.joinerid,
            })
        }
    },
    toPriceListInfo: function (e) {
        let pageType = wx.getStorageSync('pageType')
        if (pageType==4){
            wx.navigateTo({
                url: '../killPriceListInfo/killPriceListInfo?actId=' + e.currentTarget.dataset.actid,
            })
        } else if (pageType == 1){
            let userData = this.data.userList;
            for (let i = 0; i < userData.length; i++) {
                if (this.data.oriData[i].can_join) {
                    this.data.oriData[i].can_join = '正在进行'
                } else {
                    this.data.oriData[i].can_join = '已经结束'
                }

            }
            this.setData({
                isPersonInfo:false,
                personInfo: this.data.oriData[e.currentTarget.dataset.index]
            })
        }
    },
    hiddenInfo:function(){
        this.setData({
            isPersonInfo: true,
        })
    }
})