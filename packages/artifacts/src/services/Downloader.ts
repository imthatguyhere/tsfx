import fetch from 'node-fetch';
import { createWriteStream } from 'node:fs';
import stream from 'node:stream';
import { promisify } from 'node:util';

const pipeline = promisify(stream.pipeline);

export class Downloader {
    public static async download(url: string, outPath: string): Promise<void> {
        const response = await fetch(url);

        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        await pipeline(response.body, createWriteStream(outPath));
    }
}
