import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import path from 'node:path';

export class Config {
    public options: {
        output?: string;
        version?: string;
        branch?: string;
        help?: string;
        _unknown?: string[];
    };

    public outDir: string;
    public branch: string;
    public os: 'win32' | 'linux';
    public fileName: string;
    public artifactPath: string;
    public downloadUrl: string;

    private definitions = [
        {
            name: 'output',
            alias: 'o',
            type: String,
            description: 'Output directory (default: fxserver)'
        },
        {
            name: 'version',
            alias: 'v',
            type: String,
            description: '[Reserved] Specific version'
        },
        {
            name: 'branch',
            alias: 'b',
            type: String,
            description: 'Artifact branch (recommended, optional, latest'
        },
        {
            name: 'help',
            alias: 'h',
            type: Boolean,
            description: 'Show help'
        }
    ];

    constructor() {
        this.options = commandLineArgs(this.definitions, { partial: true });

        if (this.options._unknown && this.options._unknown.length > 0) {
            console.error(chalk.red(`Unknown option(s): ${this.options._unknown.join(', ')}`));
            this.printHelp();
            process.exit(1);
        }

        this.os = process.platform === 'win32' ? 'win32' : 'linux';
        this.branch = this.options.branch || 'latest';
        this.outDir = path.resolve(this.options.output || 'fxserver');
        this.fileName = this.os === 'win32' ? 'server.7z' : 'fx.tar.xz';
        this.artifactPath = path.join(this.outDir, this.fileName);
        this.downloadUrl = ``;
    }

    private printHelp(): void {
        const usage = commandLineUsage([
            {
                header: '@tsfx/artifacts',
                content: 'Downloads and extracts FiveM server artifacts.'
            },
            {
                header: 'Options',
                optionList: this.definitions
            }
        ]);

        console.log(usage);
    }
}
