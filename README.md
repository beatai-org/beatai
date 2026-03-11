# BeatAI Website

The official website for BeatAI - The AI that actually does things.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📁 Project Structure

```
beatai-website/
├── public/
│   ├── docs/           # Documentation markdown files
│   └── index.html
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── styles/         # CSS styles
│   └── App.js
└── package.json
```

## 🛠️ Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run version`

Interactive version bump script (patch, minor, major, or custom).

## 🎨 Features

- 📚 **Documentation System**: Complete docs with TOC and search
- 🎨 **Multiple Themes**: 15+ pre-built themes
- 🌓 **Dark/Light Mode**: Automatic theme switching
- 📱 **Responsive Design**: Works on all devices
- 🔍 **AI Assistant**: Built-in documentation assistant
- 💬 **Annotation System**: Inline comments and discussions

## 📝 Documentation

The documentation is located in `public/docs/` and uses markdown format.

To add a new document:
1. Create a `.md` file in `public/docs/`
2. Update `public/docs/_meta.json` with the new route

## 🚢 Deployment

```bash
npm run build
```

The production build will be in the `build/` folder, ready to deploy to any static hosting service.

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ by the BeatAI team
