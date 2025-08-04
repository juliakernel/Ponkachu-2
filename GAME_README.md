# 🎮 Pikachu Connect Game

A fun and engaging Pokemon-themed matching game built with Next.js, featuring smooth animations and responsive design.

## ✨ Game Features

### Core Gameplay

- **Grid-based matching**: 6x10 tile grid with Pokemon-themed characters
- **Path-finding logic**: Connect matching tiles with max 3 line segments
- **Smooth animations**: Powered by Framer Motion for delightful interactions
- **Timer system**: 5-minute countdown with visual feedback
- **Scoring system**: Points awarded for successful matches

### Game Controls

- **🎮 New Game**: Start fresh with a new board layout
- **⏸️ Pause/Resume**: Pause the timer and game state
- **🔄 Shuffle**: Reorganize tiles when no moves available
- **💡 Hint**: Get suggestions for possible matches
- **📊 Stats**: Real-time progress tracking

### Pokemon Types

The game features 8 different Pokemon types:

- ⚡ **Electric** (Yellow) - Pikachu style
- 🔥 **Fire** (Red) - Charmander style
- 💧 **Water** (Blue) - Squirtle style
- 🌿 **Grass** (Green) - Bulbasaur style
- 🌟 **Psychic** (Purple) - Alakazam style
- 👻 **Ghost** (Gray) - Gengar style
- ❄️ **Ice** (Cyan) - Articuno style
- 🐉 **Dragon** (Indigo) - Dragonite style

## 🚀 Technology Stack

### Frontend Framework

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React 19** for component architecture

### Styling & Animation

- **Tailwind CSS** for responsive design
- **Framer Motion** for smooth animations
- **Custom CSS** for Pokemon-themed aesthetics

### State Management

- **Zustand** for global game state
- Clean and simple state architecture
- Persistent game session

### Game Logic

- **Custom path-finding algorithm** for tile connections
- **Shuffle utilities** with valid move detection
- **Timer system** with pause/resume functionality
- **Score calculation** with achievement tracking

## 📁 Project Structure

```
/src
  /app
    page.tsx              # Main game interface
    layout.tsx            # App layout
    globals.css           # Global styles

  /components
    GameBoard.tsx         # Main game grid component
    Tile.tsx              # Individual tile component
    Timer.tsx             # Game timer display
    Score.tsx             # Score and statistics

  /store
    gameState.ts          # Zustand store for game state

  /utils
    pathCheck.ts          # Path-finding logic
    shuffle.ts            # Board shuffling utilities

/public
  /images
    pokemon-icons.json    # Pokemon type definitions
```

## 🎯 Game Rules

### How to Play

1. **Select two matching tiles** by clicking on them
2. **Tiles must be connected** by a path with maximum 3 line segments
3. **Clear all tiles** before the timer runs out
4. **Use shuffle** when no valid moves are available
5. **Request hints** if you're stuck

### Path Connection Rules

- **Direct line**: Horizontal or vertical straight line
- **One turn**: L-shaped path with one corner
- **Two turns**: Path with maximum two corners
- **No obstacles**: Path cannot pass through other tiles

### Scoring System

- **+100 points** per successful match
- **Shuffle penalty**: -10% of current score
- **Time bonus**: Extra points for quick completion
- **Achievement rewards**: Bonus points at score milestones

## 📱 Responsive Design

### Mobile Optimization

- **Touch-friendly** tile sizes (48px on mobile, 64px on desktop)
- **Responsive grid** layout adapts to screen size
- **Mobile-first** design approach
- **Optimized animations** for touch devices

### Breakpoints

- **Small**: `sm:` 640px+ (Mobile landscape)
- **Medium**: `md:` 768px+ (Tablet)
- **Large**: `lg:` 1024px+ (Desktop)
- **Extra Large**: `xl:` 1280px+ (Large desktop)

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🎨 Customization Options

### Adding New Pokemon Types

1. Update `POKEMON_EMOJIS` array in `Tile.tsx`
2. Add corresponding colors in `POKEMON_COLORS`
3. Update type names in `POKEMON_NAMES`
4. Modify `generateRandomType()` in `gameState.ts`

### Adjusting Game Difficulty

- **Board size**: Modify `initializeBoard(width, height)` parameters
- **Timer duration**: Change `timeLeft: 300` in gameState.ts
- **Scoring**: Adjust point values in `removeTiles()` function

### Customizing Animations

- **Tile animations**: Modify Framer Motion props in `Tile.tsx`
- **Board animations**: Update `GameBoard.tsx` animation configs
- **UI transitions**: Customize page-level animations in `page.tsx`

## 🐛 Troubleshooting

### Common Issues

- **Slow performance**: Reduce board size or disable some animations
- **Path detection errors**: Check `pathCheck.ts` logic for edge cases
- **Mobile responsiveness**: Verify Tailwind breakpoints
- **State persistence**: Clear browser storage if state gets corrupted

### Debug Features

- **Console logging**: Enable in development for game state tracking
- **Visual path highlighting**: Available for debugging connections
- **Performance monitoring**: Built-in animation performance tracking

## 🎉 Future Enhancements

### Potential Features

- **🔊 Sound effects**: Add audio feedback for matches and actions
- **🏆 Leaderboards**: Track high scores and completion times
- **🎭 Themes**: Multiple visual themes (seasonal, regional)
- **🎮 Game modes**: Endless mode, timed challenges, puzzle mode
- **👥 Multiplayer**: Competitive or cooperative play
- **📱 PWA**: Progressive Web App for offline play

### Technical Improvements

- **🔄 Auto-save**: Persistent game state across sessions
- **⚡ Performance**: Canvas rendering for better performance
- **🎨 Graphics**: Replace emojis with actual Pokemon sprites
- **🌐 Accessibility**: Enhanced keyboard navigation and screen reader support

---

Built with ❤️ using modern web technologies. Enjoy playing Pikachu Connect! ⚡🎮
