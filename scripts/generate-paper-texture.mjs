import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const [
  inputPath,
  outputPath,
  maxAlphaArgument = '0.07',
  shadowRangeArgument = '22',
  gammaArgument = '1.35',
] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error(`
Uso:
node scripts/generate-paper-texture.mjs <input.png> <output.png> [maxAlpha] [shadowRange] [gamma]

Exemplo:
node scripts/generate-paper-texture.mjs \\
  img/paper-texture.png \\
  img/paper-texture-subtle.png \\
  0.07
  `);

  process.exit(1);
}

const maxAlpha = Number(maxAlphaArgument);
const shadowRange = Number(shadowRangeArgument);
const gamma = Number(gammaArgument);

if (
  !Number.isFinite(maxAlpha) ||
  maxAlpha < 0 ||
  maxAlpha > 1 ||
  !Number.isFinite(shadowRange) ||
  shadowRange <= 0 ||
  !Number.isFinite(gamma) ||
  gamma <= 0
) {
  throw new Error(
    'Parâmetros inválidos. maxAlpha deve estar entre 0 e 1; shadowRange e gamma devem ser maiores que 0.',
  );
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const output = Buffer.alloc(info.width * info.height * 4);

for (let index = 0; index < data.length; index += 4) {
  const red = data[index];
  const green = data[index + 1];
  const blue = data[index + 2];
  const sourceAlpha = data[index + 3] / 255;

  /*
   * Luminância percebida do pixel.
   * 255 = branco; valores menores representam fibras/sombras.
   */
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;

  /*
   * Quanto mais escuro o pixel original, mais visível será a fibra.
   * Pixels claros ficam praticamente transparentes.
   */
  const darkness = clamp((255 - luminance) / shadowRange, 0, 1);

  const alpha = maxAlpha * Math.pow(darkness, gamma) * sourceAlpha;

  /*
   * Preto com alpha baixo.
   * Isso preserva a cor definida no CSS:
   * branco continua branco,
   * papel amarelo continua amarelo,
   * apenas com fibras discretamente mais escuras.
   */
  output[index] = 0;
  output[index + 1] = 0;
  output[index + 2] = 0;
  output[index + 3] = Math.round(alpha * 255);
}

await mkdir(path.dirname(outputPath), { recursive: true });

await sharp(output, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png({
    compressionLevel: 9,
  })
  .toFile(outputPath);

console.log(`Textura transparente criada: ${outputPath}`);
