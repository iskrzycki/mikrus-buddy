# Mikrus buddy

## Introduction

Mikrus buddy is an open-source browser extension designed for the [Mikrus](https://mikr.us/) community. This extension leverages the Mikr.us API to display vital information about your Mikrus VPS directly in your browser. [Install from chrome webstore](todo/link/to/extension/page)

<div style="display: flex; justify-content: space-between;">
   <img src="readme-img/1.png" alt="Screenshot 1" width="45%" />
   <img src="readme-img/2.png" alt="Screenshot 2" width="45%" />
</div>

## Features

- **VPS Information**: view detailed information about your VPS
  - server id
  - expiration date (both server and storage)
  - RAM and HDD size
  - Mikrus Pro status
  - uptime
  - Detailed RAM and HDD stats
- **Server Management**:
  - restart your server with a single click
  - apply "amphetamine" to boost your RAM
- **i18n**: based on browser language. Supports:
  - Polish
  - English

## Usage

Currently, extension is available in the Chrome Web store only. Feel free to install it and rate [here](TODO).
All, you need to do next is to provide your API key and server ID. Both can be obtained from your [mikr.us admin panel](https://mikr.us/panel/?a=api).

> [!TIP]
> If you want to use this extension in a different browser, you need to build it by your own. See [development section](#development) for details

## Permissions & API key safety

This extension needs just two permissions:

- **storage** - for storing user entered data in the browser (API key, server ID)
- **https://api.mikr.us host permission** - for making request to the official [mikr.us api](https://api.mikr.us/)

## Roadmap

Look at the [kanban board](https://github.com/users/iskrzycki/projects/1) to see, what features are planned in the future.

### Prerequisites

- Node.js
- npm

### Development

1. Clone the repository:

   ```sh
   git clone https://github.com/iskrzycki/mikr.us-buddy.git
   cd mikr.us-buddy
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build the extension:

   ```sh
   npm run dev
   ```

4. Load the extension in your browser.

### Running in Development Mode

To run the extension in development mode with hot-reloading:

1. Start the development server:

   ```sh
   npm run dev
   ```

## License

This project is licensed under the MIT License.

## Contact

For any questions or suggestions, feel free to open an issue or contact me at [iskrzycki@gmail.com](mailto:iskrzycki@gmail.com). If you find this project useful and would like to support its development, consider buying me a coffee.

 <a href="https://buycoffee.to/iskrzycki">
 <img src="https://buycoffee.to/img/share-button-primary.png"width="200">
 </a>
