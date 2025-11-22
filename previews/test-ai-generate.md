# AI Generate Testing Guide

## Quick Test

To test the AI-powered preview generator, run:

```bash
node previews/ai-generate.js "I run a local plumbing business that handles residential repairs and emergency calls"
```

## What Happens

1. **AI Generation (Mock Mode)**
   - Accepts your business description
   - Generates structured JSON content (currently using mock data)
   - Saves to `previews/data/<slug>.json`

2. **HTML Generation**
   - Automatically calls the existing generator
   - Replaces all {{placeholders}} with JSON values
   - Creates `previews/generated/<slug>/index.html`

3. **Output**
   - Complete working website with hover tooltips
   - All content from AI-generated JSON
   - Ready to preview in browser

## Expected Console Output

```
═══════════════════════════════════════
   AI-Powered Preview Generator
═══════════════════════════════════════

📝 User Description:
   "I run a local plumbing business..."

🤖 Calling AI (mock mode)...
   ✓ AI response received (mock)

✅ Validating AI response...
   ✓ Response validated

📦 Generated slug: greenscape-lawn-care

💾 Saving JSON data...
   ✓ Saved to: previews/data/greenscape-lawn-care.json

🏗️  Generating HTML preview...

🚀 Starting preview generation...
📖 Reading JSON data...
   ✓ Loaded data for: GreenScape Lawn Care
...
✨ Generation complete!

═══════════════════════════════════════
✨ AI GENERATION COMPLETE!
═══════════════════════════════════════
Business: GreenScape Lawn Care
JSON: previews/data/greenscape-lawn-care.json
HTML: previews/generated/greenscape-lawn-care/index.html
═══════════════════════════════════════
```

## Files Created

- `previews/data/greenscape-lawn-care.json` - AI-generated content
- `previews/generated/greenscape-lawn-care/index.html` - Full website preview

## Next Steps (Step 4)

In Step 4, we'll replace the `callAI()` mock function with real API calls to:
- OpenAI GPT-4
- Anthropic Claude
- Local Ollama models
- Or other AI providers

The system is ready for production AI integration!
