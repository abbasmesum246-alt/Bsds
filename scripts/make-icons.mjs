import zlib from "zlib";
import fs from "fs";
import path from "path";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) { c ^= buf[i]; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); }
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
function lerp(a, b, t) { return a + (b - a) * t; }

function makeBuffer(size, maskable) {
  const buf = Buffer.alloc(size * size * 4);
  const c1 = [29, 64, 245], c2 = [124, 58, 237];
  const pad = maskable ? 0 : size * 0.08;
  const radius = size * 0.22;

  // background (rounded square or full-bleed for maskable)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      let inside = true;
      if (!maskable) {
        const L = pad, R = size - pad, T = pad, B = size - pad;
        const cx = x < L + radius ? L + radius : x > R - radius ? R - radius : x;
        const cy = y < T + radius ? T + radius : y > B - radius ? B - radius : y;
        const dx = x - cx, dy = y - cy;
        inside = dx * dx + dy * dy <= radius * radius;
      }
      if (!inside) { buf[i] = buf[i + 1] = buf[i + 2] = buf[i + 3] = 0; continue; }
      const t = (x + y) / (size * 2);
      buf[i] = Math.round(lerp(c1[0], c2[0], t));
      buf[i + 1] = Math.round(lerp(c1[1], c2[1], t));
      buf[i + 2] = Math.round(lerp(c1[2], c2[2], t));
      buf[i + 3] = 255;
    }
  }

  // Bold "B" built from a vertical stem + two elliptical bowls,
  // with two elliptical counters cut back to the gradient color.
  const cx = size / 2, cy = size / 2;
  const glyph = size * (maskable ? 0.56 : 0.48);
  const left = cx - glyph * 0.36;
  const right = cx + glyph * 0.32;
  const top = cy - glyph * 0.46;
  const bottom = cy + glyph * 0.46;
  const mid = cy;
  const stemW = glyph * 0.16;

  const inEllipse = (px, py, ex, ey, rx, ry) => {
    const dx = (px - ex) / rx, dy = (py - ey) / ry;
    return dx * dx + dy * dy <= 1;
  };

  const setWhite = (x, y) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    if (buf[i + 3] === 0) return;
    buf[i] = 255; buf[i + 1] = 255; buf[i + 2] = 255; buf[i + 3] = 255;
  };
  const setBrand = (x, y) => {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    if (buf[i + 3] === 0) return;
    const t = (x + y) / (size * 2);
    buf[i] = Math.round(lerp(c1[0], c2[0], t));
    buf[i + 1] = Math.round(lerp(c1[1], c2[1], t));
    buf[i + 2] = Math.round(lerp(c1[2], c2[2], t));
    buf[i + 3] = 255;
  };

  // Vertical stem
  for (let y = top; y <= bottom; y++)
    for (let x = left; x <= left + stemW; x++) setWhite(x, y);

  // Upper bowl: ellipse whose left edge overlaps the stem, producing a D shape
  const upperH = (mid - top);
  const upperCY = top + upperH * 0.5;
  const upperRX = (right - left) * 0.52;
  const upperRY = upperH * 0.92;
  const upperCX = left + stemW + upperRX * 0.42;
  for (let y = top; y <= mid; y++)
    for (let x = left; x <= right; x++)
      if (inEllipse(x, y, upperCX, upperCY, upperRX, upperRY)) setWhite(x, y);

  // Lower bowl
  const lowerH = (bottom - mid);
  const lowerCY = mid + lowerH * 0.5;
  const lowerRX = upperRX;
  const lowerRY = upperRY;
  const lowerCX = upperCX;
  for (let y = mid; y <= bottom; y++)
    for (let x = left; x <= right; x++)
      if (inEllipse(x, y, lowerCX, lowerCY, lowerRX, lowerRY)) setWhite(x, y);

  // Counters (holes) — smaller ellipses in brand gradient
  const counterRX = upperRX * 0.42;
  const counterRY = upperRY * 0.46;
  const counterCX = upperCX + upperRX * 0.12;
  for (let y = top; y <= mid; y++)
    for (let x = left; x <= right; x++)
      if (inEllipse(x, y, counterCX, upperCY, counterRX, counterRY)) setBrand(x, y);
  for (let y = mid; y <= bottom; y++)
    for (let x = left; x <= right; x++)
      if (inEllipse(x, y, counterCX, lowerCY, counterRX, counterRY)) setBrand(x, y);

  return buf;
}

const out = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(out, { recursive: true });
for (const [name, sz, mask] of [
  ["icon-192.png", 192, false], ["icon-512.png", 512, false],
  ["maskable-192.png", 192, true], ["maskable-512.png", 512, true],
  ["favicon-32.png", 32, false], ["apple-touch-icon.png", 180, false],
]) {
  fs.writeFileSync(path.join(out, name), encodePNG(sz, sz, makeBuffer(sz, mask)));
  console.log("wrote", name);
}
