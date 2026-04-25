/**
 * Pure Node.js PNG icon generator — no native dependencies.
 * Run: node scripts/generate-icons.cjs
 */

const zlib = require('zlib')
const fs   = require('fs')
const path = require('path')

const BG_HEX     = '#1A1A1A'
const ACCENT_HEX = '#4A7C6F'

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n >>> 0, 0)
  return b
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const crcInput = Buffer.concat([t, data])
  return Buffer.concat([uint32BE(data.length), t, data, uint32BE(crc32(crcInput))])
}

function createIcon(size, maskable = false) {
  const bg  = hexToRgb(BG_HEX)
  const acc = hexToRgb(ACCENT_HEX)
  const pad = maskable ? Math.floor(size * 0.12) : 0
  const inner = size - pad * 2

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit RGB

  // Pixel data (filter byte 0 per row)
  const scanlines = Buffer.alloc(size * (1 + size * 3))
  let idx = 0

  const cx = size / 2
  const cy = size / 2 + size * 0.04

  for (let y = 0; y < size; y++) {
    scanlines[idx++] = 0 // no filter
    for (let x = 0; x < size; x++) {
      // Rounded background
      const inPadding = x >= pad && x < size - pad && y >= pad && y < size - pad
      if (!inPadding) {
        scanlines[idx++] = bg[0]; scanlines[idx++] = bg[1]; scanlines[idx++] = bg[2]
        continue
      }

      // Draw rounded rect corners
      const r = inner * 0.22
      const ox = x - pad, oy = y - pad
      const cornerX = Math.min(ox, inner - 1 - ox)
      const cornerY = Math.min(oy, inner - 1 - oy)
      if (cornerX < r && cornerY < r) {
        const dist = Math.sqrt((r - cornerX) ** 2 + (r - cornerY) ** 2)
        if (dist > r) {
          scanlines[idx++] = bg[0]; scanlines[idx++] = bg[1]; scanlines[idx++] = bg[2]
          continue
        }
      }

      // Draw "T" lettermark
      const lineW = size * 0.065
      const capH  = size * 0.065
      const capW  = size * 0.22
      const stemTop    = cy - size * 0.22
      const stemBottom = cy + size * 0.22
      const capTop     = stemTop
      const capBottom  = stemTop + capH

      const inStem = Math.abs(x - cx) <= lineW && y >= stemTop && y <= stemBottom
      const inCap  = Math.abs(x - cx) <= capW  && y >= capTop  && y <= capBottom

      if (inStem || inCap) {
        scanlines[idx++] = acc[0]; scanlines[idx++] = acc[1]; scanlines[idx++] = acc[2]
      } else {
        scanlines[idx++] = bg[0]; scanlines[idx++] = bg[1]; scanlines[idx++] = bg[2]
      }
    }
  }

  const compressed = zlib.deflateSync(scanlines)
  const signature  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([signature, pngChunk('IHDR', ihdr), pngChunk('IDAT', compressed), pngChunk('IEND', Buffer.alloc(0))])
}

const outDir = path.join(__dirname, '../public/icons')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]
sizes.forEach(size => {
  fs.writeFileSync(path.join(outDir, `icon-${size}x${size}.png`), createIcon(size))
  console.log(`✓ icon-${size}x${size}.png`)
})

fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createIcon(180))
console.log('✓ apple-touch-icon.png')

fs.writeFileSync(path.join(outDir, 'icon-maskable-192x192.png'), createIcon(192, true))
fs.writeFileSync(path.join(outDir, 'icon-maskable-512x512.png'), createIcon(512, true))
console.log('✓ maskable icons')

console.log('\nAll icons generated in public/icons/')
