const fs = require('fs');
const path = require('path');

// Helper function to create a slug from business name
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Helper function to flatten nested JSON structure into placeholder keys
function flattenData(data) {
  const flattened = {};
  
  // Top-level strings
  flattened.businessName = data.businessName;
  flattened.tagline = data.tagline;
  flattened.headline = data.headline;
  flattened.subheadline = data.subheadline;
  flattened.description = data.description;
  flattened.industry = data.industry || 'general';
  flattened.heroCTA = data.heroCTA;
  flattened.heroCTAHint = data.heroCTAHint;
  flattened.heroSecondary = data.heroSecondary;
  flattened.servicesHeading = data.servicesHeading;
  flattened.servicesSubheading = data.servicesSubheading;
  
  // Services array (up to 4 services)
  data.services.forEach((service, index) => {
    flattened[`service_${index}_name`] = service.name;
    flattened[`service_${index}_description`] = service.description;
    flattened[`service_${index}_hint`] = service.hint;
  });
  
  // About section
  flattened.about_heading = data.about.heading;
  data.about.paragraphs.forEach((paragraph, index) => {
    flattened[`about_paragraph_${index}`] = paragraph;
  });
  flattened.about_hint = data.about.hint;
  
  // CTA section
  flattened.cta_heading = data.cta.heading;
  flattened.cta_subheading = data.cta.subheading;
  flattened.cta_button = data.cta.button;
  flattened.cta_hint = data.cta.hint;
  
  // Footer
  flattened.footer_description = data.footer.description;
  flattened.footer_phone = data.footer.phone;
  flattened.footer_email = data.footer.email;
  flattened.footer_hours = data.footer.hours;
  flattened.footer_serviceArea = data.footer.serviceArea;
  flattened.footer_copyright = data.footer.copyright;
  
  return flattened;
}

// Main generation function
function generatePreview(jsonFilePath) {
  console.log('ðŸš€ Starting preview generation...\n');
  
  // Read the JSON data
  console.log('ðŸ“– Reading JSON data...');
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  console.log(`   âœ“ Loaded data for: ${jsonData.businessName}\n`);
  
  // Read the template
  console.log('ðŸ“„ Reading template...');
  const templatePath = path.join(__dirname, 'preview-template.html');
  let template = fs.readFileSync(templatePath, 'utf8');
  console.log('   âœ“ Template loaded\n');
  
  // Flatten the data structure
  console.log('ðŸ”§ Processing data...');
  const flatData = flattenData(jsonData);
  console.log(`   âœ“ Flattened ${Object.keys(flatData).length} placeholder values\n`);
  
  // Replace all {{placeholders}} with actual values
  console.log('ðŸ”€ Replacing placeholders...');
  let replacementCount = 0;
  for (const [key, value] of Object.entries(flatData)) {
    const placeholder = `{{${key}}}`;
    if (template.includes(placeholder)) {
      template = template.replace(new RegExp(placeholder, 'g'), value);
      replacementCount++;
    }
  }
  console.log(`   âœ“ Replaced ${replacementCount} placeholders\n`);
  
  // Create slug and output path with industry/date organization
  const industry = jsonData.industry || 'general';
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const slug = createSlug(jsonData.businessName);
  const outputDir = path.join(__dirname, 'generated', industry, today, slug);
  const outputPath = path.join(outputDir, 'index.html');
  
  // Create output directory if it doesn't exist
  console.log('ðŸ“ Creating output directory...');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`   âœ“ Created: ${outputDir}\n`);
  } else {
    console.log(`   âœ“ Directory exists: ${outputDir}\n`);
  }
  
  // Write the generated HTML
  console.log('ðŸ’¾ Writing generated HTML...');
  fs.writeFileSync(outputPath, template, 'utf8');
  console.log(`   âœ“ Generated file: ${outputPath}\n`);
  
  // Success summary
  console.log('âœ¨ Generation complete!\n');
  console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
  console.log(`Business: ${jsonData.businessName}`);
  console.log(`Slug: ${slug}`);
  console.log(`Output: generated/${industry}/${today}/${slug}/index.html`);
  console.log('â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•\n');
  
  return outputPath;
}

// Run the generator
if (require.main === module) {
  // Check if a slug was provided as argument
  const args = process.argv.slice(2);
  const slug = args[0];
  
  let jsonPath;
  if (slug) {
    // Use provided slug
    jsonPath = path.join(__dirname, 'data', `${slug}.json`);
  } else {
    // Default to example.json
    jsonPath = path.join(__dirname, 'data', 'example.json');
  }
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`âŒ Error: JSON file not found at ${jsonPath}`);
    process.exit(1);
  }
  
  try {
    const outputPath = generatePreview(jsonPath);
    console.log('ðŸŽ‰ Success! Open the generated file in your browser to view.\n');
    console.log(`ðŸ“ Full path: ${outputPath}\n`);
  } catch (error) {
    console.error('âŒ Error during generation:', error.message);
    process.exit(1);
  }
}

module.exports = { generatePreview, createSlug };
