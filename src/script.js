import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

async function extractProgressFromUrls(urls) {
  const results = [];

  for (const url of urls) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      const progressDiv = document.querySelector('div#progress.graph');
      if (progressDiv) {
        const barDiv = progressDiv.querySelector('div#bar.green');
        if (barDiv) {
          const paragraph = barDiv.querySelector('p');
          if (paragraph) {
            const progressText = paragraph.textContent;
            const progressValue = parseFloat(progressText);
            results.push({ url, progress: progressValue });
          } else {
            results.push({ url, error: 'No <p> element found inside the bar div' });
          }
        } else {
          results.push({ url, error: 'No bar div found' });
        }
      } else {
        results.push({ url, error: 'No progress div found' });
      }
    } catch (error) {
      results.push({ url, error: `Failed to fetch or parse URL: ${error.message}` });
    }
  }

  return results;
}

// Example usage
const urls = [
  'https://brutalassault.cz/en/tickets/detail/id/831',
  'https://brutalassault.cz/en/tickets/detail/id/690',
  'https://example.com/page3'
];

extractProgressFromUrls(urls)
  .then(results => {
    console.log('Extracted progress values:');
    results.forEach(result => {
      if (result.progress !== undefined) {
        console.log(`${result.url}: ${result.progress}%`);
      } else {
        console.log(`${result.url}: Error - ${result.error}`);
      }
    });
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });