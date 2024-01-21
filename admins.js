const adminsList = [1065713719];


function isAdmin(id) {
    for(const adminId of adminsList) {
        if(id == adminId) return true;
    }
    return false;
}


export { adminsList, isAdmin };
