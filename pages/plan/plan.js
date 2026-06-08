Page({
  data: {
    bgImage: '', aiInput: '', aiResult: '', aiLoading: false,
    daysUntilExam: 4,
    checklist: [
      { id: 1, text: '大吃一顿庆祝高考结束！🎉', done: false, time: '考完当天' },
      { id: 2, text: '睡到自然醒，好好休息两天', done: false, time: '考后1-2天' },
      { id: 3, text: '估分 + 阅读河北志愿填报指南', done: false, time: '考后1天' },
      { id: 4, text: '查询目标院校近3年录取分数线', done: false, time: '考后3天' },
      { id: 5, text: '研究96个平行志愿填报规则', done: false, time: '考后5天' },
      { id: 6, text: '初步筛选20-30个目标院校专业', done: false, time: '出分前一周' },
      { id: 7, text: '出分日查成绩！', done: false, time: '6月25日' },
      { id: 8, text: '确定冲/稳/保最终志愿方案', done: false, time: '出分后2天' },
      { id: 9, text: '网上填报96个平行志愿', done: false, time: '填报期' },
      { id: 10, text: '收到录取通知书！🎉', done: false, time: '7月下旬' },
      { id: 11, text: '打卡暑假三个小目标(考驾照/学乐器/健身)', done: false, time: '假期目标' },
      { id: 12, text: '和高中朋友策划一场毕业旅行', done: false, time: '假期目标' },
      { id: 13, text: '整理高中三年的书和笔记', done: false, time: '假期目标' },
      { id: 14, text: '准备大学入学物品清单', done: false, time: '8月中旬' },
      { id: 15, text: '加入大学新生群,认识新同学', done: false, time: '8月底' }
    ],
    phases: [
      { title: '第一阶段：彻底放松', time: '6.10 - 6.15',
        items: ['睡到自然醒，把高三缺的觉补回来','大吃一顿庆祝，和同学聚餐','刷剧追番打游戏，尽情放纵','整理高中三年的书和试卷，决定哪些留作纪念','发一条朋友圈记录高考结束的心情'] },
      { title: '第二阶段：志愿准备', time: '6.16 - 6.24',
        items: ['用本小程序AI选专业，了解适合自己的方向','查询目标院校近3年录取分数和位次','列出20-30个感兴趣的"专业+院校"组合','了解96个平行志愿的填报规则和技巧','和父母认真沟通未来方向','准备一份志愿草案，标注冲/稳/保'] },
      { title: '第三阶段：志愿填报', time: '6.25 - 7月初',
        items: ['查成绩！记录自己的分数和全省位次','根据实际分数调整志愿方案','最终确定96个志愿排序','注意专业梯度和地域搭配，拉开档次','提交前反复核对，请老师或学长帮忙看一下','提交后关注河北省教育考试院录取状态通知'] },
      { title: '第四阶段：充实自我', time: '7月初 - 8月底',
        items: ['考驾照！暑假最值得做的事，报名科目一','学一项新技能：视频剪辑/编程/乐器/摄影','读3本一直想读但没时间读的书','锻炼身体，跑步/健身/打球','坚持每天记录生活（用本小程序的每日记录功能）','帮爸妈做家务，陪陪家人'] },
      { title: '第五阶段：迎接大学', time: '8月底 - 9月',
        items: ['准备入学物品：证件/衣物/电子设备/生活用品','了解自己的专业要学什么课程','加入大学新生群，认识室友和同学','规划大学四年的目标：社团/实习/考研/出国','和高中朋友最后聚一次，各奔东西前好好告别','带着期待和勇气，开启人生新篇章！'] }
    ]
  },
  onLoad() {
    this.randomBg()
    const target = new Date('2026/06/10 00:00:00')
    const days = Math.max(0, Math.ceil((target - new Date()) / 86400000))
    this.setData({ daysUntilExam: days })
  },
  randomBg() {
    const list = ["/images/cat-devon.jpg","/images/cat-aby.jpg","/images/lego-rocket2.jpg","/images/kitty1.jpg","/images/kitty2.jpg","/images/lego-plane.jpg","/images/blue-dress.jpg","/images/ysl.jpg"]
    this.setData({ bgImage: list[Math.floor(Math.random() * list.length)] })
  },
  toggle(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.checklist.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    this.setData({ checklist: list })
  },
  onAiInput(e) { this.setData({ aiInput: e.detail.value }) },
  askAI() {
    if (!this.data.aiInput) { wx.showToast({ title: '先说说你的想法', icon: 'none' }); return }
    this.setData({ aiLoading: true, aiResult: '' })
    const prompt = '用户叫47。她想规划高考后的假期，她写道：' + this.data.aiInput + '。请帮她定制一份专属的假期计划：每天大概做什么、推荐什么活动、给2-3条实用小建议。语气温暖像朋友，100字以内，结尾说"47假期快乐！记得多喝水～💧"。'
    const that = this
    wx.request({
      url: 'http://localhost:5050/api/exam', method: 'POST', timeout: 30000,
      header: { 'Content-Type': 'application/json' }, data: { prompt: prompt },
      success(res) {
        const taskId = res.data?.task_id
        if (taskId) { that.pollPlan(taskId, 1) }
        else { that.setData({ aiResult: res.data?.content || '无返回', aiLoading: false }) }
      },
      fail() { that.setData({ aiLoading: false }); wx.showToast({ title: '网络错误', icon: 'none' }) }
    })
  },
  pollPlan(taskId, n) {
    if (n > 15) { this.setData({ aiResult: '超时请重试', aiLoading: false }); return }
    const that = this
    setTimeout(() => wx.request({
      url: 'http://localhost:5050/api/exam/result?task_id=' + taskId, timeout: 10000,
      success(r) { r.data?.content ? that.setData({ aiResult: r.data.content, aiLoading: false }) : that.pollPlan(taskId, n+1) },
      fail() { that.pollPlan(taskId, n+1) }
    }), 3000)
  }
})
