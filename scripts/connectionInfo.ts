// Get connection info from a node
import fs from 'fs-extra';
import path from 'path';
import { argv } from 'yargs';
import chalk from 'chalk';
import { getNodeArg, getPaths, getConf } from './util';

// TODO - make these dynamic
const chain = 'bitcoin';

function printConnectionInfo(node: string) {
  try {
    const encoding = argv.encoding as string || 'base64';
    const paths = getPaths(node, chain);
    const conf = getConf(node);
    const info: { [key: string]: string } = {};
    info['Address - gRPC'] = conf['Application Options'].rpclisten;
    info['Address - REST'] = conf['Application Options'].restlisten;
    info['Address - Peers'] = conf['Application Options'].listen;
    info['Macaroon - Admin'] = fs.readFileSync(path.join(paths.data, 'admin.macaroon')).toString(encoding);
    info['Macaroon - Readonly'] = fs.readFileSync(path.join(paths.data, 'readonly.macaroon')).toString(encoding);
    info['Macaroon - Invoice'] = fs.readFileSync(path.join(paths.data, 'invoice.macaroon')).toString(encoding);
    info['TLS Certificate'] = fs.readFileSync(path.join(paths.root, 'tls.cert')).toString(encoding);
    Object.entries(info).forEach(([key, value]) => {
      console.log(chalk.green(`${key}:`), value);
    });
    console.info(''.padEnd(process.stdout.columns || 20, '='));
    console.info(`Macaroons and TLS Cert are ${encoding} encoded`);
  } catch(err) {
    console.error(`Unknown node '${node}'`);
    process.exit(1);
  }
}

// Start
getNodeArg().then(printConnectionInfo);
