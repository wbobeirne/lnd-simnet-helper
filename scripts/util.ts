import fs from 'fs-extra';
import path from 'path';
import ini from 'ini';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { exec } from 'child_process';
import { argv } from 'yargs';

export function getPaths(node: string, chain = 'bitcoin') {
  const root = path.resolve(__dirname, '..', node);
  const data = path.resolve(root, 'data/chain', chain, 'simnet');
  const logs = path.resolve(root, 'logs');
  return { root, data, logs };
}

export function getConf(node: string) {
  const paths = getPaths(node);
  const conf = fs.readFileSync(path.join(paths.root, 'lnd.conf'), 'utf8');
  return ini.parse(conf);
}

export function getNodeArg(): Promise<string> {
  // TODO: Make this dynamic
  const choices = [
    'alice',
    'bob',
    'charlie',
  ];
  
  return new Promise(resolve => {
    if (argv.node) {
      resolve((argv as any).node);
    } else {
      inquirer.prompt([{
        type: 'list',
        name: 'node',
        choices,
      }]).then((answers: any) => {
        resolve(answers.node);
      });
    }
  });
}

export function makeCliArgs(obj: object) {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    return `${prev} --${key} "${value}"`;
  }, '');
}

interface CommandArgs {
  node: string;
  cmd: string;
  args?: object;
  log?: (...args: any) => void;
}

export function makeNodeCmd(args: CommandArgs) {
  const paths = getPaths(args.node);
  const conf = getConf(args.node);
  const lncliArgs = {
    network: 'simnet',
    rpcserver: conf['Application Options'].rpclisten,
    lnddir: paths.root,
  };
  return `lncli ${makeCliArgs(lncliArgs)} ${args.cmd} ${makeCliArgs(args.args || {})}`;
}

export async function runNodeCmd(args: CommandArgs) {
  const cmd = makeNodeCmd(args);
  args.log && args.log('Running command:', chalk.green(cmd));
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      }
      args.log && args.log(stdout);
    });
  });
}
