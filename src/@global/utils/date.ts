export class DateUtil {
  private date: Date
  constructor() {
    this.date = new Date()
  }
  public format() {
    const year = this.date.getFullYear()
    const month = String(this.date.getMonth() + 1).padStart(2, '0')
    const day = String(this.date.getDate()).padStart(2, '0')
    const hours = String(this.date.getHours()).padStart(2, '0')
    const minutes = String(this.date.getMinutes()).padStart(2, '0')
    const seconds = String(this.date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}
