// 新用户登录弹窗


Component({
    properties: {
        show: { // false 隐藏  true显示
           type: Boolean,
           value: false,
           observer: '_show'
        },
        in: { // 动画初始位置
            type: String,
            value: 'topUp'
        },
        out: { // 动画离开位置
            type: String,
            value: ''
        },
        position:{
            type: String,
            value: 'center' // left right top bottom
        },
        bg:{ // false 不是弹窗
            type: Boolean,
            value: true
        }
    },
    data: {
        bgShow: false,
        boxShow: false,
        flag: false
    },
    methods: {
        _show(value){
            if(value){
                this.in()
            }else{
                this.out()
            }
        },
        in(){
            // 是否有动画进行中
            if(this.data.flag) return
            // console.log(this.data)
            this.setData({
                boxShow: true,
                class: this.data.in,
                bgShow: true,
                flag: true
                // show: false
            })

            setTimeout(()=>{
                this.setData({
                    class: ''
                })
            },100)

            setTimeout(()=>{
                this.data.flag = false
            },500)

        },
        out(){
            // 是否有动画进行中
           if(this.data.flag) return

           this.setData({
               class: this.data.in || 'topUp',
               bgShow: false,
               flag: true
           })

           this.triggerEvent("leave",true)

           setTimeout(()=>{
               this.setData({
                   boxShow: false,
                   show: false,
                   flag: false
               })
           },500)

        }

    }
})

