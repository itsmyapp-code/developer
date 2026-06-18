import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { VaultSessionProvider } from '@/lib/vaultSession';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full vault-scanline">
        <VaultSessionProvider>{children}</VaultSessionProvider>
      </body>
    </html>
  );
}
