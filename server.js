// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const PAGES_DIR = path.join(__dirname, 'pages');
const MANIFEST_PATH = path.join(__dirname, 'pages_manifest.json');

// Ensure pages directory exists
async function ensurePagesDirectory() {
  try {
    await fs.access(PAGES_DIR);
  } catch {
    await fs.mkdir(PAGES_DIR);
  }
}

// Generate manifest of available pages
async function generateManifest() {
  const files = await fs.readdir(PAGES_DIR);
  const htmlFiles = files.filter(file => file.endsWith('.html') || file.endsWith('.htm'))
                        .map(file => ({
                          route: file.replace(/\.(html|htm)$/, ''),
                          filename: file,
                          path: path.join(PAGES_DIR, file)
                        }));
  
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(htmlFiles, null, 2));
  return htmlFiles;
}

// Serve any HTML/HTM file from the pages directory
app.get('/:page', async (req, res) => {
  try {
    const pageName = req.params.page;
    // Try both .html and .htm extensions
    const possiblePaths = [
      path.join(PAGES_DIR, `${pageName}.html`),
      path.join(PAGES_DIR, `${pageName}.htm`)
    ];
    
    for (const filePath of possiblePaths) {
      try {
        const content = await fs.readFile(filePath, 'utf8');
        return res.send(content);
      } catch (error) {
        continue;
      }
    }
    
    res.status(404).send(`File ${pageName}.html/.htm not found`);
  } catch (error) {
    res.status(500).send('Error serving file');
  }
});

// Root route to list available pages
app.get('/', async (req, res) => {
  try {
    const files = await fs.readdir(PAGES_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html') || file.endsWith('.htm'))
                          .map(file => file.replace(/\.(html|htm)$/, ''));
    
    const linkList = htmlFiles.map(file => 
      `<li><a href="/${file}">${file}</a></li>`
    ).join('\n');
    
    res.send(`
      <h1>Available Pages</h1>
      <ul>${linkList}</ul>
    `);
  } catch (error) {
    res.status(500).send('Error listing files');
  }
});

// Initialize and start
async function start() {
  try {
    await ensurePagesDirectory();
    
    // Generate initial manifest
    const loadedFiles = await generateManifest();
    console.log('Loaded files:', loadedFiles.map(f => f.filename).join(', '));

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Place HTML/HTM files in: ${PAGES_DIR}`);
      console.log(`Manifest saved to: ${MANIFEST_PATH}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

start();