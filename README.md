# Mosaic Photo Generator

A Vue.js application that generates photo mosaics by combining a target image with a pool of smaller images. Built with Nuxt 3 and Tailwind CSS, this application processes images client-side using Web Workers for optimal performance. This project was created by v0, an advanced AI coding assistant.

## Features

- Upload a target photo to be transformed into a mosaic
- Add multiple photos to create a pool of images for the mosaic
- Delete individual photos from the pool
- Cancel mosaic generation at any time
- Progress tracking during mosaic generation
- Responsive design that works on both desktop and mobile devices

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 14.x or later)
- npm or yarn
- Git

## Project Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mosaic-generator
   ```

2. **Install dependencies**

    ```bash
    # Using npm# Using npm
    npm install

    # Using yarn
    yarn install
    ```

3. **Start the development server**

    ```bash
    # Using npm# Using npm
    npm run dev

    # Using yarn
    yarn dev
    ```

4. **Open your browser**
Navigate to `http://localhost:3000` to see the application running.

## Project Structure

```plaintext
 mosaic-generator/mosaic-generator/
├── pages/
│   └── index.vue      # Main application component
├── public/
│   └── mosaic-worker.js    # Web Worker for image processing
├── nuxt.config.ts     # Nuxt configuration
└── package.json       # Project dependencies

```

## How It Works

### Main Logic

1. **Image Upload**

1. The target photo is uploaded and displayed
2. Pool photos can be added multiple times and deleted individually

2. **Mosaic Generation**

1. The application divides the target image into small tiles
2. For each tile, it:

1. Calculates the average color
2. Finds the best matching image from the pool
3. Replaces the tile with the matching image

3. **Performance Optimization**

1. Uses Web Workers for heavy computation
2. Implements chunked data transfer to handle large images
3. Provides progress updates during generation

### Technical Implementation

- **Web Worker**: Handles image processing in a separate thread to keep the UI responsive
- **Chunked Data Transfer**: Splits large images into 5MB chunks for efficient transfer
- **Canvas API**: Used for image manipulation and color analysis
- **Vue 3 Composition API**: Manages application state and UI updates

## Usage

1. **Upload Target Photo**

1. Click on the "Select target photo" input to choose your main image

2. **Add Pool Photos**

1. Use the "Upload pool photos" input to select multiple images for your mosaic tiles
2. You can add more photos at any time

3. **Manage Pool Photos**

1. Delete unwanted photos from the pool by clicking the "×" button on each image

4. **Generate Mosaic**

1. Click the "Generate Mosaic" button to start the process
2. A progress indicator will show the current status

5. **Cancel Generation**

1. If needed, click the "Cancel Generation" button to stop the process

6. **View Result**

1. Once complete, the generated mosaic will appear in the "Result" section

## Development

### Adding New Features

1. Modify `pages/index.vue` for UI changes
2. Update `public/mosaic-worker.js` for image processing logic
3. Test thoroughly with various image sizes and quantities

### Building for Production

```bash
 # Using npm# Using npm
npm run build
npm run start

# Using yarn
yarn build
yarn start
```

## Troubleshooting

Common issues and solutions:

1. **Image Upload Issues**

1. Ensure images are in supported formats (PNG, JPEG)
2. Check file size limits in your browser

2. **Generation Performance**

1. Reduce the number of pool images for faster processing
2. Use smaller target images for quicker results

3. **Browser Compatibility**

1. Ensure your browser supports Web Workers
2. Enable JavaScript execution

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

This project was created by v0, an advanced AI coding assistant developed by Vercel. v0 is designed to assist developers in creating efficient, modern web applications.
