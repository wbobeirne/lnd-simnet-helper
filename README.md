# LND Simnet Helper

A set of utilities to make running a simulated set of LND nodes a snap. Doesn't aim to be perfect, just aims to be better than doing it manually.

## Requirements

* Node 8.9.4+
* Yarn 1+
* LND 0.5.0+
* BTCD 0.12.0+

## Getting started

Run this in one terminal you'll leave open:

```bash
yarn btcd
```

And this in another terminal you'll leave open:
```bash
yarn start
```

Then go through these in a third terminal you'll use for commands:
```bash
# Run as many times as you need nodes
yarn create-node

# Run once to unlock all nodes
yarn unlock

# Run each restart to connect all nodes together as peers
yarn connect
```

## Commands

### `yarn btcctl`

Run arbitrary RPC commands against btcd.

Example:
```
yarn btcctl getinfo
```

### `yarn lncli`

Run arbitrary RPC commands against lnd. Specify which node with `--node [name]`, or run without to be prompted.

Example:
```
yarn lncli --node alice newaddress p2wkh
```

### `yarn fund`

Get some funds into a node. Specify which node with `--node [name]`, or run without to be prompted.

### `yarn connection-info`

Get connection info for a node. Specify which node with `--node [name]`, or run without to be prompted. Specify how to encode macaroons and TLS cert with `--encoding`, must be a valid node encoding type, defaults to `'base64'`.

Example:
```
yarn connection-info --node bob --encoding hex
```
