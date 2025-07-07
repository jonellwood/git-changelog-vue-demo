# Vue CDN Changelog Renderer Example

This is a **Vue 3 CDN-based changelog renderer** that displays release notes in a beautiful, Apple-inspired interface. Perfect for dropping into any existing project without build tools.

## Demo

🌐 **[Live Demo](https://vue.jonellwood.dev)** - See it in action!

[![Netlify Status](https://api.netlify.com/api/v1/badges/f7c08a3e-64c0-42f0-953f-62ad53b90978/deploy-status)](https://app.netlify.com/projects/vue-changelog-demo/deploys)

## 🎯 Features

- **Clean Modern Design** - Clean, professional sidebar layout
- **Vue 3 Composition API** - Modern, reactive components
- **No Build Tools** - Just include via CDN and go
- **Search & Filter** - Find releases quickly
- **Grid/List Views** - Toggle between different layouts
- **Responsive Design** - Works on all devices
- **Month Grouping** - Smart sidebar navigation
- **Modal Details** - Click releases for full details
- **Dark/Light Theme** - Automatic theme support

## 🚀 Quick Start

1. **Copy the files** to your web directory
2. **Open `index.html`** in a browser
3. **Customize the data** in `app.js`

That's it! No npm install, no build process needed.

## 📂 File Structure

```
vue-cdn/
├── index.html      # Main HTML file
├── app.js          # Vue app with sample data
├── styles.css      # Complete CSS styling
└── README.md       # This file
```

## 🔧 Integration with git-changelog-manager

This renderer is designed to work with the [`git-changelog-manager`](https://www.npmjs.com/package/git-changelog-manager) npm package. Here's how to connect them:

### 1. Install git-changelog-manager

```bash
npm install git-changelog-manager
```

### 2. Generate changelog data

```bash
# Initialize changelog in your project
changelog-init

# Add recent commits
changelog-add

# Create a release
changelog-release --type patch
```

### 3. Export data for the renderer

Create a simple Node.js script to export your changelog data:

```javascript
// scripts/export-changelog.js
const fs = require('fs');
const path = require('path');

// Read your changelog files
const changelogDir = './changelog/releases';
const files = fs.readdirSync(changelogDir)
  .filter(file => file.endsWith('.md'))
  .sort();

const releases = files.map(file => {
  const content = fs.readFileSync(path.join(changelogDir, file), 'utf8');
  const version = file.replace('.md', '');
  
  // Parse frontmatter and content
  const [, frontmatter, rawContent] = content.split('---');
  const meta = parseFrontmatter(frontmatter);
  
  return {
    version,
    date: meta.date,
    summary: meta.summary || 'Release update',
    tag: meta.tag || 'patch',
    changeCount: (rawContent.match(/^- /gm) || []).length,
    rawContent: rawContent.trim()
  };
});

const stats = {
  totalReleases: releases.length,
  totalChanges: releases.reduce((sum, r) => sum + r.changeCount, 0),
  latestVersion: releases[releases.length - 1]?.version || '0.0.0'
};

// Export for the Vue renderer
const exportData = { releases, stats };
fs.writeFileSync('changelog-data.js', 
  `window.changelogData = ${JSON.stringify(exportData, null, 2)};`
);

function parseFrontmatter(fm) {
  const lines = fm.trim().split('\n');
  const meta = {};
  lines.forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      meta[key.trim()] = valueParts.join(':').trim();
    }
  });
  return meta;
}
```

### 4. Update your HTML

```html
<!-- Replace the app.js script with your generated data -->
<script src="changelog-data.js"></script>
<script src="app.js"></script>
```

## 🎨 Customization

### Theming

The renderer uses CSS custom properties for theming:

```css
:root {
  --c-bg: #ffffff;        /* Background color */
  --c-fg: #1a1a1a;        /* Text color */
  --c-accent: #007bff;    /* Accent color */
  --c-bg-alt: #f8f9fa;   /* Alt background */
}

/* Dark theme */
.mode-dark {
  --c-bg: #0d1117;
  --c-fg: #e6edf3;
  --c-accent: #58a6ff;
  --c-bg-alt: #161b22;
}
```

### Customizing the Data Structure

The renderer expects this data format:

```javascript
window.changelogData = {
  releases: [
    {
      version: "1.2.0",
      date: "2025-01-04",
      summary: "Brief description of the release",
      tag: "feature|patch|hotfix|major",
      changeCount: 12,
      rawContent: "- Change 1\n- Change 2\n- Change 3"
    }
  ],
  stats: {
    totalReleases: 6,
    totalChanges: 67,
    latestVersion: "1.2.0"
  }
};
```

### Styling Customization

1. **Colors**: Modify CSS custom properties in `:root` and `.mode-dark`
2. **Layout**: Adjust sidebar width, card sizes, etc.
3. **Typography**: Change font families and sizes
4. **Icons**: Uses Phosphor icons - swap for your preferred icon set

## 🔄 Alternative Integrations

### Static Site Generators

For Jekyll, Hugo, or other static generators:

```yaml
# _config.yml (Jekyll example)
changelog:
  - version: "1.2.0"
    date: "2025-01-04"
    summary: "Major feature release"
    changes:
      - "New dashboard layout"
      - "Enhanced search"
```

### PHP/Backend Integration

```php
// Generate data server-side
$releases = getReleasesFromDatabase();
$stats = calculateStats($releases);

echo "<script>window.changelogData = " . json_encode([
  'releases' => $releases,
  'stats' => $stats
]) . ";</script>";
```

### API Integration

```javascript
// Fetch data from API
fetch('/api/changelog')
  .then(response => response.json())
  .then(data => {
    window.changelogData = data;
    // Initialize Vue app after data loads
    initializeChangelogApp();
  });
```

## 📱 Mobile Support

The renderer is fully responsive with:
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized layouts for small screens
- Accessible navigation

## 🎯 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

(Supports all modern browsers with CSS `color-mix()` and Vue 3)

## 📚 Related Projects

- [git-changelog-manager](https://www.npmjs.com/package/git-changelog-manager) - The npm package this renderer is designed for
- [Vue 3 Documentation](https://vuejs.org/) - Vue.js framework
- [Phosphor Icons](https://phosphoricons.com/) - Icon library used

## 🤝 Contributing

This is part of the `git-changelog-manager` ecosystem. Contributions welcome!

## 📄 License

MIT License - Use freely in your projects!
