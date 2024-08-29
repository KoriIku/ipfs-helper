# ipfs-helper

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

# IPFS Command Helper WebTool

This tool mainly generate commands for users to batch processing. which makes your life easier :)

### Mode 1: IPFS Command Generator
This mode accept user inputting as following format:
```
added <file cid 1> <folder name>/<file name 1>
added <file cid 2> <folder name>/<file name 2>
...
added <file cid i> <folder name>/<file name i>
added <folder cid> <folder name>
```

which, is the general output for a traditional ipfs-add command's stdout:
```
ipfs add --chunker=size-1048576 --raw-leaves --cid-version=1 -r --nocopy --to-files="/<folder_name_here>" <local_folder_path_here>
```


### Mode 2: IPFS CIDv1 Extractor
This mode accept user inputting as the same format as mode 1.

It will extract all cidv1(bafy cid) from added string.

### Mode 3: IPFS Pin Command Generator.
This mode accept user inputting as the same format as mode 1, in the first user input textbox.

As for the second, it accepts a cid list.

The output should be those cid generated commands which exists on those two textboxes.

### Mode 4: IPFS added string Generator
This mode is designed to rebuild the added string stdout output for mode 1-3 to use.

The first user input textbox should be stdout for command like this:
```
ipfs files ls -l /
```

And the second user input textbox should be stdout for command like this:
```
ipfs files ls -l "/<folder_name_here>"
```

The output should be useable in mode 1-3.
