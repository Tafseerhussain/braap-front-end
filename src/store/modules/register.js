const register = {
    namespaced: true,
    state: {
    },

    mutations: {
        setModel: (state, model) => {
            Object.keys(model).forEach(k => {
                state[k] = model[k]
            })
        },
        clearModel: (state) => {
            Object.keys(state).forEach(k => {
                state[k] = null
            })
        }
    }
}

export default register