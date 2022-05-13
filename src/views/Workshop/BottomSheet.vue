<template>
  <div class="work-shop-bottom-sheet-wrapper">
    <v-bottom-sheet
      v-model="openBottomSheet"
      hide-overlay
      :width="sideView ? 800 : '100%'"
      content-class="mr-auto white"
    >
      <v-hover v-slot="{ hover }" close-delay="300">
        <div
          ref="container"
          class="white work-shop-bottom-sheet pt-9 relative"
          :class="{ 'show-popup': hover || sideView }"
          v-scroll.self="onScroll"
        >
          <div class="d-flex justify-center mb-n3" v-if="openBottomSheet">
            <v-btn icon x-large @click="openBottomSheet = false">
              <v-icon size="56" color="primary">mdi-minus-circle-outline</v-icon>
            </v-btn>
          </div>

          <div>
            <div class="body-2 mb-2">SEARCH RESULTS</div>
            <!-- Diagnostics grid -->
            <div class="d-flex align-center justify-space-between">
              <div class="section-title font-weight-bold primary--text">Diagnostics</div>
              <a v-ripple class="d-flex align-cetner" @click.prevent="sideView = !sideView">
                <v-icon class="mr-2">{{ sideView ? '$svg-bottom-view' : '$svg-side-view' }}</v-icon>
                <span class="primary--text text-decoration-underline">{{
                  sideView ? 'Bottom View' : 'Sidebar view'
                }}</span>
              </a>
            </div>

            <div class="card-container full-width d-flex flex-wrap mt-16">
              <DiagnosticCard
                v-for="diagnostic in diagnostics"
                :key="diagnostic.title"
                :value="diagnostic"
                :selected="selectedDiagnostics.indexOf(diagnostic.title) >= 0"
              >
                <template #action>
                  <v-btn dark color="braap_orange" class="rounded-10 body-2" large @click="onAddDiagnostic(diagnostic)"
                    >Get it fixed</v-btn
                  >
                  <v-hover v-slot="{ hover }">
                    <v-btn
                      dark
                      color="braap_orange"
                      :outlined="!hover"
                      class="rounded-10 body-2 mt-2"
                      large
                      style="transition: 0.3s"
                      @click="$chat.start()"
                      >Ask Technician for Help</v-btn
                    >
                  </v-hover>
                </template>
              </DiagnosticCard>
            </div>
            <!-- Parts grid -->
            <div class="section-title font-weight-bold primary--text">Parts</div>
            <template v-if="filters.length > 0">
              <div class="d-flex align-center flex-wrap mt-10">
                <v-hover v-slot="{ hover }" v-for="filter in filters" :key="filter.id">
                  <v-btn
                    dark
                    :color="filter.selected ? 'primary' : 'braap_orange'"
                    :outlined="!hover && !filter.selected"
                    class="body-2 mt-5 mr-5"
                    elevation="0"
                    x-large
                    style="transition: 0.3s"
                    :style="{ borderWidth: '2px', borderStyle: 'solid' }"
                    @click="filterClick(filter)"
                    >{{ filter.name }}</v-btn
                  >
                </v-hover>
              </div>
              <div class="d-flex align-center" style="height: 27px">
                <a
                  v-show="selectedFilter"
                  class="ml-auto px-2 primary--text body-0 text-capitalize text-decoration-underline"
                  @click="clearFilter"
                  >Clear filter</a
                >
              </div>
            </template>
            <v-spacer v-else class="pt-14"></v-spacer>

            <div class="card-container full-width d-flex flex-wrap mt-2">
              <template v-if="!loadingPart">
                <template v-if="parts.length > 0">
                  <PartCard
                    v-for="part in parts"
                    :key="part.part_number"
                    :value="part"
                    :selected="selectedParts.indexOf(part.part_number) >= 0"
                    class="mb-8"
                  >
                    <template #action>
                      <v-btn dark color="primary" class="rounded-10 body-2" large block @click="onAddPart(part)"
                        >Make Interactive</v-btn
                      >

                      <v-btn
                        dark
                        color="braap_orange"
                        class="rounded-0 body-2 mt-2 ml-n4 mb-n4"
                        large
                        block
                        absolute
                        bottom
                        @click="$chat.start()"
                        >Ask Technician for Help</v-btn
                      >
                    </template>
                  </PartCard>
                </template>
                <template v-else>
                  <div class="px-4 mb-16 d-flex align-start body-1 grey--text">
                    <v-icon class="mr-1">mdi-reload</v-icon>
                    Try refining your search or setting all the filters above to get parts for your machine.
                  </div>
                </template>
              </template>
              <template v-else>
                <PartSkeleton v-for="i in 10" :key="i"></PartSkeleton>
              </template>
            </div>
          </div>
        </div>
      </v-hover>
    </v-bottom-sheet>

    <v-fade-transition>
      <v-btn
        v-if="!openBottomSheet && diagnostics.length > 0"
        x-large
        color="white"
        fixed
        bottom
        @click="openSheet"
        class="mb-2"
        style="z-index: 5; left: 50%; margin-left: -26px"
        icon
      >
        <v-icon size="56" color="primary">mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-fade-transition>
  </div>
</template>

<script>
  import DiagnosticCard from '@/components/Search/DiagnosticCard'
  import PartCard from '@/components/Search/PartCard'
  import PartSkeleton from '@/components/Search/PartSkeleton'

  export default {
    name: 'BottomSheet',
    components: {
      DiagnosticCard,
      PartCard,
      PartSkeleton
    },
    props: {
      make: {
        type: String
      },
      model: {
        type: String
      },
      year: {
        type: String
      },
      machineType: {
        type: String
      },
      vehicleId: {
        type: String
      },
      selectedDiagnostics: {
        type: Array,
        default: () => []
      },
      selectedParts: {
        type: Array,
        default: () => []
      }
    },
    data: function() {
      return {
        query: null,

        openBottomSheet: false,
        sideView: false,
        openWithHover: false,
        // diagnostic
        diagnostics: [],
        // parts
        parts: [],
        filters: [],
        selectedFilter: null,
        loadingPart: true
      }
    },
    computed: {},
    created() {},
    mounted() {
      window.workshop_search = this.search
      this.$root.openSheet = this.openSheet
    },
    watch: {
      openBottomSheet(val) {
        if (val) this.$chat.hide()
        else this.$chat.show()
      }
    },
    methods: {
      onScroll() {
        // document.querySelector('.autocomplete-suggestions.search').style.display = 'none'
      },
      search(query) {
        this.query = query
        this.getDiagnostics()
        this.getParts()
        this.getFilters()
      },
      openSheet(scrollToTop) {
        this.openBottomSheet = true
        this.openWithHover = true
        this.$nextTick(() => {
          this.$refs.container.classList.add('show-popup')
          if (scrollToTop) {
            this.$refs.container.scrollTop = 0
          }
        })
      },
      // diagnostic
      getDiagnostics() {
        this.$axios
          .post('/api/workshop/getDiagnostics', {
            query: this.query,
            make: this.make,
            model: this.model,
            year: this.year,
            machinetype: this.machineType,
            vehicleId: this.vehicleId
          })
          .then(result => {
            if (result.success && result.data) {
              this.diagnostics = result.data
              this.openSheet(true)
            }
          })
      },
      onAddDiagnostic(diagnostic) {
        this.$emit('add-diagnostic', diagnostic)
        this.openBottomSheet = false
      },
      // part
      getParts() {
        this.loadingPart = true
        this.$axios
          .post('/api/search/getParts', {
            query: this.query,
            machinetype: this.machineType,
            make: this.make,
            model: this.model,
            year: this.year,
            vehicleId: this.vehicleId,
            genericpart: this.selectedFilter
          })
          .then(result => {
            if (result.success && result.data) {
              this.parts = result.data
              this.loadingPart = false
            }
          })
      },
      getFilters() {
        this.$axios
          .post('/api/search/getPartsFilter', {
            query: this.query,
            make: this.make,
            model: this.model,
            year: this.year,
            machinetype: this.machineType,
            vehicleId: this.vehicleId
          })
          .then(result => {
            if (result.success && result.data) {
              this.selectedFilter = result.data.matchedSystem ? result.data.matchedSystem.genericPart : null
              this.filters = result.data.genericParts.map((x, index) => {
                return { id: index, name: x.genericPart, selected: this.selectedFilter === x.genericPart }
              })
            }
          })
      },
      filterClick(filter) {
        this.filters.forEach(x => (x.selected = false))
        filter.selected = true

        if (this.selectFilter != filter.name) {
          this.selectedFilter = filter.name

          this.getParts()
        }
      },
      clearFilter() {
        if (this.selectedFilter) {
          this.selectedFilter = null
          this.getParts()
        }
        this.filters.forEach(x => (x.selected = false))
      },
      onAddPart(part) {
        this.$emit('add-part', part)
        this.openBottomSheet = false
      }
    },
    updated() {
      if (this.sideView) {
        setTimeout(() => {
          this.$refs.container.classList.add('side-view')
        }, 300)
      } else {
        this.$nextTick(() => {
          this.$refs.container.classList.remove('side-view')
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .work-shop-bottom-sheet {
    padding: 32px 50px 50px 50px;
    max-height: 400px;
    overflow-y: auto;
    transition: 0.2s;
    box-shadow: 0 -4px 15px #8a8a8a1a;

    &.show-popup {
      max-height: calc(100vh - 120px);
    }

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-thumb {
      width: 1px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #535353;
    }
    &::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #ededed;
    }

    &.side-view {
      .card-wrapper {
        flex-basis: calc(50% - 20px) !important;
      }
    }
  }
</style>
