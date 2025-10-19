export function ThemeScript() {
  // This script runs BEFORE React hydrates
  
  
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            // Get theme from localStorage (default to 'light' if not set)
            const theme = localStorage.getItem('theme') || 'light';
            // Apply the 'dark' class to <html> if theme is 'dark'
            document.documentElement.classList.toggle('dark', theme === 'dark');
          } catch (e) {
            // Fallback: do nothing if localStorage fails (e.g., in private browsing)
          }
        `,
        
      }}
    />
  );
}