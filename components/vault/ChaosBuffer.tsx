'use client';

import { type ChangeEvent } from 'react';
import { FileText, Trash2 } from 'lucide-react';

interface ChaosBufferProps {
  value: string;
  onChange: (text: string) => void;
}

export default function ChaosBuffer({ value, onChange }: ChaosBufferProps) {

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
  }

  function handleClear() {
    onChange('');
  }

  const charCount = value.length;
  const lineCount = value ? value.split('\n').length : 0;

  return (
    <div className="vault-panel h-full flex flex-col">
      {/* Header */}
      <div className="vault-panel-header">
        <FileText size={12} style={{ color: 'var(--color-vault-accent)' }} />
        <span className="vault-panel-label">03. RAW CONTEXT CHAOS BUFFER</span>

        {/* Char count badge */}
        <span
          className="ml-auto text-xs"
          style={{
            fontSize: '9px',
            color:
              charCount > 8000
                ? '#f87171'
                : charCount > 4000
                  ? '#fb923c'
                  : 'var(--color-vault-dim)',
          }}
        >
          {charCount.toLocaleString()} CHARS / {lineCount} LINES
        </span>

        {/* Clear button */}
        {value && (
          <button
            id="vault-chaos-clear"
            onClick={handleClear}
            title="Clear buffer"
            className="ml-3 flex items-center gap-1 text-xs uppercase tracking-wider transition-colors duration-150"
            style={{ color: 'var(--color-vault-muted)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = '#f87171')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-vault-muted)')
            }
          >
            <Trash2 size={11} />
            CLR
          </button>
        )}
      </div>

      {/* Textarea — fills remaining height */}
      <div className="flex-1 relative">
        <textarea
          id="vault-chaos-textarea"
          value={value}
          onChange={handleChange}
          placeholder={`// CHAOS BUFFER — PASTE ANY CONTEXT HERE\n// AI script fragments, equations, logic notes,\n// cross-session scraps, raw data dumps...\n// Nothing is processed. Nothing is judged.`}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="absolute inset-0 w-full h-full resize-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            lineHeight: '1.7',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '12px 14px',
            color: 'var(--color-vault-text)',
          }}
        />
      </div>

      {/* Telemetry footer */}
      <div className="vault-telemetry">
        {value.trim()
          ? `BUFFER_STATUS=LOADED // ${charCount.toLocaleString()} CHARS STAGED FOR COMPILATION`
          : 'BUFFER_STATUS=EMPTY // AWAITING INPUT'}
      </div>
    </div>
  );
}
