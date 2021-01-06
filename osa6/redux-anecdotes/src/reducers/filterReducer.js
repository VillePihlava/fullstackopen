const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'OVERWRITE_FILTER':
            return action.data
        default:
            return state
    }
}

export const overwriteFilter = (filter) => {
    return {
        type: 'OVERWRITE_FILTER',
        data: filter
    }
}

export default filterReducer