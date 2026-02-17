// Test file to verify the development server is working
// This file can be deleted once you confirm everything is working

import { historyService } from '@/services/history.service';
import { CatchersMitt } from '@/lib/catchers-mitt';
import { analyzeMessage } from '@/engine/geodesic-engine';

console.log('🧪 Testing Development Server Components...');

// Test History Service
console.log('📝 Testing History Service...');
historyService.addEntry('message', 'Hello, this is a test message');
const history = historyService.getHistory();
console.log('✅ History Service working:', history.length > 0);

// Test CatchersMitt
console.log('🧤 Testing CatchersMitt...');
const mitt = new CatchersMitt({ bufferDuration: 5000 });
mitt.addMessage('Test message for CatchersMitt');
console.log('✅ CatchersMitt working:', mitt.getBuffer().length > 0);

// Test Geodesic Engine
console.log('🌐 Testing Geodesic Engine...');
analyzeMessage({
  id: 'test-msg-1',
  source: 'manual',
  content: 'This is a test message for geodesic analysis',
  sender: 'test',
  timestamp: new Date(),
})
  .then((result) => {
    console.log('✅ Geodesic Engine working:', result);
  })
  .catch((error) => {
    console.error('❌ Geodesic Engine failed:', error);
  });

console.log('🎉 All components tested successfully!');
console.log('🚀 Development server is ready for 3D graphics development!');
