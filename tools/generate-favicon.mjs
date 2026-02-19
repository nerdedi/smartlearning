import fs from 'fs'
import pngToIco from 'png-to-ico'

const inputs = [
  'assets/icons/icon-16x16.png',
  'assets/icons/icon-32x32.png',
  'assets/icons/icon-128x128.png',
  'assets/icons/icon-256x256.png'
]

try {
  const buf = await pngToIco(inputs)
  fs.writeFileSync('assets/icons/favicon.ico', buf)
  console.log('favicon.ico generated')
} catch (err) {
  console.error('favicon generation failed:', err)
  process.exitCode = 2
}
