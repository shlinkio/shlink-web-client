export class Topics {
  public static visits = () => 'https://shlink.io/new-visit';

  public static shortUrlVisits = (shortCode: string) => `https://shlink.io/new-visit/${shortCode}`;

  public static orphanVisits = () => 'https://shlink.io/new-orphan-visit';
}
