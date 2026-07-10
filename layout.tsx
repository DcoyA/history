export const metadata = {
  title: "Hi-Story",
  description: "고구려 카드 수집 RPG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
