// Run an arbitrary command as a node
import { exec } from 'child_process';
import { argv } from 'yargs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getNodeArg, getPaths, getConf } from './util';


async function fund(node: string) {
  const cmd = '';
  console.log('Running command:', chalk.green(cmd));
  exec(cmd, (err, stdout) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(stdout);
  });
}

// Start
getNodeArg().then(fund);
