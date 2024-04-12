export class Time {
  private static types = [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "DD/MM/YYYY",
    "YYYY-MM-DD HH:mm:ss",
    "YYYY/MM/DD HH:mm:ss",
    "DD/MM/YYYY HH:mm:ss",
    "YYYY-MM-DD HH:mm",
    "YYYY/MM/DD HH:mm",
    "DD/MM/YYYY HH:mm",
    "YYYY-MM-DD HH",
    "YYYY/MM/DD HH",
    "DD/MM/YYYY HH",
  ];
  static verification(time: string | number) {
    try {
      return new Date(time).getTime();
    } catch (error) {
      return Date.now();
    }
  }

  constructor(private readonly time: string | string) {
    this.data = new Date(Time.verification(time));
  }
  private data!: Date;

  private YYYY() {
    return this.data.getFullYear();
  }

  private MM() {
    return this.data.getMonth;
  }

  public format(type: string) {
    if (!Time.types.includes(type)) {
    }
  }
}
