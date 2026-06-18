import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import { VaultSessionProvider } from '@/lib/vaultSession';
import './globals.css';

const mono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'ITSMYAPP Vault — Developer Command Centre',
  description:
    'Private developer command centre for the itsmyapp.co.uk ecosystem. Zero-server, zero-cookie, UK GDPR compliant.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} h-full`}>
      <body className="h-full vault-scanline">
        <VaultSessionProvider>{children}</VaultSessionProvider>
      </body>
    </html>
  );
}
