import { Resume } from '@/components/resume';
import { MainNav } from '@/components/navigation/main-nav';

export default function Home() {
  return (
    <div className="min-h-screen bg-background print:bg-white">
      <MainNav />
      <Resume />
    </div>
  );
}