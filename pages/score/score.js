Page({
  data: { bgImage: '', what: '', mood: '', result: '', history: [], loading: false },
  onLoad() { this.randomBg(); this.setData({ history: wx.getStorageSync('diary_v2') || [] }) },
  randomBg() {
    const list = ["/images/cat-devon.jpg","/images/cat-aby.jpg","/images/lego-rocket2.jpg","/images/kitty1.jpg","/images/kitty2.jpg","/images/lego-plane.jpg","/images/blue-dress.jpg","/images/ysl.jpg"]
    this.setData({ bgImage: list[Math.floor(Math.random() * list.length)] })
  },
  onWhat(e) { this.setData({ what: e.detail.value }) },
  setMood(e) { this.setData({ mood: e.currentTarget.dataset.m }) },
  getAdvice() {
    if (!this.data.what) { wx.showToast({ title: '先说说今天做了什么吧', icon: 'none' }); return }
    if (!this.data.mood) { wx.showToast({ title: '选一个心情吧', icon: 'none' }); return }
    this.setData({ loading: true, result: '' })
    const prompt = '用户叫47。47今天做了这些事：'+this.data.what+'。她今天的心情是：'+this.data.mood+'。她喜欢吃的东西有:醋 和硬的面 还有番茄酱 茄皇拌面(泡面) 寿司 虾尾 草莓 三鲜饺子 喝霸王茶姬全糖少冰 炸鸡 牛排 烤肉(自己烤)。先共情回应她的心情——开心就一起开心，难过就安慰鼓励。然后根据她今天做的事和心情以及她的喜好，推荐一道适合今天吃的美食（菜名+简单理由）每次推荐的美食要多样化，不要重复推荐同一种食物。语气温暖像闺蜜。然后给一个让今天更美好的小建议。结尾"47记得多喝水💧"。'
    const that = this
    wx.cloud.callFunction({
      name: 'exam',
      data: { prompt: prompt, bot_id: '7648215602422956070' },
      success(res) {
        const fullText = res.result?.content || '无返回'
        const h = wx.getStorageSync('diary_v2') || []
        h.unshift({mood:that.data.mood,what:that.data.what.slice(0,30),time:new Date().toLocaleString('zh-CN'),content:fullText})
        wx.setStorageSync('diary_v2',h.slice(0,20))
        that.setData({history:h.slice(0,20)})
        that.setData({result:'', loading:false})
        let i = 0
        const timer = setInterval(() => { if (i < fullText.length) { that.setData({result: fullText.slice(0, i+1)}); i++ } else { clearInterval(timer) } }, 25)
      },
      fail() { that.setData({loading:false}); wx.showToast({title:'网络错误',icon:'none'}) }
    })
  },

  showDetail(e){const i=this.data.history[e.currentTarget.dataset.idx];i&&i.content&&wx.showModal({title:i.mood+' · '+i.time,content:i.content,showCancel:false,confirmText:'好的'})}
})
