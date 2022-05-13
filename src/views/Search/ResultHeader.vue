<template>
  <div class="result-header">
    <v-container>
      <v-row>
        <v-col>
          <div class="result-search mx-auto">
            <BraapSearch
              ref="braapSerach"
              v-model="filter.query"
              class="white"
              placeholder="Enter any part, problem description, or maintenance"
              v-intersect="{ handler: onIntersect }"
              @search="queryChanged"
            ></BraapSearch>
            <div class="search-types d-flex body-2 mt-4 text-decoration-underline">
              <slot name="searchTab"></slot>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="fitment-search mx-auto d-flex">
            <v-row>
              <v-col col="3">
                <v-select
                  ref="type"
                  v-model="filter.machineType"
                  dark
                  label="Type"
                  hide-details
                  no-data-text=""
                  :items="selectList.type"
                  :menu-props="menuProps"
                  append-icon="mdi-chevron-down"
                  class="mb-1"
                  @change="changeAndGetNext('make', true)"
                >
                </v-select>
              </v-col>
              <v-col col="3">
                <v-select
                  ref="make"
                  v-model="filter.make"
                  dark
                  label="Make"
                  hide-details
                  :items="selectList.make"
                  :readonly="selectList.make.length === 0"
                  :menu-props="menuProps"
                  append-icon="mdi-chevron-down"
                  class="mb-1"
                  @change="changeAndGetNext('year', true)"
                >
                </v-select>
              </v-col>
              <v-col col="3">
                <v-select
                  ref="year"
                  v-model="filter.year"
                  dark
                  label="Year"
                  hide-details
                  :items="selectList.year"
                  :readonly="selectList.year.length === 0"
                  :menu-props="menuProps"
                  append-icon="mdi-chevron-down"
                  class="mb-1"
                  @change="changeAndGetNext('model', true)"
                ></v-select>
              </v-col>
              <v-col col="3">
                <v-select
                  ref="model"
                  v-model="filter.model"
                  dark
                  label="Model"
                  hide-details
                  :items="selectList.model"
                  :readonly="selectList.model.length === 0"
                  :menu-props="menuProps"
                  append-icon="mdi-chevron-down"
                  class="mb-1"
                  @change="search"
                ></v-select>
              </v-col>
            </v-row>
            <div class="d-flex align-center pt-2 pl-12 pr-8">
              <v-btn x-large color="braap_orange" dark class="rounded-10 px-7 body-0 mr-2" @click="search"
                >Search</v-btn
              >
              <v-btn icon dark large @click="clearFilter"><v-icon size="40">mdi-refresh</v-icon></v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import BraapSearch from '@/components/BraapSearch'

  export default {
    name: 'ResultHeader',
    props: {
      show: {
        type: Number
      }
    },
    components: {
      BraapSearch
    },
    data: function() {
      return {
        menuProps: {
          offsetY: true,
          nudgeTop: '-4px',
          contentClass: 'rounded-0',
          maxHeight: '436'
        },
        filter: {
          query: null
        },
        selectList: {
          make: [],
          type: [],
          model: [],
          year: []
        }
      }
    },
    watch: {
      $route(val) {
        const {
          query: { query }
        } = val
        this.search({ query })
      }
    },
    created() {
      this.$store.commit('app/setHeaderSearch', false)
      this.$bus.$on('search', this.searchFromHeader)
      this.changeAndGetNext('type')

      // page first created, do search
      const {
        query: { query }
      } = this.$route
      this.filter.query = query
      if (this.filter.query) {
        this.search()
      } else {
        this.$router.push({ name: 'Home' })
      }
    },
    mounted() {},
    destroyed() {
      this.$bus.$off('search', this.searchFromHeader)
      this.$store.commit('app/setHeaderSearch', true)
    },
    methods: {
      onIntersect(entries) {
        this.$store.commit('app/setHeaderSearch', !entries[0].isIntersecting)
        if (!entries[0].isIntersecting) {
          this.$refs.braapSerach.hideMenu()
        }
      },
      // User enter some words and then press enter, or select 1 predefined item
      queryChanged(query) {
        this.filter.query = query
        this.$refs.braapSerach.hideMenu()
        this.search()
      },
      // User search at the float header
      searchFromHeader(query) {
        this.filter.query = query
        this.search()
      },
      search() {
        if (this.filter.query) {
          this.$bus.$emit('updateSearchQuery', this.filter.query)
          this.$url.update('query', this.filter.query)
          this.getFilterContext(this.filter.query).then(() => {
            this.$emit('search', this.filter)
          })
        } else {
          this.$msg.warning('Please enter any part, problem description, or maintenance to start search.')
        }
      },
      changeAndGetNext(name, open) {
        if (name === 'type') {
          this.selectList.make = []
          this.selectList.year = []
          this.selectList.model = []
          this.filter.make = ''
          this.filter.model = ''
          this.filter.year = ''
        }
        if (name === 'make') {
          this.selectList.year = []
          this.selectList.model = []
          this.filter.model = ''
          this.filter.year = ''
        }
        if (name === 'year') {
          this.selectList.model = []
          this.filter.model = ''
        }

        this.$axios.post('/api/search/getFilterSelectListData', { ...this.filter, selectName: name }).then(result => {
          if (result && result.success) {
            this.selectList[name] = result.data
            if (open) {
              this.openSelect(name)
            }
          }
        })
      },
      clearFilter() {
        this.filter.type = ''
        this.changeAndGetNext('type')
      },
      openSelect(name) {
        this.$refs[name].isMenuActive = true
        this.$refs[name].isFocused = true
      },
      getFilterContext(query) {
        return new Promise((resolve, reject) => {
          this.$axios.post('/api/search/getFilterContext', { query }).then(result => {
            if (result && result.success) {
              if (result.data.machinetype) {
                this.filter.machineType = result.data.machinetype
                this.changeAndGetNext('make')
              }
              if (result.data.make) {
                this.filter.make = result.data.make
                this.changeAndGetNext('year')
              }
              resolve()
            } else {
              reject()
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .result-header {
    padding: 100px 0;
    background: url('/img/search/bg.jpg') no-repeat;
    background-size: cover;
    background-position: center center;

    .result-search {
      max-width: 770px;
      .braap-search {
        .v-input__slot {
          min-height: 58px !important;
        }
        .v-input__prepend-inner {
          margin-top: 18px !important;
        }
        .v-input__append-inner {
          margin-top: 10px !important;
        }
      }
    }

    .fitment-search {
      background: rgba(0, 0, 0, 0.8);
      border-radius: 10px;
      backdrop-filter: blur(6px);
      padding: 20px 30px 30px;
      margin-top: 40px;
    }
  }
</style>
