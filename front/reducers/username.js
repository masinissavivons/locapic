export default function(userInfo = {}, action) {
    if(action.type === "user") {
        let newUserInfo = action.userInfo;
        return newUserInfo;
    } else {
        return userInfo;
    }
}