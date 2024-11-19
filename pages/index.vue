<template>
  <div
    :class="{ dark: isDarkMode }"
    class="min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <div class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1
          class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8"
        >
          Mosaic Photo Generator
        </h1>

        <div class="flex flex-col lg:flex-row">
          <div class="lg:w-1/4 lg:pr-8">
            <div
              class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 max-w-sm mx-auto"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                1. Select Target Photo
              </h2>
              <input
                type="file"
                accept="image/*"
                @change="handleTargetPhotoUpload"
                class="mb-4"
                aria-label="Select target photo"
              />
              <div v-if="targetPhoto" class="mb-4 flex justify-center">
                <img
                  :src="targetPhoto"
                  alt="Target Photo"
                  class="max-w-full h-auto max-h-64 object-contain"
                />
              </div>
            </div>

            <div
              class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                2. Upload Pool Photos
              </h2>
              <input
                type="file"
                accept="image/*"
                multiple
                @change="handlePoolPhotosUpload"
                class="mb-4"
                aria-label="Upload pool photos"
              />
              <div v-if="poolPhotos.length > 0" class="grid grid-cols-4 gap-2">
                <div
                  v-for="(photo, index) in poolPhotos"
                  :key="index"
                  class="relative"
                >
                  <img
                    :src="photo"
                    alt="Pool Photo"
                    class="w-16 h-16 object-cover rounded"
                  />
                  <button
                    @click="deletePoolPhoto(index)"
                    class="absolute top-0 left-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    aria-label="Delete photo"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div
              class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                3. Mosaic Parameters
              </h2>
              <div class="mb-4">
                <label
                  for="tileSize"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Tile Size</label
                >
                <input
                  type="range"
                  id="tileSize"
                  v-model="tileSize"
                  min="5"
                  max="50"
                  class="w-full"
                />
                <span class="text-sm text-gray-500 dark:text-gray-400"
                  >{{ tileSize }}px</span
                >
              </div>
              <div class="mb-4">
                <label
                  for="colorAdjustment"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Color Adjustment</label
                >
                <input
                  type="range"
                  id="colorAdjustment"
                  v-model="colorAdjustment"
                  min="0"
                  max="100"
                  class="w-full"
                />
                <span class="text-sm text-gray-500 dark:text-gray-400"
                  >{{ colorAdjustment }}%</span
                >
              </div>
            </div>

            <div
              class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                4. Generate Mosaic
              </h2>
              <button
                @click="generateMosaic"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                :disabled="
                  !targetPhoto || poolPhotos.length === 0 || isGenerating
                "
                aria-live="polite"
              >
                {{ isGenerating ? "Generating..." : "Generate Mosaic" }}
              </button>
            </div>
          </div>

          <div class="lg:w-3/4 lg:pl-8">
            <main
              class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 h-full"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Result
              </h2>
              <div v-if="mosaicImage" class="mb-4 flex flex-col items-center">
                <img
                  :src="mosaicImage"
                  alt="Mosaic Result"
                  class="max-w-full h-auto mb-4"
                />
                <button
                  @click="downloadMosaic"
                  class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Download Mosaic
                </button>
              </div>
              <div v-else-if="error" class="text-red-600 dark:text-red-400">
                {{ error }}
              </div>
              <div
                v-else
                class="text-gray-600 dark:text-gray-400 h-64 flex items-center justify-center"
              >
                The generated mosaic will appear here.
              </div>
            </main>
          </div>
        </div>

        <div class="fixed top-4 right-4">
          <button
            @click="toggleDarkMode"
            class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2 px-4 rounded"
            aria-label="Toggle dark mode"
          >
            {{ isDarkMode ? "Light Mode" : "Dark Mode" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Button -->
    <button
      v-if="isGenerating"
      @click="cancelGeneration"
      class="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded z-50"
      aria-live="polite"
    >
      Cancel Generation
    </button>

    <!-- Loading Overlay -->
    <div
      v-if="isGenerating"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center"
      >
        <div class="loader mb-4" aria-hidden="true"></div>
        <p class="text-lg font-semibold text-gray-900 dark:text-white">
          Generating Mosaic...
        </p>
        <p v-if="progress" class="mt-2 text-gray-600 dark:text-gray-400">
          {{ progress }}
        </p>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Progress: {{ percentProgress }}%
        </p>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Time elapsed: {{ elapsedTime }}s
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useHead } from "#imports";

const targetPhoto = ref(null);
const poolPhotos = ref([]);
const mosaicImage = ref(null);
const isGenerating = ref(false);
const progress = ref("");
const isDarkMode = ref(false);
const tileSize = ref(20);
const colorAdjustment = ref(50);
const error = ref(null);
const percentProgress = ref(0);
const elapsedTime = ref(0);
let worker = null;
let generationTimeout = null;
let elapsedTimeInterval = null;

useHead({
  title: "Mosaic Photo Generator",
  htmlAttrs: {
    lang: "en",
  },
});

onMounted(() => {
  console.log("Component mounted");
  initializeWorker();

  // Initialize dark mode based on user preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDarkMode.value = true;
  }
});

onUnmounted(() => {
  if (worker) {
    worker.terminate();
  }
  if (generationTimeout) {
    clearTimeout(generationTimeout);
  }
  if (elapsedTimeInterval) {
    clearInterval(elapsedTimeInterval);
  }
});

watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

const initializeWorker = () => {
  console.log("Initializing worker");
  worker = new Worker("/mosaic-worker.js");
  worker.onmessage = (e) => {
    console.log("Worker message received:", e.data);
    if (e.data.error) {
      console.error("Error from worker:", e.data.error);
      handleError(e.data.error);
    } else if (e.data.progress) {
      progress.value = e.data.progress;
      if (e.data.percentage !== undefined) {
        percentProgress.value = e.data.percentage;
      }
    } else if (e.data.mosaicImage) {
      console.log("Mosaic image received");
      mosaicImage.value = e.data.mosaicImage;
      isGenerating.value = false;
      progress.value = "";
      percentProgress.value = 100;
      clearTimeout(generationTimeout);
      clearInterval(elapsedTimeInterval);
      // Clear worker buffers
      worker.postMessage({ action: "clear" });
    }
  };
  worker.onerror = (err) => {
    console.error("Worker error:", err);
    handleError(`Worker error: ${err.message}`);
  };
};

const handleError = (errorMessage) => {
  console.error("Error in mosaic generation:", errorMessage);
  error.value = errorMessage;
  isGenerating.value = false;
  progress.value = "";
  percentProgress.value = 0;
  elapsedTime.value = 0;
  clearTimeout(generationTimeout);
  clearInterval(elapsedTimeInterval);
};

const handleTargetPhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      targetPhoto.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handlePoolPhotosUpload = (event) => {
  const files = event.target.files;
  if (files) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = e.target.result;
        if (!poolPhotos.value.includes(newImage)) {
          poolPhotos.value.push(newImage);
        }
      };
      reader.readAsDataURL(file);
    });
  }
};

const deletePoolPhoto = (index) => {
  poolPhotos.value.splice(index, 1);
};

const generateMosaic = async () => {
  if (!targetPhoto.value || poolPhotos.value.length === 0 || !worker) return;

  isGenerating.value = true;
  progress.value = "Preparing images...";
  error.value = null;
  percentProgress.value = 0;
  elapsedTime.value = 0;

  console.log("Starting mosaic generation with tile size:", tileSize.value);

  const startTime = Date.now();
  elapsedTimeInterval = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime) / 1000);
  }, 1000);

  try {
    // Convert data URIs to ArrayBuffers
    const targetBuffer = await fetch(targetPhoto.value).then((r) =>
      r.arrayBuffer()
    );
    const poolBuffers = await Promise.all(
      poolPhotos.value.map((photo) => fetch(photo).then((r) => r.arrayBuffer()))
    );

    console.log("Images prepared, sending to worker");

    // Send data in chunks
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    const sendChunk = (data, start) => {
      const end = Math.min(start + CHUNK_SIZE, data.byteLength);
      worker.postMessage(
        {
          chunk: data.slice(start, end),
          start,
          end,
          total: data.byteLength,
        },
        [data.slice(start, end)]
      );
      if (end < data.byteLength) {
        setTimeout(() => sendChunk(data, end), 0);
      }
    };

    worker.postMessage({
      action: "start",
      tileSize: Number(tileSize.value),
      colorAdjustment: colorAdjustment.value / 100,
    });
    sendChunk(targetBuffer, 0);
    for (const buffer of poolBuffers) {
      sendChunk(buffer, 0);
    }
    worker.postMessage({ action: "process" });

    // Set a timeout to check if the generation is taking too long
    generationTimeout = setTimeout(() => {
      if (isGenerating.value) {
        handleError(
          "Generation is taking longer than expected. Please try again with smaller images or fewer pool photos."
        );
      }
    }, 3600000); // 60 minutes timeout
  } catch (error) {
    handleError(`Error in generateMosaic: ${error.message}`);
  }
};

const cancelGeneration = () => {
  console.log("Cancelling mosaic generation");
  if (worker) {
    worker.postMessage({ action: "clear" });
    worker.terminate();
    initializeWorker();
  }
  isGenerating.value = false;
  progress.value = "";
  percentProgress.value = 0;
  elapsedTime.value = 0;
  clearTimeout(generationTimeout);
  clearInterval(elapsedTimeInterval);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

const downloadMosaic = () => {
  if (mosaicImage.value) {
    const link = document.createElement("a");
    link.href = mosaicImage.value;
    link.download = "mosaic.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<style>
.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dark mode styles */
.dark .loader {
  border-color: #4a5568;
  border-top-color: #63b3ed;
}
</style>
