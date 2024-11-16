let targetBuffer = null;
let poolBuffers = [];
let tileSize = 20;

self.onmessage = async function (e) {
  try {
    if (e.data.action === "start") {
      targetBuffer = null;
      poolBuffers = [];
      tileSize = e.data.tileSize;
    } else if (e.data.chunk) {
      if (!targetBuffer) {
        if (!e.data.start) {
          targetBuffer = new Uint8Array(e.data.total);
        }
        targetBuffer.set(new Uint8Array(e.data.chunk), e.data.start);
        if (e.data.end === e.data.total) {
          self.postMessage({
            progress: "Target image received. Processing pool images...",
          });
        }
      } else {
        let buffer;
        if (!e.data.start) {
          buffer = new Uint8Array(e.data.total);
          poolBuffers.push(buffer);
        } else {
          buffer = poolBuffers[poolBuffers.length - 1];
        }
        buffer.set(new Uint8Array(e.data.chunk), e.data.start);
        if (e.data.end === e.data.total) {
          self.postMessage({
            progress: `Received ${poolBuffers.length} pool images`,
          });
        }
      }
    } else if (e.data.action === "process") {
      await processMosaic();
    }
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

async function processMosaic() {
  self.postMessage({ progress: "Processing images..." });

  // Convert ArrayBuffers to Blobs
  const targetBlob = new Blob([targetBuffer], { type: "image/png" });
  const poolBlobs = poolBuffers.map(
    (buffer) => new Blob([buffer], { type: "image/png" })
  );

  // Load images
  const [targetImg, ...poolImgs] = await Promise.all([
    createImageBitmap(targetBlob),
    ...poolBlobs.map((blob) => createImageBitmap(blob)),
  ]);

  self.postMessage({ progress: "Generating mosaic..." });

  const canvas = new OffscreenCanvas(
    Math.floor(targetImg.width / tileSize) * tileSize,
    Math.floor(targetImg.height / tileSize) * tileSize
  );
  const ctx = canvas.getContext("2d");

  // Draw target image
  ctx.drawImage(targetImg, 0, 0, canvas.width, canvas.height);

  // Create mosaic
  const totalTiles = (canvas.width / tileSize) * (canvas.height / tileSize);
  let processedTiles = 0;

  for (let y = 0; y < canvas.height; y += tileSize) {
    for (let x = 0; x < canvas.width; x += tileSize) {
      const imageData = ctx.getImageData(x, y, tileSize, tileSize);
      const avgColor = getAverageColor(imageData.data);
      const bestMatch = findBestMatch(avgColor, poolImgs);
      ctx.drawImage(bestMatch, x, y, tileSize, tileSize);

      processedTiles++;
      if (processedTiles % 100 === 0) {
        self.postMessage({
          progress: `Processed ${processedTiles}/${totalTiles} tiles`,
        });
      }
    }
  }

  self.postMessage({ progress: "Finalizing mosaic..." });

  const blob = await canvas.convertToBlob();
  const reader = new FileReader();
  reader.onloadend = function () {
    self.postMessage({ mosaicImage: reader.result });
  };
  reader.readAsDataURL(blob);
}

function getAverageColor(data) {
  let r = 0,
    g = 0,
    b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const count = data.length / 4;
  return [r / count, g / count, b / count];
}

function findBestMatch(targetColor, poolImgs) {
  let bestMatch = poolImgs[0];
  let minDifference = Infinity;

  for (const img of poolImgs) {
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const avgColor = getAverageColor(imageData.data);
    const difference = colorDifference(targetColor, avgColor);

    if (difference < minDifference) {
      minDifference = difference;
      bestMatch = img;
    }
  }

  return bestMatch;
}

function colorDifference(color1, color2) {
  return Math.sqrt(
    Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
  );
}
