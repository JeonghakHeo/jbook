import * as esbuild from 'esbuild-wasm'
import axios from 'axios'

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // used to figure out what the actual path is to a particular file inside of a plugin.
      // is going to be called whenever Esbuild is trying to figure out a path to a particular
      // filters are executed against the file name that we are trying to load.
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args)
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' }
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          }
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        }
      })

      // used to actually load up a file off the file system.
      // namespaces are to filter which file should the load function to be applied
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args)

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React, { useState } from 'react';
              console.log(React, useState);
            `,
          }
        }

        const { data, request } = await axios.get(args.path)
        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        }
      })
    },
  }
}
