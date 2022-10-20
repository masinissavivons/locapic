export default function (list = [], action) {
    if (action.type === "addToList") {
        let newList = action.poiToAdd;
        return newList;
    } else {
        return list;
    }
}