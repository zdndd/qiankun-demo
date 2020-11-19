const userInfo = JSON.parse(localStorage.getItem('userInfo'));

export function getUserCustomId(): string {
    return userInfo.customerid;
}
export function getUserName(): string {
    return userInfo.usernamealias || userInfo.username;
}
