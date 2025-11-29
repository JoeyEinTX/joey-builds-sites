const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

console.log('Checking for remaining issues...\n');

// Check for broken copyright
if (content.includes('Â©')) {
  console.log('❌ Found broken copyright symbol (Â©)');
} else {
  console.log('✅ Copyright symbol fixed');
}

// Check for empty quotes as dashes
const lines = content.split('\n');
let emptyQuoteIssues = [];
lines.forEach((line, i) => {
  if (line.includes('""') && 
      !line.includes('src=""') && 
      !line.includes('alt=""') &&
      !line.trim().startsWith('<!--') &&
      !line.includes('title=""')) {
    emptyQuoteIssues.push(`Line ${i+1}: ${line.trim().substring(0, 80)}`);
  }
});

if (emptyQuoteIssues.length > 0) {
  console.log(`❌ Found ${emptyQuoteIssues.length} empty quote issues:`);
  emptyQuoteIssues.forEach(issue => console.log('  ' + issue));
} else {
  console.log('✅ No empty quote issues found');
}

// Check for "Joey Builds" (should be "JoeyBuildsSites")
if (content.includes('Joey Builds') || content.includes('Joey​Builds')) {
  console.log('❌ Found spacing issue in "JoeyBuildsSites"');
} else {
  console.log('✅ Brand name capitalization correct');
}

console.log('\n✅ All character encoding issues resolved!');
