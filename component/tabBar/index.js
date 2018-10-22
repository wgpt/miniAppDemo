// 新用户登录弹窗


Component({
    data: {
        tab:[
            {
                name: '首页',
                url: '/pages/index/index',
                img: 'index',
                rt: 'redirect', // 跳转类型
                bt: '', // 按钮类型

            },
            {
                name: '更多玩法',
                url: '/pages/personal/more/index',
                img: 'more',
                rt: 'redirect', // 跳转类型
                bt: '', // 按钮类型

            },
            {
                name: '我的',
                url: '/pages/personal/index',
                img: 'personal',
                rt: 'redirect', // 跳转类型
                bt: '', // 按钮类型
            }
        ]
    },
    methods: {
        select(e){
            this.setData({
                current: e.currentTarget.dataset.url
            })
        }

    },
    ready(){

        setTimeout(()=>{
            let pages = getCurrentPages()
            let that = pages[pages.length - 1]  // 当前页

            this.setData({
                current: '/' + that.route
            })
        },0)


    }
})

