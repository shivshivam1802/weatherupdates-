import Header from '../components/Header';
import WeatherDashboard from '../components/WeatherDashboard';

export default function Home() {
  return (
    <main className="min-h-screen w-full relative pb-12">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[120px] mix-blend-screen" />
      </div>
      
      <Header />
      
      <div className="px-4 md:px-8 mt-6 pb-12">
        <WeatherDashboard />
      </div>

      <footer className="w-full py-6 mt-auto text-center border-t border-white/10 mt-12">
        <p className="text-white/60 font-medium">
          &copy; {new Date().getFullYear()} <span className="text-white/90 font-bold">weatherupdates</span>. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
