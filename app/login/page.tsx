'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useVaultSession } from '@/lib/vaultSession';
import { LogIn, AlertTriangle, Loader2 } from 'lucide-react';

export const dynamic = 'force-static';

export default function LoginPage() {
  const { signIn } = useVaultSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
            <p className="vault-panel-label text-sm tracking-widest">
              ITSMYAPP VAULT
            </p>
            <p
              className="vault-panel-index mt-1"
              style={{ color: 'var(--color-vault-dim)' }}
            >
              developer.itsmyapp.co.uk // AUTHENTICATE TO PROCEED
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
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
                size={14}
                className="mt-0.5 shrink-0"
                style={{ color: '#f87171' }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#f87171' }}
              >
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label
              htmlFor="vault-email"
              className="vault-panel-index uppercase"
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

          <div className="flex flex-col gap-1">
            <label
              htmlFor="vault-password"
              className="vault-panel-index uppercase"
            >
              Passphrase
            </label>
            <input
              id="vault-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="vault-input"
            />
          </div>

          <button
            id="vault-login-submit"
            type="submit"
            disabled={loading}
            className="vault-btn-extract flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                VERIFYING IDENTITY...
              </>
            ) : (
              <>
                <LogIn size={14} />
                [ AUTHENTICATE ]
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="vault-telemetry text-center">
          UK GDPR // ZERO-COOKIE // PRIVATE DEVELOPER TOOL // itsmyapp.co.uk
        </div>
      </div>
    </div>
  );
}
