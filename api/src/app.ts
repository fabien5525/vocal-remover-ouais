import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 19001;

const vocalRemoverFolder = '../vocal-remover';
const resultsFolder = vocalRemoverFolder + '/results';
const musicsFolder = vocalRemoverFolder + '/musics';

app.get('/', (req, res) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 20;

  const instrumentalsFiles = fs.readdirSync(resultsFolder).filter((file) => file.endsWith('_Instruments.wav'));

  const results = instrumentalsFiles.slice(offset, offset + limit).map((file) => {
    const urlInstruments = new URL(`http://5525.fr:${port}/dl/${file}`);
    const urlVocals = new URL(`http://5525.fr:${port}/dl/${file.replace('_Instruments.wav', '_Vocals.wav')}`);
    const urlOriginal = new URL(`http://5525.fr:${port}/dl/${file.replace('_Instruments.wav', '.mp3')}`);
    return {
      name: file,
      instruments_url: urlInstruments,
      vocals_url: urlVocals,
      original_url: urlOriginal,
    };
  });

  res.json(results); 
});

app.get('/dl/:filename', (req, res) => {
  const filename = req.params.filename;
  let file = '';

  if (!filename || filename === '' || filename.includes('..')) {
    return res.status(400).json({ message: 'Invalid filename' });
  }

  if (filename.includes('.wav')) {
    res.setHeader('Content-Type', 'audio/wav');
    file = `${resultsFolder}/${filename}`;
  } else if (filename.includes('.mp3')) {
    res.setHeader('Content-Type', 'audio/mpeg');
    file = `${musicsFolder}/${filename}`;
  }

  return res.download(file);
});

async function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(command, args);
    let stderrData = '';

    childProcess.stderr.on('data', (data) => {
      stderrData += data;
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        const errorMessage = `Command '${command}' exited with code ${code}\n`;
        if (stderrData) {
          reject(errorMessage + `Error output:\n${stderrData}`);
        } else {
          reject(errorMessage);
        }
      }
    });
  });
}
 
app.post('/upload', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Invalid request, no body found' });
  }

  const urlPattern = /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
  let url : string = req.body.url;
  if (!url || url === '' || !urlPattern.test(url)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  if (url.includes('&')) {
    url = url.substring(0, url.indexOf('&'));
  }

  try {
    process.chdir(vocalRemoverFolder);
    console.log(`New directory: ${process.cwd()}`);
    // await runCommand('.venv\\Scripts\\activate.bat', []);
    // console.log('Virtual environment activated.')
    console.log('Trying to run : py main.py ' + url)
    await runCommand('py', ['main.py', url]);
    console.log('All commands executed successfully.');
    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});