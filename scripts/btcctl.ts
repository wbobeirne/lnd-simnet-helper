// Run an arbitrary command as a node

import { argv } from 'yargs';
import { runBtcdCmd } from './util';

const cmd = argv['_'].join(' ');
const args = { ...argv };
delete args['_'];
delete args['$0'];
runBtcdCmd({ cmd, args, log: console.info });
