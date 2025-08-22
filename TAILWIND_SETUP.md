# Tailwind CSS v3 Setup

This project has been configured with Tailwind CSS v3 for rapid UI development.

## What was installed

- `tailwindcss@^3.4.0` - The core Tailwind CSS framework
- `postcss` - PostCSS processor for Tailwind
- `autoprefixer` - Vendor prefixing for CSS

## Configuration Files

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `src/index.css`
The main CSS file now includes Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  /* ... */
}

/* Custom component styles */
@layer components {
  /* ... */
}
```

## Usage

### Basic Classes
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  Hello Tailwind!
</div>
```

### Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

### Hover and Focus States
```jsx
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300">
  Interactive Button
</button>
```

### Custom Components with @apply
```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
  }
}
```

## Available Utilities

- **Layout**: `flex`, `grid`, `container`, `columns`
- **Spacing**: `p-4`, `m-2`, `space-x-4`, `gap-6`
- **Sizing**: `w-full`, `h-screen`, `max-w-md`, `min-h-screen`
- **Typography**: `text-lg`, `font-bold`, `text-center`, `leading-relaxed`
- **Colors**: `bg-blue-500`, `text-gray-800`, `border-red-300`
- **Effects**: `shadow-lg`, `rounded-lg`, `opacity-50`
- **Transitions**: `transition-all`, `duration-200`, `ease-in-out`

## Development

1. **Start dev server**: `npm run dev`
2. **Build for production**: `npm run build`
3. **Preview build**: `npm run preview`

## Customization

To extend Tailwind's default theme, modify `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'brand': '#ff6b6b',
      },
      fontFamily: {
        'custom': ['Custom Font', 'sans-serif'],
      },
    },
  },
}
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Tailwind UI Components](https://tailwindui.com/)
