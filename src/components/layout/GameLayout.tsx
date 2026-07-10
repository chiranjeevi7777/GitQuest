import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { WorldMapView } from '../views/WorldMapView';
import { MissionView } from '../views/MissionView';
import { AchievementsView } from '../views/AchievementsView';
import { SettingsView } from '../views/SettingsView';
import { NotificationStack } from '../ui/NotificationStack';

export function GameLayout() {
  const currentView = useGameStore(s => s.currentView);

  return (
    <div className="flex w-screen h-screen bg-void overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <AnimatePresence mode="wait">
            {currentView === 'world-map' && <WorldMapView key="world-map" />}
            {currentView === 'mission' && <MissionView key="mission" />}
            {currentView === 'achievements' && <AchievementsView key="achievements" />}
            {currentView === 'settings' && <SettingsView key="settings" />}
          </AnimatePresence>
        </main>
      </div>
      <NotificationStack />
    </div>
  );
}
