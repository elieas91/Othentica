# Othentica Wellness Website

A modern, responsive wellness website built with React, React Router, and Tailwind CSS.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.jsx   # Button component with variants
│   │   └── Card.jsx     # Card component for content
│   ├── layout/          # Layout components
│   │   ├── Layout.jsx   # Main layout wrapper
│   │   └── Navigation.jsx # Navigation component
│   ├── sections/        # Page sections (used in Home page)
│   │   ├── Hero.jsx     # Hero section with main headline
│   │   ├── Philosophy.jsx # Philosophy section
│   │   ├── Services.jsx # Services grid section
│   │   ├── Testimonials.jsx # Testimonials carousel
│   │   ├── Blog.jsx     # Blog articles section
│   │   └── StayConnected.jsx # Newsletter signup
│   └── index.js         # Component exports
├── pages/               # Page components
│   ├── Home.jsx         # Home page with all sections
│   ├── About.jsx        # About page
│   ├── Services.jsx     # Dedicated services page
│   ├── Blog.jsx         # Dedicated blog page
│   ├── Contact.jsx      # Contact page with form
│   └── index.js         # Page exports
├── data/                # Static data and content
│   ├── servicesData.js  # Services information
│   ├── testimonialsData.js # Testimonial quotes
│   └── blogData.js      # Blog article data
├── App.jsx              # Main application with routing
└── index.css            # Global styles and custom colors
```

## Features

- **Multi-Page Routing**: React Router for navigation between pages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component-Based**: Modular React components for easy maintenance
- **Data-Driven**: Content managed through separate data files
- **Custom Color Palette**: Warm beige and orange wellness theme
- **Interactive Elements**: 
  - Testimonials carousel
  - Newsletter signup
  - Contact form
  - Hover effects and transitions
- **Navigation**: Sticky navigation with mobile menu

## Pages

1. **Home** (`/`) - Landing page with all wellness sections
2. **About** (`/about`) - Company information and story
3. **Services** (`/services`) - Detailed services overview
4. **Blog** (`/blog`) - Wellness articles and insights
5. **Contact** (`/contact`) - Contact form and information

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Customization

- **Colors**: Update the color palette in `tailwind.config.js`
- **Content**: Modify data files in the `data/` folder
- **Pages**: Edit individual page components in the `pages/` folder
- **Components**: Edit individual components in their respective folders
- **Styling**: Use Tailwind classes or modify `index.css`

## Technologies Used

- React 18
- React Router DOM
- Tailwind CSS
- Vite
- Modern JavaScript (ES6+)
