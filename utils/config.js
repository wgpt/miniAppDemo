

const config = {
    "production": { // 正式
        URL: 'https://camel.8848.com/api', //线上
        IMGURL: 'https://luotuo.8848.com/data/attachment/forum/' // 图片
    },
    "test": {  // 测试
        URL: 'https://ceshi.8848.com/api',
        IMGURL: 'https://ceshi.8848.com/wx_img'  // 图片
    },
}

const global = { // 全局变量
    sercetKey: ''
}



export default (type = 'test')=>{
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

        wx['config'] = Object.freeze(bject.assign(global,config[type]))
        // console.log(wx)
    }
}