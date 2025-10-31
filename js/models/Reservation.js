export class Reservation {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.clientName = data.clientName;
    this.day = data.day;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.numberOfPeople = data.numberOfPeople;
    this.type = data.type;
    this.notes = data.notes || "";
  }

  generateId() {
    return `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  toJSON() {
    return {
      id: this.id,
      clientName: this.clientName,
      day: this.day,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      numberOfPeople: this.numberOfPeople,
      type: this.type,
      notes: this.notes,
    };
  }

  static fromJSON(data) {
    return new Reservation(data);
  }
}
