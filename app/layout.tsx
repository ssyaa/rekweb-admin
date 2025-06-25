// ❌ Jangan pakai useRouter, usePathname di sini
import './globals.css';
import { AuthProvider } from './context/auth_context';
import LayoutClient from '../components/layout_clients'; // pisahkan ke komponen client

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
