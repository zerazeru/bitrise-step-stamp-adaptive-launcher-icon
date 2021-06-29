#!/bin/bash
THIS_SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
set -ex
npm install --prefix $THIS_SCRIPT_DIR
node $THIS_SCRIPT_DIR/step.js
