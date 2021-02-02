const loadingReducer = (state = false, action) => {
    switch(action.type){
        case "setLoadingCondition":
            return !state

        default: return state
    }
}

export default loadingReducer