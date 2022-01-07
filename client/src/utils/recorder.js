// export function getTimeLeft(timeout) {
//   let time = Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
//   console.log(timeout._idleStart)
//   return time
// }

// export function getTimeLeft(timeout) {
//   let time = Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
//   console.log(timeout._idleStart)
//   return time
// }
export class Timer {
  constructor(callback, delay) {
    var id, started, remaining = delay, running

    this.start = function () {
      running = true
      started = new Date()
      id = setTimeout(callback, remaining)
    }

    this.pause = function () {
      running = false
      clearTimeout(id)
      remaining -= new Date() - started
    }

    this.getTimeLeft = function () {
      if (running) {
        this.pause()
        this.start()
      }

      return remaining
    }

    this.getStateRunning = function () {
      return running
    }

    this.start()
  }
}