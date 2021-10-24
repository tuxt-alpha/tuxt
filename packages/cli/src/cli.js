import path from 'path'
import spawn from 'cross-spawn'

export default function tuxt(argv) {
  const command = 'node'
  const args = [path.join(__dirname, 'core.js')]
  const env = process.env

  env['NODE_ENV'] = argv[0] === 'build' ? 'production' : 'development'

  const child = spawn(command, args, {
    stdio: 'inherit',
    env: env,
  })

  process.on('SIGTERM', () => child.kill('SIGTERM'))
  process.on('SIGINT', () => child.kill('SIGINT'))
  process.on('SIGBREAK', () => child.kill('SIGBREAK'))
  process.on('SIGHUP', () => child.kill('SIGHUP'))

  child.on('exit', (code, signal) => {
    if (code === null) code = signal === 'SIGINT' ? 0 : 1
    process.exit(code)
  })

  return child
}