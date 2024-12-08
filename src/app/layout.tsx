import "../globals.css";
import { Metadata } from "next";
import { ClientProvider } from "@/components/ClientProvider";

export const metadata: Metadata = {
  title: "Firebase Notifier",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          <div id="root">{children}</div>
        </ClientProvider>
      </body>
    </html>
  );
}
