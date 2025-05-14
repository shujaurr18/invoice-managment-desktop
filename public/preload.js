window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Print the content of the document body
    console.log('Document body:', document.body.innerHTML);
    
    // Check if React root is present
    const rootElement = document.getElementById('root');
    console.log('Root element found:', rootElement ? true : false);
  });