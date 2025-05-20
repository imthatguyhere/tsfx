import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { Downloader } from './services/Downloader';
import { Extractor } from './services/Extractor';
import { Config } from './utils/Config';
import { TaskRunner } from './utils/TaskRunner';

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

    const runner = new TaskRunner();
    const downloadTask = runner.add('Downloading Artifact');
    const extractTask = runner.add('Extracting Artifact');

    try {
        await runner.run(downloadTask, () =>
            Downloader.download(config.downloadUrl, config.artifactPath)
        );

        await runner.run(extractTask, () => Extractor.extract(config.artifactPath, config.outDir));

        console.log('\nAll tasks complete.');
    } catch {
        console.error('\nBuild failed.');
        process.exit(1);
    }
})();
