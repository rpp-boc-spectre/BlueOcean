export class Player {
  constructor(start, stop) {
    this.start = start,
      this.stop = stop
  }

  incStart() {
    this.start += 1
  }

  incStop() {
    this.stop += 1
  }

}