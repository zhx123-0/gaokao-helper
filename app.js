App({
  globalData: {
    examDate: '2026-06-10',
    scoreDate: '2026-06-25',
    province: '河北',
    userScore: null,
    userSubject: null
  },
  onLaunch() {
    wx.cloud.init({ env: 'helper47-d2g21xang62e898b6' })
    wx.getSystemInfo({
      success: res => {
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    })
  }
})
