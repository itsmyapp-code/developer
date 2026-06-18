'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';

interface AssetInventoryProps {
  selectedAssets: string[];
  onToggle: (assetId: string) => void;
}

interface Asset {
  id: string;
  label: string;
  version: string;
  diagnostic: string;
}

const ASSETS: Asset[] = [
  {
    id: 'nextjs',
    label: 'Next.js App Router',
    version: 'v16',
    diagnostic:
      'Full-stack React framework. App Dir. RSC. Server Actions. Edge-ready. TypeScript native.',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS v4',
    version: 'v4',
    diagnostic:
      'Utility-first CSS. CSS @theme config. JIT compilation. Zero runtime overhead.',
  },
  {
    id: 'compliance',
    label: 'COMPLIANCE MD',
    version: 'UK',
    diagnostic:
      'UK GDPR enforced. Zero-cookie footprint. WCAG 2.1 AA. No PII leakage. Browser-only data.',
  },
  {
    id: 'bento',
    label: 'Bento Layout',
    version: 'CSS',
    diagnostic:
      'High-density grid. No-scroll single-screen. 4-quadrant layout. PC landscape only.',
  },
  {
    id: 'kenburns',
    label: 'Ken Burns Engine',
    version: 'CSS',
    diagnostic:
      'CSS keyframe pan/zoom animation engine. Smooth viewport transitions. GPU-accelerated.',
  },
  {
    id: 'stripe',
    label: 'Stripe Payments',
    version: 'v3',
    diagnostic:
      'PCI-compliant payments. Webhook-ready. Client-side Elements. Subscription + one-time.',
  },
  {
    id: 'mailerlite',
    label: 'MailerLite Email',
    version: 'API',
    diagnostic:
      'GDPR-friendly transactional email. REST API. Subscriber management. Automation flows.',
  },
];

export default function AssetInventory({
  selectedAssets,
  onToggle,
}: AssetInventoryProps) {
  const [hoveredDiagnostic, setHoveredDiagnostic] = useState<string>(
    '// HOVER AN ASSET TO VIEW GLOSSARY DIAGNOSTIC'
  );

  return (
    <div className="vault-panel h-full flex flex-col">
      {/* Header */}
      <div className="vault-panel-header">
        <Package size={12} style={{ color: 'var(--color-vault-accent)' }} />
        <span className="vault-panel-label">02. KEY SYMBOL SYSTEM</span>
        <span className="vault-panel-index ml-auto">
          {selectedAssets.length}/{ASSETS.length} ACTIVE
        </span>
      </div>

      {/* Asset checklist */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {ASSETS.map((asset) => {
          const isChecked = selectedAssets.includes(asset.id);
          return (
            <label
              key={asset.id}
              htmlFor={`vault-asset-${asset.id}`}
              onMouseEnter={() => setHoveredDiagnostic(asset.diagnostic)}
              onMouseLeave={() =>
                setHoveredDiagnostic(
                  '// HOVER AN ASSET TO VIEW GLOSSARY DIAGNOSTIC'
                )
              }
              className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-150"
              style={{
                backgroundColor: isChecked
                  ? 'rgba(163,230,53,0.06)'
                  : 'transparent',
                borderLeft: isChecked
                  ? '2px solid var(--color-vault-accent)'
                  : '2px solid transparent',
              }}
            >
              {/* Hidden native checkbox for accessibility */}
              <input
                id={`vault-asset-${asset.id}`}
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(asset.id)}
                className="sr-only"
              />

              {/* Custom checkbox indicator */}
              <span
                className="shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${isChecked ? 'var(--color-vault-accent)' : 'var(--color-vault-muted)'}`,
                  backgroundColor: isChecked
                    ? 'var(--color-vault-accent)'
                    : 'transparent',
                  color: 'var(--color-vault-bg)',
                  transition: 'all 0.1s ease',
                }}
              >
                {isChecked ? '✓' : ''}
              </span>

              {/* Label */}
              <span
                className="flex-1 text-xs"
                style={{
                  color: isChecked
                    ? 'var(--color-vault-text)'
                    : 'var(--color-vault-dim)',
                }}
              >
                {asset.label}
              </span>

              {/* Version badge */}
              <span
                className="text-xs px-1.5 py-0.5 shrink-0"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                  border: '1px solid var(--color-vault-border)',
                  color: 'var(--color-vault-dim)',
                }}
              >
                {asset.version}
              </span>
            </label>
          );
        })}
      </div>

      {/* Telemetry bar — shows glossary diagnostic on hover */}
      <div
        className="vault-telemetry"
        style={{
          color:
            hoveredDiagnostic.startsWith('//')
              ? 'var(--color-vault-muted)'
              : 'var(--color-vault-accent)',
        }}
      >
        {hoveredDiagnostic}
      </div>
    </div>
  );
}
