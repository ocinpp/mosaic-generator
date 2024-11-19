# Mosaic Photo Generator

A Vue.js application that generates photo mosaics by combining a target image with a pool of smaller images. Built with Nuxt 3 and Tailwind CSS, this application processes images client-side using Web Workers for optimal performance. This project was created by v0, an advanced AI coding assistant.

## Features

- Upload a target photo to be transformed into a mosaic
- Add multiple photos to create a pool of images for the mosaic
- Delete individual photos from the pool
- Adjust tile size for the mosaic
- Adjust color balance between the original image and the mosaic tiles
- Cancel mosaic generation at any time
- Progress tracking during mosaic generation
- Dark mode toggle
- Responsive design that works on both desktop and mobile devices
- Download generated mosaic

## Recent Updates

- Added dark mode support
- Improved error handling and logging for better debugging
- Added tooltips for Tile Size and Color Adjustment parameters
- Fixed issues with mosaic generation for different tile sizes
- Improved progress reporting during mosaic generation

## Mosaic Parameters

- **Tile Size**: Determines the size of each mosaic tile. Smaller values create more detailed mosaics but take longer to generate.
- **Color Adjustment**: Controls the balance between the original image colors and the mosaic tile colors. Higher values result in a mosaic that's closer to the original image colors.

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

4. **Adjust Mosaic Parameters**

    1. Use the "Tile Size" slider to set the size of mosaic tiles
    2. Use the "Color Adjustment" slider to balance between original and mosaic colors

5. **Generate Mosaic**

    1. Click the "Generate Mosaic" button to start the process
    2. A progress indicator will show the current status and elapsed time

6. **Cancel Generation**

    1. If needed, click the "Cancel Generation" button to stop the process

7. **View Result**

    1. Once complete, the generated mosaic will appear in the "Result" section

8. **Download Mosaic**

    1. Click the "Download Mosaic" button to save the generated image

9. **Toggle Dark Mode**

    1. Use the dark mode toggle in the top right corner to switch between light and dark modes

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

If you encounter any issues with mosaic generation:

1. **Check the browser console for error messages or logs**

    - Open your browser's developer tools (usually F12 or right-click and select "Inspect")
    - Go to the Console tab to view any error messages or logs

2. **Image Upload Issues**

    - Ensure images are in supported formats (PNG, JPEG)
    - Check file size limits in your browser

3. **Generation Performance**

    - Try using smaller tile sizes or fewer pool photos if the generation is taking too long
    - Use smaller target images for quicker results

4. **Browser Compatibility**

    - Ensure your browser supports Web Workers and modern JavaScript features
    - Try updating your browser to the latest version

5. **Clear browser cache and reload**

    - Sometimes, clearing your browser's cache and reloading the page can resolve issues

6. **Check for updates**

    - Make sure you're using the latest version of the application

If the issue persists after trying these steps, please report it by opening an issue on the project repository with a detailed description of the problem and steps to reproduce it.

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
