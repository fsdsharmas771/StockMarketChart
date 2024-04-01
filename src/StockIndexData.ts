export class StockIndexData {
  public static getData(): any[] {
    return [
      {
        Date: new Date(2020, 2, 3),
        Open: 3235,
        High: 3268,
        Low: 3235,
        Close: 3248,
        Volume: 3757910000,
      },
      {
        Date: new Date(2020, 2, 4),
        Open: 3280,
        High: 3306,
        Low: 3280,
        Close: 3297,
        Volume: 3995320000,
      },
    ];
  }
}
