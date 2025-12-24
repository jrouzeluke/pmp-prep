# One-Step Global Theme Application

## The Simple Prompt for Cursor:

```
Add this CSS file to my project as "theme-22nd-century.css" and import it at the top of my main CSS file (index.css or globals.css). 

DO NOT modify any component files, JavaScript, or existing styles. 

This CSS uses global selectors to theme the entire app. Just add the file and the import - nothing else.

[Then paste the entire contents of theme-22nd-century.css]
```

---

## Alternative: If you want Cursor to create it

```
Create a new CSS file called "theme-22nd-century.css" that applies a dark futuristic theme to my entire React app using ONLY global CSS selectors.

Requirements:
- DO NOT touch any component files or JavaScript
- Use attribute selectors like [class*="card"] to target elements
- Dark background: #0A0A0F
- Primary accent: #00F0FF (electric cyan)
- Fonts: Orbitron for headings, Rajdhani for body (import from Google Fonts)
- Style all buttons, inputs, cards, tables, progress bars globally
- Add correct/incorrect states for quiz answers (green/red)
- Style scrollbars, selection highlight, focus states
- Add subtle scan line overlay and grid background on body

After creating the file, add this import to the TOP of index.css:
@import './theme-22nd-century.css';

That's it. Do not modify anything else.
```

---

## How It Works

The CSS file uses:

1. **Element selectors** - `button`, `input`, `h1`, `table`, etc.
2. **Attribute selectors** - `[class*="card"]` matches ANY class containing "card"
3. **CSS variables** - Easy to tweak colors in one place
4. **!important sparingly** - Only for state overrides (correct/incorrect)

This means it styles everything without knowing your exact class names.

---

## To Install Manually (No Cursor)

1. Save `theme-22nd-century.css` to your `/src` folder
2. Add this line to the TOP of `index.css` or `App.css`:
   ```css
   @import './theme-22nd-century.css';
   ```
3. Done. Refresh your app.

---

## To Remove/Disable

Just comment out or delete the import line:
```css
/* @import './theme-22nd-century.css'; */
```

Your app returns to normal instantly.

---

## Customizing After Install

Edit the CSS variables at the top of the theme file:

```css
:root {
  --theme-bg-primary: #0A0A0F;     /* Change background */
  --theme-cyan: #00F0FF;            /* Change accent color */
  --theme-green: #00FF88;           /* Change success color */
  /* etc */
}
```

All styled elements update automatically.
