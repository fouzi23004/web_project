# Pâtisserie Délice - Angular Application

An Angular-based online pastry shop application converted from a static travel agency website.

## Features

- Modern Angular 17 standalone components architecture
- Responsive design with custom CSS
- Product catalog with categories
- Shopping cart functionality
- French-themed pastry shop

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Navigation header
│   │   ├── banner/          # Promotional banner
│   │   ├── sidebar/         # Category sidebar
│   │   ├── product-list/    # Product display
│   │   └── footer/          # Footer with social links
│   ├── models/
│   │   └── pastry.model.ts  # Product data model
│   ├── services/
│   │   └── pastry.service.ts # Product service
│   ├── app.component.*      # Main app component
│   ├── app.config.ts        # App configuration
│   └── app.routes.ts        # Routing configuration
├── assets/
│   └── images/              # Product images
├── index.html               # Main HTML file
├── main.ts                  # Application entry point
└── styles.css               # Global styles

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Product Categories

- Viennoiseries (Croissants, Pain au Chocolat, etc.)
- Pâtisseries (Éclairs, Macarons, Millefeuille, etc.)
- Tartes (Fruit tarts, Lemon meringue, etc.)
- Gâteaux
- Chocolats
- Macarons
- Biscuits

## Customization

### Adding New Products

Edit `src/app/services/pastry.service.ts` and add new items to the `pastries` array.

### Changing Colors

The main color scheme uses brown tones for a bakery theme:
- Primary: `#8b4513` (brown)
- Secondary: `#d2691e` (chocolate)
- Background: `#fff5e1` (cream)

Edit `src/styles.css` and component CSS files to customize colors.

## Notes

- This project uses Angular 17 with standalone components
- Social media icons (facebook.png, rss.png, twitter.png) are referenced from the root directory
- Product images should be placed in `src/assets/images/`

## License

© 2024 Pâtisserie Délice. All rights reserved.
