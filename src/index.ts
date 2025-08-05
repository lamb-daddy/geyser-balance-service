import run from './run';

run().catch(e => {
  console.error('Error', e);
  process.exit(1);
})
