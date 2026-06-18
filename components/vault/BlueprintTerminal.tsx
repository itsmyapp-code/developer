'use client';

import { useRef, useEffect, useState } from 'react';
import { Cpu, Copy, Check } from 'lucide-react';
import { compileBlueprintFromState } from '@/lib/compileBlueprint';
import type { VaultState } from '@/hooks/useVaultStorage';

interface BlueprintTerminalProps {
  state: VaultState;
}

export default function BlueprintTerminal({ state }: BlueprintTerminalProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const blueprint = compileBlueprintFromState(state);

  // Auto-scroll to bottom whenever blueprint updates
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [blueprint]);

  async function handleExtract() {
    try {
      await navigator.clipboard.writeText(blueprint);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that block clipboard access
      const el = document.createElement('textarea');
      el.value = blueprint;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  }

  const lineCount = blueprint.split('\n').length;
  const charCount = blueprint.length;

  return (
    <div className="vault-panel h-full flex flex-col">
      {/* Header */}
      <div className="vault-panel-header">
        <Cpu size={12} style={{ color: 'var(--color-vault-accent)' }} />
        <span className="vault-panel-label">04. BLUEPRINT COMPILER</span>
        <span className="vault-panel-index ml-auto">
          {lineCount} LINES // {charCount.toLocaleString()} CHARS
        </span>
      </div>

      {/* Blueprint preview */}
      <pre
        ref={preRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          lineHeight: '1.8',
          color: 'var(--color-vault-dim)',
          padding: '12px 14px',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {blueprint.split('\n').map((line, i) => {
          // Highlight headings (lines starting with #) in accent colour
          const isHeading = line.startsWith('#');
          // Highlight dividers
          const isDivider = line.startsWith('━');
          // Highlight checked items
          const isChecked = line.includes('[✓]');

          return (
            <span
              key={i}
              style={{
                display: 'block',
                color: isHeading
                  ? 'var(--color-vault-accent)'
                  : isDivider
                    ? 'var(--color-vault-border)'
                    : isChecked
                      ? 'var(--color-vault-text)'
                      : undefined,
              }}
            >
              {line || '\u00A0'}
            </span>
          );
        })}
      </pre>

      {/* Extract button */}
      <div
        className="p-3"
        style={{ borderTop: '1px solid var(--color-vault-border)' }}
      >
        <button
          id="vault-extract-btn"
          onClick={handleExtract}
          className={`vault-btn-extract flex items-center justify-center gap-2 ${copied ? 'copied' : ''}`}
        >
          {copied ? (
            <>
              <Check size={13} />
              BLUEPRINT COPIED TO CLIPBOARD
            </>
          ) : (
            <>
              <Copy size={13} />
              ⚡ EXTRACT RAW COMPILED BLUEPRINT ⚡
            </>
          )}
        </button>
      </div>

      {/* Telemetry */}
      <div className="vault-telemetry">
        {copied
          ? 'CLIPBOARD_WRITE=SUCCESS // READY TO PASTE INTO AI WORKSPACE'
          : `COMPILE_STATUS=LIVE // MODE=${state.activeMode.toUpperCase()} // ASSETS=${state.selectedAssets.length}`}
      </div>
    </div>
  );
}
