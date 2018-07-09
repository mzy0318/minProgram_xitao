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
        actImg:'',     //活动图片地址
        actImg0:'',    //活动图片ID
        isShow:false,
        isActImg:false,
        isCoverImg:false,
        coverImg:'',   //封面图片地址
        coveImgId:'',  //封面图片ID
        startTime:'',
        endTime:'',
        isOption:true,
        joinInfo: ['姓名', '电话'],
        joinInfoId: [1, 1],
        nameInfo:[],
        nameInfoId: [],
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
        isID:'',
        isCoverImg:true,
        isActImg:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        this.setData({
            bannerImg: options.image,
            isID: options.id,
        })
        let toDay = new Date().valueOf();
        let toFuture = new Date().valueOf() + 2592000000
        that.setData({
            startTime: util.formatDate(new Date(toDay)),
            endTime: util.formatDate(new Date(toFuture)),
        })
        console.log('数据类型', typeof options.id)
        if(options.id != undefined){
            getApp().request({
                url: 'org/make_personal_group',
                method: 'get',
                data: {
                    id: options.id,
                },
                success:function(res){
                    let joinInfo = [];
                    let joinInfoId = [];
                    let actImage = [];
                    let actImageId = []
                    if (res.data.data.cover != null){
                        that.setData({
                            isCoverImg:false
                        })
                    }else{
                        that.setData({
                            isCoverImg: true
                        })
                    }
                    if (res.data.data.act_image.length>0){
                        for (let i = 0; i < res.data.data.act_image.length;i++){
                            actImage.push(res.data.data.act_image[i].url);
                            actImageId.push(res.data.data.act_image[i].id);
                            that.setData({
                                isActImg: false
                            })
                        }
                    }else {
                        that.setData({
                            isActImg:true
                        })
                    }
                    for (let i = 0; i < res.data.data.join_info.length; i++) {
                        joinInfo.push(res.data.data.join_info[i].text);
                        joinInfoId.push(res.data.data.join_info[i].require)
                    }
                    // 处理pricel的值为-1
                    for (let i = 0; i < res.data.data.act_set.length;i++){
                        if (Number(res.data.data.act_set[i].person) == -1){
                            res.data.data.act_set[i].person = '';
                            res.data.data.act_set[i].price = '';
                        }
                    }
                    // joinInfo.splice(0, 2);
                    // joinInfoId.splice(0, 2)
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
                        person3: res.data.data.act_set[2].person ,
                        price3: res.data.data.act_set[2].price,
                        person4: res.data.data.act_set[3].person,
                        price4: res.data.data.act_set[3].price,
                        person5: res.data.data.act_set[4].person,
                        price5: res.data.data.act_set[4].price,
                        oriPrice: res.data.data.original_price,
                        nowPrice: res.data.data.now_price,
                        bannerImg: res.data.data.banner_image_url,
                        actImg0: actImageId,
                        actImg: actImage,
                        coveImgId: res.data.data.cover_image,
                        coverImg: res.data.data.cover.url,
                        nameInfo: joinInfo,
                        nameInfoId: joinInfoId
                    })
                }
            })
        }else{
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
        let that = this;
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
            banner_image_url: that.data.bannerImg,
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
            // person: person,
            // price: price,
            // join_info_require: this.data.nameInfoId,
            // join_info_text: this.data.nameInfo,
            cover_image: this.data.coveImgId,
            // act_image: this.data.actImg0,
        };
        if (person.length != 0){
            for (let i = 0; i < person.length; i++) {
                sendData['person[' + i + ']'] = person[i];
                sendData['price[' + i + ']'] = price[i];
            }
           
        }
        if (this.data.actImg0.length != 0){
            for (let i = 0; i < this.data.actImg0.length; i++) {
                sendData['act_image[' + i + ']'] = that.data.actImg0[i];
            }
        }
        if (that.data.nameInfo.length != 0){
            for (let i = 0; i < that.data.nameInfo.length; i++) {
                // let index = i + 2;
                sendData['join_info_text[' + i + ']'] = that.data.nameInfo[i];
                sendData['join_info_require[' + i + ']'] = that.data.nameInfoId[i];
            }
        }

        // for (let i = 0; i < that.data.joinInfo.length; i++) {
        //     sendData['join_info_text[' + i + ']'] = that.data.joinInfo[i];
        //     sendData['join_info_require[' + i + ']'] = that.data.joinInfoId[i];
        // }
        getApp().request({
            url:'org/make_personal_group',
            data: sendData,
            method:'post',
            success:function(res){
                if (Number(res.data.code)==1){
                    wx.showLoading({
                        title: '正在发布',
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000)

                    function closeLogin() {

                        wx.hideLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            success:function(){
                                if (that.data.isID != undefined) {
                                    wx.navigateBack({})
                                } else if (that.data.isID == undefined){
                                    wx.navigateBack({ delta: 2 })
                                }
                            }
                        })
                    }
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
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
    // 活动图片上传
    chooseActImg:function(){
        let that = this
        wx.chooseImage({
            count:9,
            success:function(res){

                let actImage = [];
                let actImg = [];  //图片id
                
                actImage.push(...that.data.actImg);
                actImg.push(...that.data.actImg0);
                actImage.push(...res.tempFilePaths);

                that.setData({
                    actImg: actImage,
                    isShow:true
                })

                let imgPath = res.tempFilePaths;

                that.setData({
                    isActImg: false
                })

                wx.showLoading({
                    title: '图片上传中',
                    mask: true,
                })
                for (let i = 0; i < imgPath.length; i++){

                    let n = imgPath[i].lastIndexOf('.');

                    let imgPathO = imgPath[i].substring(n);

                    getApp().request({
                        url: "org/policy",
                        method: "post",
                        data: {
                            "type": "image"
                        },
                        success: function (res) {
                            let sendData = {
                                "key": res.data.data.dir + getApp().imageAddress(imgPath[i]) + imgPathO,
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
                                filePath: imgPath[i],
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
                                                // console.log("上传到服务器出错");
                                                // return
                                                wx.showToast({
                                                    title: '上传到服务器出错',
                                                    icon: 'none'
                                                })
                                            }else if(Number(r.code)==1){
                                                //得到图片的id和地址
                                                actImg.push(r.data.imageId)
                                                that.setData({
                                                    actImg0: actImg,
                                                })
                                                wx.hideLoading();
                                                wx.showToast({
                                                    title: '图片上传成功',
                                                    icon:'success',
                                                })
                                            }
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
                    coverImg: res.tempFiles[0].path,
                    isCoverImg: true,
                    isCoverImg: false
                })
                var imgPath = res.tempFiles[0].path;
                wx.showLoading({
                    title: '图片上传中',
                    mask: true,
                })
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
                            "key": res.data.data.dir + getApp().imageAddress(imgPath) + imgPathO,
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
                                            // console.log("上传到服务器出错");
                                            // return
                                            wx.showToast({
                                                title: '上传到服务器出错',
                                                icon: 'none'
                                            })
                                        }else if(Number(r.code)==1){
                                            //得到图片的id和地址
                                            that.setData({
                                                coveImgId: r.data.imageId
                                            })
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '图片上传成功',
                                                icon:"success"
                                            })
                                        }
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
    jianForm: function (e) {
        let that = this;
        let nameInfo = that.data.nameInfo
        let nameInfoId = that.data.nameInfoId
        nameInfo.splice(e.target.dataset.index, 1)
        nameInfoId.splice(e.target.dataset.index, 1)
        that.setData({
            nameInfo: nameInfo,
            nameInfoId: nameInfoId,
        })
    },
    isMustEdit: function (e) {
        let that = this;
        let nameInfoId = that.data.nameInfoId
        if (e.detail.value) {
            nameInfoId[e.target.dataset.index] = 1
        } else {
            nameInfoId[e.target.dataset.index] = 0
        }
        that.setData({
            nameInfoId: nameInfoId
        })
    },
    // 删除图片
    delImage:function(e){
        let that = this;
        let index = Number(e.currentTarget.dataset.index)
        let actImage = that.data.actImg;
        let actImageId = that.data.actImg0;
        actImage.splice(index, 1);
        actImageId.splice(index,1);
        that.setData({
            actImg: actImage,
            actImg0: actImageId,
        })
    }
})