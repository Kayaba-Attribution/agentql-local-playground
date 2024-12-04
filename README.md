# Web Page Data Extractor

A Node.js application for extracting structured data from web pages using AgentQL and Playwright. The system serves static HTML pages and runs configurable data extraction experiments.

## Features

- Static HTML page server with automatic page discovery
- Configurable experiment runner for data extraction
- AgentQL integration for advanced web scraping
- Automatic manifest generation of available pages
- Support for both .html and .htm files

## Prerequisites

- Node.js (v14 or higher)
- An AgentQL API key

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Fill in the AgentQL in the `.env` file in the root directory

## Project Structure

```
├── server.js # Static page server
├── pages/ # Directory for HTML pages
├── experiments/ # Experiment configurations
│ └── linkedin_profile/ # LinkedIn profile extraction example
├── utils/
│ └── ExperimentRunner.js # Experiment runner utility
└── pages_manifest.json # Auto-generated page manifest
```

## Usage

1. Start the server: `node server.js`

2. Place HTML files in the `pages` directory. The server will automatically detect and serve them.

3. Access the server:
   - View available pages at: http://localhost:3000
   - Access individual pages at: http://localhost:3000/page_name

4. Run an experiment:
    + `node experiments/linkedin_profile/index.js`

## Creating New Experiments

1. Create a new directory under `experiments/`
2. Create an `index.js` file with your experiment configuration
3. Define your AgentQL query
4. Use the ExperimentRunner to execute the experiment

## Experiment Results

Results are automatically saved in:
- `experiments/<experiment_name>/result_<timestamp>.json`

## Error Handling

- Server errors return appropriate HTTP status codes (404, 500)
- Failed experiments log errors to console
- Missing API key throws clear error message

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT