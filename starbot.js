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

    let users = [];

    users.push(args.user);
    let data = await octokit.users.listFollowingForUser({
        username: args.user
    });
    users = users.concat(data.data.map(user => user.login));
    for (let user of users) {
        data = await octokit.rest.repos.listForUser({
            username: user,
        });
        data.data.forEach(item => {
            octokit.rest.activity.starRepoForAuthenticatedUser({
                owner: item.owner.login,
                repo: item.name,
            }).then(() => {
                console.log(`Starred ${item.full_name}`);
            }).catch((err) => {
                console.error(err);
            });
        });
    }
}

main().then(() => {}).catch((e) => {
    console.error(e);
});