// pages/manageCenters/collageEdit/collageEdit.js
let util = require('../../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerImg:'',
        rule:'',
        description:'',
        leaderReward:'',
        actImg:'',
        actImg0:null,
        isShow:false,
        isActImg:false,
        isCoverImg:false,
        coverImg:'',
        startTime:'2018-06-04',
        endTime:'2018-06-05',
        isOption:true,
        nameInfo: ['姓名', '电话'],
        nameInfoId: [1, 1],
        actId:0,
        title:'',
        phoneNum:'',
        address:'',
        person1:'',
        price1:'',
        person2: '',
        price2: '',
        person3: '',
        price3: '',
        person4: '',
        price4: '',
        person5: '',
        price5: '',
        oriPrice:'',
        nowPrice:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            bannerImg: options.image,
        })
        console.log(options.id)
        let that = this
        if(!options.id){
            getApp().request({
                url: 'org/make_personal_group',
                method: 'get',
                data: {
                    id: options.id,
                },
                success:function(res){
                    that.setData({
                        actId:res.data.data.id,
                        title:res.data.data.title,
                        phoneNum: res.data.data.telephone,
                        startTime: res.data.data.start_time,
                        endTime: res.data.data.end_time,
                        address: res.data.data.address,
                        rule: res.data.data.rule,
                        description: res.data.data.description,
                        leaderReward: res.data.data.leader_reward,
                        person1: res.data.data.act_set[0].person,
                        price1: res.data.data.act_set[0].price,
                        person2: res.data.data.act_set[1].person,
                        price2: res.data.data.act_set[1].price,
                        person3: res.data.data.act_set[2].person,
                        price3: res.data.data.act_set[2].price,
                        person4: res.data.data.act_set[3].person,
                        price4: res.data.data.act_set[3].price,
                        person5: res.data.data.act_set[4].person,
                        price5: res.data.data.act_set[4].price,
                        oriPrice: res.data.data.original_price,
                        nowPrice: res.data.data.now_price,
                        bannerImg: res.data.data.banner_image_url,
                        // actImg: res.data.data.act_image,
                        // coverImg: res.data.data.cover_image,
                    })
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
    formSubmit:function(e){
        let value = e.detail.value;
        let person = [];
        let price = [];
        if (value.person1 != '' && value.price1 != ''){
            person.push(value.person1);
            price.push(value.price1);
        } 
        if (value.person2 != '' && value.price2 != ''){
            person.push(value.person2);
            price.push(value.price2);
        }
        if (value.person3 != '' && value.price3 != ''){
            person.push(value.person3);
            price.push(value.price3);
        }
        if (value.person4 != '' && value.price4 != ''){
            person.push(value.person4);
            price.push(value.price4);
        }
        if (value.person5 != '' && value.price5 != ''){
            person.push(value.person5);
            price.push(value.price5);
        }
        let sendData = {
            id:this.data.actId,
            title: e.detail.value.title,
            telephone: e.detail.value.telephone,
            address: e.detail.value.address,
            original_price: e.detail.value.original_price,
            pay_status: e.detail.value.pay_status?0:1,
            now_price: e.detail.value.now_price,
            leader_reward: this.data.leaderReward,
            rule: this.data.rule,
            description: this.data.description,
            start_time: this.data.startTime,
            end_time: this.data.endTime,
            person: person,
            price: price,
            join_info_require: this.data.nameInfoId,
            join_info_text: this.data.nameInfo,
            cover_image: this.data.cover_image,
            act_image: this.data.actImg0,
        };
        console.log('sendData', sendData)
        getApp().request({
            url:'org/make_personal_group',
            data: sendData,
            method:'post',
            success:function(res){
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                })
                if (res.data.msg==1){
                    wx.navigateTo({
                        url: '../org/personal_group_list/org/personal_group_list?url=org/personal_group_list',
                    })
                }
            }
        })

    },
    getDescription:function(e){
        this.setData({
            description: e.detail.value
        })
    },
    getRule:function(e){
        this.setData({
            rule: e.detail.value
        })
    },
    getLeaderReward:function(e){
        this.setData({
            leaderReward: e.detail.value
        })
    },
    chooseActImg:function(){
        let that = this
        wx.chooseImage({
            count:9,
            success:function(res){
                that.setData({
                    actImg: res.tempFiles,
                    isShow:true
                })
                let imgPath = res.tempFiles;
                let actImg = [];
                
                for (let i = 0; i < imgPath.length; i++){
                    getApp().request({
                        url: "org/policy",
                        method: "post",
                        data: {
                            "type": "image"
                        },
                        success: function (res) {
                            let sendData = {
                                "key": res.data.data.dir + imgPath[i].path,
                                "OSSAccessKeyId": res.data.data.accessid,
                                "host": res.data.data.host,
                                "expire": res.data.data.expire,
                                "signature": res.data.data.signature,
                                "policy": res.data.data.policy,
                                'success_action_status': '200'
                            }
                            wx.uploadFile({
                                url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                                name: 'file',
                                filePath: imgPath[i].path,
                                formData: sendData,
                                success: function (res) {
                                    getApp().request({
                                        url: "org/exchange",
                                        data: {
                                            "key": sendData.key,
                                            "type": "image",
                                        },
                                        method: "post",
                                        success: function (r) {
                                            r = r.data
                                            if (r.code == 0) {
                                                console.log("上传到服务器出错");
                                                return
                                            }
                                            //得到图片的id和地址
                                            actImg.push(r.data.imageId)
                                            that.setData({
                                                actImg0: actImg,
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            }
        })
    },
    getCoverImage:function(){
        let that = this
        wx.chooseImage({
            count: 1,
            success: function (res) {

                that.setData({
                    coverImg: res.tempFiles,
                    isCoverImg: true,
                })

                var imgPath = res.tempFiles[0].path;

                getApp().request({
                    url: "org/policy",
                    method: "post",
                    data: {
                        "type": "image"
                    },
                    success:function(res){
                        let n = imgPath.lastIndexOf('.');
                        let imgPathO = imgPath.substring(n)
                        let sendData = {
                            "key": res.data.data.dir + new Date().valueOf() + getApp().randomNum() + imgPathO,
                            "OSSAccessKeyId": res.data.data.accessid,
                            "host": res.data.data.host,
                            "expire": res.data.data.expire,
                            "signature": res.data.data.signature,
                            "policy": res.data.data.policy,
                            'success_action_status': '200'
                        }
                        wx.uploadFile({
                            url: 'https://wise.oss-cn-hangzhou.aliyuncs.com/',
                            name: 'file',
                            filePath: imgPath,
                            formData: sendData,
                            success:function(res){
                                console.log(res)
                                getApp().request({
                                    url: "org/exchange",
                                    data: {
                                        "key": sendData.key,
                                        "type": "image",
                                    },
                                    method: "post",
                                    success: function (r) {
                                        r = r.data
                                        if (r.code == 0) {
                                            console.log("上传到服务器出错");
                                            return
                                        }
                                        //得到图片的id和地址
                                        that.setData({
                                            cover_image: r.data.imageId
                                        })
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    },
    getStartTime:function(e){
        this.setData({
            startTime:e.detail.value,
        })
    },
    getEndTime: function (e) {
        this.setData({
            endTime: e.detail.value,
        })
    },
    addNameOptions: function (e) {
        let arr = this.data.nameInfo;
        let arrO = this.data.nameInfoId
        arr.push(e.target.dataset.value);
        arrO.push(0);
        this.setData({
            nameInfo: arr,
            nameInfoId: arrO
        })
    },
    showOptions: function (e) {
        this.setData({
            isOption: Boolean(Number(e.target.dataset.is))
        })
    },
})