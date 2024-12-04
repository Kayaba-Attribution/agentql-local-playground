const { wrap, configure } = require("agentql");
const { chromium } = require("playwright");
const fs = require('fs').promises;
const path = require('path');

class ExperimentRunner {
  constructor(config = {}) {
    this.config = {
      headless: false,
      baseUrl: 'http://localhost:3000',
      experimentsDir: path.join(process.cwd(), 'experiments'),
      ...config
    };
  }

  async init() {
    if (!process.env.AGENTQL_API_KEY) {
      throw new Error("AGENTQL_API_KEY is not set");
    }

    configure({
      apiKey: process.env.AGENTQL_API_KEY,
    });

    // Ensure experiments directory exists
    await fs.mkdir(this.config.experimentsDir, { recursive: true });
  }

  async runExperiment(experimentName, query, page = 'example_1') {
    const experimentDir = path.join(this.config.experimentsDir, experimentName);
    await fs.mkdir(experimentDir, { recursive: true });

    const browser = await chromium.launch({ headless: this.config.headless });
    const browserPage = await wrap(await browser.newPage());

    try {
      await browserPage.goto(`${this.config.baseUrl}/${page}`);
      const result = await browserPage.queryData(query);
      
      // Save results with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const resultPath = path.join(experimentDir, `result_${timestamp}.json`);
      
      await fs.writeFile(
        resultPath, 
        JSON.stringify(result, null, 2)
      );

      return {
        result,
        savedTo: resultPath
      };
    } finally {
      await browser.close();
    }
  }
}

module.exports = ExperimentRunner; 