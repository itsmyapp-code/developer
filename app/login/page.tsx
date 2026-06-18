'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useVaultSession } from '@/lib/vaultSession';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogIn, AlertTriangle, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const dynamic = 'force-static';

export default function LoginPage() {
  const { signIn } = useVaultSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err
          ? String((err as { code: unknown }).code)
          : '';

      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        setError('Invalid credentials. Check email and password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Account temporarily locked.');
      } else {
        setError('Authentication failure. Check console for details.');
        console.error('[VAULT] Sign-in error:', err);
      }
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
      {/* Background grid lines */}
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
        {/* Header */}
        <div
          className="vault-panel-header justify-center flex-col items-center gap-4 py-8"
          style={{ borderBottomColor: 'var(--color-vault-border)' }}
        >
          <Image
            src="/developer.png"
            alt="ITSMYAPP Developer"
            width={80}
            height={80}
            priority
            className="opacity-90"
          />
          <div className="text-center">
            <p className="vault-panel-label" style={{ fontSize: '16px', letterSpacing: '0.15em' }}>
              ITSMYAPP VAULT
            </p>
            <p
              className="vault-panel-index mt-1"
              style={{ color: 'var(--color-vault-dim)', fontSize: '12px' }}
            >
              developer.itsmyapp.co.uk · AUTHENTICATE TO PROCEED
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Error state */}
          {error && (
            <div
              className="flex items-start gap-2 p-3"
              style={{
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: '#f87171' }}
              />
              <p
                className="leading-relaxed"
                style={{ color: '#f87171', fontSize: '13px' }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Reset sent confirmation */}
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
                Reset email sent. Check your inbox.
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
              placeholder="operator@itsmyapp.co.uk"
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
              Passphrase
            </label>
            <div className="relative">
              <input
                id="vault-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="vault-input"
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                id="vault-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-0 top-0 h-full flex items-center justify-center transition-colors duration-150"
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

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                id="vault-forgot-password"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="transition-colors duration-150"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: resetLoading ? 'wait' : 'pointer',
                  color: 'var(--color-vault-dim)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.05em',
                  padding: '2px 0',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
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
          </div>

          {/* Submit */}
          <button
            id="vault-login-submit"
            type="submit"
            disabled={loading}
            className="vault-btn-extract flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                VERIFYING IDENTITY...
              </>
            ) : (
              <>
                <LogIn size={15} />
                [ AUTHENTICATE ]
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="vault-telemetry text-center">
          UK GDPR · ZERO-COOKIE · PRIVATE DEVELOPER TOOL · itsmyapp.co.uk
        </div>
      </div>
    </div>
  );
}
