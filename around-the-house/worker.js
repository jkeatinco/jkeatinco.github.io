// worker.js
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.16.0';

env.allowLocalModels = false;

let detector;

self.onmessage = async (event) => {
  switch (event.data.cmd) {
    case 'init':
      detector = await pipeline('zero-shot-object-detection', 'Xenova/owlvit-base-patch32');
      self.postMessage({ status: 'ready' });
      break;
    case 'detect':
      const output = await detector(event.data.imgSrc, event.data.candidate_labels);
      self.postMessage({ status: 'result', output });
      break;
  }
};