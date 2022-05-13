const app = {
    namespaced: true,
    state: {
        showHeaderSearch: true
    },

    mutations: {
        setHeaderSearch: (state, result) => {
            state.showHeaderSearch = result
        }
    }
}

export default app