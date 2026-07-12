import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameLayout } from '@/components/layout/GameLayout';
import { WorldMapView } from '@/components/views/WorldMapView';
import { MissionView } from '@/components/views/MissionView';
import { AchievementsView } from '@/components/views/AchievementsView';
import { SettingsView } from '@/components/views/SettingsView';
import { CardsView } from '@/components/views/CardsView';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<GameLayout />}>
          <Route path="/" element={<WorldMapView />} />
          <Route path="/mission/:missionId" element={<MissionView />} />
          <Route path="/achievements" element={<AchievementsView />} />
          <Route path="/cards" element={<CardsView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
