<template>
  <v-card flat class="required-work" color="transparent">
    <v-card-text class="pa-0 pt-5">
      <div
        v-if="works.length === 0 && !loading"
        class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4"
      >
        <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
        <p class="mb-0">Search to add fixes, maintenances, and parts.</p>
      </div>

      <template v-else>
        <v-text-field
          outlined
          placeholder="Search required work and related parts"
          prepend-inner-icon="$svg-search"
          hide-details
          class="mb-7 rounded-10 braap-filter-search small caption"
          v-model="query"
        ></v-text-field>

        <perfect-scrollbar
          ref="ps"
          class="work-container flex-grow-1 px-2 mx-n2 pb-4"
          :options="{ suppressScrollX: true, wheelPropagation: false }"
          :style="{ marginTop: selectWorks.length > 0 ? '-47px' : '0' }"
        >
          <div ref="psContent" class="d-flex flex-column">
            <div v-if="selectWorks.length === 0">
              <v-scroll-x-transition group>
                <v-hover open-delay="100" v-slot="{ hover }" v-for="work in filteredWork" :key="work.id">
                  <v-card class="work d-flex flex-column pa-2 pl-4 mb-4 rounded-10">
                    <div class="d-flex align-center" v-if="work.id != standaloneId">
                      <v-tooltip right color="primary" open-delay="100" content-class="right">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            :color="work.type === 'DIAGNOSTIC' ? 'braap_green' : 'error'"
                            class="white--text mr-3 body-2"
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

                      <v-tooltip top color="primary" open-delay="100" max-width="300" content-class="top">
                        <template v-slot:activator="{ on, attrs }">
                          <span class="mr-1 work-name" v-bind="attrs" v-on="on">
                            {{ work.work }}
                          </span>
                        </template>
                        <span>{{ work.work }}</span>
                      </v-tooltip>

                      <v-icon class="mr-2" v-if="work.workParts && work.workParts.length > 0">$svg-label</v-icon>
                      <v-spacer></v-spacer>
                      <v-btn icon class="ml-auto" @click="addToCart(work)">
                        <v-icon>mdi-cart</v-icon>
                      </v-btn>

                      <v-btn icon class="ml-auto" @click="removeWork(work.id)">
                        <v-icon color="#c4c4c4">mdi-trash-can</v-icon>
                      </v-btn>
                    </div>
                    <div v-else class="font-weight-bold">Parts, no related diagnostic</div>
                    <v-expand-transition>
                      <div
                        v-if="work.workParts && work.workParts.length > 0 && (hover || work.id === standaloneId)"
                        class="part-wrapper d-flex flex-column"
                      >
                        <div
                          v-for="part in work.workParts"
                          :key="part.assignWorkId"
                          class="
                            d-flex
                            align-center
                            justify-space-between
                            mt-2
                            mr-auto
                            px-2
                            py-1
                            rounded-10
                            caption
                            braap_grey
                            white--text
                          "
                        >
                          <a class="mr-2 white--text text-decoration-underline" @click="openProductDetails(part)">
                            {{ part.partName }}
                          </a>
                          <v-btn icon dark small @click="removePart(part.assignWorkId, part.cartId, work.id)">
                            <v-icon size="20" color="#c4c4c4">mdi-trash-can</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </v-expand-transition>
                  </v-card>
                </v-hover>
              </v-scroll-x-transition>
            </div>
            <div v-else style="z-index: 30">
              <div class="white--text body-0 mb-5">Select a diagnostic then click to add the part to it.</div>
              <v-card
                light
                class="work d-flex flex-column pa-2 pl-4 mb-4 rounded-10"
                v-for="work in selectWorks"
                :key="work.id"
                @click="selectWork(work.id)"
              >
                <div class="d-flex align-center" style="cursor: pointer">
                  <v-avatar
                    v-if="work.id != standaloneId"
                    :color="work.type === 'DIAGNOSTIC' ? 'braap_green' : 'braap_red'"
                    size="36"
                    class="white--text mr-3 body-2"
                  >
                    {{ work.type === 'DIAGNOSTIC' ? 'R' : 'M' }}
                  </v-avatar>
                  <span v-if="work.id != standaloneId" class="mr-1"> {{ work.work }} </span>
                  <span v-else class="mr-1 font-weight-bold" style="padding: 7px 4px">
                    PARTS, NO RELATED DIAGNOSTIC
                  </span>
                </div>
              </v-card>
              <v-btn @click="addNewWorkForPart" color="braap_orange" dark large
                ><v-icon>mdi-plus</v-icon>Add Diagnostic</v-btn
              >
            </div>
          </div>
        </perfect-scrollbar>
        <v-overlay color="rgba(0,0,0,0.5)" opacity="1" :value="selectWorks.length > 0" class="px-4" style="z-index: 29">
        </v-overlay>
      </template>
    </v-card-text>

    <ProductDialog ref="productDialog" view-only></ProductDialog>
  </v-card>
</template>

<script>
  import ProductDialog from '@/components/Search/ProductDialog'

  export default {
    name: 'RequiredWork',
    props: {
      vehicleId: {
        type: String,
        required: true
      }
    },
    components: {
      ProductDialog
    },
    data: function() {
      return {
        works: [],
        selectWorks: [],
        query: null,
        data: null,
        partPendingToAdd: null,
        loading: true,
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
    mounted() {
      if (this.vehicleId) this.getWorks()
    },
    watch: {
      vehicleId(val) {
        if (val) {
          this.getWorks()
        }
      }
    },
    methods: {
      getWorks() {
        this.$axios
          .post(`/api/vehicle/${this.vehicleId}/works/list`, {
            status: 'PROCESSING',
            workStatus: 'ACTIVE'
          })
          .then(result => {
            if (result.success && result.data) {
              this.works = result.data
              this.loading = false
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
            .post(`/api/vehicle/${this.vehicleId}/works/add`, {
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
                  // check if there are part pending to add
                  if (this.partPendingToAdd) {
                    this.addPart({ ...this.partPendingToAdd, vehicleId: this.vehicleId, vehicleWorkId: result.data.id })
                    this.partPendingToAdd = null
                  }
                }
                this.getWorks()
              }
            })
        }
        if (data.action === 'PART') {
          const { system } = data

          // ajax to check if there are diagnostics can be assigned to
          this.findWorksToAssign(this.vehicleId, system).then(result => {
            if (result.length === 1) {
              // auto assign to diagnostic if there is only one
              this.addPart({ ...data, vehicleId: this.vehicleId, vehicleWorkId: result[0].id })
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
        this.$axios.post(`/api/vehicle/${this.vehicleId}/works/delete/${id}`).then(result => {
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
          .post(`/api/vehicle/${this.vehicleId}/works/${workId}/parts/delete/${id}`, {
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
                this.$emit('on-part-added', { ...part, id: result.data })
                this.getWorks()
              }
              this.selectWorks = []
            }
          })
      },
      selectWork(vehicleWorkId) {
        this.addPart({ ...this.data, vehicleId: this.vehicleId, vehicleWorkId })
      },
      setWorkType(work) {
        var tag = work.type === 'DIAGNOSTIC' ? 'MAINTENANCE' : 'DIAGNOSTIC'
        this.$axios.post(`/api/vehicle/${this.vehicleId}/works/${work.id}/${tag}`).then(result => {
          if (result.success) {
            work.type = tag
          }
        })
      },
      addNewWorkForPart() {
        this.$root.openSheet(true)
        this.partPendingToAdd = { ...this.data }
      },
      addToCart(work) {
        this.$axios
          .post(`/api/vehicle/${this.vehicleId}/works/addToCart/${work.id}`, {
            type: work.type
          })
          .then(result => {
            if (result.success && result.data) {
              let index = this.works.findIndex(x => x.id === work.id)
              this.$emit('on-work-remove', { ...this.works[index] })
              if (index >= 0) this.works.splice(index, 1)
              this.$msg.success('Added to the cart.')
            }
          })
      },
      openProductDetails(part) {
        this.$refs.productDialog.openProduct({ braap_part_number: part.braap_PartNumber, price: part.partPrice })
      }
    }
  }
</script>

<style lang="scss">
  .required-work {
    .v-overlay__content {
      width: 100%;
      align-self: flex-start;
      padding-top: 20px;
    }

    .work-container {
      min-height: 200px;
      max-height: calc(100vh - 200px);
      overflow: auto;
      overscroll-behavior: contain;

      .work-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      a {
        text-decoration: underline;
      }

      & > div {
        min-height: 100%;
      }
    }
  }
</style>
