const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('Lines with "" in text content (excluding HTML attributes):');
lines.forEach((line, i) => {
  // Skip lines that are only HTML attributes
  if (line.includes('""') && 
      !line.includes('src=""') && 
      !line.includes('alt=""') && 
      !line.trim().startsWith('<!--')) {
    console.log(`Line ${i+1}: ${line.trim().substring(0, 100)}`);
  }
});
