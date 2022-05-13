<template>
  <v-card flat class="history-work" color="transparent">
    <v-card-text class="pa-0 pt-5">
      <div
        v-if="works.length === 0 && !loading"
        class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4"
      >
        <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
        <p class="mb-0">Search to add fixes, maintenances, and parts.</p>
      </div>

      <template v-else>
        <perfect-scrollbar
          ref="ps"
          class="work-container flex-grow-1 px-2 mx-n2 pb-4 mt-7"
          :options="{ suppressScrollX: true, wheelPropagation: false }"
        >
          <div ref="psContent" class="d-flex flex-column">
            <v-scroll-x-transition group>
              <v-card
                class="work d-flex flex-column pa-5 pb-0 mb-5 rounded-10 bordered"
                v-for="work in filteredWork"
                :key="work.id"
                color="braap_bg_grey"
                outlined
              >
                <div
                  class="d-flex align-center white rounded-10 pa-4 mb-4 bordered shadow"
                  v-if="work.id != standaloneId"
                >
                  <v-avatar
                    :color="work.type === 'DIAGNOSTIC' ? 'braap_green' : 'error'"
                    class="white--text mr-3 body-2"
                    elevation="0"
                  >
                    {{ work.type === 'DIAGNOSTIC' ? 'R' : 'M' }}
                  </v-avatar>

                  <v-tooltip top color="primary" open-delay="100" max-width="300" content-class="top">
                    <template v-slot:activator="{ on, attrs }">
                      <span class="mr-1 work-name" v-bind="attrs" v-on="on">
                        {{ work.work }}
                      </span>
                    </template>
                    <span>{{ work.work }}</span>
                  </v-tooltip>

                  <v-icon class="mr-2" v-if="work.workParts && work.workParts.length > 0">$svg-label</v-icon>
                </div>
                <div v-else class="font-weight-medium rounded-10 white pa-5 body-2 mb-4 bordered shadow">
                  Parts, no related Diagnostic
                </div>

                <div v-if="work.workParts && work.workParts.length > 0" class="part-wrapper d-flex flex-column">
                  <div
                    v-for="part in work.workParts"
                    :key="part.assignWorkId"
                    class="pa-5 mb-5 rounded-10 body-2 white--text bordered shadow relative"
                    style="background-color: #c4c4c4"
                  >
                    <a class="white--text" @click="openProductDetails(part)">
                      {{ part.partName }}
                    </a>
                  </div>
                </div>
              </v-card>
            </v-scroll-x-transition>
          </div>
        </perfect-scrollbar>
      </template>
    </v-card-text>

    <!-- <ProductCard ref="productDialog" view-only></ProductCard> -->
  </v-card>
</template>

<script>
  // import ProductCard from '../../Search/ProductCard'

  export default {
    name: 'HistoryWork',
    props: {
      vehicleId: {
        type: String,
        required: true
      }
    },
    components: {
      // ProductCard
    },
    data: function() {
      return {
        historyWorkId: null,
        works: [],
        loading: true,
        standaloneId: 'STANDALONE PART'
      }
    },
    computed: {
      filteredWork() {
        return this.works
      }
    },
    mounted() {
      const {
        params: { workId }
      } = this.$route
      this.historyWorkId = workId
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
        this.$axios.post(`/api/vehicle/${this.vehicleId}/histories/${this.historyWorkId}`).then(result => {
          if (result.success && result.data) {
            this.works = result.data
            this.loading = false
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
  .history-work {
    .bordered {
      border-color: #e6e6e6 !important;
      line-height: 28.8px !important;
    }
    .shadow {
      box-shadow: 0 3px 10px rgb(0 0 0 / 10%) !important;
    }
  }
</style>
