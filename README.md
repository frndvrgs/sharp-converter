# sharp-converter

[![npm](https://img.shields.io/npm/v/sharp-converter)](https://www.npmjs.com/package/sharp-converter)

Batch image conversion and compression CLI powered by [Sharp](https://sharp.pixelplumbing.com/).

## Installation

```bash
npm install -g sharp-converter
```

## Usage

```bash
sharpc                         # convert using config or defaults
sharpc init                    # create sharpc.json in current directory
sharpc -c                      # interactive configuration wizard
sharpc -i photos/ -o dist/     # custom input/output directories
sharpc --clean                 # clear output before converting
```

## Configuration

Run `sharpc init` to create a local `sharpc.json`, or `sharpc -c` to configure interactively.

Config resolution order:
1. `sharpc.json` in current directory
2. `~/.config/sharp-converter/sharpc.json`
3. Built-in defaults (webp, quality 80, no resize)

```json
{
  "format": "webp",
  "quality": 80,
  "resize": {
    "width": 1920,
    "height": null,
    "fit": "inside",
    "withoutEnlargement": true
  }
}
```

## Output

```
  Processing 4 images → webp (q80)
  hero-1.png → hero-1.webp  62kb  (96% smaller)
  hero-2.png → hero-2.webp  162kb  (92% smaller)
```

## Formats

webp, jpg, png, avif

## Fit strategies

| Strategy | Behavior |
|----------|----------|
| `inside` | fit within dimensions, preserve aspect ratio |
| `cover` | fill dimensions, crop excess |
| `contain` | fit within, letterbox if needed |
| `outside` | cover minimum dimension |
| `fill` | exact dimensions, may distort |

## License

MIT
