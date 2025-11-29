const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MANIFEST_PATH = path.join(__dirname, 'generated', 'manifest.json');

// Generate a short unique ID
function generateId() {
  return crypto.randomBytes(6).toString('hex');
}

// Read the current manifest (or empty array if doesn't exist)
function readManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const data = fs.readFileSync(MANIFEST_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading manifest:', error.message);
  }
  return [];
}

// Write the manifest
function writeManifest(entries) {
  // Ensure generated directory exists
  const dir = path.dirname(MANIFEST_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(entries, null, 2), 'utf8');
}

// Add a new entry to the manifest
function addEntry({ description, customerName, customerEmail, customerPhone, businessName, industry, slug, outputPath }) {
  const entries = readManifest();
  
  const newEntry = {
    id: generateId(),
    generatedAt: new Date().toISOString(),
    
    input: {
      description: description || null,
      customerName: customerName || null,
      customerEmail: customerEmail || null,
      customerPhone: customerPhone || null
    },
    
    output: {
      businessName: businessName,
      industry: industry || 'general',
      slug: slug,
      path: outputPath
    },
    
    status: "generated"
  };
  
  // Add to beginning of array (newest first)
  entries.unshift(newEntry);
  
  writeManifest(entries);
  
  return newEntry;
}

// Get all entries
function getEntries() {
  return readManifest();
}

// Update entry status
function updateStatus(id, status) {
  const entries = readManifest();
  const entry = entries.find(e => e.id === id);
  if (entry) {
    entry.status = status;
    entry.updatedAt = new Date().toISOString();
    writeManifest(entries);
    return entry;
  }
  return null;
}

module.exports = {
  addEntry,
  getEntries,
  updateStatus,
  readManifest
};
