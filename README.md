# Page Load Performance Extension

A browser extension that measures page load performance by refreshing the page and timing how long it takes to load.

## Features

- Measures page load time with a single click
- Works on any webpage
- Compatible with Chrome and Edge browsers
- Uses modern Performance API for accurate timing

## Installation

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the folder containing the extension files
4. The extension should now appear in your toolbar

### Edge

1. Open Edge and navigate to `edge://extensions/`
2. Enable "Developer mode" by toggling the switch in the left sidebar
3. Click "Load unpacked" and select the folder containing the extension files
4. The extension should now appear in your toolbar

## Usage

1. Navigate to any webpage you want to measure
2. Click the extension icon in your toolbar to open the popup
3. Click the "Measure Performance" button
4. The page will refresh and the extension will measure the load time
5. Results will be displayed in milliseconds once the page has finished loading

## How It Works

The extension uses the Web Performance API to accurately measure how long a page takes to load. When you click the "Measure Performance" button, the extension:

1. Sets a flag in the page's sessionStorage
2. Refreshes the page
3. Detects the refresh and measures the time from navigation start to load event end
4. Displays the results in the popup

## Technical Notes

- The extension uses the modern Navigation Timing API (PerformanceNavigationTiming) when available
- Falls back to the older Performance.timing API for backward compatibility
- Requires permissions for "activeTab", "scripting", and "tabs" 