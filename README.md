# 🎮 GitQuest

> **Learn Git & GitHub Through Cyberpunk Adventure**

GitQuest is an immersive, retro-futuristic web application designed to teach version control concepts through interactive puzzle-solving. Instead of dry documentation or static quizzes, players are cast as developers in a cyberpunk world, solving real-world file conflicts, repository issues, and branching scenarios by typing actual Git commands directly into an in-game terminal.

---

## ✨ Features

- **Interactive Git Terminal**: Custom terminal rendering with syntax coloring, command history navigation, and prompt states.
- **State-Based Validation**: Missions validate progress by checking the actual simulated git repository state (commits, file structures, branches) rather than checking command input strings.
- **Dynamic Git Graph**: Visual commit graph panel displaying real-time branch tracks, commit nodes, and merge indicators.
- **Narrative & NPC Dialogues**: Interact with distinct characters in a cyberpunk storyline through animated chat bubbles with typewriter effects.
- **RPG Progression & Achievements**: Level up from an **Apprentice** to a **Legend**, gain XP, and unlock 12 achievements across 4 rarity tiers.
- **Cyberpunk UI**: Glassmorphic styling, neon glows, custom scanlines, and fluid framer-motion micro-animations.

---

## 🗺️ The World Map & Missions

Learn through 6 progressively challenging worlds:
1. **🏘️ Repository Village**: Master the basics (`init`, `status`, `add`, `commit`).
2. **🌲 Branch Forest**: Learn parallel development timelines (`branch`, `checkout`, `merge`).
3. **🏔️ Merge Mountains**: Conquer merge conflicts and manually resolve differences.
4. **🏰 Remote Kingdom**: Connect with remote hosts and publish your work (`remote add`).
5. **🏙️ Open Source City**: Clone public codebases, create forks, and collaborate.
6. **⛩️ Git Master Temple**: Harness advanced techniques (`stash`, `stash pop`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 8, TailwindCSS v4, Zustand, Framer Motion
- **Icons**: Lucide React
- **Local Indexing & Code Intelligence**: Serena

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chiranjeevi7777/GitQuest.git
   cd GitQuest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the game in your browser:
   ```
   http://localhost:5173/
   ```

---

## 🗺️ Project Structure

```
src/
├── types/             # Core type definitions
├── data/              # NPC, Achievement, and World game content
├── engine/            # Client-side Git command simulation engine
├── stores/            # Persistent Zustand progress store
├── components/        # Game components (Terminal, Graph, Dialogues, Map)
└── index.css          # Cyberpunk design system variables and keyframes
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new worlds, NPC interactions, or advanced git mechanics, feel free to open an issue or submit a pull request.
