import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const venvPythonWin = path.join(__dirname, 'backend', 'venv', 'Scripts', 'python.exe');
const venvPythonUnix = path.join(__dirname, 'backend', 'venv', 'bin', 'python');

let pythonCmd = 'python';
if (process.platform === 'win32' && fs.existsSync(venvPythonWin)) {
  pythonCmd = venvPythonWin;
} else if (fs.existsSync(venvPythonUnix)) {
  pythonCmd = venvPythonUnix;
}

const backendDir = path.join(__dirname, 'backend');
console.log(`[CogFlow] Launching FastAPI Backend with: ${pythonCmd}`);

const proc = spawn(
  pythonCmd,
  ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'],
  {
    cwd: backendDir,
    stdio: 'inherit',
    shell: false,
  }
);

proc.on('error', (err) => {
  console.error('[CogFlow Backend Error]:', err);
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  proc.kill('SIGINT');
  process.exit(0);
});
process.on('SIGTERM', () => {
  proc.kill('SIGTERM');
  process.exit(0);
});
