import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();
  const refId = searchParams.get('ref');
  
  const [isSignUp, setIsSignUp] = useState(!!refId); // default to sign up if ref exists
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setSubmitting(false);
          return;
        }
        const { data: signUpData, error: signUpError } = await signUp(email, password, fullName.trim(), refId);
        if (signUpError) {
          if (signUpError.message?.toLowerCase().includes('already registered')) {
            setError('This email is already registered. Try signing in instead.');
            toast.error('Email already registered. Try signing in.');
          } else {
            setError(signUpError.message);
            toast.error(signUpError.message);
          }
        } else {
          // ─── Increment the referrer's recruit count in GHL ───
          if (refId) {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.access_token) {
                const res = await supabase.functions.invoke('ghl-recruit-increment', {
                  body: { referrerId: refId, newUserEmail: email },
                });
                if (res.error) {
                  console.warn('Could not increment referrer recruits:', res.error);
                } else {
                  console.log('Referrer recruit count incremented successfully.');
                }
              }
            } catch (refErr) {
              console.warn('Referral increment failed (non-blocking):', refErr);
            }
          }

          // Check if user was auto-confirmed (no email confirmation required)
          if (signUpData?.user && !signUpData.user.email_confirmed_at && signUpData.user.confirmation_sent_at) {
            setSuccess('Account created! Check your email to confirm, then sign in.');
            toast.success('Account created! Check your email to confirm.');
            setIsSignUp(false);
            setPassword('');
          } else {
            // Auto-confirmed — try to sign them in immediately
            toast.success('Account created successfully!');
            const { error: autoSignInError } = await signIn(email, password);
            if (autoSignInError) {
              setSuccess('Account created! You can now sign in.');
              setIsSignUp(false);
              setPassword('');
            }
          }
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          if (signInError.message?.toLowerCase().includes('email not confirmed')) {
            setError('Your email is not confirmed yet. Please check your inbox for a confirmation link, or contact your admin.');
            toast.error('Email not confirmed. Check your inbox.');
          } else if (signInError.message?.includes('Invalid login')) {
            setError('Invalid email or password. Please try again.');
            toast.error('Invalid email or password.');
          } else {
            setError(signInError.message);
            toast.error(signInError.message);
          }
        } else {
          toast.success('Welcome back! Syncing your data...');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      if (googleError.message?.includes('provider')) {
        setError('Google sign-in is not enabled yet. Please use email & password.');
      } else {
        setError(googleError.message);
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0d14", color: "#e8e4dc",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: "#111520", border: "1px solid #1e2333", borderRadius: 16,
        padding: "48px 40px", maxWidth: 460, width: "100%", textAlign: "center",
        boxShadow: "0 16px 64px rgba(0,0,0,0.5)", margin: "0 24px"
      }}>
        {/* Logo */}
        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #C8A96E, #E8845C)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, margin: "0 auto 24px" }}>R</div>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: "#e8e4dc" }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
          {isSignUp ? 'Join the RFL Ambassador Program' : 'Sign in to your Ambassador Portal'}
        </p>

        {/* Error / Success Messages */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#E8845C15", border: "1px solid #E8845C30", borderRadius: 8, padding: "12px 16px", marginBottom: 20, textAlign: "left" }}>
            <AlertCircle size={16} color="#E8845C" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#E8845C" }}>{error}</span>
          </div>
        )}
        {success && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#7EC8A415", border: "1px solid #7EC8A430", borderRadius: 8, padding: "12px 16px", marginBottom: 20, textAlign: "left" }}>
            <AlertCircle size={16} color="#7EC8A4" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#7EC8A4" }}>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {isSignUp && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  style={{ width: "100%", background: "#0a0d14", border: "1px solid #1e2333", padding: "12px 16px 12px 40px", borderRadius: 8, color: "#e8e4dc", outline: "none", fontSize: 14, transition: "border-color .2s" }}
                />
              </div>
            </div>
          )}
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: "100%", background: "#0a0d14", border: "1px solid #1e2333", padding: "12px 16px 12px 40px", borderRadius: 8, color: "#e8e4dc", outline: "none", fontSize: 14, transition: "border-color .2s" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: "#a0a8b8", marginBottom: 8, fontWeight: 500 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#4b5563" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isSignUp ? "Min 6 characters" : "Your password"}
                required
                minLength={6}
                style={{ width: "100%", background: "#0a0d14", border: "1px solid #1e2333", padding: "12px 40px", borderRadius: 8, color: "#e8e4dc", outline: "none", fontSize: 14, transition: "border-color .2s" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                {showPassword ? <EyeOff size={16} color="#4b5563" /> : <Eye size={16} color="#4b5563" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%", background: "linear-gradient(135deg, #C8A96E, #E8845C)", color: "#0a0d14", border: "none",
              borderRadius: 8, padding: "14px 24px", fontSize: 15, fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, transition: "opacity 0.2s", opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? (
              <span>Please wait...</span>
            ) : isSignUp ? (
              <><UserPlus size={18} /> Create Account</>
            ) : (
              <><LogIn size={18} /> Sign In</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#1e2333" }} />
          <span style={{ fontSize: 12, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".08em" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#1e2333" }} />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            width: "100%", background: "#161b26", color: "#a0a8b8", border: "1px solid #1e2333",
            borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8A96E50"; e.currentTarget.style.color = "#e8e4dc"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2333"; e.currentTarget.style.color = "#a0a8b8"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Toggle Sign In / Sign Up */}
        <div style={{ marginTop: 24, fontSize: 14, color: "#6b7280" }}>
          {isSignUp ? (
            <>Already have an account?{' '}
              <button onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }}
                style={{ background: "none", border: "none", color: "#C8A96E", cursor: "pointer", fontSize: 14, fontWeight: 600, textDecoration: "underline" }}>
                Sign In
              </button>
            </>
          ) : (
            <>Don't have an account?{' '}
              <button onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }}
                style={{ background: "none", border: "none", color: "#C8A96E", cursor: "pointer", fontSize: 14, fontWeight: 600, textDecoration: "underline" }}>
                Create Account
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: 20, fontSize: 11, color: "#4b5563" }}>
          By signing in, you agree to the RFL Ambassador Terms of Service.
        </div>
      </div>
    </div>
  );
}
