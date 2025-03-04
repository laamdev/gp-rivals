# GP Rivals

A Next.js application for exploring Formula 1 rivalries, race statistics, and
season comparisons. Built with modern web technologies to provide an interactive
and engaging experience for F1 fans.

## Features

- 🏎️ Season-by-season race statistics and comparisons
- 👥 Driver head-to-head comparisons
- 📊 Interactive charts and visualizations
- 📱 Responsive design for all devices
- ⚡ Fast performance with Next.js
- 🎨 Beautiful UI with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Prisma
- **Charts:** Recharts
- **UI Components:** Radix UI
- **Package Manager:** Bun

## Getting Started

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd gp-rivals
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables.

4. **Set up the database**

   ```bash
   bun db:generate
   bun db:push
   ```

5. **Start the development server**

   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint
- `bun db:generate` - Generate Prisma client
- `bun db:push` - Push database schema changes
- `bun db:studio` - Open Prisma Studio

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for
details.
