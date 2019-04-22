'use strict';
const path = require('path')
const remoteDeploy = require('..').remoteDeploy

// jest.setTimeout(20000)
test('@arwen/arwen-deploy', () => {
    return remoteDeploy({
        auth: {
            host: '192.168.39.31',
            username: 'kawhi',
            password: 'kawhi'
        },
        localFiles: path.resolve(__dirname, './abc/**/*'),
        remotePath: '/home/kawhi/testabc',
        silent: true
    }).then(result => {
        console.log('deploy succeed')
    }).catch(error => {
        console.error(error)
    })
});
