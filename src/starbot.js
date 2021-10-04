#!/usr/bin/env node

'use strict';

const { Octokit } = require("@octokit/rest");
const { ArgumentParser } = require('argparse');
const { get_users, get_starred_repos_for_user } = require('./github_util');

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

    let users = await get_users(octokit, args.user);

    let repos = [];
    for (let user of users) {
        repos = repos.concat(await get_starred_repos_for_user(octokit, user));
    }
    repos.forEach(repo => {
        octokit.rest.activity.starRepoForAuthenticatedUser({
            owner: repo.owner.login,
            repo: repo.name,
        }).then(() => {
            console.log(`Starred ${repo.name}`);
        }).catch((err) => {
            console.error(err);
        });
    });
}

main().then(() => {}).catch((e) => {
    console.error(e);
});