import * as dat from 'dat.gui';
import * as Stats from 'stats.js';
import Circle from './Circle';
import utils from './utils';

const configs = {
  count: 1000,
  performance: true,
  color: '#2299ff',
  backgroundColor: '#000000',
};

const _configs = {
  width: window.innerWidth,
  height: window.innerHeight - 5,
};

const canvas: HTMLCanvasElement = document.createElement('canvas');
canvas.width = _configs.width;
canvas.height = _configs.height;

const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const particles: Circle[] = [];

function initParticles(count: number) {
  if (count < particles.length) {
    return particles.splice(count);
  }

  for (let i = particles.length; i < count; i++) {
    const c = new Circle(
      (-1 * _configs.width) / 2 + Math.random() * _configs.width,
      (-1 * _configs.height) / 2 + Math.random() * _configs.height,
      0.2 + Math.random() * 1.5,
    );
    particles.push(c);
  }
}

initParticles(configs.count);

const stats = new Stats();
stats.showPanel(0);
stats.dom.style.display = configs.performance ? 'block' : 'none';
document.body.append(stats.dom);

const gui = new dat.GUI();
gui.add(configs, 'count', 100, 10000).onChange(initParticles);
gui.add(configs, 'performance').onChange(() => {
  stats.dom.style.display = configs.performance ? 'block' : 'none';
});
gui.addColor(configs, 'color');
gui.addColor(configs, 'backgroundColor');

const cam = new utils.Camera(
  _configs.width,
  _configs.height,
  _configs.height + 200,
);

function update() {
  if (configs.performance) stats.begin();

  ctx.fillStyle = configs.backgroundColor;
  ctx.fillRect(0, 0, _configs.width, _configs.height);
  ctx.fillStyle = configs.color;
  particles.forEach(c => {
    c.update();
    const pos = cam.to2d(c.x, 100, c.y);

    if (
      pos.x > 0 &&
      pos.x < _configs.width &&
      pos.y > 0 &&
      pos.y < _configs.height
    ) {
      ctx.fillRect(pos.x, pos.y, c.radius, c.radius);
    }
  });

  if (configs.performance) stats.end();
}

setInterval(update, 1000 / 60);
