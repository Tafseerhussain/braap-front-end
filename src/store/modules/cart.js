import axios from "axios";

// import { deepCopy } from '@/utils'
const cart = {
    namespaced: true,

    actions: {
        getCartListItems({ commit }) {
            axios.post('/api/cart/items/incart').then(result => {
                if (result.success && result.data) {
                    commit('GETCARTLISTITEMS', result.data)
                }
            })
        },
        getHistoryListItems({ commit }) {
            axios.post('/api/cart/items/history').then(result => {
                if (result.success && result.data) {
                    commit('GETHISTORYLISTITEMS', result.data)
                }
            })
        },
        getSavedListItems({ commit }) {
            axios.post('/api/cart/items/saved').then(result => {
                if (result.success && result.data) {
                    commit('GETSAVEDLISTITEMS', result.data)
                }
            })
        },
    },

    mutations: {
        GETCARTLISTITEMS(state, value) {
            state.cartListItems = value;
        },
        GETHISTORYLISTITEMS(state, value) {
            state.historyListItems = value
        },
        GETSAVEDLISTITEMS(state, value) {
            state.saveListItems = value
        },
        getCartData(state, value) {
            const { cartListItems, historyListItems, saveListItems } = value
            state.cartListItems = cartListItems;
            state.historyListItems = historyListItems;
            state.saveListItems = saveListItems;
        },
        changePartCount(state, value) {
            const { countValue, vehicleId, vehicleWorkId, cartItemId } = value
            state.cartListItems.find(item => {
                return item.vehicleId === vehicleId
            }).works.find(item => {
                return item.vehicleWorkId === vehicleWorkId
            }).parts.find(item => {
                return item.cartItemId === cartItemId
            }).partQty = countValue
        },
        addToKit(state, value) {
            const { vehicleId, vehicleWorkId, cartItemId, newTag } = value
            const tags = state.cartListItems.find(item => {
                return item.vehicleId === vehicleId
            }).works.find(item => {
                return item.vehicleWorkId === vehicleWorkId
            }).parts.find(item => {
                return item.cartItemId === cartItemId
            }).tags

            tags.push(newTag)
        },
        deleteKit(state, value) {
            const { kitId, vehicleId, vehicleWorkId, cartItemId } = value
            const tags = state.cartListItems.find(item => {
                return item.vehicleId === vehicleId
            }).works.find(item => {
                return item.vehicleWorkId === vehicleWorkId
            }).parts.find(item => {
                return item.cartItemId === cartItemId
            }).tags

            const kit = tags.findIndex(item => {
                return item.id === kitId
            })
            tags.splice(kit, 1)

        },
        changeTab(state, value) {
            state.tab = value
        },
        resetFilter(state) {
            state.selectedKits = []
            state.selectedType = []
            state.selectedMachines = []
        },
        selectedMachinesChange(state, value) {
            state.selectedMachines = value
        },
        selectedTypeChange(state, value) {
            state.selectedType = value
        },
        selectedKitsChange(state, value) {
            state.selectedKits = value
        },
        onQueryChanged(state, value) {
            state.query = value
        }
    },

    getters: {
        baseListItems: state => {
            if (state.tab === 0) {
                return state.cartListItems || []
            } else if (state.tab === 1) {
                return state.saveListItems || []
            } else if (state.tab === 2) {
                return state.historyListItems || []
            }
        },


        machineArr: (_, getters) => getters.baseListItems.map(item => {
            return item.vehicleId
        }),

        kitArr: (_, getters) => {
            let kitArr = []
            let kitOptionsArr = []
            getters.baseListItems.forEach(item => {
                item.works.forEach(d => {
                    d.parts.forEach(p => {
                        let kitList = p.tags
                        kitArr = [...kitArr, ...kitList]
                    })
                })
            })
            kitArr.forEach(item => {
                if (!kitOptionsArr.find(p => item.tagName.toUpperCase() === p.tagName.toUpperCase())) {
                    kitOptionsArr.push(item)
                }
            })
            return kitOptionsArr
        },

        filterCartList: (state, getters) => {
            const { selectedMachines, selectedType, selectedKits, query } = state
            // const { selectedMachines, selectedType, query } = state
            let list = JSON.parse(JSON.stringify(getters.baseListItems))


            if (selectedMachines.length > 0 && selectedMachines.length !== list.length) {
                let arr = []
                selectedMachines.map(sm => {
                    return list.filter(l => {
                        return l.vehicleId === sm
                    })
                }).forEach(item => {
                    arr = [...arr, ...item]
                })
                list = arr
            }

            if (selectedType.length > 0 && selectedType.length < 2) {
                if (selectedType[0] === 'service') {
                    list.forEach(item => {
                        item.works.forEach(d => {
                            d.parts = []
                        })
                    })
                    console.log(list);
                } else {
                    console.log('part');
                }
            }

            if (selectedKits.length > 0) {
                let arr = []
                let count = 0;
                let dArr = []
                list = list.filter((l, index) => {
                    l.works.forEach(d => {
                        arr.push(d.parts.filter((p) => {
                            let pArr = p.tags.map(item => {
                                return item.tagName.toUpperCase()
                            })
                            return selectedKits.every(kl => pArr.includes(kl.toUpperCase()))
                        }))
                        d.parts = arr[count]
                        count += 1
                    })
                    dArr.push(l.works.filter(d => {
                        return d.parts.length !== 0
                    }))
                    l.works = dArr[index]
                    return l.works.length !== 0
                })
            }

            if (query) {
                let key = query.toUpperCase()
                list = list.filter(l => {
                    if (l.vehicleFullname && l.vehicleFullname.toUpperCase().indexOf(key) >= 0) {
                        return true
                    } else {
                        let returnDiagnostics = l.works.filter(d => {
                            let returnParts = d.parts.filter(p => {
                                return p.partName && p.partName.toUpperCase().indexOf(key) >= 0
                            })
                            d.parts = returnParts
                            return returnParts.length > 0 || (d.workName && d.workName.toUpperCase().indexOf(key) >= 0)
                        })
                        l.works = returnDiagnostics
                        return returnDiagnostics.length > 0
                    }

                })
            }

            return list || []
        },

        subtotal: (state) => {
            let sum = 0
            state.cartListItems.forEach(l => {
                l.works.forEach(d => {
                    sum += d.workQty * d.workPrice
                    d.parts.forEach(p => {
                        sum += p.partQty * p.partPrice
                    })
                })
            })
            return sum
        }
    },


    state: {
        cartListItems: [],
        historyListItems: [],
        saveListItems: [],
        tab: 0,
        selectedKits: [],
        selectedType: [],
        selectedMachines: [],
        query: ''
    }
}

export default cart