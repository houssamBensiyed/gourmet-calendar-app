# Gourmet Calendar App

An elegant restaurant reservation management system with a modern, responsive interface.

## Features

- 📅 Interactive calendar view with week/day layouts
- 🔄 Drag-and-drop reservation management
- 🎨 Color-coded reservation types (VIP, Birthday, Group, etc.)
- 📱 Responsive design for all devices
- 🔍 Quick search and filtering options
- 📊 Reservation statistics and overview
- 🎯 Mini calendar for quick date navigation

## Tech Stack

- Vanilla JavaScript (ES6+)
- CSS3 with Custom Properties
- HTML5
- Font Awesome for icons
- TailwindCSS for utility classes

## Getting Started

### Prerequisites

- Node.js (for running the development server)
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone https://github.com/houssamBensiyed/gourmet-calendar-app.git
cd gourmet-calendar-app
```

2. Start the development server:

```bash
npx http-server . -p 8080 --cors -c-1
```

3. Open your browser and navigate to:

```
http://localhost:8080
```

## Project Structure

```
gourmet-calendar-app/
├── index.html          # Main entry point
├── assets/            # Static assets
├── css/
│   └── styles.css     # Main stylesheet
└── js/
    ├── app.js         # Application entry point
    ├── config/        # Configuration files
    ├── controllers/   # Calendar and reservation controllers
    ├── models/        # Data models
    ├── services/      # Business logic and utilities
    ├── utils/         # Helper functions
    └── views/         # UI components
```

## Usage

- Click the "+" button to create a new reservation
- Drag reservations to reschedule
- Use the filter panel to sort by reservation type
- Click on reservations to view/edit details
- Use the mini calendar for quick date navigation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
