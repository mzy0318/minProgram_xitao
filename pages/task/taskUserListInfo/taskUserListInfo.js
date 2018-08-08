// pages/task/taskUserListInfo/taskUserListInfo.js
let formart = require('../../../utils/util.js');
const innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentDate:'',
        currentWeek:'',
        currentDataArr: [],
        currentWeekArr:'',
        isInfo:true,
        courseId:'',
        myHomework:'',
        isMyHomework:true,
        assignment:'',
        isAssignment:true,
        allHomework:'',
        isAllHomework:true,
        homeNum:-1,
        toDayString:'',
        isRank:true,
        isMyRank:true,
        isStuwork:true,
        isTeacwork:true,
        date:'',
        isDate:'',
        dateString:'',//布置作业时使用的日期
        idDates:true,
        month: '',
        year: '',
        yearMonth: '',
        isDates:true,
        pageNum:1,
        pageStatus:false,
        isPwd:false,
        pwd:'',
        isVideo:true,
        otherVideo:'',
        isOther:true,
        isOtherDisplay:'none',
        isToday:true,
        hasWorkList:[],
        endTime:'',
        startTime:'',
        currentText:'目前没有作业',
        teacherText:'布置作业',
        title:'',
        audioUrl:'',
        myId:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.setData({
            isDate: Number(options.isDate),
            pageStatus: true,
            pwd: options.pwd,
            endTime:Number(options.endTime),
            startTime: Number(options.startTime),
            title:options.title,
        })

        if(that.data.isDate == 1){
            that.setData({
                date:options.date
            })
        }

        if (options.scene != undefined) {
            let scene = decodeURIComponent(options.scene);
            let n = scene.indexOf('=');
            that.setData({
                courseId: scene.slice(n + 1),
            })
        } else if (options.scene == undefined) {
            that.setData({
                courseId: options.courseId,
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this;
        that.videoContext = wx.createVideoContext('myVideo');
        innerAudioContext.onEnded(() => {
            that.setData({
                audioUrl: '',
                isMy: '',
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        if (that.data.pageStatus){
            if (that.data.isDate == 1) {

                let timeString = new Date(that.data.date).valueOf();
                that.switchDate('time', timeString)

            } else if (that.data.isDate == 0) {

                that.toDay();
            }
        }else{

            that.switchDate('time', that.data.toDayString) 
        }
        that.setData({
            pageStatus:false
        })
        // 登录
        if(wx.getStorageSync(that.data.courseId) == that.data.pwd){
            that.setData({
                isPwd: true,
            })
        }else{
            that.setData({
                isPwd: false,
            })
        }
        // 提示内容
        that.actText()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        let that = this;
        that.setData({
            homeNum: -1,
        })
        innerAudioContext.stop()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        let that = this;
        that.setData({
            homeNum: -1,
        })
        if(that.data.isDate == 1){
            wx.navigateBack({
                delta:1
            })
        } else if (that.data.isDate == 0){

            return 
        }
        innerAudioContext.stop()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    // onPullDownRefresh: function () {

    // },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        let pageDataArr = [];
        pageDataArr.push(...that.data.allHomework)
        if (that.data.pageData.length >= that.data.pageNum * 10){
            that.setData({
                pageNum: that.data.pageNum + 1,
            })
            getApp().request({
                url: 'punch_course',
                data: {
                    punch_course_id: that.data.courseId,
                    date: date,
                    page: pageNum,
                },
                method: 'get',
                success: function (res) {
                    if (Number(res.data.code) == 1) {
                        wx.hideLoading();
                        // 所有作业
                        if (res.data.data.allHomework.length > 0) {
                            let allHome = res.data.data.allHomework
                            for (let i = 0; i < allHome.length; i++) {
                                allHome[i].create_time = formart.formatTime(new Date(allHome[i].create_time * 1000));
                            }
                            pageDataArr.push(...allHome)
                            that.setData({
                                isAllHomework: false,
                                allHomework: pageDataArr,
                            })
                        } else if (res.data.data.allHomework.length <= 0) {
                            that.setData({
                                isAllHomework: true,
                            })
                        }
                    }
                }
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            path: 'pages/index/index?pageId=18?courseId=' + that.data.courseId + '&pwd=' + that.data.pwd
        }
    },
    // 学生主页
    toHome:function(e){
        let that = this;
        wx.navigateTo({
            url: '../taskStuHome/taskStuHome?userId=' + e.currentTarget.dataset.userid,
        })
    },
    // 密码登录
    confirmPwd:function(e){
        let that = this;
        if (e.detail.value.password == that.data.pwd){
            that.setData({
                isPwd: true,
            })
            wx.setStorageSync(that.data.courseId, that.data.pwd)
        }else{
            wx.showToast({
                title: '密码不正确,请重新输入',
                icon:'none'
            })
        }
    },
    //放大查看图片
    previewImage:function(e){
        wx.previewImage({
            urls: [e.currentTarget.dataset.url],
        })
    },
    //全屏查看视频
    previewVideo:function(e){
        let that = this;
        that.setData({
            isOther: true,
            isOtherDisplay:'display',
            otherVideo: e.currentTarget.dataset.url,
        })
        that.videoContext.play();
        that.videoContext.requestFullScreen({ direction:0});
    },
    // 视频播放结束后退出全屏
    stopVideo:function(e){
        let that = this;
        that.videoContext.exitFullScreen();
    },
    // 切换日期
    switchDate:function(e,timeString){
        let that = this;
        wx.showLoading({
            title: '正在加载',
        })
        let toDay = timeString || e.currentTarget.dataset.info.timeString;
        let date = formart.formatDate(new Date(toDay))
        that.setData({
            currentDataArr: getApp().sevenDay(formart.dateWeek(new Date(toDay)),that.data.hasWorkList),
            toDayString: toDay,
            dateString: date,
            pageNum:1,
        })
        that.getHomework(date);
        if (date == formart.formatDate(new Date())){
            that.setData({
                isToday: true,
            })
        }else{
            that.setData({
                isToday: false,
            })
        }
    },
    // 今天的日期
    toDay:function(){
        let that = this;
        let toDay = formart.formatDate(new Date());
        that.setData({
            currentDataArr: getApp().sevenDay(formart.dateWeek(new Date()), that.data.hasWorkList),
            toDayString:new Date().valueOf(),
            dateString: toDay,
            pageNum:1,
            isToday: true,
        })
        that.getHomework(toDay)
    },
    // 所有作业里面的功能
    infoOpt: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //更多功能
            if (e.currentTarget.dataset.index == that.data.homeNum){
                that.setData({
                    homeNum: -1,
                })
            }else{
                that.setData({
                    homeNum: e.currentTarget.dataset.index,
                })
            }
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //点赞/取消点赞
            var status = 0
            if (Boolean(e.currentTarget.dataset.iszan)){

                status = 1

            }else{

                status = 0
            }
            getApp().request({
                url:'punch_course/thumb',
                data:{
                    status: status,
                    homework_id: e.currentTarget.dataset.homeid
                },
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        let date = formart.formatDate(new Date(that.data.toDayString))
                        that.setData({
                            homeNum: -1,
                            pageNum:1,
                        })
                        that.getHomework(date);
                    }else{
                        wx.showToast({
                            title: res.data.msg,
                            icon:'none',
                        })
                        that.setData({
                            homeNum: -1,
                        })
                    }
                }
            })
        } else if (Number(e.currentTarget.dataset.id) == 2) {
            let time = formart.formatTime(new Date(that.data.toDayString));
            //评论
            wx.navigateTo({
                url: '../taskStuHomeInfo/taskStuHomeInfo?stuId=' + e.currentTarget.dataset.stuid + '&courseId=' + e.currentTarget.dataset.courseid + '&time=' + time,
            })
        }
    },
    infoBtn:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            // 排行榜
            wx.navigateTo({
                url: '../taskRankList/taskRankList?courseId=' + that.data.courseId,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            //去打卡
            // 判断是否为学生
            getApp().request({
                url:'punch_course/is_student',
                data:{},
                method:'get',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        if (res.data.data.is_student){
                             wx.navigateTo({
                                 url: '../taskReply/taskReply?isMark=1&isEdit=0&assignment=' + e.currentTarget.dataset.assignment,
                            })
                        }else{
                            // 加入学员
                            wx.navigateTo({
                                url: '../taskStudentEdit/taskStudentEdit?isEdit=0',
                            })
                        }
                    }
                }   
            })
        }
    },
    // 教师发布作业
    setHomework:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            if ((that.data.endTime * 1000 > that.data.toDayString) && (that.data.startTime * 1000 < that.data.toDayString)){
                //布置作业
                wx.navigateTo({
                    url: '../taskReply/taskReply?isMark=3&isEdit=0&courseId=' + that.data.courseId + '&date=' + that.data.dateString,
                })
            }else{
                return 
            }
        } else if (Number(e.currentTarget.dataset.id) == 1){
            // 编辑布置作业
            wx.navigateTo({
                url: '../taskReply/taskReply?isMark=3&isEdit=1&courseId=' + that.data.courseId + '&assignment=' + e.currentTarget.dataset.assigment + '&date=' + that.data.dateString,
            })
        }
    },
    listOpts:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            //分享
            wx.navigateTo({
                url: '../../baseOptions/sharePage/sharePage?title=' + e.currentTarget.dataset.title + '&actTag=punch&page=pages/task/taskUserListInfo/taskUserListInfo&actId=' + that.data.courseId,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //打卡日历
            that.setData({
                isDates:false,
                month: formart.month(new Date(that.data.toDayString)),
                year: formart.year(new Date(that.data.toDayString)),
                yearMonth: formart.year(new Date(that.data.toDayString)) + '年' + formart.month(new Date(that.data.toDayString)) + '月'
            })
            that.getDate(that.data.month, that.data.year)
        } else if (Number(e.currentTarget.dataset.id) == 2){
            // 今天
            that.toDay()
        }
    },
    //具体的日期
    toDateInfo:function(e){
        let that = this;
        let month = Number(e.currentTarget.dataset.month) > 10 ? Number(e.currentTarget.dataset.month) : ('0' + Number(e.currentTarget.dataset.month));
        let day = Number(e.currentTarget.dataset.day) > 10 ? Number(e.currentTarget.dataset.day) : ('0' + Number(e.currentTarget.dataset.day));
        let date = e.currentTarget.dataset.year + '-' + month + '-' + day;
        let timeString = new Date(date).valueOf();
        if (e.currentTarget.dataset.enable) {
            that.switchDate('time', timeString);
            that.setData({
                isDates:true,
            })
        } else {

            return
        }
    },
    // 添加/编辑作业
    toEdit:function(e){
        let that = this;
        wx.navigateTo({
            url: '../taskReply/taskReply?isMark=1&isEdit=1&assignment=' + e.currentTarget.dataset.assignment + '&homeworkId=' + e.currentTarget.dataset.homeid,
        })
    },
    // 播放语音
    playAudio: function (e) {
        let that = this;
        that.setData({
            audioUrl: e.currentTarget.dataset.id,
            isMy:'',
        })
        innerAudioContext.src = e.currentTarget.dataset.url;
        innerAudioContext.play();
    },
    //我的作业播放语音
    playMyAudio: function (e) {
        let that = this;
        that.setData({
            audioUrl: '',
            isMy: e.currentTarget.dataset.id,
        })
        innerAudioContext.src = e.currentTarget.dataset.url;
        innerAudioContext.play();
    },
    //退出日历
    cancelDate:function(){
        let that = this;
        that.setData({
            isDates:true,
        })
    },
    // 获取作业
    getHomework:function(date){
        let that = this;
        getApp().request({
            url: 'punch_course',
            data: {
                punch_course_id: that.data.courseId,
                date: date,
                page: that.data.pageNum,
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    wx.hideLoading();
                    // 有没有作业
                    let hasWork = [];
                    for (let i = 0; i < res.data.data.dates.length;i++){

                        hasWork.push(res.data.data.dates[i].hasAssignment)
                    }
                    that.setData({
                        pageData: res.data.data,
                        hasWorkList: hasWork,
                        currentDataArr: getApp().sevenDay(formart.dateWeek(new Date(that.data.toDayString)), hasWork),
                    })
                    // 我的作业
                    if (JSON.stringify(res.data.data.myHomework) == '{}'){
                        that.setData({
                            isMyHomework: true,
                        })
                    }else{
                        if (res.data.data.myHomework.image.length > 0) {
                            for (let i = 0; i < res.data.data.myHomework.image.length; i++) {
                                res.data.data.myHomework.image[i].url = formart.rect(res.data.data.myHomework.image[i].url, 100, 100)
                            }
                        }
                        that.setData({
                            isMyHomework: false,
                            myHomework: res.data.data.myHomework,
                        })
                    }
                    // 布置作业
                    if (JSON.stringify(res.data.data.assignment) == '{}'){
                        that.setData({
                            isAssignment: true,
                        })
                    }else{
                        if (res.data.data.assignment.image.length > 0){
                            for (let i = 0; i < res.data.data.assignment.image.length;i++){
                                res.data.data.assignment.image[i].url = formart.rect(res.data.data.assignment.image[i].url,100,100)
                            }
                        }
                        that.setData({
                            isAssignment: false,
                            assignment: res.data.data.assignment,
                        })
                    }

                    if (res.data.data.is_teacher == true && that.data.isAssignment == true) {
                        that.setData({
                            isStuwork: true,
                            isTeacwork: false,
                        })
                    } else if (res.data.data.is_teacher == false && that.data.isAssignment == true){
                        that.setData({
                            isStuwork: false,
                            isTeacwork: true,
                        })
                    } else if (that.data.isAssignment == false || res.data.data.is_teacher == false){
                        that.setData({
                            isStuwork: true,
                            isTeacwork: true,
                        })
                    }
                    if (that.data.isAssignment == true && that.data.isMyHomework==true){
                        that.setData({
                            isRank: true,
                            isMyRank: true,
                        })
                    } else if (that.data.isAssignment == false && that.data.isMyHomework == true){
                        that.setData({
                            isRank: false,
                            isMyRank: true,
                        })
                    } else if (that.data.isAssignment == false && that.data.isMyHomework == false){
                        that.setData({
                            isRank: true,
                            isMyRank: false,
                        })
                    } else if (that.data.isAssignment == true && that.data.isMyHomework == false){
                        that.setData({
                            isRank: true,
                            isMyRank: false,
                        })
                    }
                    // 所有作业
                    if (res.data.data.allHomework.length > 0) {
                        let allHome = res.data.data.allHomework;
                        for (let i = 0; i < allHome.length;i++){
                            allHome[i].create_time = formart.formatTime(new Date(allHome[i].create_time*1000));
                            if (allHome[i].image.length>0){
                                for (let j = 0; j < allHome[i].image.length;j++){
                                    allHome[i].image[j].url = formart.rect(allHome[i].image[j].url, 100, 100)
                                }
                            }
                        }
                        that.setData({
                            isAllHomework: false,
                            allHomework: allHome,
                        })
                    } else if (res.data.data.allHomework.length <= 0){
                        that.setData({
                            isAllHomework: true,
                        })
                    }
                    that.actText()
                }
            }
        })
    },
    //改变日历
    changeMonth: function (e) {
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0) {
            // 减
            let month = that.data.month
            let year = that.data.year;
            month -= 1
            if (month <= 0) {
                month = 12
                year -= 1
            }
            that.setData({
                month: month,
                year: year,
                yearMonth: year + '年' + month + '月'
            })
            that.getDate(month, year);

        } else if (Number(e.currentTarget.dataset.id) == 1) {
            //加
            let month = that.data.month
            let year = that.data.year;
            month += 1
            if (month >= 13) {
                month = 1
                year += 1
            }
            that.setData({
                month: month,
                year: year,
                yearMonth: year + '年' + month + '月'
            })
            that.getDate(month, year)
        }
    },
    //获取日历
    getDate: function (month, year) {
        let that = this;
        getApp().request({
            url: 'punch_course/calendar',
            data: {
                month: month,
                year: year,
                punch_course_id: that.data.courseId,
            },
            method: 'get',
            success: function (res) {
                if (Number(res.data.code) == 1) {
                    for (let i = 0; i < res.data.data.date.length; i++) {
                        if (res.data.data.date[i].week == 0) {
                            res.data.data.date[i].week = 7
                        }
                    }
                    let dateList = res.data.data.date;
                    let index = dateList[0].week - 1;
                    for (let i = 0; i < index; i++) {
                        dateList.unshift({ day: '', enable: false, hasAssignment: false })
                    }
                    that.setData({
                        dayList: dateList,
                        startDate: formart.formatDate(new Date(res.data.data.start_time * 1000)),
                        endDate: formart.formatDate(new Date(res.data.data.end_time * 1000)),
                        count: res.data.data.assign_times
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                    })
                }
            }
        })
    },
    //日历下面提示框内容
    actText:function(e){
        let that = this;
        //按钮显示内容
        if (that.data.endTime * 1000 > that.data.toDayString) {
            that.setData({
                currentText: '目前没有作业',
                teacherText: '布置作业'
            })
        } else if (that.data.endTime * 1000 <= that.data.toDayString) {
            that.setData({
                currentText: '课程是从' + formart.formatDate(new Date(that.data.startTime * 1000)) + '至' + formart.formatDate(new Date(that.data.endTime * 1000)) + ',目前是[已结束]',
                teacherText: '课程是从' + formart.formatDate(new Date(that.data.startTime * 1000)) + '至' + formart.formatDate(new Date(that.data.endTime * 1000)) + ',目前是[已结束]',
            })
        }
        if (that.data.startTime * 1000 > that.data.toDayString) {
            that.setData({
                currentText: '课程是从' + formart.formatDate(new Date(that.data.startTime * 1000)) + '至' + formart.formatDate(new Date(that.data.endTime * 1000)) + ',目前是[未开始]',
                teacherText: '课程是从' + formart.formatDate(new Date(that.data.startTime * 1000)) + '至' + formart.formatDate(new Date(that.data.endTime * 1000)) + ',目前是[未开始]',
            })
        }   
    }
})