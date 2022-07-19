export default class Bread {
  breadId: number;
  breadPrice: number;
  breadName: string;
  bakerCpf: string;
  constructor(
    breadId: number | null | undefined,
    breadPrice: number | null | undefined,
    breadName: string | null | undefined,
    bakerCpf: string | null | undefined
  ) {
    if (!breadId || !breadPrice || !breadName || !bakerCpf) {
      throw new Error('Null properties');
    }

    this.breadId = breadId;
    this.breadPrice = breadPrice;
    this.breadName = breadName;
    this.bakerCpf = bakerCpf;
  }
  //getters and setters
  getBreadId(): number {
    return this.breadId;
  }
  setBreadId(breadId: number): void {
    this.breadId = breadId;
  }
}
