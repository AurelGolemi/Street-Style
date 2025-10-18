export function ThemeScript() {
  // This script runs BEFORE React hydrates
  const themeScript = `
    (function() {
      try {
        // Check localStorage first
        const savedTheme = localStorage.getItem('theme');
        
        // Check system preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        // Use saved theme or fall back to system
        const theme = savedTheme || systemPreference;
        
        // Apply immediately to prevent flash
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Store for later
        localStorage.setItem('theme', theme);
      } catch (e) {
        console.error('Theme initialization error:', e);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}