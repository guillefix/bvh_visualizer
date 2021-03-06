import Myo from 'myo';


// Myo devloper docs: https://github.com/thalmiclabs/myo.js/blob/master/docs.md

class MyoInput {
  constructor() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.Myo = Myo;
    this.myos = [];

    this.Myo.connect('com.kineviz.myo');
    this.Myo.on('connected', this.initMyos.bind(this));
  }

  on(name, cb, event, label) {
    this.callbacks[name] = cb;
    this.events.push(event);
    this.labels.push(label);
    this.initCallbacks();
  }

  clearCallbacks() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];
  }

  initCallbacks() {
    _.forEach(this.callbacks, this.initCallback.bind(this));
  }

  initCallback(cb, name) {
    this.Myo.on(name, cb);
  }

  initMyos(myo) {
    _.forEach(this.Myo.myos, this.initMyo.bind(this));
    this.saveMyos();
  }

  initMyo(myo) {
    myo.streamEMG(true);
  }

  saveMyos() {
    this.myos = this.Myo.myos;
  }

  vibrate(myo) {
    console.log('Vibrating Myo:', myo.name);
    myo.vibrate(); // 'short', 'medium', 'long'
  }

  vibrateAll() {
    _.forEach(this.myos, this.vibrate);
  }
}

module.exports = MyoInput;
