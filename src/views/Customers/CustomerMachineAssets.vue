<template>
  <div class="customer-machine-assets">
    <v-container class="py-0">
      <v-row class="mb-5">
        <v-col cols="6">
          <v-btn color="braap_orange" dark x-large class="mr-4 mb-0 rounded-10" @click="openSelector">
            + Associate Machine | Asset
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-text-field
            outlined
            hide-details
            placeholder="Search shop by name, location, VIN, or asset ID"
            @keydown="queryChange"
            v-model="query"
            class="rounded-10 braap-filter-search"
          >
            <template #prepend-inner>
              <v-icon>$svg-search</v-icon>
            </template>
            <template #append>
              <v-menu offset-y nudge-bottom="12" bottom left nudge-right="12" content-class="menu-dropdown">
                <template v-slot:activator="{ attrs, on }">
                  <v-icon color="primary" size="28" v-bind="attrs" v-on="on">$svg-settings</v-icon>
                </template>
                <v-list dense>
                  <v-list-item-group :mandatory="true" v-model="filter" @change="filterChanged">
                    <v-list-item
                      v-for="option in filterOptions"
                      :key="option.value"
                      link
                      :value="option.value"
                      class="px-3"
                      @click="filterItemClicked(option)"
                    >
                      <v-checkbox
                        :label="option.text"
                        hide-details
                        :ripple="false"
                        v-model="option.checked"
                        color="braap_orange"
                        class="ma-0 pb-1"
                      >
                      </v-checkbox>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <!-- <v-divider class="mt-10 mb-8"></v-divider> -->
      <div class="machine-grid">
        <!-- <div class="mb-4 body-2 text-right" v-if="this.machines.length > 0">
          Viewing {{ this.machines.length }} of {{ this.total }} machines
        </div> -->
        <div ref="container" class="d-flex flex-wrap card-container">
          <template v-if="machines.length > 0">
            <MachineAsset
              v-for="machine in machines"
              :key="machine.id"
              :value="machine"
              :selected="machine.id === selectedMachine"
              @remove="unlinkMachine"
              @select="selectMachine"
              @edit="editMachine"
              remove-tooltip="Remove from customer"
            >
              <template #action>
                <v-btn
                  dark
                  color="braap_orange"
                  class="rounded-0 body-2 ml-n4 mb-n4"
                  large
                  block
                  absolute
                  bottom
                  @click="openWorkplace(machine)"
                  style="height: 48px"
                  >Interactive Workspace</v-btn
                >
              </template>
            </MachineAsset>
            <div class="ma-auto px-4" v-intersect.quiet="loadMore" v-if="!loading && hasMore"></div>
          </template>
          <template v-if="loading">
            <MachineAssetSkeleton v-for="index of this.pageSize" :key="index"></MachineAssetSkeleton>
          </template>
          <template v-else-if="machines.length == 0">
            <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
              <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
              <p class="mb-0" v-if="noMachine">Setup your first machine or asset.</p>
              <p class="mb-0" v-else>No machines or assets were found for your search.</p>
            </div>
          </template>
        </div>
      </div>
    </v-container>

    <AddMachineDialog
      v-model="dialog"
      :vehicleId="currentVehicleId"
      :userType="userType"
      @saved="machineSaved"
    ></AddMachineDialog>

    <MachineSelectorDialog v-model="openDialog" @select="linkMachines"></MachineSelectorDialog>
  </div>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import MachineAsset from '@/components/Vehicle/MachineAsset.vue'
  import MachineAssetSkeleton from '@/components/Vehicle/MachineAssetSkeleton.vue'
  import AddMachineDialog from '@/components/Vehicle/AddMachineDialog.vue'
  import MachineSelectorDialog from './MachineSelector.vue'
  import mixins from '@/components/Search/mixins'

  export default {
    name: 'CustomerMachineAssets',
    components: { MachineAsset, MachineAssetSkeleton, AddMachineDialog, MachineSelectorDialog },
    props: {
      userType: {
        type: String
      },
      customerId: {
        type: [String, Number]
      }
    },
    data: function() {
      return {
        noMachine: null,
        query: null,
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
        pageIndex: 1,
        total: 0,
        hasMore: true,
        selectedMachine: null,
        // add dialog
        dialog: false,
        currentVehicleId: null,
        openDialog: false
      }
    },
    mixins: [mixins],
    watch: {
      value(val) {
        this.selectedMachine = val
      }
    },
    created() {
      this.queryChange = debounce(() => {
        this.pageIndex = 1
        this.getUserVehicle()
      }, 500)
    },
    mounted() {},
    methods: {
      getUserVehicle(resolve) {
        this.$axios
          .post('/api/vehicle/list', {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            filterby: this.filter,
            searchQuery: this.query,
            userCustomerId: this.customerId
          })
          .then(result => {
            if (result.success && result.data) {
              if (this.pageIndex === 1) this.machines = result.data.data
              else this.machines = this.machines.concat(result.data.data)
              this.loading = false
              this.hasMore = result.data.data.length >= this.pageSize
              this.total = result.data.count
              if (this.noMachine === null) this.noMachine = this.total === 0
            }
            if (resolve) resolve()
          })
      },
      loadMore(entries, observer, isIntersecting) {
        if (!isIntersecting) return
        this.pageIndex = this.pageIndex + 1
        this.loading = true
        this.getUserVehicle()
      },
      filterChanged() {
        this.pageIndex = 1
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
        this.checkUserVehicleLimitStatus().then(() => {
          this.selectedMachine = machine.id
          this.$emit('input', machine.id)
        })
      },
      checkUserVehicleLimitStatus() {
        return new Promise((resolve, reject) => {
          this.$axios.post('/api/myShop/checkUserVehicleLimitStatus').then(result => {
            if (result.success) {
              if (result.data === 'EXCEEDLIMIT') {
                this.$router.push({ name: 'PurchaseMachineAccess' })
              } else {
                resolve()
              }
            } else {
              reject()
            }
          })
        })
      },
      editMachine(machine) {
        this.checkUserVehicleLimitStatus().then(() => {
          this.currentVehicleId = machine.id
          this.dialog = true
        })
      },
      machineSaved() {
        this.filter = 'reset'
        this.query = ''
        this.pageIndex = 1
        this.getUserVehicle()
      },
      openWorkplace(machine) {
        this.checkUserVehicleLimitStatus().then(() => {
          this.$router.push({ name: 'Workshop', params: { id: machine.id } })
        })
      },
      // select machine
      openSelector() {
        this.openDialog = true
      },
      linkMachines(machines) {
        this.$axios
          .post(`/api/userCustomer/${this.customerId}/link`, { vehicleIds: machines.map(x => x.id) })
          .then(result => {
            if (result.success && result.data) {
              machines.forEach(m => {
                this.machines.splice(0, 0, { ...m })
              })
              this.total = this.total + machines.length
              this.noMachine = this.total === 0 && !this.query && this.filter === 'reset'
            }
          })
      },
      unlinkMachine(machine) {
        this.$axios.post(`/api/userCustomer/${this.customerId}/unLink`, { vehicleIds: [machine.id] }).then(result => {
          if (result.success && result.data) {
            var index = this.machines.findIndex(x => x.id === machine.id)
            this.machines.splice(index, 1)
            this.total = this.total - 1
            this.noMachine = this.total === 0 && !this.query && this.filter === 'reset'
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .customer-machine-assets {
  }
</style>
