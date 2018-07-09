// pages/baseOptions/sharePage/sharePage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        urlAddress:'',
        urlBigAddress:'',
        enCodeImage:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let sendData = {};
        sendData['id'] = Number(options.actId); 
        sendData['page'] = options.page;
        sendData['title'] = options.title;
        sendData['scale'] = 0.3;
        sendData['org_id'] = String(getApp().getExtConfig().orgId);
        sendData['visitor_id'] = String(wx.getStorageSync('visitorId'));
        //二维码地址
        let mzy = 'actid=' + sendData.id + '&acttag=' + undefined;
        that.setData({
            pageData: getApp().globalData.userInfo,
            urlAddress: 'https://www.zhihuizhaosheng.com/placard?id=' + sendData.id + '&page=' + sendData.page + '&title=' + sendData.title + '&scale=0.3&org_id=' + sendData.org_id + '&visitor_id=' + sendData.visitor_id,
            urlBigAddress: 'https://www.zhihuizhaosheng.com/placard?id=' + sendData.id + '&page=' + sendData.page + '&title=' + sendData.title + '&scale=0.5&org_id=' + sendData.org_id + '&visitor_id=' + sendData.visitor_id,
            enCodeImage: getApp().getEncodeImage(sendData.page,mzy)
        })
        // getApp().request({
        //     url:'placard',
        //     data:sendData,
        //     method:'get',
        //     sucess:function(res){
        //         console.log(res)
        //     }        
        // })
        
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
        return {
            path:'/pages/index/index'
        }
    },
    saveImage:function(){
        let that = this;
        wx.downloadFile({
            url: that.data.urlAddress,
            success:function(res){
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success:function(res){
                        console.log(res)
                    }
                })
            }
        })
    },
    shareFriends:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            wx.previewImage({
                urls: [that.data.urlBigAddress],
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            wx.previewImage({
                urls: [that.data.enCodeImage],
            })
        }
    }
})