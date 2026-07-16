#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

/** Code-lane phases only. Spec / docs:render / legacy → run on `base-docs`. */
const PHASES = {
  gen: [{ run: 'portal:gen:dry' }, { run: 'portal:gen' }],
  unit: [{ run: 'portal:unit-gen:dry' }, { run: 'portal:unit-gen' }],
  e2e: [
    { run: 'testcase:gen:dry' },
    { run: 'testcase:gen' },
    { run: 'test:e2e', forward: false },
  ],
}

function main() {
  const [phase, ...rest] = process.argv.slice(2)
  if (phase === 'spec' || phase === 'common') {
    console.error(`phase:${phase} moved to base-docs (R2).`)
    console.error('  cd ../base-docs && pnpm spec:split … / pnpm docs:render …')
    process.exit(1)
  }
  const steps = PHASES[phase]
  if (!steps) {
    console.error(`Unknown phase: ${phase ?? '(none)'}`)
    console.error(`Available phases: ${Object.keys(PHASES).join(', ')}`)
    process.exit(1)
  }

  for (const step of steps) {
    const args = step.forward === false ? [] : rest
    const echo = args.length ? ` ${args.join(' ')}` : ''
    console.log(`\n▶ phase:${phase} → pnpm ${step.run}${echo}`)
    const result = spawnSync('pnpm', ['run', step.run, ...(args.length ? ['--', ...args] : [])], {
      stdio: 'inherit',
      shell: true,
    })
    if (result.status !== 0) {
      console.error(`\n✖ ${step.run} failed (exit ${result.status}). Stopped phase:${phase}.`)
      process.exit(result.status ?? 1)
    }
  }

  console.log(`\n✔ phase:${phase} completed (${steps.length} steps)`)
}

main()
