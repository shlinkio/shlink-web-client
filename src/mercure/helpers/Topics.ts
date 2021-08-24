export class Topics {
  public static readonly visits = 'https://shlink.io/new-visit';

  public static readonly orphanVisits = 'https://shlink.io/new-orphan-visit';

  public static readonly shortUrlVisits = (shortCode: string) => `https://shlink.io/new-visit/${shortCode}`;
}
