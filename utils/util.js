import md5 from "./md5";

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/*序列化当前时间*/
const formatDate = (time, splitStr) => {
    if (!time) return '';

    let  date = new Date(time);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()


    if (splitStr)
        return [year, month, day].map(formatNumber).join(splitStr) + ' ' + [hour, minute, second].map(formatNumber).join(':');
    else
        return {
            year, month, day,
            hour, minute, second
        };
}


// 删除 下标为key 的对象
const removeObject = (data, key) => {
    console.log(key)

    if (Array.isArray(data)) { // 对象
        data[key] = 0;

        return data.filter(item => item)


    } else if (typeof data == 'object') { // 数组过滤下标不为数字的数据
        let ar = [];
        for (var i in data) {

            if (i == key || isNaN(i)) continue

            ar.push(data[i])
        }

        return ar

    } else {
        console.log('不是对象或数组')
        return data
    }


}

// 弹窗
const showToast = (op) => {

    let def = {
        title: '成功',
        icon: 'success',
        duration: 1200,
        mask: true
    }

    def = Object.assign(def, op)

    // console.log(def)

    setTimeout(() => {

        wx.showToast({
            ...def
        })

    }, 0)
}

// 注入wx
const settingWx = (key, value) => {
    if (!wx) {
        console.log('wx还未初始化')
    } else if (wx[key]) {
        console.log(`utils/util.js: wx中${key}已存在`)
    } else {
        wx[key] = value
        // console.log(wx)
    }
}

// 随机数 n 到 m
const random = (n, m) => {
    return Math.floor(Math.random() * (m - n + 1) + n);
}


/**
 * // 倒计时计算
 *
 * @param Object
 * {
 *   end 终结时间
 *   start 开始时间
 *
 *   flag 自减**毫秒数**  如果存在 time - flag
 * }
 * */
const countTime = ({end, start, flag, time}) => {
    //获取当前时间

    let leftTime
    if (flag) {
        leftTime = time - flag;
    } else {
        leftTime = end - start;
    }

    // console.log(leftTime,end,start,flag)

    if (leftTime >= 0) {
        return {
            d: Math.floor(leftTime / 1000 / 60 / 60 / 24),
            h: formatNumber(Math.floor(leftTime / 1000 / 60 / 60 % 24)),
            m: formatNumber(Math.floor(leftTime / 1000 / 60 % 60)),
            s: formatNumber(Math.floor(leftTime / 1000 % 60)),
            end: leftTime
        }
    } else {
        return 0
    }
}

/*
* 返回上一页，没上一页, 返回首页
*
* */
const back = () => {

    let page = getCurrentPages()

    if (page.length == 1) {

        wx.navigateTo({
            url: '/pages/index/index'
        })

    } else {
        wx.navigateBack()
    }

}


/**
 * 删除数据，重新渲染
 *
 * @param that 当前页面
 * @key pages data 字段
 * @flag 数组 key
 * @value 过滤值
 *
 * */

const countData = (that, key, flag, value) => {

    let data = that.data[key]

    let ar = []

    let list = []

    for (var i in data) {

        if (data[i][flag] == value) continue
        ar.push(data[i])

    }
    list[key] = ar

    that.setData({...list})

}

/**
 * 确定弹窗
 * */

const showModal = (op) => {

    let def = {
        title: '提示',
        content: 'msg',
        showCancel: false
    }

    def = Object.assign(def, op)

    // console.log(def)

    wx.showModal(def)


}


/*
* 当前页
* */
const getPage = () => {
    let pages = getCurrentPages()

    return pages[pages.length - 1]  // 当前页

}

/**
 * 当前页
 * */
const go = (url = false, type = 1) => {
    if (!url) {
        console.log('url 不存在')
    }

    if (type == 1) {
        wx.navigateTo({
            url
        })
    } else if (type == 2) {
        wx.redirectTo({
            url
        })
    }

}

/**
 * 上传文件
 * */
const upFile = ({url = '', filePath = ''}) => {

    return new Promise((resolve, reject) => {

        if (!url || !filePath) {
            showModal({
                content: '参数错误1000'
            })
            reject(false)
            return
        }

        wx.api({
            isLogin: true,
            hideLoading: false,
            showLoading: false
        }).then(() => {
            let time = new Date().getTime()

            wx.uploadFile({
                url: url,
                filePath: filePath,
                name: 'file',
                header: {
                    token: wx.getStorageSync('token'),
                    'appKey': 'wx', // 加密验证
                    'sign': md5.hexMD5('hg9ll7ylq5eiojc3uj' + time),
                    'time': time
                },
                success(res) {

                    try {
                        resolve(JSON.parse(res.data))
                    } catch (e) {
                        console.log(e)
                        reject(res)
                    }

                },
                fail(res) {
                    reject(res)
                }
            })
        })

    })
}

/*
* 精确计算
* */
const calc = {
    /*
    函数，加法函数，用来得到精确的加法结果
    说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
    调用：Calc.Add(arg1,arg2,d)
    返回值：两数相加的结果
    */
    Add: function (arg1, arg2) {
        arg1 = arg1.toString(), arg2 = arg2.toString();
        var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
        var maxLen = Math.max(d1.length, d2.length);
        var m = Math.pow(10, maxLen);
        var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        var d = arguments[2];
        return typeof d === "number" ? Number((result).toFixed(d)) : result;
    },
    /*
    函数：减法函数，用来得到精确的减法结果
    说明：函数返回较为精确的减法结果。
    参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
    调用：Calc.Sub(arg1,arg2)
    返回值：两数相减的结果
    */
    Sub: function (arg1, arg2) {
        return Calc.Add(arg1, -Number(arg2), arguments[2]);
    },
    /*
    函数：乘法函数，用来得到精确的乘法结果
    说明：函数返回较为精确的乘法结果。
    参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
    调用：Calc.Mul(arg1,arg2)
    返回值：两数相乘的结果
    */
    Mul: function (arg1, arg2) {
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    /*
    函数：除法函数，用来得到精确的除法结果
    说明：函数返回较为精确的除法结果。
    参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
    调用：Calc.Div(arg1,arg2)
    返回值：arg1除于arg2的结果
    */
    Div: function (arg1, arg2) {
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    }
};

/**
*过滤规则
*
* */
const valid = {
    nullable(value){ // 去空格 能换行
       return  value.replace(/[^\S\n\r]/g, '')
    },
    mobile(str) {
        str = '' + str
        return /^0\d{2,3}-?\d{7,8}$/.test(str) || /^\d{11}$/.test(str)
    },
    phone(str) {
        str = '' + str
        return /^\d{11}$/.test(str)
    },
    number(str) {
        return /^\d+$/.test(str)
    },
    email(str) {
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
            str
        )
    },
    postalCode(str) {
        str = '' + str
        return /^[0-9]{6}$/.test(str)
    }

}



const $ = {
    formatTime,
    removeObject, // 删除数据
    showToast,
    showModal,
    settingWx,
    random,
    countTime, /*倒计时计算*/
    countData, /*删除数据，重新渲染*/
    getPage, // 当前页
    go, // 自定跳转
    back,
    upFile, // 上传图片
    formatDate, // 序列化时间
    calc, // 精确计算
    valid // 过滤规则
}

const init = (key) => {
    settingWx(key, $)
}

export default init


