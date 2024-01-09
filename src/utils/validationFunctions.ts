class ValidationFunctionClass {
  speed: number
  time: number
  presure: number

  timeStart: number
  timeEnd: number

  constructor() {
    this.speed = 0
    this.time = 0
    this.presure = 0
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  setTime(time: number) {
    this.time = this.time + time

    const event = new CustomEvent('time', { detail: this.time })
    document.dispatchEvent(event)
  }

  setPresure(presure: number) {
    this.presure = presure
  }

  countTime = () => {
    const time = this.timeEnd - this.timeStart

    this.setTime(time)
  }

  countTimeStart = () => {
    this.timeStart = new Date().getTime()
  }

  countTimeEnd = () => {
    this.timeEnd = new Date().getTime()

    this.countTime()
  }
}

export default ValidationFunctionClass
