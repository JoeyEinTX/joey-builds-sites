# JoeyBuildsSites - AI Preview Generator

Generate complete website previews for local businesses using Claude AI and interactive hotspot tooltips.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your Anthropic API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
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

## 📁 File Structure

```
joey-builds-sites/
├── .env                    # Your config (create from .env.example)
├── .env.example            # Example configuration
├── .gitignore              # Git ignore rules
├── package.json            # Node dependencies
├── README.md               # This file
│
├── ai-generate.js          # AI generator (Anthropic/Claude)
├── generate.js             # Static HTML generator
├── preview-template.html   # HTML template with {{placeholders}}
├── index.html              # Main JoeyBuildsSites landing page
│
├── data/                   # JSON content files
│   └── example.json        # BrightWire Electric example
│
└── generated/              # Output HTML files (gitignored)
    └── [slug]/
        └── index.html
```

## 🎯 How It Works

```
User Description → Claude AI → JSON → Template → HTML Preview
```

1. **User describes their business** (e.g., "I own a plumbing business")
2. **Claude AI generates structured JSON** with all website content
3. **JSON saved** to `data/<slug>.json`
4. **Template engine** replaces `{{placeholders}}` with JSON values
5. **HTML preview** created at `generated/<slug>/index.html`

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | (required) | Your Anthropic API key |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-20250514` | Claude model to use |
| `MOCK_AI` | `false` | Use mock AI instead of real API |

## 🛠️ Troubleshooting

### "Anthropic API key not configured"

Copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=sk-ant-your-key
```

### "Module not found: dotenv"

Install dependencies:
```bash
npm install
```

### Want to test without API costs?

Set `MOCK_AI=true` in `.env`

## 🔐 Security Notes

- **NEVER commit your `.env` file** - it's in `.gitignore` for a reason
- Get your API key from: https://console.anthropic.com/
- The `.gitignore` is set up to protect you, but double-check before pushing

## 📝 License

MIT License - Feel free to use and modify for your projects.
