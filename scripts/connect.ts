// Run an arbitrary command as a node
import chalk from 'chalk';
import { getNodeNames, getConf, runNodeCmd } from './util';

async function connect() {
  const nodes = getNodeNames();
  const confs = nodes.map(getConf);
  const infos = await Promise.all(
    nodes.map(async (node) => {
      const res = await runNodeCmd({ node, cmd: 'getinfo' });
      return JSON.parse(res);
    }),
  );

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < confs.length; j++) {
      if (i === j) {
        continue;
      }
      const pubkey = infos[j].identity_pubkey;
      const address = confs[j]['Application Options'].listen;
      try {
        await runNodeCmd({
          node: nodes[i],
          cmd: `connect ${pubkey}@${address}`,
        });
      } catch(err) {
        if (!err.message.includes('already')) {
          throw err;
        }
      }
      console.log(`Connected ${chalk.green(nodes[i])} to ${chalk.green(nodes[j])}`);
    }
  }
}

// Start
connect();
