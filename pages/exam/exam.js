Page({
  data: { bgImage: '', hobby: '', subjects: '', score: '', result: '', loading: false, history: [] },
  onLoad() { this.randomBg(); this.setData({ history: wx.getStorageSync('exam_hist') || [] }) },
  randomBg() {
    const list = ["/images/cat-devon.jpg","/images/cat-aby.jpg","/images/lego-rocket2.jpg","/images/kitty1.jpg","/images/kitty2.jpg","/images/lego-plane.jpg","/images/blue-dress.jpg","/images/ysl.jpg"]
    this.setData({ bgImage: list[Math.floor(Math.random() * list.length)] })
  },
  onHobby(e) { this.setData({ hobby: e.detail.value }) },
  onSubjects(e) { this.setData({ subjects: e.detail.value }) },
  onScore(e) { this.setData({ score: e.detail.value }) },
  getAIAdvice() {
    if (!this.data.hobby && !this.data.subjects) { wx.showToast({ title: '请至少填一项', icon: 'none' }); return }
    this.setData({ loading: true, result: '' })
    const prompt = '你是资深高考志愿规划师，精通河北新高考3+1+2模式。用户叫47。47：河北，物化地，2026高考。兴趣：'+(this.data.hobby||'无')+' 擅长：'+(this.data.subjects||'无')+' 预估：'+(this.data.score||'无')+'\n物化地覆盖90%以上理工农医+地理/测绘/城规/地质。\n按格式回复：🎯推荐专业(3-5个) 💼就业 🏫院校推荐(冲/稳/保)：河北本地院校加一句"想要离家近些可以多陪陪奶奶"，京津冀院校加一句"回唐山也很方便不用担心陪奶奶时间变少"，全国热门院校加一句"每周飞机来回也很方便" 💧结尾：47加油记得多喝水～'
    const that = this
    wx.cloud.callFunction({
      name: 'exam',
      data: { prompt: prompt, bot_id: '7648155992223563791' },
      success(res) {
        const fullText = res.result?.content || '无返回'
        // 存历史
        const h = wx.getStorageSync('exam_hist') || []
        h.unshift({score:that.data.score||'--',preview:(that.data.hobby||'').slice(0,15),time:new Date().toLocaleString('zh-CN'),content:fullText})
        wx.setStorageSync('exam_hist',h.slice(0,20))
        that.setData({history:h.slice(0,20)})
        // 打字效果
        that.setData({result:'', loading:false})
        let i = 0
        const timer = setInterval(() => { if (i < fullText.length) { that.setData({result: fullText.slice(0, i+1)}); i++ } else { clearInterval(timer) } }, 25)
      },
      fail() { that.setData({loading:false}); wx.showToast({title:'网络错误',icon:'none'}) }
    })
  },

  showDetail(e){const i=this.data.history[e.currentTarget.dataset.idx];i&&i.content&&wx.showModal({title:i.score+'分 · '+i.time,content:i.content,showCancel:false,confirmText:'好的'})}
})
