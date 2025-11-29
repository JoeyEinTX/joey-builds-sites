const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Replace broken characters
content = content.replace(/â€™/g, "'");  // curly apostrophe
content = content.replace(/â€"/g, "—");  // em-dash (use proper em-dash)
content = content.replace(/â€œ/g, '"');  // opening curly quote
content = content.replace(/â€/g, '"');   // closing curly quote
content = content.replace(/â€¢/g, "•");  // bullet point
content = content.replace(/""/g, " —");  // empty quotes (should be em-dash with spaces)
content = content.replace(/â€"¢/g, "•"); // another bullet variant
content = content.replace(/"¢/g, "•");   // yet another bullet variant
content = content.replace(/Â©/g, "&copy;");  // broken copyright symbol
content = content.replace(/Joey Builds|Joey​Builds/g, "JoeyBuildsSites");  // fix brand name spacing

fs.writeFileSync('index.html', content, 'utf8');
console.log('✓ Fixed all character encoding issues in index.html');
