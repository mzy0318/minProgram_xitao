// pages/courses/courseUserListInfo/courseUserListInfo.js
let utils = require('../../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageData:'',
        sexArr: [
            {
                name: '未知',
                color: '#000',
            }, {
                name: '男',
                color: '#000',
            }, {
                name: '女',
                color: '#000',
            },
        ],
        status: [
            {
                name: '待跟进',
                color: '#FAC935',
            }, {
                name: '跟进中',
                color: '#469AFB',
            }, {
                name: '已预约',
                color: '#58C268',
            }, {
                name: '已试听',
                color: '#B5B6B9',
            }, {
                name: '已到访',
                color: '#EE505B',
            }, {
                name: '已失效',
                color: '#9F85CD',
            }, {
                name: '已成交',
                color: '#37C2D3',
            }
        ],
        xinArr:[
            {
                name:"../../../icon/baixin.png",
            },{
                name: "../../../icon/banxin.png",
            },{
                name: "../../../icon/hongxin.png",
            }
        ],
        isOptions:true,
        optionsData:'',
        optionsType:'',
        sexData:null,
        sexId:'',
        statusData:null,
        index:0,
        isConnect:false,
        isBase:true,
        firseName:'',
        connectList:'',
        addInfo:'+',
        isShowInput:true,
        connectData:'',
        userId:'',
        starStyle: 'iconfont icon-shoucang iconStyle',
        staredStyle:'iconfont icon-shoucangxuanzhong iconStyled',
        isStar:'',
        isXinOptions:true,
        xinId:'',
        xinData:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let pageData = JSON.parse(options.pageData);


        for (let i = 0; i < that.data.status.length;i++){
            if (pageData.status == that.data.status[i].name){
                that.setData({
                    statusData: that.data.status[i],
                })
            }
        }

        let firstName = JSON.parse(options.pageData).nickname.split('')[0];
        that.setData({
            sexData: that.data.sexArr[JSON.parse(options.pageData).sex],
            sexId: JSON.parse(options.pageData).sex,
            pageData: JSON.parse(options.pageData),
            firseName: JSON.parse(options.pageData).nickname.split('')[0],
            userId: JSON.parse(options.pageData).id,
            isStar: Number(JSON.parse(options.pageData).is_star)?true:false,
            xinId: JSON.parse(options.pageData).intention,
            xinData: that.data.xinArr[JSON.parse(options.pageData).intention]
        })
        getApp().request({
            url:'org/sale_lesson_appoint_communication_list',
            method:'get',
            data:{
                appointer_id: JSON.parse(options.pageData).id
            },
            success:function(res){
                for (let i = 0; i < res.data.data.list.length;i++){
                    res.data.data.list[i].Date = utils.formatDate(new Date(res.data.data.list[i].create_time))
                    res.data.data.list[i].Time = utils.formatTimer(new Date(res.data.data.list[i].create_time))
                }
                that.setData({
                    connectList:res.data.data.list
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
    changeOption:function(e){
        let that = this;
        if (e.currentTarget.dataset.options == 'status') {
            that.setData({
                optionsData: that.data.status,
                isOptions: false,
                optionsType: e.currentTarget.dataset.options
            })
        } else if (e.currentTarget.dataset.options == 'sex'){
            that.setData({
                optionsData: that.data.sexArr,
                isOptions: false,
                optionsType: e.currentTarget.dataset.options,
            })
        } else if(e.currentTarget.dataset.options == 'xin') {
            that.setData({
                optionsData: that.data.xinArr,
                isXinOptions: false,
                optionsType: e.currentTarget.dataset.options,
            })
        }
    },
    cancelOption:function(){
        let that = this
        that.setData({
            isOptions: true,
        })
    },
    changeValue:function(e){
        let that = this;
        if (that.data.optionsType =='status'){
            that.setData({
                statusData: that.data.status[e.currentTarget.dataset.index],
                isOptions: true,
            })
            getApp().request({
                url:'org/sale_lesson_edit_appoint_status',
                data:{
                    appointer_id: that.data.userId,
                    status: e.currentTarget.dataset.index
                },
                method:'post',
                success:function(res){
                    console.log(res)
                }
            })
        } else if (that.data.optionsType == 'sex'){
            that.setData({
                sexData: that.data.sexArr[e.currentTarget.dataset.index],
                isOptions: true,
                sexId: e.currentTarget.dataset.index
            })
        } else if (that.data.optionsType == 'xin'){
            that.setData({
                xinData: that.data.xinArr[e.currentTarget.dataset.index],
                isXinOptions: true,
                xinId: e.currentTarget.dataset.index
            })
            getApp().request({
                url:'org/sale_lesson_edit_appoint_intention',
                method:'post',
                data:{
                    appointer_id: that.data.userId,
                    intention: that.data.xinId
                },
                success:function(res){
                    if(res.data.code==0){
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                    }
                }
            })
        }
    },
    isShowChild:function(e){
        let that = this;
        that.setData({
            isConnect: Boolean(Number(e.currentTarget.dataset.is)),
            isBase: !Boolean(Number(e.currentTarget.dataset.is))
        })
    },
    tellPhone:function(e){
        getApp().tellPhone(e)
    },
    showInput:function(){
        let that = this;
        that.setData({
            isShowInput: !that.data.isShowInput
        })
        if (that.data.isShowInput){
            that.setData({
                addInfo:'+'
            })
        }else{
            that.setData({
                addInfo: 'x'
            })
        }
    },
    getInputData:function(res){
        let that = this
        that.setData({
            connectData: res.detail.value,
        })
    },
    submitTextarea:function(e){
        let that = this;
        getApp().request({
            url:'org/sale_lesson_add_appoint_communication',
            method:'post',
            data:{
                appointer_id: that.data.userId,
                content: e.detail.value.textareaData,
            },
            success:function(res){
                that.setData({
                    isShowInput: true,
                    addInfo: '+'
                })
                if(res.data.code==1){
                    getApp().request({
                        url: 'org/sale_lesson_appoint_communication_list',
                        method: 'get',
                        data:{
                            appointer_id: that.data.userId,
                        },
                        success:function(res){
                            for (let i = 0; i < res.data.data.list.length; i++) {
                                res.data.data.list[i].Date = utils.formatDate(new Date(res.data.data.list[i].create_time))
                                res.data.data.list[i].Time = utils.formatTimer(new Date(res.data.data.list[i].create_time))
                            }
                            that.setData({
                                connectList: res.data.data.list
                            })
                        }
                    })
                }
            }
        })
    },
    collection:function(res){
        let that = this;
        that.setData({
            isStar: !that.data.isStar
        })
        getApp().request({
            url:'org/sale_lesson_edit_appoint_star',
            data:{
                appointer_id: that.data.userId,
                star: that.data.isStar?1:0
            },
            method:'post',
            success:function(res){
                if(res.data.code==0){
                    that.setData({
                        isStar:!that.data.isStar
                    })
                }
            }
        })
    },
    // 提交预约用户信息
    submitUserInfo:function(res){
        let that = this
        res.detail.value['sex'] = that.data.sexId;
        res.detail.value['id'] = that.data.userId;
        console.log(res.detail.value);
        getApp().request({
            url:'org/sale_lesson_edit_appoint_info',
            data: res.detail.value,
            method:'post',
            success:function(res){
                if(res.data.code==1){
                    getApp().request({
                        url:'org/sale_lesson_appoint_list',
                        method:'post',
                        data:{},
                        success:function(res){
                            if(Number(res.data.code)==1){
                                wx.showToast({
                                    title: '保存成功',
                                    icon:'success'
                                })
                            }
                            for (let i = 0; i < res.data.data.length;i++){
                                if (res.data.data[i].id == that.data.userId){
                                    that.setData({
                                        pageData: res.data.data[i]
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    },
    cancelXinOption:function(){
        let that = this
        that.setData({
            isXinOptions:true,
        })
    }
})