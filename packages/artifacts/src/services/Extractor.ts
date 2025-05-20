import { execSync } from 'node:child_process';
import zip from '7zip-min';
import { rmSync } from 'node:fs';

export class Extractor {
    public static async extract(filePath: string, outDir: string): Promise<void> {
        if (filePath.endsWith('.7z')) {
            await zip.unpack(filePath, outDir);
            rmSync(filePath);
        } else {
            const command = `tar xf ${filePath} -C ${outDir}`;

            execSync(command);
        }
    }
}
