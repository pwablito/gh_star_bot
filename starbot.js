#!/usr/bin/env node

'use strict';


const { ArgumentParser } = require('argparse');
const { Octokit } = require("@octokit/rest");


async function main() {
    const parser = new ArgumentParser({
        description: 'GitHub Star Bot'
    });

    parser.add_argument('-t', '--token', { help: 'GitHub token', required: true });
    parser.add_argument('-u', '--user', { help: 'GitHub username', required: true });

    const args = parser.parse_args();

    const octokit = new Octokit({
        auth: args.token,
        userAgent: 'starbot'
    });

    let data = await octokit.rest.repos.listForUser({
        username: args.user,
    });
    data.data.forEach(item => {
        console.log(item.name);
    });
}

main().then(() => {

}).catch((e) => {
    console.error(e);
});