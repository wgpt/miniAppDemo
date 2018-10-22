/*全局变量*/


const config = {
    "production": { // 正式
        url: '', //线上
        image: '', //图片
    },
    "test": {  // 测试
        url: '', //线上
        image: '', //图片
    },
}

const global = { // 全局变量
    timeOutCode: 401 // 失效码
}


export default (type = 'production')=>{
    if(!wx){
        console.log('wx还未初始化')
    }else if(wx['key']){
        console.log(`utils/config.js: wx中config已存在`)
    }else{
        let st = wx.getStorageSync('configType');

        if(st != type){ // 换环境清缓存
            wx.clearStorageSync()
            wx.setStorageSync('configType', type);
        }

        wx['config'] = Object.assign(global,config[type])
        // console.log(wx)
    }
}