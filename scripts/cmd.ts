// Run an arbitrary command as a node

import { argv } from 'yargs';
import { getNodeArg, runNodeCmd } from './util';

// Start
getNodeArg().then(node => {
  const cmd = argv['_'].join(' ');
  const args = { ...argv };
  delete args['node'];
  delete args['_'];
  delete args['$0'];
  runNodeCmd({
    node,
    cmd,
    args,
    log: console.info,
  });
});
