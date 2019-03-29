// Run an arbitrary command as a node
import { exec } from 'child_process';
import { argv } from 'yargs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getNodeArg, runBtcdCmd, runNodeCmd } from './util';


async function fund(node: string) {
  // console.log(`Getting address for ${node}...`);
  // const lndRes = await runNodeCmd({
  //   node,
  //   cmd: 'newaddress p2wkh',
  // });
  // const { address } = JSON.parse(lndRes);
  // console.log('Got address', chalk.green(address));

  console.log('Generating some blocks to get some funds...');
  await runBtcdCmd({ cmd: 'generate 10' });

  // console.log(`Sending 1 coin to ${chalk.green(address)}...`);
  // await runBtcdCmd({ cmd: `sendtoaddress "${address}" 1` });
  
  // console.log('Generating 6 blocks to confirm send...');
  // await runBtcdCmd({ cmd: 'generate 6' });

  console.log('All done!');
}

// Start
getNodeArg().then(fund);
