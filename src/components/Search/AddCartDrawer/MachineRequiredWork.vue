<template>
  <div class="machine-workplace d-flex pa-0">
    <v-card class="d-flex flex-column flex-grow-1">
      <div class="header pa-8 pb-5 d-flex flex-column">
        <v-btn icon class="mb-6" @click="closeDrawer">
          <v-icon color="primary">$svg-arrow-left</v-icon>
        </v-btn>
        <v-btn
          color="braap_orange"
          :dark="works.length > 0"
          class="mx-auto mb-12 rounded-10 body-0"
          :disabled="works.length === 0"
          @click="sendToCart"
          block
          x-large
        >
          <v-icon class="mr-2">mdi-cart</v-icon>Add to Cart
        </v-btn>
        <div class="text-h5 font-weight-medium mb-3 primary--text">{{ machine.fullName }}</div>
        <v-text-field
          flat
          outlined
          placeholder="Search required work and related parts"
          prepend-inner-icon="$svg-search"
          hide-details
          class="mb-2 rounded-10 braap-filter-search"
          v-model="query"
        ></v-text-field>
      </div>
      <perfect-scrollbar
        ref="ps"
        class="machine-container flex-grow-1 pa-8"
        :options="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <div ref="psContent" class="d-flex flex-column pt-1">
          <div v-show="selectWorks.length === 0">
            <v-scroll-x-transition group>
              <v-card
                class="work d-flex flex-column pa-4 pb-0 rounded-10 mb-7 bordered"
                color="braap_bg_grey"
                outlined
                flat
                v-for="work in filteredWork"
                :key="work.id"
              >
                <div
                  class="d-flex align-center rounded-10 white pa-5 body-2 mb-4 bordered shadow"
                  v-if="work.id != standaloneId"
                >
                  <v-tooltip right color="primary" open-delay="300">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        large
                        fab
                        :color="work.type === 'DIAGNOSTIC' ? 'braap_green' : 'error'"
                        class="white--text mr-2 text-h5"
                        elevation="0"
                        v-bind="attrs"
                        v-on="on"
                        @click="setWorkType(work)"
                      >
                        {{ work.type === 'DIAGNOSTIC' ? 'R' : 'M' }}
                      </v-btn>
                    </template>
                    <span>Click to set work as {{ work.type === 'DIAGNOSTIC' ? 'Maintenance' : 'Repair' }}</span>
                  </v-tooltip>

                  <span>
                    {{ work.work }}
                    <v-icon v-if="work.workParts && work.workParts.length > 0" color="success" size="20"
                      >$svg-label</v-icon
                    >
                  </span>
                  <v-btn icon absolute right top class="mt-n3 mr-n3" @click="removeWork(work.id)"
                    ><v-icon size="28">mdi-close-circle</v-icon></v-btn
                  >
                </div>
                <div v-else class="font-weight-medium rounded-10 white pa-5 body-2 mb-4 bordered shadow">
                  Parts, no related Diagnostic
                </div>

                <v-expand-transition>
                  <div v-if="work.workParts && work.workParts.length > 0" class="part-wrapper d-flex flex-column">
                    <div
                      v-for="part in work.workParts"
                      :key="part.assignWorkId"
                      class="
                        d-flex
                        align-center
                        justify-space-between
                        pa-4
                        mb-5
                        rounded-10
                        body-2
                        white--text
                        bordered
                        shadow
                        relative
                      "
                      style="background-color: #c4c4c4"
                    >
                      <div>{{ part.partName }}</div>
                      <v-btn
                        icon
                        absolute
                        right
                        top
                        class="mt-n7 mr-n7"
                        @click="removePart(part.assignWorkId, part.cartId, work.id)"
                      >
                        <v-icon size="28">mdi-close-circle</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-scroll-x-transition>
          </div>
        </div>
      </perfect-scrollbar>
      <v-overlay absolute color="rgba(0,0,0,0.5)" opacity="1" :value="selectWorks.length > 0" class="px-4">
        <div class="modal-arrow-wrapper mb-16 mt-5 body-0">Select a diagnostic then click to add the part to it.</div>
        <v-card
          light
          class="work d-flex flex-column rounded-10 white pa-5 body-2 mb-4 bordered shadow"
          v-for="work in selectWorks"
          :key="work.id"
          @click="selectWork(work.id)"
        >
          <div class="d-flex align-center" style="cursor: pointer">
            <v-avatar
              v-if="work.id != standaloneId"
              :color="work.type === 'DIAGNOSTIC' ? 'braap_green' : 'braap_red'"
              size="60"
              class="white--text mr-2"
            >
              {{ work.Type === 'DIAGNOSTIC' ? 'R' : 'M' }}
            </v-avatar>
            <span v-if="work.id != standaloneId" class="mr-1"> {{ work.work }} </span>
            <span v-else class="mr-1 font-weight-medium" style="padding: 7px 4px"> Parts, no related Diagnostic </span>
          </div>
        </v-card>
      </v-overlay>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'MachineRequiredWork',
    props: {
      machine: {
        type: Object,
        default: () => {}
      }
    },
    data: function() {
      return {
        works: [],
        selectWorks: [],
        query: null,
        data: null,
        standaloneId: 'STANDALONE PART'
      }
    },
    computed: {
      filteredWork() {
        if (!this.query) return this.works

        let key = this.query.toLowerCase()
        let work_partsFiltered = this.works.map(x => {
          let work = { ...x }
          work.workParts = work.workParts.filter(p => {
            return (
              (p.partName && p.partName.toLowerCase().indexOf(key) >= 0) ||
              (p.braap_PartNumber && p.braap_PartNumber.toLowerCase().indexOf(key) >= 0)
            )
          })
          return work
        })

        return work_partsFiltered.filter(
          x => (x.workParts && x.workParts.length > 0) || (x.work && x.work.toLowerCase().indexOf(key) >= 0)
        )
      }
    },
    created() {
      // this.getWorks()
    },
    methods: {
      moment,
      getWorks() {
        this.$axios
          .post(`/api/vehicle/${this.machine.id}/works/list`, {
            status: 'PROCESSING',
            workStatus: 'ACTIVE'
          })
          .then(result => {
            if (result.success) {
              this.works = result.data
            }
          })
      },
      addToWorkplace(data) {
        // cache data
        this.data = { ...data }

        if (data.action === 'DIAGNOSTIC') {
          // ajax to add diagnostic
          const { work, system } = data
          this.$axios
            .post(`/api/vehicle/${this.machine.id}/works/add`, {
              work,
              system
            })
            .then(result => {
              if (result.success) {
                if (!result.data.status) {
                  if (!result.data.isDuplicate) {
                    this.$msg.error('Something wrong during adding the part, please try again...')
                  } else {
                    this.$msg.warning('This part is already on the machine, adding will create a duplicate.')
                    this.$emit('on-work-added', work)
                  }
                } else {
                  this.$emit('on-work-added', work)
                }
                this.getWorks()
              }
            })
        }
        if (data.action === 'PART') {
          const { system } = data

          // ajax to check if there are diagnostics can be assigned to
          this.findWorksToAssign(this.machine.id, system).then(result => {
            if (result.length === 1) {
              // auto assign to diagnostic if there is only one
              this.addPart({ ...data, vehicleId: this.machine.id, vehicleWorkId: result[0].id })
            } else if (result.length > 1) {
              // if there are more, show diagnostics to be selected.
              this.selectWorks = result
            } else {
              // if there are none, add single part
              this.addPart({ ...data, vehicleId: this.vehicleId, vehicleWorkId: this.standaloneId })
            }
          })
        }
      },
      removeWork(id) {
        this.$axios
          .post(`/api/vehicle/${this.machine.id}/works/delete/${id}`, {
            id
          })
          .then(result => {
            if (result.success) {
              let index = this.works.findIndex(x => x.id === id)
              this.$emit('on-work-remove', { ...this.works[index] })
              if (index >= 0) this.works.splice(index, 1)
            }
          })
      },
      findWorksToAssign(userVehicleId, system) {
        return new Promise(resolve => {
          this.$axios
            .post(`/api/vehicle/${userVehicleId}/works/findWorksToAssign`, {
              system
            })
            .then(result => {
              if (result.success) {
                resolve(result.data)
              }
            })
        })
      },
      removePart(id, userCartId, workId) {
        this.$axios
          .post(`/api/vehicle/${this.machine.id}/works/${workId}/parts/delete/${id}`, {
            userCartId
          })
          .then(result => {
            if (result.success) {
              this.works.forEach(w => {
                let index = w.workParts.findIndex(x => x.assignWorkId === id)
                if (index >= 0) {
                  this.$emit('on-part-remove', { ...w.workParts[index] })
                  w.workParts.splice(index, 1)
                  if (w.id === this.standaloneId && w.workParts.length === 0) {
                    let index = this.works.findIndex(x => x.id === w.id)
                    if (index >= 0) this.works.splice(index, 1)
                  }
                }
              })
            }
          })
      },
      addPart(part) {
        this.$axios
          .post(`/api/vehicle/${part.vehicleId}/works/${part.vehicleWorkId}/parts/add`, {
            ...part,
            isNonActiveCart: true
          })
          .then(result => {
            if (result.success) {
              if (!result.data) this.$msg.error('Something wrong during adding the part, please try again...')
              else {
                this.$emit('on-part-added', { ...part, id: result.data.id })
                this.getWorks()
              }
              this.selectWorks = []
            }
          })
      },
      selectWork(vehicleWorkId) {
        this.addPart({ ...this.data, vehicleId: this.machine.id, vehicleWorkId })
      },
      setWorkType(work) {
        var tag = work.type === 'DIAGNOSTIC' ? 'MAINTENANCE' : 'DIAGNOSTIC'
        this.$axios.post(`/api/vehicle/${this.machine.id}/works/${work.id}/${tag}`).then(result => {
          if (result.success) {
            work.type = tag
          }
        })
      },
      sendToCart() {
        this.$axios.post(`/api/vehicle/${this.machine.id}/works/addToCart`).then(result => {
          if (result.success && result.data) {
            this.$msg.success('Required works and related parts has been added to cart.')
            this.$emit('on-close')
            this.$nextTick(() => {
              var query = this.$url.get('query')
              this.$router.push({ name: 'Cart', query: { query } })
            })
          }
        })
      },
      closeDrawer() {
        this.$emit('on-close')
      }
    }
  }
</script>

<style lang="scss">
  .machine-workplace {
    width: 100%;
    height: 100vh;
    position: relative;

    .v-overlay__content {
      width: 100%;
      align-self: flex-start;
      padding: 20px;
    }

    .machine-container {
      min-height: 300px;
      max-height: calc(100vh - 10px);
      overflow: auto;

      a {
        text-decoration: underline;
      }

      & > div {
        min-height: 100%;
      }

      .bordered {
        border-color: #e6e6e6 !important;
        line-height: 28.8px !important;
      }
      .shadow {
        box-shadow: 0 3px 10px rgb(0 0 0 / 10%) !important;
      }
    }
  }
</style>

