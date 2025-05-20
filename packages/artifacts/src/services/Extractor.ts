import StreamZip from 'node-stream-zip';
import { execSync } from 'node:child_process';

export class Extractor {
    public static async extract(filePath: string, outDir: string): Promise<void> {
        if (filePath.endsWith('.7z')) {
            const zip = new StreamZip.async({ file: filePath });

            await zip.extract(null, outDir);
            await zip.close();
        } else {
            const command = `tar xf ${filePath} -C ${outDir}`;

            execSync(command);
        }
    }
}
