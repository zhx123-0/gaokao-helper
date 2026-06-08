Page({
  data: {
    bgImage: '', aiInput: '', aiResult: '', aiLoading: false,
    filter: 'all',
    tips: ['用学生证！景区门票半价','火车票学生价 7.5 折','青旅/民宿比酒店便宜一半以上','结伴出行，拼房拼车省一大笔','提前订票比现场便宜','带好身份证+高考准考证备用'],
    dests: [
      { name: '秦皇岛·北戴河', emoji: '🌊', days: '2-3天', budget: '¥500-800', filter: 'short',
        desc: '河北最近的海滨城市，高考后看海首选。老虎石日落、鸽子窝日出、山海关古城。',
        route: '唐山→高铁1.5h直达北戴河站', tip: '6月中旬还没到旺季，住宿便宜' },
      { name: '北京·首都之旅', emoji: '🏛️', days: '3-4天', budget: '¥800-1200', filter: 'short',
        desc: '故宫、长城、颐和园、清华北大校园游。历史文化之旅最适合高考季。',
        route: '唐山→高铁1h到北京', tip: '周一故宫闭馆，提前预约门票' },
      { name: '西安·梦回长安', emoji: '🏯', days: '4-5天', budget: '¥1000-1500', filter: 'mid',
        desc: '兵马俑、城墙、回民街、大唐不夜城。历史+美食双重享受。',
        route: '唐山→高铁3h到西安北站', tip: '兵马俑离市区远，报一日游团更划算' },
      { name: '重庆·山城魔幻', emoji: '🌆', days: '4-5天', budget: '¥1200-1800', filter: 'mid',
        desc: '洪崖洞夜景、轻轨穿楼、火锅江湖、长江索道。魔幻8D城市。',
        route: '唐山→高铁7h或飞机1.5h', tip: '夏天重庆很热，建议避开三伏天' },
      { name: '南京·金陵烟雨', emoji: '🏮', days: '3-4天', budget: '¥800-1200', filter: 'short',
        desc: '夫子庙秦淮河、中山陵、南京博物院。最有文化味的毕业旅行。',
        route: '唐山→高铁3h到南京南站', tip: '中山陵免费但需预约' },
      { name: '长沙·青春之城', emoji: '🔥', days: '3-4天', budget: '¥800-1000', filter: 'short',
        desc: '橘子洲头、岳麓山、茶颜悦色、文和友。网红城市的快乐。',
        route: '唐山→高铁4h到长沙南', tip: '茶颜悦色要排队，建议错峰' },
      { name: '成都·慢生活', emoji: '🐼', days: '5-6天', budget: '¥1500-2000', filter: 'mid',
        desc: '大熊猫基地、宽窄巷子、都江堰、火锅串串。巴适！',
        route: '唐山→飞机2.5h或高铁8h', tip: '看熊猫要早上去，下午它们睡觉' },
      { name: '青岛·红瓦绿树', emoji: '🍺', days: '3-4天', budget: '¥800-1200', filter: 'short',
        desc: '栈桥喂海鸥、八大关漫步、崂山看海、啤酒博物馆。北方最美的海滨城市。',
        route: '唐山→高铁3h到青岛北', tip: '6月海风凉爽，啤酒节还没开始但人少' },
      { name: '济南·泉城', emoji: '⛲', days: '2-3天', budget: '¥500-800', filter: 'short',
        desc: '趵突泉、大明湖、千佛山、芙蓉街小吃。老舍笔下的泉城。',
        route: '唐山→高铁2.5h到济南西', tip: '大明湖免费，趵突泉学生票半价' },
      { name: '大连·浪漫之都', emoji: '🐬', days: '4-5天', budget: '¥1000-1500', filter: 'mid',
        desc: '星海广场、老虎滩海洋公园、金石滩、有轨电车。东北最浪漫的城市。',
        route: '唐山→高铁5h或飞机1h', tip: '6月海水还有点凉，但人少景美' },
      { name: '洛阳·古都神都', emoji: '🏮', days: '3-4天', budget: '¥800-1000', filter: 'short',
        desc: '龙门石窟、白马寺、洛邑古城汉服体验、牛肉汤。穿越回大唐。',
        route: '唐山→高铁4h到洛阳龙门', tip: '穿汉服逛古城拍照超出片，租一套几十块' },
      { name: '云南·大理丽江', emoji: '🏔️', days: '6-7天', budget: '¥2000-3000', filter: 'long',
        desc: '苍山洱海、丽江古城、玉龙雪山。毕业旅行终极目的地。',
        route: '唐山→飞机3h到昆明→高铁2h到大理', tip: '7月是雨季，带好雨具；提前订民宿' },
    ]
  },
  onLoad() {
    this.randomBg()
    this.setFilter({ currentTarget: { dataset: { f: 'all' } } })
  },
  randomBg() {
    const list = ["/images/cat-devon.jpg","/images/cat-aby.jpg","/images/lego-rocket2.jpg","/images/kitty1.jpg","/images/kitty2.jpg","/images/lego-plane.jpg","/images/blue-dress.jpg","/images/ysl.jpg"]
    this.setData({ bgImage: list[Math.floor(Math.random() * list.length)] })
  },
  setFilter(e) {
    const f = e.currentTarget.dataset.f
    this.setData({
      filter: f,
      filteredDests: f === 'all' ? this.data.dests : this.data.dests.filter(d => d.filter === f)
    })
  },
  onAiInput(e) { this.setData({ aiInput: e.detail.value }) },
  askAI() {
    if (!this.data.aiInput) { wx.showToast({ title: '说说你的想法', icon: 'none' }); return }
    this.setData({ aiLoading: true, aiResult: '' })
    const prompt = '用户叫47，从唐山出发，她想毕业旅行。她写道：' + this.data.aiInput + '。请推荐1-2个适合的目的地，给一个3天左右的行程安排，附预算建议和实用小贴士。语气温暖，100字以内，结尾说"47旅途愉快！记得多喝水～💧"。'
    const that = this
    wx.request({
      url: 'http://localhost:5050/api/exam', method: 'POST', timeout: 30000,
      header: { 'Content-Type': 'application/json' }, data: { prompt: prompt },
      success(res) {
        const taskId = res.data?.task_id
        if (taskId) { that.pollTravel(taskId, 1) }
        else { that.setData({ aiResult: res.data?.content || '无返回', aiLoading: false }) }
      },
      fail() { that.setData({ aiLoading: false }) }
    })
  },
  pollTravel(taskId, n) {
    if (n > 15) { this.setData({ aiResult: '超时请重试', aiLoading: false }); return }
    const that = this
    setTimeout(() => wx.request({
      url: 'http://localhost:5050/api/exam/result?task_id=' + taskId, timeout: 10000,
      success(r) { r.data?.content ? that.setData({ aiResult: r.data.content, aiLoading: false }) : that.pollTravel(taskId, n+1) },
      fail() { that.pollTravel(taskId, n+1) }
    }), 3000)
  }
})
