window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Print the content of the document body
    console.log('Document body:', document.body.innerHTML);
    
    // Check if React root is present
    const rootElement = document.getElementById('root');
    console.log('Root element found:', rootElement ? true : false);
    
    // Log any errors that occur
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
    });

    // Log unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
    });

    // Check if React is loaded
    console.log('React available:', window.React ? true : false);
    console.log('ReactDOM available:', window.ReactDOM ? true : false);
});