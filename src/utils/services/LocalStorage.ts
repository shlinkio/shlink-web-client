const PREFIX = 'shlink';
const buildPath = (path: string) => `${PREFIX}.${path}`;

export class LocalStorage {
  public constructor(private readonly localStorage: Storage) {}

  public readonly get = <T>(key: string): T | undefined => {
    const item = this.localStorage.getItem(buildPath(key));
    return item ? JSON.parse(item) as T : undefined;
  };

  public readonly set = (key: string, value: any) => this.localStorage.setItem(buildPath(key), JSON.stringify(value));
}
