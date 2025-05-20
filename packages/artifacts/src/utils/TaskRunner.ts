import chalk from 'chalk';
import spinners from 'cli-spinners';
import logUpdate from 'log-update';

const spinner = spinners.dots;

type Task = {
    label: string;
    status: 'pending' | 'running' | 'done' | 'error';
    error?: string;
};

export class TaskRunner {
    private tasks: Task[] = [];
    private frame: number = 0;
    private interval: NodeJS.Timeout | null = null;

    public add(label: string): number {
        this.tasks.push({ label, status: 'pending' });
        return this.tasks.length - 1;
    }

    public async run(index: number, fn: () => Promise<void>): Promise<void> {
        this.tasks[index].status = 'running';
        this.startRendering();

        try {
            await fn();
            this.tasks[index].status = 'done';
        } catch (err: any) {
            this.tasks[index].status = 'error';
            this.tasks[index].error = err?.message || String(err);

            throw err;
        } finally {
            this.stopRendering();
        }
    }

    private startRendering(): void {
        if (this.interval) return;

        this.interval = setInterval(() => {
            this.frame = (this.frame + 1) % spinner.frames.length;
            this.render();
        }, spinner.interval);
    }

    private stopRendering(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.render();
        }
    }

    private render() {
        logUpdate(
            this.tasks
                .map((task) => {
                    switch (task.status) {
                        case 'pending':
                            return `  ${chalk.dim('•')} ${task.label}`;
                        case 'running':
                            return `  ${chalk.yellow(spinner.frames[this.frame])} ${chalk.yellow(task.label)}`;
                        case 'done':
                            return `  ${chalk.green('✔')} ${chalk.dim(task.label)}`;
                        case 'error':
                            return `  ${chalk.red('✖')} ${chalk.red(task.label)}\n     ${chalk.gray(task.error)}`;
                    }
                })
                .join('\n')
        );
    }
}
