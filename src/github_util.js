module.exports = {
    get_users: get_users,
    get_starred_repos_for_user: get_starred_repos_for_user,
};

async function get_users(octokit_obj, username) {
    let users = [];
    users.push(username);
    let data = await octokit_obj.users.listFollowingForUser({
        username: username
    });
    return users.concat(data.data.map(user => user.login));
}

async function get_starred_repos_for_user(octokit_obj, username) {
    let repos = [];
    let data = await octokit_obj.repos.listForUser({
        username: username
    });
    return repos.concat(data.data.map(repo => repo));
}