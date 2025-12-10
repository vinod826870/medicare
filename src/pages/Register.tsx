import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPanel } from 'miaoda-auth-react';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Pill className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">MediCare</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Sign up to start shopping for your healthcare needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginPanel
              title="Sign Up"
              loginType="password"
              onLoginSuccess={async () => { navigate('/'); }}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
