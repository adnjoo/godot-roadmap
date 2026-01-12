# Godot Game Developer Roadmap (2026)

A clean, modern roadmap and progress tracker web application for learning Godot game development. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Interactive Roadmap**: 60+ learning items organized into 9 sections
- **Progress Tracking**: Mark items as complete, track overall progress with percentage
- **Filtering & Search**: Filter by difficulty, category, completion status, and search by keywords
- **Practice Projects**: 7 projects mapped to roadmap milestones with prerequisites and checklists
- **Local Storage**: All progress persists in browser localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context API
- **Persistence**: localStorage

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone or navigate to the project directory:
```bash
cd godot-map
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
godot-map/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── roadmap/           # Roadmap page
│   └── projects/          # Projects page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── roadmap/           # Roadmap-specific components
│   ├── projects/          # Project components
│   └── layout/            # Layout components
├── data/
│   └── roadmap.godot-2026.json  # Roadmap data
├── lib/
│   ├── store/             # State management
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Roadmap Sections

1. **Foundations**: Nodes, scenes, input, signals, resources
2. **2D Essentials**: Sprites, tilemaps, collisions, physics, animation
3. **UI Systems**: Control nodes, themes, containers, dialogs
4. **Game Systems**: State machines, save/load, events, data-driven design
5. **Content Pipeline**: Asset management, import settings, organization
6. **Tools & Automation**: Editor scripts, plugins, export presets
7. **Performance & Optimization**: Profiling, draw calls, physics optimization
8. **Shipping & Distribution**: Export settings, itch.io, Steam publishing
9. **Advanced Topics**: Multiplayer, shaders, 3D basics, custom rendering

## Features in Detail

### Progress Tracking
- Check off items as you complete them
- View overall progress percentage
- Track completion per section
- All progress saved automatically to localStorage

### Filtering
- Filter by difficulty (Beginner/Intermediate/Advanced)
- Filter by category (2D/3D/UI/Systems/Tools)
- Show only remaining items
- Search by title, summary, or keywords

### Projects
- 7 practice projects with varying scope
- Prerequisites tracking (must complete roadmap items first)
- Project checklists to guide development
- Mark projects as complete

## Data Model

The roadmap data is stored in `data/roadmap.godot-2026.json` with:
- **sections**: Learning sections with id, title, description
- **items**: Roadmap items with id, sectionId, title, summary, difficulty, category, estimated hours, prerequisites, resources, keywords
- **projects**: Practice projects with id, title, description, prerequisites, checklist, scope

## Customization

### Adding New Items
Edit `data/roadmap.godot-2026.json` to add new roadmap items or projects.

### Styling
Modify `app/globals.css` and Tailwind classes in components to customize the appearance.

### State Management
State is managed in `lib/store/RoadmapContext.tsx`. Modify this file to add new state or actions.

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.
