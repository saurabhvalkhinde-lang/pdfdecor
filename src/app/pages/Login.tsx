import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Crown, Sparkles, LogIn, UserPlus, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'signup';

export function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]         = useState<Mode>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  /* auto-fill demo credentials */
  const fillDemo = (type: 'admin' | 'user') => {
    setMode('login');
    setError('');
    if (type === 'admin') { setEmail('admin@pdfdecor.in'); setPassword('Admin@123'); }
    else                  { setEmail('user@pdfdecor.in');  setPassword('User@123');  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          /* admins go straight to /admin/dashboard */
          navigate(res.isAdmin ? '/admin/dashboard' : '/', { replace: true });
        } else {
          setError(res.error || 'Login failed.');
        }
      } else {
        const res = await signup(email, password, name);
        if (res.success) navigate('/pricing');
        else setError(res.error || 'Signup failed.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">PDFDecor</span>
          </Link>
          <p className="text-gray-500 text-sm">Professional PDF generation for everyone</p>
        </div>

        {/* ── Demo credentials box ── */}
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-[11px] font-bold text-blue-800 mb-2.5 uppercase tracking-wider">🔑 Demo Accounts — click to fill</p>
          <div className="grid grid-cols-2 gap-2">

            {/* Admin card */}
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="flex items-start gap-2 bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-left hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-blue-700">Admin</div>
                <div className="text-[10px] text-gray-600 font-mono">admin@pdfdecor.in</div>
                <div className="text-[10px] text-gray-500 font-mono">Admin@123</div>
                <div className="text-[10px] text-purple-600 font-semibold mt-0.5">→ Admin Dashboard</div>
              </div>
            </button>

            {/* User card */}
            <button
              type="button"
              onClick={() => fillDemo('user')}
              className="flex items-start gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-left hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <UserPlus className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-gray-700">User</div>
                <div className="text-[10px] text-gray-600 font-mono">user@pdfdecor.in</div>
                <div className="text-[10px] text-gray-500 font-mono">User@123</div>
                <div className="text-[10px] text-green-600 font-semibold mt-0.5">→ Home Page</div>
              </div>
            </button>
          </div>
        </div>

        {/* ── Login / Signup card ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {(['login', 'signup'] as Mode[]).map(m => (
              <button key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  mode === m ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {m === 'login' ? <><LogIn className="h-4 w-4" /> Sign In</> : <><UserPlus className="h-4 w-4" /> Create Account</>}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {mode === 'login' ? 'Sign in to access your account' : 'Join thousands of professionals using PDFDecor'}
              </p>
            </div>

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Your Name" value={name}
                  onChange={e => setName(e.target.value)} className="h-11" />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email" className="h-11" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Enter password'}
                  value={password} onChange={e => setPassword(e.target.value)} required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="h-11 pr-10" />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            {mode === 'signup' && (
              <p className="text-xs text-gray-400 text-center leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
                <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
              </p>
            )}
          </form>

          {/* Pro upsell */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white text-center">
            <div className="flex items-center justify-center gap-2 font-semibold text-sm">
              <Crown className="h-4 w-4 text-yellow-300" />
              Pro Plan — ₹249/month · No watermarks · All templates · Ad-free
            </div>
            <Link to="/pricing" className="text-xs text-blue-100 underline mt-1 inline-block hover:text-white">
              See all Pro features →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Free plan is always available — no credit card required
        </p>
      </div>
    </div>
  );
}
