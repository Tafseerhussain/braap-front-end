<template>
  <div class="work-shop">
    <v-row class="ma-0">
      <v-col cols="6" class="left">
        <div class="d-flex flex-column mx-n2">
          <div class="full-name primary--text font-weight-bold px-2">
            {{ vehicle.fullName }}
          </div>

          <v-btn-toggle
            class="rounded-10 workplace-tab px-2"
            v-model="currentTab"
            dense
            background-color="transparent"
            mandatory
          >
            <v-btn
              x-large
              :color="currentTab === tab.id ? 'braap_orange' : 'braap_light_grey'"
              :class="{ 'white--text': currentTab === tab.id }"
              class="flex-grow-1 mt-7 mb-5"
              v-for="tab in tabs"
              :key="tab.id"
            >
              <div class="d-flex flex-column">
                <v-icon class="mr-1" :color="currentTab === tab.id ? 'white' : 'braap_grey'">{{ tab.icon }}</v-icon>
                {{ tab.title }}
              </div>
            </v-btn>
          </v-btn-toggle>

          <v-tabs-items v-model="currentTab" class="px-2">
            <v-tab-item>
              <RequiredWork
                ref="requiredWork"
                :vehicleId="vehicleId"
                @on-work-remove="onWorkRemove"
                @on-part-remove="onPartRemove"
                @on-work-added="onWorkAdded"
                @on-part-added="onPartAdded"
              >
              </RequiredWork>
            </v-tab-item>
            <v-tab-item>
              <MachineDetails :vehicleId="vehicleId"></MachineDetails>
            </v-tab-item>
            <v-tab-item>
              <MachineHistory :vehicleId="vehicleId"></MachineHistory>
            </v-tab-item>
            <v-tab-item>
              <MachineJobs :vehicleId="vehicle" filter="INPROGRESS"></MachineJobs>
            </v-tab-item>
            <v-tab-item>
              <MachineJobs :vehicleId="vehicle" filter="HISTORY"></MachineJobs>
            </v-tab-item>
          </v-tabs-items>
          <v-divider class="mb-4 d-lg-none"></v-divider>
        </div>
      </v-col>
      <v-col cols="6" class="right">
        <div class="flex-grow-1">
          <MachineImages
            ref="image"
            class=""
            :vehicleId="vehicleId"
            @marker-removed="markerRemoved"
            @send-cart="reload"
          ></MachineImages>
        </div>
      </v-col>
    </v-row>

    <BottomSheet
      ref="bottom"
      v-bind="vehicle"
      @add-diagnostic="addWork"
      @add-part="addPart"
      :selectedDiagnostics="selectedDiagnostics"
      :selectedParts="selectedParts"
    ></BottomSheet>
  </div>
</template>

<script>
  import RequiredWork from './RequiredWork.vue'
  import MachineDetails from './MachineDetails.vue'
  import MachineHistory from './MachineHistory.vue'
  import MachineJobs from './MachineJobs.vue'
  import MachineImages from './MachineImages.vue'
  import BottomSheet from './BottomSheet.vue'

  export default {
    name: 'WorkShop',
    components: {
      RequiredWork,
      MachineDetails,
      MachineHistory,
      MachineJobs,
      MachineImages,
      BottomSheet
    },
    data: function() {
      return {
        tabs: [
          {
            id: 0,
            title: 'Requied Work',
            icon: 'mdi-briefcase-outline'
          },
          {
            id: 1,
            title: 'Details',
            icon: 'mdi-file-document-outline'
          },
          {
            id: 2,
            title: 'Interactive Builds',
            icon: 'mdi-gesture-double-tap'
          },
          {
            id: 3,
            title: 'Job In Progress',
            icon: 'mdi-progress-wrench'
          },
          {
            id: 4,
            title: 'History',
            icon: 'mdi-history'
          }
        ],
        currentTab: null,
        vehicleId: '',
        vehicle: {},
        selectedDiagnostics: [],
        selectedParts: []
      }
    },
    computed: {},
    created() {
      this.checkUserVehicleLimitStatus().then(() => {
        const {
          params: { id, tab }
        } = this.$route
        this.vehicleId = id
        this.getVehicle(id)

        if (tab) {
          this.currentTab = tab * 1
        } else this.currentTab = 0
      })
    },
    mounted() {
      this.$bus.$on('search', this.search)
    },
    destroyed() {
      this.$bus.$off('search', this.search)
    },
    watch: {},
    methods: {
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
      search(query) {
        this.$refs.bottom.search(query)
      },
      getVehicle(id) {
        this.$axios.post('/api/vehicle/' + id).then(result => {
          if (result.success && result.data) {
            this.vehicle = result.data
          }
        })
      },
      // diagnostics
      addWork(work) {
        let data = {
          action: 'DIAGNOSTIC',
          work: work.title,
          system: work.system
        }
        // console.log(data)
        this.$refs.requiredWork.addToWorkplace(data)
      },
      onWorkRemove(work) {
        // remove selected diagnostic
        let index = this.selectedDiagnostics.findIndex(x => x === work.work)
        if (index >= 0) this.selectedDiagnostics.splice(index, 1)
        // remove selected parts
        work.workParts.forEach(part => {
          let index = this.selectedParts.findIndex(x => x === part.braap_PartNumber)
          if (index >= 0) {
            this.selectedParts.splice(index, 1)
          }
        })
        this.$refs.image.reloadCurrentImage()
      },
      onWorkAdded(work) {
        this.selectedDiagnostics.push(work)
      },
      // parts
      addPart(part) {
        let data = {
          action: 'PART',
          partName: part.part_name,
          partPrice: part.decimalprice,
          partImage: part.thumbnail,
          braap_PartId: part.braap_part_id,
          braap_PartSupplierId: part.supplier_id,
          braap_PartNumber: part.part_number,
          filterApplied: this.vehicle.make + ' ' + this.vehicle.model + ' ' + this.vehicle.year,
          system: part.system,
          vehicleImageId: this.$refs.image.image.id
        }
        // console.log(part)
        this.$refs.requiredWork.addToWorkplace(data)
      },
      onPartRemove(part) {
        let index = this.selectedParts.findIndex(x => x === part.braap_PartNumber)
        if (index >= 0) {
          this.selectedParts.splice(index, 1)
        }
        this.$refs.image.reloadCurrentImage()
      },
      onPartAdded(part) {
        this.selectedParts.push(part.braap_PartNumber)
        this.$refs.image.reloadCurrentImage()
      },
      markerRemoved(id) {
        this.$refs.requiredWork.works.forEach(w => {
          var index = w.workParts.findIndex(p => p.assignWorkId === id)
          if (index >= 0) {
            this.onPartRemove(w.workParts[index])
            w.workParts.splice(index, 1)
          }
        })
      },
      reload() {
        this.$refs.requiredWork.getWorks()
      }
    }
  }
</script>

<style lang="scss">
  .work-shop {
    .left {
      background: #fcfcfc;
      padding: 50px;
      min-height: 100vh;
    }
    .right {
      background: #f7f7f7;
      padding: 50px;
      min-height: 100vh;
    }

    .full-name {
      font-size: 32px;
      line-height: 53px;
    }

    .workplace-tab {
      .v-btn:not(.v-btn--round).v-size--x-large {
        height: 76px;
      }
      .v-btn.v-btn {
        border: 0px;
      }
    }

    .theme--light.v-tabs-items {
      background: transparent;
    }
  }
</style>
