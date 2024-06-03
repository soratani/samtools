type FormatType =
  | "YYYY-MM-DD"
  | "YYYY/MM/DD"
  | "DD/MM/YYYY"
  | "YYYY-MM-DD HH:mm:ss"
  | "YYYY/MM/DD HH:mm:ss"
  | "DD/MM/YYYY HH:mm:ss"
  | "YYYY-MM-DD HH:mm"
  | "YYYY/MM/DD HH:mm"
  | "DD/MM/YYYY HH:mm"
  | "YYYY-MM-DD HH"
  | "YYYY/MM/DD HH"
  | "DD/MM/YYYY HH";

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

  constructor(private readonly time: string | number) {
    this.data = new Date(Time.verification(time));
  }

  private data!: Date;

  private YYYY() {
    return this.data.getFullYear();
  }

  private MM() {
    const t = this.data.getMonth() + 1;
    return String(t).padStart(2, "0");
  }

  private DD() {
    const t = this.data.getDate();
    return String(t).padStart(2, "0");
  }

  private HH() {
    return this.data.getHours();
  }

  private mm() {
    return this.data.getMinutes();
  }

  private ss() {
    return this.data.getSeconds();
  }

  private _format(type: string, sep = "/") {
    if (!type) return undefined;
    return type
      .split(sep)
      .map((item) => {
        return this[item]();
      })
      .join(sep);
  }

  public format(type: FormatType) {
    let defaultTime = type;
    if (!Time.types.includes(type)) {
      defaultTime = "YYYY-MM-DD";
    }
    const [time1, time2] = defaultTime.split(" ");
    return [time1, time2]
      .map((i) => {
        if (!i) return undefined;
        if (i.includes("-")) return this._format(i, "-");
        if (i.includes("/")) return this._format(i, "/");
        if (i.includes(":")) return this._format(i, ":");
        return undefined;
      })
      .filter(Boolean)
      .join(" ");
  }
}
