Page({
  data: {
    bgImage: '', mode: 'exam', history: [],
    hobby: '', subjects: '', score: '', loading: false,
    planInput: '', pLoading: false,
    travelInput: '', tLoading: false,
    result: ''
  },
  onLoad() {
    this.randomBg()
    this.setData({ history: wx.getStorageSync('plan_hist') || [] })
  },
  randomBg() {
    const list = ["/images/cat-devon.jpg","/images/cat-aby.jpg","/images/lego-rocket2.jpg","/images/kitty1.jpg","/images/kitty2.jpg","/images/lego-plane.jpg","/images/blue-dress.jpg","/images/ysl.jpg"]
    this.setData({ bgImage: list[Math.floor(Math.random() * list.length)] })
  },
  setMode(e) {
    const m = e.currentTarget.dataset.m
    const key = m === 'plan' ? 'plan_hist' : 'travel_hist'
    this.setData({ mode: m, result: '', history: wx.getStorageSync(key) || [] })
  },
  onHobby(e) { this.setData({ hobby: e.detail.value }) },
  onSubjects(e) { this.setData({ subjects: e.detail.value }) },
  onScore(e) { this.setData({ score: e.detail.value }) },
  onPlanInput(e) { this.setData({ planInput: e.detail.value }) },
  onTravelInput(e) { this.setData({ travelInput: e.detail.value }) },

  // === 选专业 ===
  getAIAdvice() {
    console.log('AI选专业被点击')
    if (!this.data.hobby && !this.data.subjects) { wx.showToast({ title: '请至少填一项', icon: 'none' }); return }
    this.setData({ loading: true, result: '' })
    const prompt = '你是资深高考志愿规划师，精通河北新高考3+1+2模式。用户叫47。47：河北，物化地，2026高考。兴趣：'+(this.data.hobby||'无')+' 擅长：'+(this.data.subjects||'无')+' 预估：'+(this.data.score||'无')+'\n物化地覆盖90%以上理工农医+地理/测绘/城规/地质。\n按格式回复：🎯推荐专业(3-5个) 💼就业 🏫院校推荐(冲/稳/保)：河北本地院校加一句"想要离家近些可以多陪陪奶奶"，京津冀院校加一句"回唐山也很方便不用担心陪奶奶时间变少"，全国热门院校加一句"每周飞机来回也很方便" 💧结尾：47加油记得多喝水～'
    this.callAPI(prompt, 'loading', '🎓选专业', (this.data.score||'--')+'分 '+(this.data.hobby||'').slice(0,15), '7648155992223563791')
  },

  // === 假期规划 ===
  askPlan() {
    if (!this.data.planInput) { wx.showToast({ title: '说说你的想法', icon: 'none' }); return }
    this.setData({ pLoading: true, result: '' })
    const prompt = '用户叫47，河北唐山考生，刚高考完在过暑假。她想规划假期，写道：'+this.data.planInput+'。47喜欢当被人支配的NPC，喜欢在街上漫无目的的闲逛，还喜欢一个人去KTV（记得提醒她一个人不要喝酒）。请帮她定制专属假期计划：每天做什么、推荐什么活动、给2-3条实用建议。语气温暖亲近像朋友。结尾"47假期快乐！记得多喝水💧"。'
    this.callAPI(prompt, 'pLoading', '📅假期', this.data.planInput.slice(0,20), '7648214622226726952')
  },

  // === 旅行 ===
  askTravel() {
    if (!this.data.travelInput) { wx.showToast({ title: '说说你的想法', icon: 'none' }); return }
    this.setData({ tLoading: true, result: '' })
    const prompt = '用户叫47，从唐山出发毕业旅行。她写道：'+this.data.travelInput+'。47喜欢当被人支配的NPC，喜欢在街上漫无目的的闲逛，还喜欢一个人去KTV（记得提醒她一个人不要喝酒）。请根据47的预算和天数，结合她的喜好推荐几个目的地，给具体行程安排和预算提示。语气温暖。结尾"47旅途愉快！记得多喝水💧"。'
    this.callAPI(prompt, 'tLoading', '🗺️旅行', this.data.travelInput.slice(0,20), '7648215194921582598')
  },

  // === 通用 API 调用 ===
  // 调用微信云函数
  callAPI(prompt, loadingKey, modeLabel, preview, botId) {
    const that = this
    that.setData({ [loadingKey]: true, result: '' })
    wx.cloud.callFunction({
      name: 'exam',
      data: { prompt: prompt, bot_id: botId },
      success(res) {
        const fullText = res.result?.content || '无返回'
        const key = that.data.mode === 'plan' ? 'plan_hist' : 'travel_hist'
        // 打字效果：逐字显示
        that.setData({ result: '', [loadingKey]: false })
        let i = 0
        const timer = setInterval(() => {
          if (i < fullText.length) {
            that.setData({ result: fullText.slice(0, i + 1) })
            i++
          } else { clearInterval(timer) }
        }, 30)
        // 存历史
        const h = wx.getStorageSync(key) || []
        h.unshift({ mode: modeLabel, preview: preview, time: new Date().toLocaleString('zh-CN'), content: fullText })
        wx.setStorageSync(key, h.slice(0, 30))
        that.setData({ history: h.slice(0, 30) })
      },
      fail(e) { console.log('云函数失败:', JSON.stringify(e)); that.setData({ [loadingKey]: false }); wx.showToast({ title: '网络错误', icon: 'none' }) }
    })
  },

  showDetail(e) {
    const item = this.data.history[e.currentTarget.dataset.idx]
    if (item && item.content) { wx.showModal({ title: item.mode+' · '+item.time, content: item.content, showCancel: false, confirmText: '好的' }) }
  }
})
