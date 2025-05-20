import fetch from 'node-fetch';
import { createWriteStream } from 'node:fs';
import stream from 'node:stream';
import { promisify } from 'node:util';
import { BranchOption, OsOption } from '../utils/Config';

interface JGResponse {
    windowsDownloadLink: string;
    linuxDownloadLink: string;
}

interface ChangelogResponse {
    latest_download: string;
    recommended_download: string;
}

const pipeline = promisify(stream.pipeline);

export class Downloader {
    public static async download(
        os: OsOption,
        branch: BranchOption,
        outPath: string
    ): Promise<void> {
        const url = await Downloader.getUrl(branch, os);
        const response = await fetch(url);

        if (!response.ok || !response.body) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        await pipeline(response.body, createWriteStream(outPath));
    }

    private static async getUrl(branch: BranchOption, os: OsOption): Promise<string> {
        if (branch === 'recommended') {
            const response = await fetch('https://artifacts.jgscripts.com/json');

            if (!response.ok) {
                throw new Error(`Failed to fetch recommended artifact: ${response.statusText}`);
            }

            const data = (await response.json()) as JGResponse;

            return os === 'win32' ? data.windowsDownloadLink : data.linuxDownloadLink;
        }

        const response = await fetch(
            `https://changelogs-live.fivem.net/api/changelog/versions/${os}/server`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${branch} changelog for ${os}: ${response.statusText}`
            );
        }

        const data = (await response.json()) as ChangelogResponse;

        return branch === 'latest' ? data.latest_download : data.recommended_download;
    }
}
