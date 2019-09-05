const {
    spawn
} = require('@arwen/arwen-utils')

test('arwen', () => {
    spawn('node', [ARWEN], {
        stdio: 'inherit'
    })
})

test('help', () => {
    spawn('node', [ARWEN, '--help'], {
        stdio: 'inherit'
    })
})

test('create', () => {
    spawn('node', [ARWEN, 'create', TEST_PROJECT], {
        cwd: TEST_DIR,
        env: {
            ARWEN_ENV: 'production',
            ...process.env
        },
        stdio: 'inherit'
    })
})

test('build', () => {
    spawn('node', [ARWEN, 'build'], {
        cwd: `${TEST_DIR}/${TEST_PROJECT}`,
        env: {
            ARWEN_ENV: 'development',
            ...process.env
        },
        stdio: 'inherit'
    })
})

test('deploy', () => {
    spawn('node', [ARWEN, 'deploy', `./build`], {
        cwd: `${TEST_DIR}/${TEST_PROJECT}`,
        stdio: 'inherit'
    })
})

test('list', () => {
    spawn('node', [ARWEN, 'deploy', '-s', 'list'], {
        stdio: 'inherit'
    })
})

test('stop-0', () => {
    spawn('node', [ARWEN, 'deploy', '-s', 'stop', '--app-id', '0'], {
        stdio: 'inherit'
    })
})

test('stop-all', () => {
    spawn('node', [ARWEN, 'deploy', '-s', 'stop'], {
        stdio: 'inherit'
    })
})

test('push', () => {
    spawn('node', [ARWEN, 'push', 'development'], {
        cwd: `${TEST_DIR}/${TEST_PROJECT}`,
        stdio: 'inherit'
    })
})
