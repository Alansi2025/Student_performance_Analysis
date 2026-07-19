import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NeuralAdvantage from './components/NeuralAdvantage';
import CoreCapabilities from './components/CoreCapabilities';
import Ecosystem from './components/Ecosystem';
import IntegrationSafety from './components/IntegrationSafety';
import MeasurableEvolution from './components/MeasurableEvolution';
import Footer from './components/Footer';
import LiveSessions from './components/LiveSessions';
import MentorsList from './components/MentorsList';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import MentorDashboard from './components/MentorDashboard';
import OverseerDashboard from './components/OverseerDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Curriculum');
  const [isInitializing, setIsInitializing] = useState(true);

  // Check backend session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          setIsLoggedIn(true);
          setActiveTab('Dashboard');
        }
      } catch (err) {
        // Not logged in
      } finally {
        setIsInitializing(false);
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setActiveTab('Dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/users/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
    } catch (e) { }
    
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('Curriculum');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-brand-500/10 dark:selection:bg-brand-500/30 selection:text-brand-600 dark:selection:text-brand-450 transition-colors duration-300 overflow-x-hidden">
      {activeTab !== 'Login' && activeTab !== 'Dashboard' && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      
      <main className="flex-grow flex flex-col items-center justify-center">
        {activeTab === 'Dashboard' && isLoggedIn && (
          currentUser?.role === 'Overseer' ? (
            <OverseerDashboard user={currentUser} onLogout={handleLogout} />
          ) : (currentUser?.role === 'Mentor' || currentUser?.role === 'Teacher') ? (
            <MentorDashboard user={currentUser} onLogout={handleLogout} />
          ) : (
            <StudentDashboard user={currentUser} onLogout={handleLogout} />
          )
        )}
        {activeTab === 'Curriculum' && (
          <>
            <Hero />
            <NeuralAdvantage />
            <CoreCapabilities />
            <Ecosystem />
            <IntegrationSafety />
            <MeasurableEvolution />
          </>
        )}
        {activeTab === 'Live Sessions' && <LiveSessions />}
        {activeTab === 'Mentors' && <MentorsList />}
        {activeTab === 'Login' && (
          <LoginPage 
            onBackToHome={() => setActiveTab(isLoggedIn ? 'Dashboard' : 'Curriculum')} 
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </main>

      {activeTab !== 'Login' && activeTab !== 'Dashboard' && (
        <Footer 
          setActiveTab={setActiveTab} 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      
    </div>
  );
}

export default App;
