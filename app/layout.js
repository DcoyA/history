export const metadata = {
  title: "Hi-Story",
  description: "고구려 카드 수집 RPG",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
