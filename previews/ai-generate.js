const fs = require('fs');
const path = require('path');
const { generatePreview, createSlug } = require('./generate.js');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MOCK_AI = process.env.MOCK_AI === 'true';
const MAX_RETRIES = 2;

// JSON Schema for the AI to follow
const JSON_SCHEMA = {
  businessName: "",
  tagline: "",
  headline: "",
  subheadline: "",
  description: "",
  heroCTA: "",
  heroCTAHint: "",
  heroSecondary: "",
  servicesHeading: "",
  servicesSubheading: "",
  services: [
    {
      name: "",
      description: "",
      hint: ""
    }
  ],
  about: {
    heading: "",
    paragraphs: ["", "", ""],
    hint: ""
  },
  cta: {
    heading: "",
    subheading: "",
    button: "",
    hint: ""
  },
  footer: {
    description: "",
    phone: "",
    email: "",
    hours: "",
    serviceArea: "",
    copyright: ""
  }
};

// System prompt for the AI
function buildSystemPrompt(userDescription) {
  return `You are a professional website content generator. Your task is to create website content for a local business based on the user's description.

USER DESCRIPTION:
${userDescription}

INSTRUCTIONS:
1. Analyze the user's description and infer the business type, services, and target audience
2. Generate appropriate content for each section of the website
3. Keep text SHORT, SIMPLE, and CLIENT-FRIENDLY (avoid jargon)
4. Use the businessName to create a professional, memorable company name if not provided
5. Generate 3-4 relevant services with clear, benefit-focused descriptions
6. Write helpful hotspot hint explanations that describe what interactive elements could do
7. Create realistic contact information (use placeholder phone/email if not provided)
8. Keep all text professional but conversational - like a real local business would write

HOTSPOT HINTS GUIDELINES:
- Explain what clicking/interacting would do (e.g., "This could open a quote form", "This could link to a gallery")
- Keep hints under 100 characters
- Be specific and actionable

CONTENT GUIDELINES:
- Headline: The business name or main value proposition
- Subheadline: A clear, benefit-focused statement (8-12 words)
- Description: 1-2 sentences explaining what they do and their unique value
- Services: 3-4 core offerings, each with name and 1-2 sentence description
- About: 3 paragraphs - company story, values/approach, credentials/guarantee
- CTA: Action-oriented heading and clear button text
- Footer: Realistic business hours, service area description

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure. NO additional text, explanations, or markdown.

${JSON.stringify(JSON_SCHEMA, null, 2)}

CRITICAL: Your response must be ONLY the JSON object. Do not include any text before or after the JSON. Do not wrap it in markdown code blocks. Just the raw JSON.`;
}

// Mock AI function (for testing without API costs)
function getMockResponse(userDescription) {
  return {
    businessName: "GreenScape Lawn Care",
    tagline: "Professional Lawn Care Since 2010",
    headline: "GreenScape Lawn Care",
    subheadline: "Beautiful, Healthy Lawns for Your Home",
    description: "From weekly mowing to seasonal treatments, we keep your lawn looking its best year-round with reliable service and professional results.",
    heroCTA: "Get a Free Quote",
    heroCTAHint: "This could open a simple quote form where customers enter their address, lawn size, and preferred services.",
    heroSecondary: "View Services",
    servicesHeading: "Our Services",
    servicesSubheading: "Complete lawn care solutions for residential properties throughout the area.",
    services: [
      {
        name: "Weekly Mowing",
        description: "Professional mowing, edging, and trimming to keep your lawn neat and healthy all season long.",
        hint: "This could link to a detailed service page with pricing tiers, schedule options, and before/after photos."
      },
      {
        name: "Fertilization Programs",
        description: "Custom fertilization schedules designed for your grass type and local climate conditions.",
        hint: "This could open a seasonal program guide showing treatment schedules and expected results for each season."
      },
      {
        name: "Spring & Fall Cleanup",
        description: "Thorough seasonal cleanups including leaf removal, bed prep, and debris clearing.",
        hint: "This could display a gallery of cleanup projects with seasonal package details and add-on options."
      },
      {
        name: "Aeration & Seeding",
        description: "Core aeration and overseeding services to improve soil health and fill in thin or bare spots.",
        hint: "This could show timing recommendations, process videos, and results timeline with booking options."
      }
    ],
    about: {
      heading: "Local Expertise. Reliable Service.",
      paragraphs: [
        "GreenScape Lawn Care has been serving homeowners since 2010. Our team understands local soil conditions, grass types, and seasonal challenges to deliver results that last.",
        "We believe in straightforward pricing, dependable weekly service, and treating every lawn like it's our own. Whether you need basic mowing or a complete care program, we're here to help.",
        "All work is backed by our satisfaction guarantee. Licensed and insured for your peace of mind."
      ],
      hint: "This could expand into a full company page with team photos, service area map, certifications, and customer testimonials."
    },
    cta: {
      heading: "Ready for a lawn you'll love?",
      subheading: "Get a free quote and see how easy great lawn care can be.",
      button: "Request Free Quote",
      hint: "This could open a quote form with service selection, or trigger a phone call on mobile devices during business hours."
    },
    footer: {
      description: "Licensed & Insured\nServing Your Local Area",
      phone: "(555) 234-5678",
      email: "info@greenscape-lawn.com",
      hours: "Mon-Fri: 7am - 5pm\nSat: 8am - 2pm",
      serviceArea: "Serving all of Metro County\nWithin 25 miles of downtown",
      copyright: "2024 GreenScape Lawn Care. All rights reserved. License #LC-12345."
    }
  };
}

// Real OpenAI API call
async function callOpenAI(userDescription, systemPrompt, attempt = 1) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in .env file');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userDescription
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Try to parse JSON from response
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    // Parse JSON
    const parsedData = JSON.parse(jsonContent);
    
    return parsedData;

  } catch (error) {
    if (attempt < MAX_RETRIES) {
      console.log(`   ⚠️  Attempt ${attempt} failed: ${error.message}`);
      console.log(`   🔄 Retrying (${attempt + 1}/${MAX_RETRIES})...\n`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      return callOpenAI(userDescription, systemPrompt, attempt + 1);
    }
    throw error;
  }
}

// Main AI call function (switches between mock and real)
async function callAI(userDescription, systemPrompt) {
  if (MOCK_AI) {
    console.log('🤖 Using Mock AI (MOCK_AI=true)...\n');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    console.log('   ✓ Mock response generated\n');
    return getMockResponse(userDescription);
  } else {
    console.log(`🤖 Calling OpenAI API (${OPENAI_MODEL})...\n`);
    const result = await callOpenAI(userDescription, systemPrompt);
    console.log('   ✓ AI response received\n');
    return result;
  }
}

// Validate AI response structure
function validateResponse(data) {
  const required = [
    'businessName',
    'headline',
    'services',
    'about',
    'cta',
    'footer'
  ];

  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`AI response missing required fields: ${missing.join(', ')}`);
  }

  if (!Array.isArray(data.services) || data.services.length === 0) {
    throw new Error('AI response must include at least one service');
  }

  if (!Array.isArray(data.about?.paragraphs) || data.about.paragraphs.length === 0) {
    throw new Error('AI response must include about paragraphs');
  }

  return true;
}

// Print response summary
function printResponseSummary(data) {
  console.log('📊 Content Summary:');
  console.log(`   Business: ${data.businessName}`);
  console.log(`   Services: ${data.services.length} items`);
  console.log(`   About: ${data.about.paragraphs.length} paragraphs`);
  console.log(`   CTA: "${data.cta.button}"`);
  console.log('');
}

// Main AI generation function
async function aiGenerate(userDescription) {
  console.log('═══════════════════════════════════════');
  console.log('   AI-Powered Preview Generator');
  console.log('═══════════════════════════════════════\n');
  
  console.log('📝 User Description:');
  console.log(`   "${userDescription}"\n`);
  
  console.log('⚙️  Configuration:');
  console.log(`   Mode: ${MOCK_AI ? 'Mock AI' : 'Real AI'}`);
  if (!MOCK_AI) {
    console.log(`   Model: ${OPENAI_MODEL}`);
  }
  console.log('');
  
  try {
    // Build system prompt
    const systemPrompt = buildSystemPrompt(userDescription);
    
    // Call AI (mock or real)
    const aiResponse = await callAI(userDescription, systemPrompt);
    
    // Validate response
    console.log('✅ Validating AI response...');
    validateResponse(aiResponse);
    console.log('   ✓ Response validated\n');
    
    // Print summary
    printResponseSummary(aiResponse);
    
    // Create slug from business name
    const slug = createSlug(aiResponse.businessName);
    console.log(`📦 Generated slug: ${slug}\n`);
    
    // Save JSON to data directory
    const dataDir = path.join(__dirname, 'data');
    const jsonPath = path.join(dataDir, `${slug}.json`);
    
    console.log('💾 Saving JSON data...');
    fs.writeFileSync(jsonPath, JSON.stringify(aiResponse, null, 2), 'utf8');
    console.log(`   ✓ Saved to: previews/data/${slug}.json\n`);
    
    // Generate HTML preview
    console.log('🏗️  Generating HTML preview...\n');
    const outputPath = generatePreview(jsonPath);
    
    // Success summary
    console.log('\n═══════════════════════════════════════');
    console.log('✨ AI GENERATION COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`Business: ${aiResponse.businessName}`);
    console.log(`JSON: previews/data/${slug}.json`);
    console.log(`HTML: previews/generated/${slug}/index.html`);
    console.log('═══════════════════════════════════════\n');
    
    return {
      slug,
      jsonPath,
      outputPath,
      data: aiResponse
    };
    
  } catch (error) {
    console.error('\n❌ Error during AI generation:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('\n💡 Tip: Copy .env.example to .env and add your OpenAI API key');
      console.error('   Or set MOCK_AI=true to test without API calls\n');
    }
    
    throw error;
  }
}

// Run the AI generator
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Error: No description provided\n');
    console.log('Usage: node previews/ai-generate.js "Your business description here"\n');
    console.log('Examples:');
    console.log('  node previews/ai-generate.js "I own a lawn care business"');
    console.log('  node previews/ai-generate.js "Roofing contractor specializing in residential repairs"\n');
    console.log('Configuration:');
    console.log('  - Set OPENAI_API_KEY in .env file for real AI');
    console.log('  - Set MOCK_AI=true in .env to test without API costs\n');
    process.exit(1);
  }
  
  const userDescription = args.join(' ');
  
  aiGenerate(userDescription)
    .then(result => {
      console.log('🎉 Done! Open the generated HTML file in your browser to preview.\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('Failed to generate preview');
      process.exit(1);
    });
}

module.exports = { aiGenerate, buildSystemPrompt, callAI, JSON_SCHEMA };
