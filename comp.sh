#!/bin/bash

PATH=$(npm bin):$PATH tsc
PATH=$(npm bin):$PATH browserify ./bin/Main.js -o ./browser/bundle.js
