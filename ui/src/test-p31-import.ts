import { p31 } from '@p31/shared';

console.log('P31 Config Test:');
console.log('Identity:', p31.config.identity.name);
console.log('FDA Classification:', p31.config.identity.fdaClassification);
console.log('Phosphorus Color:', p31.color('phosphorus'));

// Test sync pulse (dev mode, won't actually send)
p31.sync.pulse('test_event', { message: 'Integration test' });

// Test logging
p31.log('s', 'P31 nerve utility successfully imported!');
