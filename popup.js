document.addEventListener('DOMContentLoaded', () => {
  const measureBtn = document.getElementById('measureBtn');
  const loadingElement = document.getElementById('loading');
  const resultElement = document.getElementById('result');
  const errorElement = document.getElementById('error');
  const loadTimeElement = document.getElementById('loadTime');

  // Add keyboard accessibility
  measureBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      measureBtn.click();
    }
  });

  // Set up message listener once during initialization
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'performanceResult') {
      loadingElement.classList.add('hidden');
      resultElement.classList.remove('hidden');
      
      // Format the load time
      const loadTime = message.loadTime.toFixed(2);
      loadTimeElement.textContent = `${loadTime} ms`;
    }
  });

  measureBtn.addEventListener('click', async () => {
    try {
      // Reset UI
      loadingElement.classList.remove('hidden');
      resultElement.classList.add('hidden');
      errorElement.classList.add('hidden');
      
      // Get the current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      // Inject the content script to measure performance
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: injectPerformanceMonitor
      });

      // Now refresh the page to start measurement
      await chrome.tabs.reload(tab.id);
    } catch (error) {
      console.error('Error:', error);
      loadingElement.classList.add('hidden');
      errorElement.classList.remove('hidden');
    }
  });
});

// This function will be injected into the page
function injectPerformanceMonitor() {
  // Check if we're in a refresh cycle
  const isRefresh = sessionStorage.getItem('measuringPerformance');
  
  if (isRefresh === 'true') {
    // This is the refreshed page, measure the performance
    
    // Using the modern Performance API
    let loadTime;
    
    // Try to use the newer Navigation Timing API (PerformanceNavigationTiming)
    const navigationEntries = performance.getEntriesByType('navigation');
    
    if (navigationEntries.length > 0) {
      // Use the first navigation entry
      const navigationEntry = navigationEntries[0];
      loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;
    } else {
      // Fall back to the older API
      const performanceData = window.performance.timing;
      loadTime = performanceData.loadEventEnd - performanceData.navigationStart;
    }
    
    // Clean up
    sessionStorage.removeItem('measuringPerformance');
    
    // Send the results back to the extension
    chrome.runtime.sendMessage({
      type: 'performanceResult',
      loadTime: loadTime
    });
  } else {
    // First visit, set the flag and prepare for refresh
    sessionStorage.setItem('measuringPerformance', 'true');
  }
} 