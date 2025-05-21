#!/usr/bin/env node

import Listr, { ListrTaskObject } from 'listr';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import Observable from 'zen-observable';
import { Downloader } from './services/Downloader';
import { Extractor } from './services/Extractor';
import { Config } from './utils/Config';

(() => {
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
        } as unknown as ListrTaskObject<Observable<string>>,
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
