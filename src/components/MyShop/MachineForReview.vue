<template>
  <div>
    <div class="machine-grid pt-4 px-3 px-sm-4">
      <div class="d-flex flex-column flex-sm-row align-stretch align-center mb-4">
        <v-text-field
          solo
          hide-details
          placeholder="Search shop by name, location, VIN, or asset ID"
          prepend-inner-icon="mdi-magnify"
          @keydown="queryChange"
          v-model="query"
          :loading="querying"
        >
          <template #append>
            <v-menu offset-y nudge-bottom="12" bottom left nudge-right="12" content-class="menu-dropdown">
              <template v-slot:activator="{ attrs, on }">
                <v-icon color="primary" v-bind="attrs" v-on="on">$svg-settings</v-icon>
              </template>
              <v-list>
                <v-list-item-group color="#000" :mandatory="true" v-model="filter" @change="filterChanged">
                  <v-list-item
                    v-for="option in filterOptions"
                    :key="option.value"
                    link
                    :value="option.value"
                    class="px-2"
                    @click="filterItemClicked(option)"
                  >
                    <v-checkbox
                      :label="option.text"
                      hide-details
                      :ripple="false"
                      v-model="option.checked"
                      class="ma-0 py-2 text-uppercase font-weight-medium"
                    >
                    </v-checkbox>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </div>
      <div class="mb-4 body-2 text-right" v-if="this.machines.length > 0">
        Viewing {{ this.machines.length }} of {{ this.total }} machines
      </div>
      <div ref="container" class="d-flex flex-wrap mb-4 mx-n4">
        <!-- machines grid -->
        <template v-if="machines.length > 0">
          <MachineTech
            v-for="machine in machines"
            :key="machine.Id"
            :value="machine"
            :selected="machine.Id === selectedMachine"
            @select="selectMachine"
          ></MachineTech>
          <div class="ma-auto px-4" v-intersect.quiet="loadMore" v-if="!loading && hasMore"></div>
        </template>
        <!-- skeleton loader -->
        <template v-if="loading">
          <v-card
            v-for="index of this.pageSize"
            :key="index"
            class="d-flex flex-column mx-4 mb-8 pa-3 pb-0 primary--text machine-item"
          >
            <v-skeleton-loader class="mb-2" type="list-item-avatar"></v-skeleton-loader>
            <v-skeleton-loader type="image"></v-skeleton-loader>
            <v-skeleton-loader class="my-4" type="text@2"></v-skeleton-loader>
            <v-skeleton-loader class="d-flex justify-space-between mb-5" type="heading@2"></v-skeleton-loader>
          </v-card>
        </template>
        <template v-else-if="machines.length == 0">
          <!-- No machine, add first notification -->
          <div v-if="noMachine" class="pa-4 mt-4 flex-grow-1 subtitle-1 text-sm-h6 font-weight-regular text-center">
            Waiting for the first machine to be assigned. Make sure your hours, skills, and settings are up-to-date on
            the <a href="/account">account</a> page.
          </div>
          <!-- No matching machine -->
          <div v-else class="pa-4 mt-4 flex-grow-1 subtitle-1 text-sm-h6 font-weight-regular text-center">
            Try again, no machine found.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import MachineTech from './MachineTech.vue'

  export default {
    name: 'MachineForReview',
    components: { MachineTech },
    props: {
      value: {
        type: String
      },
      userType: {
        type: String
      }
    },
    data: function() {
      return {
        query: null,
        querying: false,
        filter: 'reset',
        filterOptions: [
          { value: 'recently_added', text: 'Recently added', checked: false },
          { value: 'recent_diagnostics', text: 'Recent diagnostics', checked: false },
          { value: 'require_response', text: 'Require Response', checked: false },
          { value: 'favourite', text: 'Favorites', checked: false },
          { value: 'scheduled_jobs', text: 'Scheduled Jobs', checked: false },
          { value: 'deleted', text: 'Recycling bin', checked: false },
          { value: 'reset', text: 'Show All', checked: true }
        ],
        loading: true,
        machines: [],
        pageNum: 1,
        pageSize: 4,
        total: 0,
        hasMore: true,
        selectedMachine: null,
        // add dialog
        dialog: false,
        currentVehicleId: null
      }
    },
    watch: {
      value(val) {
        this.selectedMachine = val
      }
    },
    computed: {
      noMachine() {
        return this.filter === 'reset' && this.total === 0 && !this.query
      }
    },
    created() {
      this.queryChange = debounce(() => {
        this.pageNum = 1
        this.querying = true
        this.getUserVehicle()
      }, 500)
    },
    mounted() {
      this.setPageSize()
      this.getUserVehicle()
    },
    methods: {
      setPageSize() {
        var height = window.innerHeight - this.$refs.container.offsetTop
        var width = this.$refs.container.offsetWidth
        var rowNum = 5
        if (width > 2000) rowNum = Math.floor(width / 362)
        else if (width > 1700) rowNum = 5
        else if (width > 1280) rowNum = 4
        else if (width > 1020) rowNum = 3
        else if (width > 650) rowNum = 2
        else rowNum = 1

        if (rowNum > 1) {
          var colNum = Math.ceil(height / 475)
          this.pageSize = rowNum * colNum
        } else {
          this.pageSize = 6
        }
      },
      getUserVehicle() {
        this.$axios
          .post('/MyShop/GetTechVehiclePaging', {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            filterby: this.filter,
            searchString: this.query
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              if (this.pageNum === 1) this.machines = result.data
              else this.machines = this.machines.concat(result.data)
              this.loading = false
              this.querying = false
              this.hasMore = result.data.length >= this.pageSize
            }
          })

        this.$axios
          .post('/MyShop/GetTechVehiclePagingCount', {
            filterby: this.filter,
            searchString: this.query
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              this.total = result.data
            }
          })
      },
      loadMore(entries, observer, isIntersecting) {
        if (!isIntersecting) return
        this.pageNum = this.pageNum + 1
        this.loading = true
        this.getUserVehicle()
      },
      filterChanged() {
        this.pageNum = 1
        this.query = null
        this.getUserVehicle()
      },
      filterItemClicked(option) {
        this.filterOptions.forEach(x => {
          x.checked = false
        })
        option.checked = true
      },
      selectMachine(machine) {
        this.selectedMachine = machine.Id
        this.$emit('input', machine.Id)
      }
    }
  }
</script>

<style lang="scss">
  .machine-grid {
  }
</style>
