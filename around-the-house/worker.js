// worker.js
console.log('Worker script loaded'); // Add this line
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.0';

env.allowLocalModels = false;

let detector;

self.onmessage = async (event) => {
  try {
    switch (event.data.cmd) {
      case 'init':
        detector = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');
        console.log('Model initialized'); // Add this line
        self.postMessage({ status: 'ready' });
        break;
      case 'detect':
        const output = await detector(event.data.imgSrc, event.data.candidate_labels, {threshold: 0.1, percentage: true});
        self.postMessage({ status: 'result', output });
        break;
    }
  } catch (error) {
    console.error('Error in worker:', error);
    self.postMessage({ status: 'error', message: error.message });
  }
};