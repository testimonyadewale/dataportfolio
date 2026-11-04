import KeystaticApp from "./keystatic";

export const metadata = { title: "Edit portfolio", robots: { index: false } };

export default function Layout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
