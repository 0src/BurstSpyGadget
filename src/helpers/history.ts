import * as fsPath from 'fs-path';
import * as path from 'path';
import * as fs from 'fs';

class History {
    saving: Map<string, string> = new Map();

    update(name: string, data: string) {
        name = name.replace(/[^0-9a-z]/gi, '_');

        if(this.saving.has(name)) {
            this.saving.set(name, this.saving.get(name) + '\n' + data);
            setTimeout(() => { this.update(name, data); }, 300);
            return;
        }

        this.saving.set(name, data);

        fs.appendFile(path.resolve('history', `${name}.txt`), `${data}\n`, 'utf8', (err) => {
            if(err) {
                console.log(err);

                fsPath.writeFile(path.resolve('history', `${name}.txt`), `${data}\n`, (err) => {
                    if(err) {
                        console.log(err);
                    }
                    this.saving.delete(name);
                });
            } else {
                this.saving.delete(name);
            }
        });
    }
}

export const history = new History();