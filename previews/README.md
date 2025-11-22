# AI-Powered Preview Generator

Generate complete website previews for local businesses using AI and interactive hotspot tooltips.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd previews
npm install
```

### 2. Configure Environment

Copy the example environment file and add your OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
MOCK_AI=false
```

### 3. Generate a Preview

```bash
node ai-generate.js "I own a roofing contractor business that does residential repairs and replacements"
```

## 📋 Usage Examples

### Real AI Mode (Requires API Key)

```bash
# Lawn care business
node ai-generate.js "I run a lawn care company that does mowing and fertilization"

# Plumbing business
node ai-generate.js "Local plumber specializing in emergency repairs and water heater installations"

# Photography studio
node ai-generate.js "Wedding and portrait photographer with 10 years experience"
```

### Mock AI Mode (No API Key Required)

Set `MOCK_AI=true` in `.env`, then run:

```bash
node ai-generate.js "Any business description"
```

This generates a sample "GreenScape Lawn Care" website for testing.

## 🔧 Advanced Options

### Using Different AI Models

In `.env`:
```env
# Cheaper, faster (recommended for testing)
OPENAI_MODEL=gpt-4o-mini

# More advanced (better content quality)
OPENAI_MODEL=gpt-4o

# Latest model
OPENAI_MODEL=gpt-4-turbo
```

### Manual Generation from JSON

If you already have a JSON file:

```bash
# Generate from existing JSON
node generate.js example

# This uses: previews/data/example.json
# Creates: previews/generated/brightwire-electric/index.html
```

## 📁 File Structure

```
previews/
├── .env                           # Your config (create from .env.example)
├── .env.example                   # Example configuration
├── package.json                   # Node dependencies
├── README.md                      # This file
│
├── ai-generate.js                 # Main AI generator (Step 4)
├── generate.js                    # Static HTML generator (Step 2)
├── preview-template.html          # HTML template with {{placeholders}}
│
├── data/                          # JSON content files
│   ├── example.json              # BrightWire Electric example
│   └── [slug].json               # AI-generated content
│
└── generated/                     # Output HTML files
    ├── brightwire-electric/
    │   └── index.html
    └── [slug]/
        └── index.html
```

## 🎯 How It Works

### The Pipeline

```
User Description → AI (OpenAI) → JSON → Template → HTML Preview
```

1. **User describes their business** (e.g., "I own a plumbing business")
2. **AI generates structured JSON** with all website content
3. **JSON saved** to `previews/data/<slug>.json`
4. **Template engine** replaces `{{placeholders}}` with JSON values
5. **HTML preview** created at `previews/generated/<slug>/index.html`

### Interactive Hotspots

The generated preview includes interactive hotspots that show potential functionality:

- **Hero CTA Button**: Hover to see "This could open a quote request form"
- **Service Cards**: Each card explains what clicking would do
- **About Section**: Shows potential expansion options
- **CTA Strip**: Indicates possible booking/contact actions

## 📊 Example Output

### Console Output (Real AI Mode)

```
═══════════════════════════════════════
   AI-Powered Preview Generator
═══════════════════════════════════════

📝 User Description:
   "I run a roofing contractor business"

⚙️  Configuration:
   Mode: Real AI
   Model: gpt-4o-mini

🤖 Calling OpenAI API (gpt-4o-mini)...
   ✓ AI response received

✅ Validating AI response...
   ✓ Response validated

📊 Content Summary:
   Business: Summit Roofing Contractors
   Services: 4 items
   About: 3 paragraphs
   CTA: "Get Free Inspection"

📦 Generated slug: summit-roofing-contractors

💾 Saving JSON data...
   ✓ Saved to: previews/data/summit-roofing-contractors.json

🏗️  Generating HTML preview...

🚀 Starting preview generation...
📖 Reading JSON data...
   ✓ Loaded data for: Summit Roofing Contractors
📄 Reading template...
   ✓ Template loaded
🔧 Processing data...
   ✓ Flattened 34 placeholder values
🔀 Replacing placeholders...
   ✓ Replaced 34 placeholders
📁 Creating output directory...
   ✓ Created: previews/generated/summit-roofing-contractors
💾 Writing generated HTML...
   ✓ Generated file: previews/generated/summit-roofing-contractors/index.html

✨ Generation complete!

═══════════════════════════════════════
Business: Summit Roofing Contractors
Slug: summit-roofing-contractors
Output: previews/generated/summit-roofing-contractors/index.html
═══════════════════════════════════════

═══════════════════════════════════════
✨ AI GENERATION COMPLETE!
═══════════════════════════════════════
Business: Summit Roofing Contractors
JSON: previews/data/summit-roofing-contractors.json
HTML: previews/generated/summit-roofing-contractors/index.html
═══════════════════════════════════════

🎉 Done! Open the generated HTML file in your browser to preview.
```

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | (required) | Your OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o-mini` | AI model to use |
| `MOCK_AI` | `false` | Use mock AI instead of real API |

## 🛠️ Troubleshooting

### "OpenAI API key not configured"

**Solution**: Copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=sk-your-key
```

### "Module not found: dotenv"

**Solution**: Install dependencies:
```bash
npm install
```

### Want to test without API costs?

**Solution**: Set `MOCK_AI=true` in `.env`:
```env
MOCK_AI=true
```

### API rate limit errors

**Solution**: The system includes automatic retry logic with exponential backoff. If you hit rate limits:
1. Wait a few minutes
2. Use `gpt-4o-mini` (cheaper, higher rate limits)
3. Enable `MOCK_AI=true` for testing

## 🎨 Customization

### Modifying the Template

Edit `preview-template.html` to change:
- Layout and styling
- Section order
- Component designs
- Placeholder structure

All `{{placeholders}}` must match the JSON schema in `ai-generate.js`.

### Customizing AI Prompts

Edit the `buildSystemPrompt()` function in `ai-generate.js` to:
- Change content tone/style
- Modify section requirements
- Adjust content guidelines
- Add new fields

### Adding New Sections

1. Update JSON schema in `ai-generate.js`
2. Add new placeholders to `preview-template.html`
3. Update `flattenData()` in `generate.js`

## 📦 Dependencies

- **Node.js**: ≥18.0.0 (for native fetch support)
- **dotenv**: Environment variable management
- **OpenAI API**: For AI content generation

## 🚀 Next Steps

1. **Test with Mock AI** to verify setup
2. **Add your OpenAI API key** for real generation
3. **Generate previews** for different business types
4. **Customize templates** to match your brand
5. **Integrate with your workflow** (CMS, customer portal, etc.)

## 📝 License

MIT License - Feel free to use and modify for your projects.

## 💡 Tips

- **Start with mock mode** to test the system
- **Use gpt-4o-mini** for faster, cheaper generation
- **Review generated content** before showing to clients
- **Customize the system prompt** for your target market
- **Save successful JSON files** as templates for similar businesses

## 🤝 Support

For issues or questions:
1. Check this README
2. Review example files in `data/`
3. Test with `MOCK_AI=true` to isolate issues
4. Verify your `.env` configuration
