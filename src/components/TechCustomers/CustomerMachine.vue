<template>
  <div>
    <div class="machine-grid pt-4">
      <div class="d-flex flex-column flex-sm-row align-stretch align-center mb-4">
        <v-btn color="primary" dark large class="mr-0 mr-sm-4 mb-4 mb-sm-0" @click="openSelector">
          + Associate MACHINE | ASSET
        </v-btn>
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
      <div ref="container" class="d-flex flex-wrap mb-0 mx-n4">
        <!-- machines grid -->
        <template v-if="machines.length > 0">
          <Machine
            v-for="machine in machines"
            :key="machine.Id"
            :value="machine"
            @remove="removeMachine"
            @select="openTimeline"
            @edit="editMachine"
            removeTooltip="Remove from customer"
          ></Machine>
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
        <template v-else-if="machines.length === 0">
          <!-- No machine, add first notification -->
          <div
            v-if="noMachine"
            class="d-flex align-center align-sm-end pl-4 pl-sm-10 pr-4 mt-0 subtitle-1 font-weight-medium text-sm-h6"
          >
            <ArrowLine class="d-none d-sm-inline-block mb-3 flex-shrink-0"></ArrowLine>
            <v-icon large class="d-block d-sm-none">mdi-arrow-up-thin</v-icon>
            Click to associate the first machine or asset to your customer.
          </div>
          <!-- No matching machine -->
          <div v-else class="pa-4 mt-4 flex-grow-1 subtitle-1 text-sm-h6 font-weight-regular text-center">
            Try again, no machine found.
          </div>
        </template>
      </div>
    </div>

    <AddMachineForm v-model="dialog" :vehicleId="currentVehicleId" @saved="machineSaved"></AddMachineForm>

    <MachineSelector v-model="openDialog" @select="selectMachine"></MachineSelector>
  </div>
</template>

<script>
  import MachineSelector from './MachineSelector.vue'
  import { debounce } from 'vue-debounce'
  import ArrowLine from '../../assets/arrow-line.svg'
  import Machine from '../MyShop/Machine.vue'
  import AddMachineForm from '@/components/Vehicle/AddMachineDialog.vue'

  export default {
    name: 'CustomerMachine',
    components: { ArrowLine, Machine, AddMachineForm, MachineSelector },
    props: {
      customerId: {
        type: [String, Number]
      },
      customerName: {
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
          { value: 'reset', text: 'Show All', checked: true }
        ],
        loading: true,
        machines: [],
        pageNum: 1,
        pageSize: 4,
        total: 0,
        hasMore: true,
        // add dialog
        dialog: false,
        currentVehicleId: null,
        // select dialog
        openDialog: false
      }
    },
    watch: {},
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
    },
    methods: {
      setPageSize() {
        var height = window.innerHeight - this.$refs.container.offsetTop
        var width = window.innerWidth
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
      getUserVehicle(resolve) {
        this.$axios
          .post('/MyShop/GetUserVehicleApi', {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            filterby: this.filter,
            searchString: this.query,
            userCustomerId: this.customerId
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              if (this.pageNum === 1) this.machines = result.data
              else this.machines = this.machines.concat(result.data)
              this.loading = false
              this.querying = false
              this.hasMore = result.data.length >= this.pageSize
              if (resolve) resolve()
            }
          })

        this.$axios
          .post('/MyShop/GetUserVehicleCount', {
            filterby: this.filter,
            searchString: this.query,
            userCustomerId: this.customerId
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
      removeMachine(machine) {
        this.$axios
          .post('/UserCustomer/UnLinkMachineToCustomer', {
            vehicleId: machine.Id
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              var index = this.machines.findIndex(x => x.Id === machine.Id)
              this.machines.splice(index, 1)
              this.total = this.total - 1
            }
          })
      },
      openTimeline(machine) {
        window.location.href = '/myshop?timeline=' + machine.Id
      },
      // edit machine
      editMachine(machine) {
        this.currentVehicleId = machine.Id
        this.dialog = true
      },
      machineSaved() {
        this.filter = 'reset'
        this.query = ''
        this.pageNum = 1
        this.getUserVehicle()
      },
      // select machine
      openSelector() {
        this.openDialog = true
      },
      selectMachine(machines) {
        this.$axios
          .post('/UserCustomer/LinkMachineToCustomer', {
            vehicleIds: machines.map(x => x.Id),
            customerId: this.customerId
          })
          .then(result => {
            if (result && result.status === 200 && result.data) {
              machines.forEach(m => {
                this.machines.splice(0, 0, { ...m, UserCustomerName: this.customerName })
              })
              this.total = this.total + machines.length
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  .machine-grid {
  }
</style>
