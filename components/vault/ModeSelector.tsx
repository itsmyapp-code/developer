'use client';

import { Terminal } from 'lucide-react';
import type { VaultMode } from '@/hooks/useVaultStorage';

interface ModeSelectorProps {
  activeMode: VaultMode;
  projectCodename: string;
  onModeChange: (mode: VaultMode) => void;
  onCodenameChange: (name: string) => void;
}

const MODES: { id: VaultMode; label: string; desc: string }[] = [
  { id: 'build',    label: 'BUILD APPS',  desc: 'Production build mode' },
  { id: 'research', label: 'RESEARCH',    desc: 'Analysis & research mode' },
  { id: 'report',   label: 'REPORTS',     desc: 'Formal report mode' },
];

export default function ModeSelector({
  activeMode,
  projectCodename,
  onModeChange,
  onCodenameChange,
}: ModeSelectorProps) {
  return (
    <div className="vault-panel h-full flex flex-col">
      {/* Header */}
      <div className="vault-panel-header">
        <Terminal size={12} style={{ color: 'var(--color-vault-accent)' }} />
        <span className="vault-panel-label">01. OPERATIONAL TARGET</span>
        <span className="vault-panel-index ml-auto">MODE_SELECTOR</span>
      </div>

      {/* Mode Toggles */}
      <div className="p-4 flex flex-col gap-2">
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: 'var(--color-vault-dim)' }}
        >
          Select Operating Mode
        </p>
        <div className="flex gap-2">
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              id={`vault-mode-${id}`}
              onClick={() => onModeChange(id)}
              className={`vault-btn flex-1 ${activeMode === id ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Active mode descriptor */}
        <p
          className="text-xs mt-1 leading-relaxed"
          style={{ color: 'var(--color-vault-dim)' }}
        >
          {'>'}{' '}
          {MODES.find((m) => m.id === activeMode)?.desc}
        </p>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--color-vault-border)' }} />

      {/* Project Codename */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <label
          htmlFor="vault-codename"
          className="text-xs uppercase tracking-widest"
          style={{ color: 'var(--color-vault-dim)' }}
        >
          Project Codename
        </label>
        <input
          id="vault-codename"
          type="text"
          value={projectCodename}
          onChange={(e) => onCodenameChange(e.target.value)}
          placeholder="e.g. VAULT_CORE / PAT_V2 / ALPHA"
          className="vault-input"
          maxLength={64}
          autoComplete="off"
          spellCheck={false}
        />
        {projectCodename.trim() && (
          <p
            className="text-xs"
            style={{ color: 'var(--color-vault-accent)' }}
          >
            ⚡ {projectCodename.trim().toUpperCase()}
          </p>
        )}
      </div>

      {/* Footer telemetry */}
      <div className="vault-telemetry">
        {`ACTIVE_MODE=${activeMode.toUpperCase()} · CODENAME=${projectCodename.trim().toUpperCase() || 'NULL'}`}
      </div>
    </div>
  );
}
