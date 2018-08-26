const PREFIX = 'shlink';
const buildPath = (path) => `${PREFIX}.${path}`;

export class Storage {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  get = (key) => {
    const item = this.localStorage.getItem(buildPath(key));

    return item ? JSON.parse(item) : undefined;
  };

  set = (key, value) => this.localStorage.setItem(buildPath(key), JSON.stringify(value));
}

const browserStorage = global.localStorage || {
  getItem() {
    return '';
  },
  setItem() {
    return '';
  },
};
const storage = new Storage(browserStorage);

export default storage;
