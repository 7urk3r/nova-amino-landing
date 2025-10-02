# Marquee Component Demo

A modern marquee component built with React, TypeScript, and Tailwind CSS that supports infinite scrolling for seamless display of text, images, and videos. Features smooth animations, customizable speed, and responsive design for continuous content scrolling.

## Features

- 🚀 **Infinite Scrolling**: Seamless continuous animation
- 🎨 **Customizable**: Configurable speed, direction, and styling
- 📱 **Responsive**: Works perfectly on all screen sizes
- ⏸️ **Pause on Hover**: Optional pause functionality
- 🔄 **Reverse Direction**: Support for both directions
- 📏 **Vertical & Horizontal**: Support for both orientations
- 🎯 **TypeScript**: Full type safety
- 🎨 **Tailwind CSS**: Beautiful styling with utility classes

## Demo Examples

The demo includes several examples:

1. **Horizontal Marquee** - Classic left-to-right scrolling reviews
2. **Vertical Marquee** - Top-to-bottom scrolling testimonials  
3. **Logo Marquee** - Company logos with hover effects
4. **3D Marquee** - Modern gradient cards with 3D hover effects

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Component Usage

```tsx
import Marquee from './components/Marquee';

// Basic usage
<Marquee>
  <div>Your content here</div>
</Marquee>

// With options
<Marquee 
  pauseOnHover={true}
  reverse={false}
  vertical={false}
  repeat={4}
  className="[--duration:20s]"
>
  <div>Your content here</div>
</Marquee>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `reverse` | `boolean` | `false` | Reverse animation direction |
| `pauseOnHover` | `boolean` | `false` | Pause animation on hover |
| `vertical` | `boolean` | `false` | Vertical scrolling mode |
| `repeat` | `number` | `4` | Number of content repetitions |
| `children` | `ReactNode` | - | Content to scroll |

## CSS Variables

- `--duration`: Animation duration (default: 40s)
- `--gap`: Gap between items (default: 1rem)

## Tailwind Configuration

The component requires custom animations in your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
    },
  },
};
```

## Build

```bash
npm run build
```

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite
- clsx & tailwind-merge

## Inspiration

This component is inspired by the [UI-Layouts Marquee Component](https://www.ui-layouts.com/components/marquee).

## License

MIT License - feel free to use this in your projects!
