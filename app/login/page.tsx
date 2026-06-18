'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useVaultSession } from '@/lib/vaultSession';
import {
  LogIn,
  UserPlus,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';

export const dynamic = 'force-static';

type Mode = 'signin' | 'register';

export default function LoginPage() {
  const { signIn } = useVaultSession();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setResetSent(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        // Firebase auto-signs in after creation — vaultSession will redirect
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: unknown }).code)
          : '';

      const messages: Record<string, string> = {
        'auth/email-already-in-use':   'An account with this email already exists. Sign in instead.',
        'auth/user-not-found':         'No account found. Create one below.',
        'auth/wrong-password':         'Incorrect password.',
        'auth/invalid-credential':     'Invalid credentials. Check email and password.',
        'auth/too-many-requests':      'Too many attempts — account temporarily locked.',
        'auth/weak-password':          'Password is too weak. Use at least 8 characters.',
        'auth/invalid-email':          'Invalid email address.',
      };

      setError(messages[code] ?? 'Something went wrong. Check console for details.');
      console.error('[VAULT] Auth error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email address above first.');
      return;
    }
    setResetLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (err: unknown) {
      setError('Could not send reset email. Check the address is correct.');
      console.error('[VAULT] Password reset error:', err);
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: 'var(--color-vault-bg)' }}
    >
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(39,39,42,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(39,39,42,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className="relative w-full max-w-md vault-panel"
        style={{ border: '1px solid var(--color-vault-accent)' }}
      >
        {/* Brand header */}
        <div
          className="vault-panel-header justify-center flex-col items-center gap-4 py-8"
          style={{ borderBottomColor: 'var(--color-vault-border)' }}
        >
          <Image
            src="/developer.png"
            alt="ITSMYAPP Developer"
            width={120}
            height={120}
            priority
            className="opacity-95"
          />
          <div className="text-center">
            <p
              className="vault-panel-label"
              style={{ fontSize: '16px', letterSpacing: '0.15em' }}
            >
              ITSMYAPP VAULT
            </p>
            <p
              className="vault-panel-index mt-1"
              style={{ color: 'var(--color-vault-dim)', fontSize: '12px' }}
            >
              developer.itsmyapp.co.uk
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div
          className="flex"
          style={{ borderBottom: '1px solid var(--color-vault-border)' }}
        >
          {(['signin', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              id={`vault-mode-${m}`}
              onClick={() => switchMode(m)}
              className="flex-1 py-3 text-center transition-all duration-150"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                borderBottom: mode === m
                  ? '2px solid var(--color-vault-accent)'
                  : '2px solid transparent',
                background: mode === m ? 'rgba(163,230,53,0.05)' : 'transparent',
                color: mode === m
                  ? 'var(--color-vault-accent)'
                  : 'var(--color-vault-dim)',
                cursor: 'pointer',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2 p-3"
              style={{
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: '#f87171' }} />
              <p style={{ color: '#f87171', fontSize: '13px', lineHeight: '1.5' }}>
                {error}
              </p>
            </div>
          )}

          {/* Reset sent */}
          {resetSent && (
            <div
              className="flex items-start gap-2 p-3"
              style={{
                backgroundColor: 'rgba(163,230,53,0.08)',
                border: '1px solid rgba(163,230,53,0.3)',
              }}
            >
              <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--color-vault-accent)' }} />
              <p style={{ color: 'var(--color-vault-accent)', fontSize: '13px' }}>
                Reset email sent — check your inbox.
              </p>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="vault-email"
              className="vault-panel-index uppercase"
              style={{ fontSize: '12px' }}
            >
              Email Address
            </label>
            <input
              id="vault-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@itsmyapp.co.uk"
              className="vault-input"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="vault-password"
              className="vault-panel-index uppercase"
              style={{ fontSize: '12px' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="vault-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Min. 8 characters' : '••••••••••••'}
                className="vault-input"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                id="vault-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-0 top-0 h-full flex items-center justify-center"
                style={{
                  width: '42px',
                  color: showPassword ? 'var(--color-vault-accent)' : 'var(--color-vault-muted)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Forgot password — only in sign in mode */}
            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  id="vault-forgot-password"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: resetLoading ? 'wait' : 'pointer',
                    color: 'var(--color-vault-dim)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    padding: '2px 0',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      'var(--color-vault-accent)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      'var(--color-vault-dim)')
                  }
                >
                  {resetLoading ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
            )}
          </div>

          {/* Confirm password — register only */}
          {mode === 'register' && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vault-confirm-password"
                className="vault-panel-index uppercase"
                style={{ fontSize: '12px' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="vault-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="vault-input"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  id="vault-confirm-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '100%',
                    width: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: showConfirm ? 'var(--color-vault-accent)' : 'var(--color-vault-muted)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            id="vault-auth-submit"
            type="submit"
            disabled={loading}
            className="vault-btn-extract flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                {mode === 'register' ? 'CREATING ACCOUNT...' : 'VERIFYING...'}
              </>
            ) : mode === 'register' ? (
              <>
                <UserPlus size={15} />
                [ CREATE ACCOUNT ]
              </>
            ) : (
              <>
                <LogIn size={15} />
                [ SIGN IN ]
              </>
            )}
          </button>
        </form>

        <div className="vault-telemetry text-center">
          UK GDPR · ZERO-COOKIE · PRIVATE DEVELOPER TOOL · itsmyapp.co.uk
        </div>
      </div>
    </div>
  );
}
