#!/usr/bin/env node

import Listr from 'listr';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { Downloader } from './services/Downloader';
import { Extractor } from './services/Extractor';
import { Config } from './utils/Config';

(async () => {
    const config = new Config();

    if (config.options.help) {
        config.printHelp();
        process.exit(0);
    }

    if (existsSync(config.outDir)) {
        rmSync(config.outDir, { recursive: true, force: true });
    }

    mkdirSync(config.outDir, { recursive: true });

    const tasks = new Listr([
        {
            title: 'Downloading Artifact',
            task: () => Downloader.download(config.os, config.branch, config.artifactPath)
        },
        {
            title: 'Extracting Artifact',
            task: () => Extractor.extract(config.artifactPath, config.outDir)
        }
    ]);

    tasks.run().catch((err) => {
        console.error(err);
        process.exit(1);
    });
})();
