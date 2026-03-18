import { useState, useCallback, useEffect } from 'react';
import BootScreen from './components/BootScreen';
import LoginScreen from './components/LoginScreen';
import Desktop from './components/Desktop';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('boot');
  const [user, setUser] = useState(null);

  const goToLogin = useCallback(() => {
    setCurrentScreen('login');
  }, []);

  const goToDesktop = useCallback((username) => {
    setUser(username);
    setCurrentScreen('desktop');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    if (token && storedUser) {
      setUser(storedUser);
      setCurrentScreen('desktop');
    } else {
      // If no token, ensure we go to login after boot, not desktop
      // This handles cases where a token might have been cleared externally
      // or if it's the first visit.
      // However, the BootScreen already calls goToLogin, so this might be redundant
      // unless we want to skip boot screen if no token.
      // For now, let's keep the existing flow where BootScreen leads to LoginScreen.
    }
  }, []);

  return (
    <div className="w-full h-full">
      {currentScreen === 'boot' && <BootScreen onFinish={goToLogin} />}
      {currentScreen === 'login' && <LoginScreen onLogin={goToDesktop} />}
      {currentScreen === 'desktop' && <Desktop user={user} />}
    </div>
  );
}

export default App;
