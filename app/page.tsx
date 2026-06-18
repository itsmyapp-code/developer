'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LogOut, Wifi, WifiOff } from 'lucide-react';
import { useVaultSession } from '@/lib/vaultSession';
import { useVaultStorage } from '@/hooks/useVaultStorage';
import ModeSelector from '@/components/vault/ModeSelector';
import AssetInventory from '@/components/vault/AssetInventory';
import ChaosBuffer from '@/components/vault/ChaosBuffer';
import BlueprintTerminal from '@/components/vault/BlueprintTerminal';
import VaultDropBox from '@/components/vault/VaultDropBox';

export default function VaultDashboard() {
  const { user, isReady, signOut } = useVaultSession();
  const vault = useVaultStorage();
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport on mount + resize
  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Suppress render until auth is resolved
  if (!isReady) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-vault-bg)' }}
      >
        <div
          className="text-xs uppercase tracking-widest animate-pulse"
          style={{ color: 'var(--color-vault-accent)' }}
        >
          INITIALISING VAULT SESSION...
        </div>
      </div>
    );
  }

  // Mobile capture fallback
  if (isMobile) {
    return (
      <VaultDropBox
        onDeposit={(content, category) =>
          vault.addVaultDrop({ content, category })
        }
      />
    );
  }

  // ── Full desktop Bento Grid ──────────────────────────────────────────────
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        minWidth: '1280px',
        backgroundColor: 'var(--color-vault-bg)',
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-4 py-2"
        style={{
          borderBottom: '1px solid var(--color-vault-border)',
          backgroundColor: 'rgba(9,9,11,0.9)',
          height: '44px',
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/developer.png"
            alt="ITSMYAPP Developer"
            width={24}
            height={24}
            className="opacity-90"
          />
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: 'var(--color-vault-accent)' }}
          >
            ITSMYAPP VAULT
          </span>
          <span
            className="text-xs"
            style={{ color: 'var(--color-vault-dim)', fontSize: '9px' }}
          >
            developer.itsmyapp.co.uk
          </span>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4">
          {/* Loading indicator */}
          {vault.isLoading ? (
            <span
              className="flex items-center gap-1.5 text-xs animate-pulse"
              style={{ color: 'var(--color-vault-dim)', fontSize: '9px' }}
            >
              <WifiOff size={10} />
              SYNCING...
            </span>
          ) : (
            <span
              className="flex items-center gap-1.5 text-xs"
              style={{ color: 'var(--color-vault-accent)', fontSize: '9px' }}
            >
              <Wifi size={10} />
              FIRESTORE LIVE
            </span>
          )}

          {/* User email */}
          <span
            className="text-xs"
            style={{ color: 'var(--color-vault-dim)', fontSize: '9px' }}
          >
            {user?.email ?? 'UNKNOWN'}
          </span>

          {/* Sign out */}
          <button
            id="vault-signout-btn"
            onClick={signOut}
            title="Sign out"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors duration-150"
            style={{ color: 'var(--color-vault-dim)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-vault-accent)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-vault-dim)')
            }
          >
            <LogOut size={11} />
            EXIT
          </button>
        </div>
      </header>

      {/* ── Bento Grid ──────────────────────────────────────────────────── */}
      <main
        className="flex-1 grid overflow-hidden p-2 gap-2"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        {/* 01 — Top Left: Mode Selector */}
        <ModeSelector
          activeMode={vault.activeMode}
          projectCodename={vault.projectCodename}
          onModeChange={vault.setActiveMode}
          onCodenameChange={vault.setProjectCodename}
        />

        {/* 03 — Top Right: Chaos Buffer */}
        <ChaosBuffer
          value={vault.chaosBuffer}
          onChange={vault.setChaosBuffer}
        />

        {/* 02 — Bottom Left: Asset Inventory */}
        <AssetInventory
          selectedAssets={vault.selectedAssets}
          onToggle={vault.toggleAsset}
        />

        {/* 04 — Bottom Right: Blueprint Terminal */}
        <BlueprintTerminal
          state={{
            activeMode:     vault.activeMode,
            projectCodename: vault.projectCodename,
            selectedAssets: vault.selectedAssets,
            chaosBuffer:    vault.chaosBuffer,
            vaultDrops:     vault.vaultDrops,
          }}
        />
      </main>

      {/* ── Bottom status bar ───────────────────────────────────────────── */}
      <footer
        className="shrink-0 flex items-center justify-between px-4"
        style={{
          borderTop: '1px solid var(--color-vault-border)',
          backgroundColor: 'rgba(9,9,11,0.9)',
          height: '24px',
        }}
      >
        <span
          className="text-xs"
          style={{ color: 'var(--color-vault-dim)', fontSize: '9px' }}
        >
          UK GDPR · ZERO-COOKIE · ZERO-SERVER · FIRESTORE OFFLINE-FIRST
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--color-vault-dim)', fontSize: '9px' }}
        >
          {`MODE=${vault.activeMode.toUpperCase()} · ASSETS=${vault.selectedAssets.length} · itsmyapp.co.uk`}
        </span>
      </footer>
    </div>
  );
}
