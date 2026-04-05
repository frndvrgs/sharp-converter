# sharp-converter

Batch image conversion and compression CLI powered by [Sharp](https://sharp.pixelplumbing.com/).

## Install

```bash
npm install -g sharp-converter
```

## Usage

```bash
sharpc                         # convert images using .sharpc.json or defaults
sharpc -c                      # interactive configuration wizard
sharpc -i photos/ -o dist/     # custom input/output directories
sharpc --clean                 # clear output before converting
```

## Configuration

Run `sharpc -c` to create a `.sharpc.json` in the current directory:

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

Without a config file, defaults to webp at quality 80 with no resize.

## Formats

webp, jpg, png, avif

## Fit strategies

- `inside` — fit within dimensions, preserve aspect ratio
- `cover` — fill dimensions, crop excess
- `contain` — fit within, letterbox if needed
- `outside` — cover minimum dimension
- `fill` — exact dimensions, may distort

## Filename normalization

Output filenames are cleaned automatically:

```
My Photo (2024).jpg → my-photo-2024.webp
Product_Image #123!.png → product-image-123.webp
```
