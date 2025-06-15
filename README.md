# TileClassify: Roof Tile Recognition and Classification System

<p align="center">
  <b>Mobile Application for Roof Tile Type and Price Classification</b><br>
  <i>Collaboration between Students and Professors at Mercu Buana University</i>
</p>

<p align="center">
  <a href="#about-the-project">About the Project</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How to Use</a> •
  <a href="#installation--development">Installation & Development</a> •
  <a href="#technologies-used">Technologies</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## About the Project

TileClassify is a mobile application developed to help classify types and prices of roof tiles through images. This project is the result of collaboration between students and professors in implementing an AI model for roof tile recognition.

The application uses React Native (Expo) technology for the mobile frontend and connects to a backend API that uses a machine learning model for classification, which can be found [in the backend repository](https://github.com/anggara-26/tileclassify-backend). Users can take photos of roof tiles using their smartphone camera or select images from the gallery, and the system will classify the type of roof tile along with its estimated price.

## Key Features

- **Direct Photo Capture**: Take photos of roof tiles directly using the device's camera
- **Gallery Image Selection**: Select roof tile images from the device's gallery
- **Automatic Classification**: Recognize roof tile types and price estimates
- **Results Display with Confidence Level**: View classification results with confidence levels
- **Modern User Interface**: Intuitive and easy-to-use UI design
- **Light/Dark Mode Support**: Comfortable display for various lighting conditions
- **Automatic Image Optimization**: Compression and processing of images before sending to the API

## Demo

<p align="center">
  <img src="./assets/docs/demo-1.jpg" alt="Screenshot 1" width="200" />
  <img src="./assets/docs/demo-2.jpg" alt="Screenshot 2" width="200" />
  <img src="./assets/docs/demo-3.jpg" alt="Screenshot 3" width="200" />
</p>

## How to Use

1. Open the application and navigate to the "Classification" tab
2. Choose one of the image capture methods:
   - **Take Photo with Camera**: To capture roof tile images directly
   - **Select Image from Gallery**: To select existing roof tile photos
3. Press the "Classify" button to process the image
4. Classification results will be displayed as:
   - Roof tile type
   - Estimated price
   - Analysis confidence level

## Installation & Development

### Prerequisites

- Node.js (version 18 or newer)
- pnpm
- Expo CLI
- Expo Go on mobile device (for testing)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/anggara-26/tileclassify-mobile.git
   cd tileclassify-mobile
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure API endpoint:

   Open the `services/api.ts` file and adjust the `baseURL` with the classification API URL being used.

4. Run the application:

   ```bash
   pnpm start
   ```

5. Scan the QR code with Expo Go or run on an emulator

### Running on Devices

- **Android**: Scan QR code with Expo Go or run `pnpm android`
- **iOS**: Scan QR code with Camera app or run `pnpm ios`

## Project Structure

```
tileclassify-mobile/
├── app/                  # Expo Router files
│   ├── (tabs)/           # Tab navigation screens
│   └── _layout.tsx       # Root layout
├── assets/               # Static assets
├── components/           # Reusable components
│   ├── ImageClassification/  # Classification components
│   └── ui/               # UI components
├── constants/            # Constants and theme settings
├── hooks/                # Custom React hooks
├── services/             # API services
└── README.md             # Project documentation
```

## Technologies Used

- **Frontend**:

  - React Native with [Expo](https://expo.dev/)
  - [Expo Router](https://expo.github.io/router/docs/) for navigation
  - [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/) for photo capture
  - [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) for gallery access
  - [Expo Image Manipulator](https://docs.expo.dev/versions/latest/sdk/imagemanipulator/) for image optimization
  - TypeScript for type safety

- **Backend**:
  - API with machine learning model for roof tile classification
  - API communication using Axios
  - Can be viewed [here](https://github.com/anggara-26/tileclassify-backend)

## Contributing

I greatly appreciate contributions to improve this project. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for more details.

## Acknowledgments

- To the professors for the research and AI model used
- The open source development teams behind the technologies used
