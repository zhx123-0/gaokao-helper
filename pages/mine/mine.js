Page({
  data: { bgImage: '' },
  onLoad() { this.randomBg() },
  randomBg() {
    const list = ["/images/cat-devon.jpg","/images/cat-aby.jpg","/images/lego-rocket2.jpg","/images/kitty1.jpg","/images/kitty2.jpg","/images/lego-plane.jpg","/images/blue-dress.jpg","/images/ysl.jpg"]
    this.setData({ bgImage: list[Math.floor(Math.random() * list.length)] })
  }
})
