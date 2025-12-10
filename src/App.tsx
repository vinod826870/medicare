import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider as MiaodaAuthProvider } from 'miaoda-auth-react';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { supabase } from '@/db/supabase';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import routes from './routes';

const App = () => {
  return (
    <Router>
      <MiaodaAuthProvider client={supabase}>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </MiaodaAuthProvider>
    </Router>
  );
};

export default App;
