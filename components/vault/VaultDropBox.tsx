'use client';

import { useState, type FormEvent } from 'react';
import { Inbox, Tag, Save } from 'lucide-react';
import type { VaultMode } from '@/hooks/useVaultStorage';

type DropCategory = VaultMode | 'unclassified';

const CATEGORIES: { id: DropCategory; label: string }[] = [
  { id: 'build',        label: 'BUILD' },
  { id: 'research',     label: 'RESEARCH' },
  { id: 'report',       label: 'REPORT' },
  { id: 'unclassified', label: 'UNSORTED' },
];

interface VaultDropBoxProps {
  onDeposit: (content: string, category: DropCategory) => void;
}

export default function VaultDropBox({ onDeposit }: VaultDropBoxProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DropCategory>('unclassified');
  const [deposited, setDeposited] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return;

    onDeposit(content.trim(), category);
    setContent('');
    setDeposited(true);
    setTimeout(() => setDeposited(false), 2500);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
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
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-sm vault-panel">
        {/* Header */}
        <div className="vault-panel-header flex-col items-start gap-1 py-4">
          <div className="flex items-center gap-2">
            <Inbox size={14} style={{ color: 'var(--color-vault-accent)' }} />
            <span className="vault-panel-label">THE VAULT DROP BOX</span>
          </div>
          <p
            className="text-xs"
            style={{ color: 'var(--color-vault-dim)', fontSize: '9px' }}
          >
            MOBILE CAPTURE MODE // DEPOSIT SCRAPS FOR DESKTOP REVIEW
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {/* Content textarea */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="vault-drop-content"
              className="vault-panel-index uppercase"
            >
              Scrap Content
            </label>
            <textarea
              id="vault-drop-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="// Dump your scrap here — AI fragments, equations, notes, URLs, anything..."
              rows={6}
              className="vault-input resize-none"
              style={{ lineHeight: '1.6' }}
              spellCheck={false}
              required
            />
          </div>

          {/* Category selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Tag size={10} style={{ color: 'var(--color-vault-dim)' }} />
              <span className="vault-panel-index uppercase">Category Tag</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  id={`vault-drop-cat-${id}`}
                  onClick={() => setCategory(id)}
                  className={`vault-btn text-center ${category === id ? 'active' : ''}`}
                  style={{ fontSize: '10px', padding: '6px 8px' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit button */}
          <button
            id="vault-drop-submit"
            type="submit"
            className={`vault-btn-extract flex items-center justify-center gap-2 ${deposited ? 'copied' : ''}`}
          >
            {deposited ? (
              '✓ DEPOSITED TO VAULT'
            ) : (
              <>
                <Save size={13} />[ 💾 DEPOSIT TO VAULT ]
              </>
            )}
          </button>
        </form>

        <div className="vault-telemetry text-center">
          REVIEW DEPOSITS ON DESKTOP // developer.itsmyapp.co.uk
        </div>
      </div>
    </div>
  );
}
