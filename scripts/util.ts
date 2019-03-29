import fs from 'fs-extra';
import path from 'path';
import ini from 'ini';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { exec } from 'child_process';
import { argv } from 'yargs';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/// --- NODE INFO HELPERS --- ///

export function getNodeNames() {
  // TODO: Scan dirs with fs instead of hard-coded
  return [
    'alice',
    'bob',
    'charlie',
  ];
}

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
  const choices = getNodeNames();
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

/// --- SHARED COMMAND HELPERS --- ///

interface CommandArgs {
  cmd: string;
  args?: object;
  log?: (...args: any) => void;
}


export function makeCliArgs(obj: object) {
  return Object.entries(obj).reduce((prev, [key, value]) => {
    if (typeof value === 'string' || typeof value === 'number') {
      return `${prev} --${key} "${value}"`;
    } else if (value) {
      return `${prev} --${key}`;
    }
    return prev;
  }, '');
}

/// --- LND COMMAND HELPERS --- ///

interface NodeCommandArgs extends CommandArgs {
  node: string;
}

export function makeNodeCmd(args: NodeCommandArgs) {
  const paths = getPaths(args.node);
  const conf = getConf(args.node);
  const lncliArgs = {
    network: 'simnet',
    rpcserver: conf['Application Options'].rpclisten,
    lnddir: paths.root,
  };
  return `lncli ${makeCliArgs(lncliArgs)} ${args.cmd} ${makeCliArgs(args.args || {})}`;
}

export async function runNodeCmd(args: NodeCommandArgs): Promise<string> {
  const cmd = makeNodeCmd(args);
  args.log && args.log('Running command:', chalk.green(cmd));
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      }
      args.log && args.log(stdout);
      resolve(stdout);
    });
  });
}

/// --- BTCD COMMAND HELPERS --- ///

export function makeBtcdCmd(args: CommandArgs) {
  const root = path.resolve(__dirname, '../btcd');
  const confPath = path.resolve(root, 'btcd.conf');
  const conf = ini.parse(fs.readFileSync(confPath, 'utf8'));
  const btcctlArgs = {
    configfile: confPath,
    rpcserver: conf.rpcserver,
    rpcuser: conf.rpcuser,
    rpcpass: conf.rpcpass,
    simnet: true,
  };
  return `btcctl ${makeCliArgs(btcctlArgs)} ${args.cmd} ${makeCliArgs(args.args || {})}`;
}

export async function runBtcdCmd(args: CommandArgs): Promise<string> {
  const cmd = makeBtcdCmd(args);
  args.log && args.log('Running command:', chalk.green(cmd));
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) {
        reject(err);
      }
      args.log && args.log(stdout);
      resolve(stdout);
    });
  });
}

/// --- MISC HELPERS --- ///

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
