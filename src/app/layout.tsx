import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContextCompressor - LLM Prompt & Token Optimizer',
  description: 'An open-source developer tool to minify code contexts and reduce OpenAI token costs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tailwindConfig = `
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            dark: {
              bg: '#090d16',
              card: '#111827',
              border: '#1f2937',
            }
          }
        }
      }
    }
  `;

  const customStyles = `
    body {
      font-family: "Plus Jakarta Sans", sans-serif;
      background-color: #090d16;
      color: #f3f4f6;
    }
    textarea, code, pre, select, .font-mono {
      font-family: "JetBrains Mono", monospace !important;
    }
  `;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      </head>
      <body className="bg-[#090d16] text-gray-100 antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}