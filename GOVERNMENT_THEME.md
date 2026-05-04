# Government Website Color Theme - Smart Queue Management System

## Color Palette

### Primary Colors
- **Navy Blue** (`#1B4965`) - Primary brand color for headers, buttons, and key elements
- **Dark Blue** (`#003366`) - Accent for hover states and gradients
- **Gold** (`#D4AF37`) - Premium accent color for highlights and important CTAs
- **Light Gold** (`#F4D03F`) - Secondary gold for lighter accents

### Secondary Colors
- **Cream/Off-White** (`#F5F5DC`) - Main background color
- **White** (`#FFFFFF`) - Card backgrounds and clean sections
- **Light Gray** (`#F0F0F0`) - Subtle backgrounds
- **Dark Gray** (`#333333`) - Text content

### Status Colors
- **Success** (`#2D5016`) - Dark green for positive actions
- **Warning** (`#B8860B`) - Dark goldenrod for cautions
- **Danger** (`#8B0000`) - Dark red for errors/warnings
- **Info** (`#4A90E2`) - Light blue for information

### Utility Colors
- **Border Gray** (`#CCCCCC`) - Borders and dividers
- **Text Color** (`#333333`) - Main text
- **Placeholder** (`#999999`) - Input placeholders

## Usage Guidelines

### Navbar/Header
- Background: Navy Blue to Dark Blue gradient
- Text: White
- Accents: Gold
- Border: Gold bottom border

### Buttons
- **Primary**: Navy Blue → Dark Blue hover with gold text option
- **Secondary**: Gold → Light Gold (important CTAs)
- **Danger**: Dark Red
- **Success**: Dark Green

### Cards/Containers
- Background: White
- Border: Light Gray
- Hover: Navy Blue shadows

### Text
- Headings: Navy Blue (`#1B4965`)
- Body: Dark Gray (`#333333`)
- Labels: Navy Blue

### Modals
- Header: Navy to Dark Blue gradient with Gold border
- Background: White
- Close button: White hover Gold

## Implementation Example

```jsx
// Button Example
<Button variant="primary" className="bg-[#1B4965] hover:bg-[#003366] text-white">
  Primary Action
</Button>

// Card Example
<Card className="bg-white border border-[#CCCCCC] shadow-md">
  <p className="text-[#333333]">Professional content here</p>
</Card>

// Navbar Example
<nav className="bg-gradient-to-r from-[#1B4965] to-[#003366] border-b-4 border-[#D4AF37]">
  ...
</nav>
```

## Benefits
✅ Professional government appearance
✅ High contrast for accessibility
✅ Clean and minimalist design
✅ Easy to navigate
✅ Trust-building color psychology
✅ Print-friendly (low saturation colors)
