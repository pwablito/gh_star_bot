export const get_users = get_users;
export const get_starred_repos_for_user = get_starred_repos_for_user;

async function get_users(octokit_obj, username, network_size = 1) {
    let users = [];
    users.push(username);
    for (let i = 0; i < network_size; i++) {
        for (let user of users) {
            let data = await octokit_obj.users.listFollowingForUser({
                username: user.login
            });
            users = [...new Set(users.concat(data.data.map(user => user.login)))];
            data = await octokit_obj.users.listFollowersForUser({
                username: user.login
            });
            users = [...new Set(users.concat(data.data.map(user => user.login)))];
        }
    }
    return users;
}

async function get_starred_repos_for_user(octokit_obj, username) {
    let repos = [];
    let data = await octokit_obj.repos.listForUser({
        username: username
    });
    return repos.concat(data.data.map(repo => repo));
}