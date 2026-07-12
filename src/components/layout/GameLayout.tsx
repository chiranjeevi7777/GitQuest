import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { NotificationStack } from '../ui/NotificationStack';
import { ErrorBoundary } from '../common/ErrorBoundary';

export function GameLayout() {

  return (
    <div className="flex w-screen h-screen bg-parchment overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <ErrorBoundary>
            <div className="h-full w-full relative z-10">
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>
      </div>
      <NotificationStack />
    </div>
  );
}
