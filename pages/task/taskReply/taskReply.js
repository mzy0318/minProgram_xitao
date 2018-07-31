// pages/task/taskReply/taskReply.js
const recorderManager = wx.getRecorderManager();
let formate = require('../../../utils/util.js');
const innerAudioContext = wx.createInnerAudioContext()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMark:'', //是否为打卡
        isJob:true,
        isImage:true,
        isVideo:true,
        isAudio:true,
        actImage:[],
        actImageId:[],
        videos:[],
        videosId:[],
        audios: [],
        audiosId: [],
        audioIcon:'../../../icon/audio.png',
        isGetAudio:true,
        isStart:false,
        borderColor:'#7c7c7c',
        assignment:'',
        homeId:'',
        isEdit:'',
        homeworkId:'',
        pageData:'',
        courseId:'',
        text:'',
        date:'',//布置作业使用
        month: '',
        year: '',
        yearMonth: '',
        isCopy:true,
        dayList:'',
        startDate: '',
        endDate: '',
        count: '',
        isContent:false,
        toDay:'',
        dateString: [],
        dateStringIndex:[],
        audioUrl:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log('options', options)
        that.setData({
            isMark: Number(options.isMark),
        })
        if (that.data.isMark == 1){
            //打卡(我的)作业
            that.setData({
                isEdit: Number(options.isEdit)
            })
            if(that.data.isEdit == 1){
                wx.setNavigationBarTitle({
                    title: '编辑我的作业',
                })
                that.setData({
                    isJob: true,
                    assignment: options.assignment,
                    homeworkId: options.homeworkId,
                })
                getApp().request({
                    url:'punch_course/add_homework',
                    data:{
                        assignment_id: that.data.assignment,
                        homework_id: that.data.homeworkId,
                    },
                    method:'get',
                    success:function(res){
                        if(Number(res.data.code) == 1){
                            //音频
                            that.setData({
                                text: res.data.data.homework.text
                            })
                            if (res.data.data.homework.audio.length > 0){
                                let audios = [];
                                let audiosId = [];
                                for (let i = 0; i < res.data.data.homework.audio.length;i++){
                                    audios.push(res.data.data.homework.audio[i].url)
                                    audiosId.push(res.data.data.homework.audio[i].id)
                                }
                                that.setData({
                                    isAudio: false,
                                    audios: audios,
                                    audiosId: audiosId,
                                })
                            }else{
                                that.setData({
                                    audios: [],
                                    audiosId: [],
                                    isAudio: true,
                                })
                            }
                            //图片
                            if (res.data.data.homework.image.length > 0) {
                                let actImage = [];
                                let actImageId = [];
                                for (let i = 0; i < res.data.data.homework.image.length; i++) {
                                    actImage.push(res.data.data.homework.image[i].url)
                                    actImageId.push(res.data.data.homework.image[i].id)
                                }
                                that.setData({
                                    isImage: false,
                                    actImage: actImage,
                                    actImageId: actImageId,
                                })
                            }else{
                                that.setData({
                                    actImage: [],
                                    actImageId: [],
                                    isImage: true,
                                })
                            }
                            //视频
                            if (res.data.data.homework.video.length > 0){
                                let videos = [];
                                let videosId = [];
                                for (let i = 0; i < res.data.data.homework.video.length; i++) {
                                    videos.push(res.data.data.homework.video[i].url)
                                    videosId.push(res.data.data.homework.video[i].id)
                                }
                                that.setData({
                                    isVideo: false,
                                    videos: videos,
                                    videosId: videosId,
                                })
                            }else{
                                that.setData({
                                    videos: [],
                                    videosId: [],
                                    isVideo: true,
                                })
                            }
                        }else{
                            wx.showToast({
                                title: res.data.msg,
                                icon:'none'
                            })
                        }
                    }
                })
            }else{
                wx.setNavigationBarTitle({
                    title: '打卡',
                })
                that.setData({
                    isJob: true,
                    assignment: options.assignment
                })
            }
        } else if (that.data.isMark == 0){
            that.setData({
                isJob: true,
                homeId:options.homeId,
            })
            wx.setNavigationBarTitle({
                title: '打卡作业回复',
            })
        } else if (that.data.isMark == 3){
            // 教师布置作业
            that.setData({
                isEdit: Number(options.isEdit)
            })
            if (that.data.isEdit == 1){
                wx.setNavigationBarTitle({
                    title: '编辑作业',
                })
                that.setData({
                    isJob: true,
                    courseId: options.courseId,
                    assignment: options.assignment,
                    date: options.date,
                })
                getApp().request({
                    url:'punch_course/add_assignment',
                    data:{
                        id: that.data.assignment
                    },
                    method:'get',
                    success:function(res){
                        if(Number(res.data.code) == 1){
                            that.setData({
                                text: res.data.data.text
                            })
                            //音频
                            if (res.data.data.audio.length > 0) {
                                let audios = [];
                                let audiosId = [];
                                for (let i = 0; i < res.data.data.audio.length; i++) {
                                    audios.push(res.data.data.audio[i].url)
                                    audiosId.push(res.data.data.audio[i].id)
                                }
                                that.setData({
                                    isAudio: false,
                                    audios: audios,
                                    audiosId: audiosId,
                                })
                            } else {
                                that.setData({
                                    audios: [],
                                    audiosId: [],
                                    isAudio: true,
                                })
                            }
                            //图片
                            if (res.data.data.image.length > 0) {
                                let actImage = [];
                                let actImageId = [];
                                for (let i = 0; i < res.data.data.image.length; i++) {
                                    actImage.push(res.data.data.image[i].url)
                                    actImageId.push(res.data.data.image[i].id)
                                }
                                that.setData({
                                    isImage: false,
                                    actImage: actImage,
                                    actImageId: actImageId,
                                })
                            } else {
                                that.setData({
                                    actImage: [],
                                    actImageId: [],
                                    isImage: true,
                                })
                            }
                            //视频
                            if (res.data.data.video.length > 0) {
                                let videos = [];
                                let videosId = [];
                                for (let i = 0; i < res.data.data.video.length; i++) {
                                    videos.push(res.data.data.video[i].url)
                                    videosId.push(res.data.data.video[i].id)
                                }
                                that.setData({
                                    isVideo: false,
                                    videos: videos,
                                    videosId: videosId,
                                })
                            } else {
                                that.setData({
                                    videos: [],
                                    videosId: [],
                                    isVideo: true,
                                })
                            }
                            
                        }else{
                            wx.showToast({
                                title: res.data.msg,
                                icon:'none',
                            })
                        }
                    }
                })
            } else if (that.data.isEdit == 0){
                that.setData({
                    isJob: true,
                    courseId: options.courseId,
                    date:options.date,
                })
                wx.setNavigationBarTitle({
                    title: '布置作业',
                })
            }
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
        innerAudioContext.stop()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
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

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
    // 播放语音
    playAudio: function (e) {
        let that = this;
        innerAudioContext.src = e.currentTarget.dataset.url;
        innerAudioContext.play();
        that.setData({
            audioUrl: e.currentTarget.dataset.url
        })
        innerAudioContext.onEnded(() => {
            that.setData({
                audioUrl: '',
            })
        })
    },
    // 提交作业
    submitData:function(e){
        let that = this;
        let sendData = e.detail.value;
        let title = '';
        let titleing = '';
        let url = '';
        if(that.data.actImageId.length > 0){
            for(let i =0;i<that.data.actImageId.length;i++){
                sendData['image[' + i + ']'] = that.data.actImageId[i]
            }
        }else{
            sendData['image[0]'] = '';
        }
        if (that.data.videosId.length > 0) {
            for (let i = 0; i < that.data.videosId.length; i++) {
                sendData['video[' + i + ']'] = that.data.videosId[i]
            }
        }else{
            sendData['video[0]'] = '';
        }
        if (that.data.audiosId.length > 0) {
            for (let i = 0; i < that.data.audiosId.length; i++) {
                sendData['audio[' + i + ']'] = that.data.audiosId[i]
            }
        }else{
            sendData['audio[0]'] = '';
        }


        if (that.data.isMark == 1){
            //  我的打卡作业
            sendData['assignment_id'] = that.data.assignment;
            url = 'punch_course/add_homework';
            
            if(that.data.isEdit == 1){

                title = '正在编辑';
                titleing: '编辑成功';
                sendData['homework_id'] = that.data.homeworkId;

            } else if (that.data.isEdit == 0){

                title = '正在打卡';
                titleing: '打卡成功';
                sendData['homework_id'] = '';

            }

        } else if (that.data.isMark == 0){

            sendData['homework_id'] = that.data.homeId;
            title = '正在回复';
            titleing: '回复成功';
            url = 'punch_course/comment';

        } else if (that.data.isMark == 3){
            //教师布置作业
            sendData['punch_course_id'] = that.data.courseId;
            url = 'punch_course/add_assignment';  //assignment
            if(that.data.isEdit == 1){
                title = '正在编辑作业';
                titleing: '编辑成功';
                sendData['assignment_id'] = that.data.assignment;
            } else if (that.data.isEdit == 0){
                title = '正在布置作业';
                titleing: '布置成功';
                sendData['assignment_id'] = 0; 
                sendData['date'] = that.data.date; 
            }
        }
        getApp().request({
            url:url,
            data: sendData,
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
                    wx.showLoading({
                        title: title,
                        mask: true,
                    })
                    setTimeout(closeLogin, 2000);
                    function closeLogin() {
                        wx.hideLoading()
                        wx.showToast({
                            title: titleing,
                            icon: 'success',
                            success: function () {
                                wx.navigateBack({})
                            }
                        })
                    }
                }else {
                    wx.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
            }
        })
    },
    // 删除作业
    delWork:function(e){
        let that = this;
        let url = '';
        let sendData = {};
        if (that.data.isMark == 3){
            //教师删除自己的作业
            url = 'punch_course/delete_assignment';
            sendData['assignment_id'] = that.data.assignment
        } else if (that.data.isMark == 1){
            //学员删除自己的打卡作业
            url = 'punch_course/delete_homework';
            sendData['homework_id'] = that.data.homeworkId
        }
        getApp().request({
            url:url,
            data:sendData,
            method:'post',
            success:function(res){
                if(Number(res.data.code) == 1){
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
                                wx.navigateBack({})
                            }
                        })
                    }
                }
            }
        })
    },
    // 拷贝作业
    copyCourse:function(){
        let that = this;
        let date = that.data.date;
        let dateString = new Date(date).valueOf();
        that.setData({
            isContent: true,
            isCopy: false,
            month: formate.month(new Date(dateString)),
            year: formate.year(new Date(dateString)),
            yearMonth: formate.year(new Date(dateString)) + '年' + formate.month(new Date(dateString)) + '月',
            toDay: formate.formatDate(new Date(dateString))
        })
        that.getDate(that.data.month, that.data.year)
        
    },
    // 拷贝页面按钮
    copyBtns:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            that.setData({
                isContent: false,
                isCopy: true,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            let sendData = {};
            for (let i = 0; i < that.data.dateString.length;i++){
                sendData['date[' + i + ']'] = that.data.dateString[i]
            }
            sendData['assignment_id'] = that.data.assignment;
            getApp().request({
                url:'punch_course/copy_assignment',
                data: sendData,
                method:'post',
                success:function(res){
                    if(Number(res.data.code) == 1){
                        wx.showLoading({
                            title: '正在拷贝',
                            mask: true,
                        })
                        setTimeout(closeLogin, 2000);
                        function closeLogin() {
                            wx.hideLoading()
                            wx.showToast({
                                title: '拷贝成功',
                                icon: 'success',
                                success: function () {
                                    wx.navigateBack({})
                                }
                            })
                        }
                    }
                }
            })
        }
    },
    //选择日期
    chooseDate:function(e){
        let that = this;
        let dateArr = [];
        let dateArrIndex = [];
        let dayList = []
        dayList.push(...that.data.dayList) 
        dateArr.push(...that.data.dateString);
        dateArrIndex.push(...that.data.dateStringIndex)
        let month = Number(e.currentTarget.dataset.month) > 10 ? Number(e.currentTarget.dataset.month) : ('0' + Number(e.currentTarget.dataset.month))
        let day = Number(e.currentTarget.dataset.day) > 10 ? Number(e.currentTarget.dataset.day) : ('0' + Number(e.currentTarget.dataset.day))
        let date = e.currentTarget.dataset.year + '-' + month + '-' + day

        if ((e.currentTarget.dataset.enable == true) && (e.currentTarget.dataset.haswork == false)){
            if(dateArr.includes(date)){
                let index = dateArr.indexOf(date);
                dateArr.splice(index, 1)
                dateArrIndex.splice(index,1)
                for (let i = 0; i < dayList.length;i++){
                    
                    if (i == Number(e.currentTarget.dataset.index)){
                            dayList[i].color = '#fff'
                    }
                }
                that.setData({
                    dateString: dateArr,
                    dateStringIndex: dateArrIndex,
                    dayList: dayList
                })
            }else{
                dateArr.push(date);
                dateArrIndex.push(Number(e.currentTarget.dataset.index));
                that.setData({
                    dateString: dateArr,
                    dateStringIndex: dateArrIndex,
                })
                for (let i = 0; i < dayList.length; i++) {
                    for (let j = 0; j < that.data.dateStringIndex.length; j++) {
                        if (i == that.data.dateStringIndex[j]) {
                            dayList[i].color = '#3984FF'
                        }
                    }
                }
                that.setData({
                    dayList: dayList,
                })
            }
        }else{
            return
        }
    },
    // 改变日历
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
    // 获取日历
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
                        res.data.data.date[i].color = '#fff'
                        if (res.data.data.date[i].week == 0) {
                            res.data.data.date[i].week = 7
                        }
                    }
                    let dateList = res.data.data.date;
                    let index = dateList[0].week - 1;
                    for (let i = 0; i < index; i++) {
                        dateList.unshift({ day: '', enable: false, hasAssignment: false })
                    }
                    for (let i = 0; i < res.data.data.date.length; i++) {
                        res.data.data.date[i].color = '#fff'
                    }

                    that.setData({
                        dayList: dateList,
                        startDate: formate.formatDate(new Date(res.data.data.start_time * 1000)),
                        endDate: formate.formatDate(new Date(res.data.data.end_time * 1000)),
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
    //上传图片
    chooseImage: function (e) {
        let that = this;
        wx.chooseImage({
            success: function (res) {
                //图片大小判定
                let imgArr = res.tempFiles;
                let size = imgArr.every((item, index, arr) => {
                    return item.size < 6291456
                })
                if(size){
                    let actImageId = [];
                    let actImage = [];

                    actImage.push(...that.data.actImage);
                    actImage.push(...res.tempFilePaths);
                    actImageId.push(...that.data.actImageId);

                    that.setData({
                        isImage:false,
                        actImage: actImage,
                    });

                    wx.showLoading({
                        title: '图片上传中',
                        mask: true,
                    });

                    let imageArr = res.tempFilePaths

                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    for (let i = 0; i < imageArr.length;i++){

                        getApp().uploadFile({
                            url: 'upload',
                            filePath: imageArr[i],
                            success: function (res) {
                                if (Number(res.code) == 1) {
                                    actImageId.push(res.data.imageId);
                                    that.setData({
                                        actImageId: actImageId
                                    })
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '上传成功',
                                        icon: 'success'
                                    })
                                } else {
                                    wx.showToast({
                                        title: res.msg,
                                        icon: 'none',
                                    })
                                }
                            }
                        }, header)
                    }
                } else {
                    wx.showToast({
                        title: '选择图片必须小于6M',
                        icon: 'none'
                    })
                }
            },
        })
    },
    // 删除视频/图片
    delImage:function(e){
        let that = this;
        if (Number(e.currentTarget.dataset.id) == 0){
            let that = this;
            let index = Number(e.currentTarget.dataset.index)

            let actImage = that.data.actImage;
            let actImageId = that.data.actImageId;

            actImage.splice(index, 1);
            actImageId.splice(index, 1);
            if (actImage.length <= 0) {
                that.setData({
                    isImage: true,
                })
            }
            that.setData({
                actImage: actImage,
                actImageId: actImageId,
            })
        } else if (Number(e.currentTarget.dataset.id) == 1){
            let that = this;
            let index = Number(e.currentTarget.dataset.index)

            let videos = that.data.videos;
            let videosId = that.data.videosId;

            videos.splice(index, 1);
            videosId.splice(index, 1);
            if (videos.length <= 0){
                that.setData({
                    isVideo: true,
                })
            }
            that.setData({
                videos: videos,
                videosId: videosId,
            })
        } else if (Number(e.currentTarget.dataset.id) == 2){
            let that = this;
            let index = Number(e.currentTarget.dataset.index)

            let audios = that.data.audios;
            let audiosId = that.data.audiosId;

            audios.splice(index, 1);
            audiosId.splice(index, 1);
            if (audios.length <= 0) {
                that.setData({
                    isAudio: true,
                })
            }
            that.setData({
                audios: audios,
                audiosId: audiosId,
            })
        }
    },
    //上传视频
    chooseVideo:function(){
        let that = this;
        wx.chooseVideo({
            success:function(res){
                let videoPath = res.tempFilePath;
                let size = res.size;
                let duration = res.duration;

                var time = 30;

                if ((Number(res.size) < 73400320) && (Number(res.duration) < 60)){
                    let videos = [];
                    let videosId = [];

                    videos.push(...that.data.videos);
                    videos.push(res.tempFilePath);
                    videosId.push(...that.data.videosId);

                    that.setData({
                        isVideo: false,
                        videos: videos,
                    })

                    wx.showLoading({
                        title: '请耐心等待',
                        mask: true,
                    })

                    let timer = setInterval(timeSub, 1000);

                    function timeSub() {
                        time -= 1;
                        if (time <= 0) {
                            clearInterval(timer)
                            wx.hideLoading(),
                            wx.showToast({
                                title: '请重新上传视频',
                                icon: 'none',
                            })
                        }
                    }
                    var header = {};
                    header.Cookie = wx.getStorageSync('cookie');
                    header['Content-Type'] = 'multipart/form-data';

                    wx.uploadFile({
                        url: getApp().getHost() + 'upload',
                        filePath: videoPath,
                        name: 'file',
                        header: header,
                        formData: {
                            size: Number(size),
                            duration: Number(duration.toFixed(0)),
                        },
                        success: function (res) {
                            let r = JSON.parse(res.data)
                            if (Number(r.code) == 1) {

                                clearInterval(timer)

                                videosId.push(r.data.videoId)
                                that.setData({
                                    videosId: videosId,
                                });
                                wx.hideLoading();
                                wx.showToast({
                                    title: '上传成功',
                                    icon: 'success'
                                })
                            } else {
                                wx.showToast({
                                    title: r.msg,
                                    icon: 'none',
                                })
                            }
                        }
                    })
                } else if ((Number(res.size) >= 73400320) || (Number(res.duration) >= 60)) {
                    wx.showToast({
                        title: '视频大于70M或长度大于60s,请重新选择',
                        icon: 'none'
                    })
                }
            }
        })
    },
    chooseAudio:function(){
        let that = this;
        that.setData({
            isGetAudio:false
        })
    },
    // 获取音频
    getAudio:function(e){
        let that = this;
        that.setData({
            isStart: !that.data.isStart,
        })
        if (that.data.isStart){
            let options = {
                format: 'mp3',
            }
            recorderManager.start(options);
            that.setData({
                borderColor: '#d81e06',
                audioIcon: '../../../icon/zheng.png',
            })

            let time = 60;

            let timer = setInterval(timeSubAudio, 1000);

            function timeSubAudio() {
                time -= 1;
                if (time <= 0) {
                    clearInterval(timer);
                    recorderManager.stop();
                    recorderManager.onStop((res) => {
                        let audios = [];
                        let audiosId = [];
                        let duration = res.duration;
                        let audiosPath = res.tempFilePath;
                        wx.showLoading({
                            title: '正在上传',
                            mask: true,
                        })
                        audiosId.push(...that.data.audiosId)
                        audios.push(...that.data.audios)
                        audios.push(res.tempFilePath);
                        that.setData({
                            isAudio: false,
                            audios: audios,
                        })

                        var header = {};
                        header.Cookie = wx.getStorageSync('cookie');
                        header['Content-Type'] = 'multipart/form-data';

                        wx.uploadFile({
                            url: getApp().getHost() + 'upload',
                            filePath: audiosPath,
                            name: 'file',
                            header: header,
                            formData: {
                                duration: Number(duration.toFixed(0)),
                            },
                            success: function (res) {
                                let r = JSON.parse(res.data);
                                console.log('r', r)
                                if (Number(r.code) == 1) {
                                    wx.hideLoading()
                                    audiosId.push(r.data.audioId);
                                    that.setData({
                                        audiosId: audiosId
                                    })
                                } else {
                                    wx.showToast({
                                        title: r.msg,
                                        icon: 'none',
                                    })
                                }
                            }
                        })

                    })
                }
            }

        }else{
            recorderManager.stop();
            recorderManager.onStop((res) => {
                let audios = [];
                let audiosId = [];
                let duration = res.duration;
                let audiosPath = res.tempFilePath;
                wx.showLoading({
                    title: '正在上传',
                    mask: true,
                })
                audiosId.push(...that.data.audiosId)
                audios.push(...that.data.audios)
                audios.push(res.tempFilePath);
                that.setData({
                    isAudio:false,
                    audios: audios,
                })

                var header = {};
                header.Cookie = wx.getStorageSync('cookie');
                header['Content-Type'] = 'multipart/form-data';

                wx.uploadFile({
                    url: getApp().getHost() + 'upload',
                    filePath: audiosPath,
                    name: 'file',
                    header: header,
                    formData: {
                        duration: Number(duration.toFixed(0)),
                    },
                    success:function(res){
                        let r = JSON.parse(res.data);
                        console.log('r',r)
                        if(Number(r.code) == 1){
                            wx.hideLoading()
                            audiosId.push(r.data.audioId);
                            that.setData({
                                audiosId: audiosId
                            })
                        }else{
                            wx.showToast({
                                title: r.msg,
                                icon:'none',
                            })
                        }
                    }
                })

            })
            that.setData({
                isGetAudio: true,
                borderColor: '#7c7c7c',
                audioIcon: '../../../icon/audio.png',
            })
        }
    }
})