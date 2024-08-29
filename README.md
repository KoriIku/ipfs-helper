# Script Usage:

## Multipin.sh:

Execute: /path/to/multipin.sh

Press Enter to input multiple lines of the command ```ipfs pin remote add --service=crust --background <cid>```, where <cid> can be either a file CID or a directory CID.

After entering the commands, press Ctrl+D to start executing them. You can run this in a screen session to keep it running in the background.

## Multicheck.sh:

Input one command per line: ```ipfs pin remote ls --service=<nickname> --cid=<cid> --status=pinned,pinning,failed,queued```

If the status returned is "pinned", it means the operation was successful. If it returns any other status or no status at all, it indicates a stalled chain state. You can manually upload via crustfiles.io or simply retry the Remote Pin to fix it.
