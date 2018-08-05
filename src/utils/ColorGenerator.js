import Storage from './Storage';

const buildRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export class ColorGenerator {
  constructor(storage) {
    this.storage = storage;
    this.colors = this.storage.get('colors') || {};
  }

  getColorForKey = key => {
    let color = this.colors[key];
    if (color) {
      return color;
    }

    // If a color has not been set yet, generate a random one and save it
    color = buildRandomColor();
    this.colors[key] = color;
    this.storage.set('colors', this.colors);
    return color;
  };
}

export default new ColorGenerator(Storage);
