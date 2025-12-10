# DeepL API Demo - Style Rules & Custom Instructions

An interactive web application showcasing DeepL's powerful Style Rules API and Custom Instructions functionality through an engaging dice-rolling interface with side-by-side translation comparisons.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## Features

### 🎲 Custom Instructions Generator
- **Animated dice roll interface** powered by Framer Motion
- Generates 10 creative custom instructions via OpenAI proxy
- Select 1-10 instructions to apply to your translations
- Real-time selection feedback

### 📋 Style Rules Management
- Fetch and display all available DeepL style rules
- View detailed rule configurations (word redundancy, instruction style, etc.)
- Select one style rule to apply to translations
- Manual refresh functionality

### 🔄 Side-by-Side Translation Comparison
- **Parallel API calls** for optimal performance
- **Baseline translation**: No customization
- **Custom translation**: With selected style rule + custom instructions
- Clear visual distinction between results
- Copy-to-clipboard functionality

### 🔍 API Debug Panel
- Collapsible debug interface
- View raw JSON requests and responses
- Full transparency for both API calls

### ⚙️ Configuration
- Secure API key storage in browser localStorage
- DeepL API key configuration
- OpenAI proxy URL configuration
- Settings modal with form validation

## Prerequisites

- Node.js 18+ and npm
- DeepL API key ([Get one here](https://www.deepl.com/pro-api))
- OpenAI proxy endpoint

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Configure API Keys

Click the **Settings** button in the header to configure:
- DeepL API Key
- OpenAI Proxy URL

API keys are stored in your browser's localStorage.

## Usage Guide

### Step 1: Generate Custom Instructions

1. Click **"Roll Dice"** to generate 10 creative custom instructions
2. Wait for the animation and API call to complete
3. Select 1-10 instructions by clicking on them
4. Click **"Apply X Selected"** to confirm your selection

### Step 2: Select a Style Rule (Optional)

1. The style rules panel automatically loads your DeepL style rules
2. Select one style rule by clicking its radio button
3. Or choose "None (no style rule)" for no style customization

### Step 3: Enter Text to Translate

1. Choose source and target languages from the dropdowns
2. Optionally select an example text from the dropdown
3. Or enter your own text in the textarea
4. Click **"Translate"** to start the translation

### Step 4: Compare Results

- **Left panel**: Baseline translation (no customization)
- **Right panel**: Custom translation (with your selected style rule and instructions)
- Compare the differences to see the impact of customization
- Use the **Copy** button to copy translations to clipboard

### Step 5: Debug API Calls (Optional)

- Expand the **API Debug Information** panel
- View the raw JSON for both baseline and custom API calls
- Inspect requests and responses for transparency

## Supported Languages

Custom instructions work with these target languages:
- German (de)
- English (en, en-US, en-GB)
- Spanish (es)
- French (fr)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Chinese (zh, zh-Hans, zh-Hant)

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner

### Project Structure

```
custom-instructions-demo/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main demo page
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── layout/              # Header, SettingsModal
│   ├── dice/                # DiceInterface
│   ├── style-rules/         # StyleRulesPanel
│   ├── translation/         # TranslationForm, TranslationResults
│   └── debug/               # ApiDebugPanel
├── lib/
│   ├── api/                 # DeepL & OpenAI API clients
│   ├── constants/           # Languages, example texts, config
│   ├── storage/             # localStorage utilities
│   └── formatters.ts        # Text formatting utilities
├── hooks/                   # Custom React hooks
├── context/                 # React Context providers
└── types/                   # TypeScript type definitions
```

### Key Design Decisions

1. **Client-side API calls**: All API calls happen in the browser for transparency
2. **localStorage**: API keys stored in browser (acceptable for demo, not production)
3. **Parallel translations**: Baseline and custom translations run simultaneously
4. **Context-based state**: API keys and style rules managed via React Context
5. **Form validation**: Zod schemas ensure data integrity

## API Integration

### DeepL Translation API

The app uses the DeepL Translation API v2:

```typescript
POST https://api.deepl.com/v2/translate

Headers:
  Authorization: DeepL-Auth-Key [yourAuthKey]
  Content-Type: application/json

Body:
{
  "text": ["Text to translate"],
  "target_lang": "DE",
  "style_rule_id": "uuid-of-style-rule",  // Optional
  "custom_instructions": [                 // Optional, max 10
    "Instruction 1",
    "Instruction 2"
  ]
}
```

### DeepL Style Rules API

Fetches style rules using API v3:

```typescript
GET https://api.deepl.com/v3/style_rules?detailed=true&page=0&page_size=25

Headers:
  Authorization: DeepL-Auth-Key [yourAuthKey]
```

### OpenAI Proxy

Generates custom instructions:

```typescript
POST https://YOUR_OPENAI_PROXY.com

Body:
{
  "count": 10,
  "max_length": 300,
  "style": "creative"
}
```

## Development

### Build for Production

```bash
npm run build
```

### Lint Code

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and deploy
4. No environment variables needed (API keys configured via UI)

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Any Node.js hosting platform

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

1. **Never store API keys in localStorage**
   - Use server-side API routes to proxy requests
   - Store API keys in environment variables on the server
   - Implement proper authentication

2. **Rate limiting**
   - Add rate limiting to prevent API abuse
   - Implement request throttling

3. **Input validation**
   - Sanitize all user inputs server-side
   - Validate all API responses

## Troubleshooting

### API Key Errors

If you see "Invalid API key" errors:
1. Verify your DeepL API key at [deepl.com/pro-api](https://www.deepl.com/pro-api)
2. Check that the key is correctly entered in Settings
3. Ensure you're using a Pro API key (Free API keys have different endpoints)

### Style Rules Not Loading

If style rules don't appear:
1. Verify you have created style rules in your DeepL account
2. Click the Refresh button in the Style Rules panel
3. Check browser console for API errors
4. Note: Style rules are data-center specific

### Dice Roll Fails

If custom instructions don't generate:
1. Verify the OpenAI proxy URL is correct
2. Check browser console for network errors
3. Ensure the proxy endpoint is accessible

### Build Errors

If you encounter build errors:
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Resources

- [DeepL API Documentation](https://developers.deepl.com/docs)
- [DeepL Style Rules API](https://developers.deepl.com/api-reference/style-rules)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)

## Support

For issues related to:
- **DeepL API**: [DeepL Support](https://support.deepl.com/)
- **This demo app**: Open an issue on GitHub

---

Built with ❤️ using Next.js, TypeScript, and DeepL API
