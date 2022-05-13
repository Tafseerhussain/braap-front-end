<template>
  <v-dialog v-model="dialog" persistent scrollable fullscreen transition="dialog-bottom-transition">
    <v-card>
      <v-card-text class="pt-8">
        <div class="machine-assets pt-0">
          <v-container class="py-0">
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="primary"
                  x-large
                  class="rounded-10 body-0 px-6 text-capitalize mr-5"
                  dark
                  @click="closeDialog"
                >
                  <v-icon class="mr-1" color="white">mdi-arrow-left</v-icon>
                  <span class="">Back</span>
                </v-btn>
                <v-slide-x-transition>
                  <v-btn
                    v-if="selectedMachines.length > 0"
                    color="braap_orange"
                    dark
                    x-large
                    class="rounded-10"
                    @click="select"
                  >
                    + Select Machine | Asset
                  </v-btn>
                </v-slide-x-transition>
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
            <v-divider class="mt-10 mb-8"></v-divider>

            <!-- <div class="mb-4 body-2 text-right" v-if="this.machines.length > 0">
            Viewing {{ this.machines.length }} of {{ this.total }} machines
          </div> -->
            <div ref="container" class="d-flex flex-wrap card-container">
              <!-- machines grid -->
              <template v-if="machines.length > 0">
                <MachineAsset
                  v-for="machine in machines"
                  :key="machine.id"
                  :value="machine"
                  :selected="selectedMachines.findIndex((x) => x.id === machine.id) >= 0"
                  @select="selectMachine"
                  :readonly="true"
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
                      >Select Machine</v-btn
                    >
                  </template>
                </MachineAsset>

                <div class="ma-auto px-4" v-intersect.quiet="loadMore" v-if="!loading && hasMore"></div>
              </template>
              <!-- skeleton loader -->
              <template v-if="loading">
                <MachineAssetSkeleton v-for="index of this.pageSize" :key="index"></MachineAssetSkeleton>
              </template>
              <template v-else-if="machines.length == 0">
                <!-- No matching machine -->
                <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
                  <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
                  <p class="mb-0" v-if="noMachine">Setup your first machine or asset.</p>
                  <p class="mb-0" v-else>No machines or assets were found for your search.</p>
                </div>
              </template>
            </div>
          </v-container>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import MachineAsset from '@/components/Vehicle/MachineAsset.vue'
  import MachineAssetSkeleton from '@/components/Vehicle/MachineAssetSkeleton.vue'
  import mixins from '@/components/Search/mixins'

  export default {
    name: 'MachineSelector',
    components: { MachineAsset, MachineAssetSkeleton },
    props: {
      value: {
        type: Boolean
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
        pageSize: 4,
        total: 0,
        hasMore: true,
        selectedMachines: [],
        dialog: false
      }
    },
    mixins: [mixins],
    watch: {
      value(val) {
        this.dialog = val
        if (val) {
          this.loading = true
          this.$nextTick(() => {
            this.setPageSize()
            this.machines = []
            this.pageIndex = 1
            this.filter = 'reset'
            this.query = null
            this.selectedMachines = []
            this.getUserVehicle()
          })
        }
      },

      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          setTimeout(() => {
            this.$scrollbar_show()
          }, 200)
        }
      }
    },
    computed: {},
    created() {
      this.queryChange = debounce(() => {
        this.pageIndex = 1
        this.getUserVehicle()
      }, 500)
    },
    mounted() {},
    methods: {
      getUserVehicle() {
        this.$axios
          .post('/api/vehicle/list', {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            filterby: this.filter,
            searchQuery: this.query,
            usedForLinkCustomer: true
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
        let index = this.selectedMachines.findIndex(x => x.id === machine.id)
        console.log(index)
        if (index >= 0) this.selectedMachines.splice(index, 1)
        else this.selectedMachines.push(machine)
      },
      closeDialog() {
        this.dialog = false
        this.$emit('input', false)
      },
      select() {
        this.$emit('select', this.selectedMachines)
        setTimeout(() => {
          this.closeDialog()
        }, 500)
      }
    }
  }
</script>

<style lang="scss">
</style>
