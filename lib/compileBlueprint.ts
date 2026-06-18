import type { VaultMode, VaultState } from '@/hooks/useVaultStorage';

export interface BlueprintConfig {
  activeMode: VaultMode;
  projectCodename: string;
  selectedAssets: string[];
  chaosBuffer: string;
}

const ASSET_LABELS: Record<string, string> = {
  nextjs:        'Next.js App Router',
  tailwind:      'Tailwind CSS v4',
  compliance:    'COMPLIANCE MD (UK GDPR)',
  bento:         'Bento Layout',
  kenburns:      'Ken Burns Animation Engine',
  stripe:        'Stripe Payments',
  mailerlite:    'MailerLite Email',
};

const MODE_CONTEXT: Record<VaultMode, string> = {
  build:    'Production-ready application build. Prioritise clean architecture, type safety, and component reuse.',
  research: 'Structured research and analysis task. Prioritise accuracy, source attribution, and structured output.',
  report:   'Formal report generation. Prioritise professional tone, structured sections, and clear conclusions.',
};

export function compileBlueprint(config: BlueprintConfig): string {
  const { activeMode, projectCodename, selectedAssets, chaosBuffer } = config;

  const timestamp = new Date().toISOString();
  const codename = projectCodename.trim() || 'UNNAMED_PROJECT';

  const assetBlock =
    selectedAssets.length > 0
      ? selectedAssets
          .map((id) => `  - [✓] ${ASSET_LABELS[id] ?? id}`)
          .join('\n')
      : '  - [NONE SELECTED]';

  const chaosBlock = chaosBuffer.trim()
    ? `## RAW CONTEXT DUMP\n\`\`\`\n${chaosBuffer.trim()}\n\`\`\``
    : '## RAW CONTEXT DUMP\n[EMPTY — NO CONTEXT LOADED]';

  return `# VAULT COMPILED BLUEPRINT
# Generated: ${timestamp}
# Project:   ${codename.toUpperCase()}
# Mode:      ${activeMode.toUpperCase()}
# Platform:  developer.itsmyapp.co.uk

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## OPERATIONAL MODE
${activeMode.toUpperCase()} — ${MODE_CONTEXT[activeMode]}

## PROJECT IDENTITY
Codename: ${codename}

## TECH STACK MANIFEST
${assetBlock}

## OVERRIDING CONSTRAINTS
- Zero Server. Zero Surveillance. Zero Cost.
- All client-side. No background telemetry.
- UK GDPR enforced. Zero-cookie footprint.
- PC-only landscape display (1080p / 4K).
- Strict TypeScript. No implicit \`any\`. No placeholders.
- Monospace typography throughout.

${chaosBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# END OF COMPILED BLUEPRINT // itsmyapp.co.uk
`;
}

// Utility: compile from full VaultState (convenience overload)
export function compileBlueprintFromState(state: VaultState): string {
  return compileBlueprint({
    activeMode:     state.activeMode,
    projectCodename: state.projectCodename,
    selectedAssets: state.selectedAssets,
    chaosBuffer:    state.chaosBuffer,
  });
}
