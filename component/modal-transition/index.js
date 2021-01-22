// 动态弹窗
/**
 *  动画弹窗组件
 *
* */

Component({
  properties: {
    show: { // false 隐藏  true显示
      type: Boolean,
      value: false,
      observer: '_show'
    },
    inModel: { // 动画初始位置样式
      type: String,
      value: 'topIn'
    },
    outModel: { // 动画离开位置样式
      type: String,
      value: 'topOut'
    },
    duration: { // 执行时间
      type: Number,
      value: 800,
    },
    timingFunction: {
      type: String,
      value: 'ease'
    },
    bgClose: { // 背景点击是否关闭
      type: Boolean,
      value: true
    },
    position: { // 方框所在位置
      type: String,
      value: 'middle'
    }
  },
  data: {
    bgShow: false,
    boxShow: false,
    flag: false
  },
  methods: {
    _show(value) {
      if (value) {
        this.in()
      } else {
        this.out()
      }
    },
    // 进场动画
    in() {
      this.setData({
        boxShow: true
      },()=>{

        let {duration,timingFunction, inModel} = this.data

        // 背景入场动画
        let bg_ani = wx.createAnimation({
          duration: duration / 2,
          timingFunction
        })
        bg_ani.opacity(0.7).step()

        // 主体入场
        let slot = wx.createAnimation({
          duration: duration,
          timingFunction
        })

        /**
         * 入场动画设计处
         * */
        slot = this.storeHouse(slot, inModel)

        setTimeout(()=>{
          this.setData({
            bg_ani: bg_ani.export(),
            slot_ani: slot.export(),
          })
        },60)


      })


    },
    // 退出动画
    out() {
      let {duration,timingFunction, outModel} = this.data
      let outDur = duration * 1.2
      // 背景入场动画
      let bg_ani = wx.createAnimation({
        duration: outDur,
        timingFunction
      })
      bg_ani.opacity(0).step()

      // 主体入场
      let slot = wx.createAnimation({
        duration: duration,
        timingFunction
      })

      // 退场动画设计处
      slot = this.storeHouse(slot, outModel)


      this.setData({
        bg_ani: bg_ani.export(),
        slot_ani: slot.export(),
      },()=>{

        setTimeout(()=>{
          this.setData({
            boxShow: false,
          })

          this.triggerEvent('modalOut', true)

        },outDur)

      })

    },
    /**
     * 动画设计工厂
     *
     * @param animate - createAnimation
     * @param name - 动画名
     * @return createAnimation
     *
     *
    * */
    storeHouse(animate, name){

      let store = {
        topIn(){ // 淡入
          animate = animate.opacity(0.1).top('-30%').step({
            duration: 60
          })
          animate = animate.opacity(1).top(0).step()
        },
        topOut(){ // 淡出
          animate = animate.opacity(0).top('-30%').step()
        },
        scaleIn(){ // 弹入
          animate = animate.opacity(0.6).scale(1.1).step({
            duration: 60
          })
          animate = animate.opacity(1).scale(1).step()
        },
        scaleOut(){ // 弹出
          animate = animate.opacity(0).scale(0).step()
        },
        bottomUp(){ // 下方拉起
          animate = animate.opacity(0.1).bottom('-60%').step({
            duration: 60
          })
          animate = animate.opacity(1).bottom(0).step()
        },
        bottomDown(){ // 下方隐藏
          animate = animate.opacity(0).bottom('-60%').step()
        }


      }

      store[name] && store[name]();


      return animate
    }


  }
})

