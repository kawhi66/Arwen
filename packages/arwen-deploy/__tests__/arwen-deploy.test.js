'use strict';
const path = require('path')
const arwenDeploy = require('..')

// jest.setTimeout(20000)
test('@arwen/arwen-deploy', () => {
    return arwenDeploy({
        auth: {
            host: '192.168.39.31',
            username: 'kawhi',
            password: 'kawhi'
        },
        localFiles: [path.resolve(__dirname, './abc/test.md')],
        remotePath: '/home/kawhi/testtest',
        silent: true
    }).then(result => {
        console.log('deploy succeed')
    }).catch(error => {
        console.error(error)
    })
});
