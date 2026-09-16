// Compatibility entry point for the non-destructive seed command.
require('./demo').runDemo().catch(() => { console.error('Seed stopped. Check database configuration and ensure it is empty.'); process.exitCode = 1; });
