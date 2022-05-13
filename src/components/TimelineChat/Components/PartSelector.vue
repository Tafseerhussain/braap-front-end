<template>
  <div class="part-selector">
    <template v-if="loading">
      <div class="d-flex mr-4">
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ma-1" type="button"></v-skeleton-loader>
      </div>
      <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
      <div class="d-flex">
        <v-skeleton-loader class="flex-grow-1 ma-1" type="list-item-avatar-three-line, article"></v-skeleton-loader>
        <v-skeleton-loader class="flex-grow-1 ma-1" type="list-item-avatar-three-line, article"></v-skeleton-loader>
      </div>
    </template>

    <template v-else>
      <div class="part-filter pr-4">
        <v-btn
          :color="filter.selected ? '#000' : 'braap_deep_blue'"
          small
          dark
          v-for="filter in filters"
          :key="filter.id"
          class="ma-1 rounded text-capitalize"
          @click="filterClick(filter)"
          elevation="0"
        >
          {{ filter.name }}
        </v-btn>
        <v-btn
          v-show="selectFilter"
          class="ml-1 pl-1 pr-1 braap_deep_blue--text text-capitalize text-decoration-underline"
          small
          text
          @click="clearFilter"
          >Clear filter</v-btn
        >
      </div>
      <v-text-field
        outlined
        rounded
        solo
        flat
        dense
        placeholder="Search for parts by name or part number"
        prepend-inner-icon="mdi-magnify"
        hide-details
        class="mr-2 mt-2 mb-2"
        v-show="filters.length > 0"
        v-model="query"
      ></v-text-field>
      <template v-if="loadingPart">
        <div class="d-flex">
          <v-skeleton-loader class="flex-grow-1 ma-1" type="list-item-avatar-three-line, article"></v-skeleton-loader>
          <v-skeleton-loader class="flex-grow-1 ma-1" type="list-item-avatar-three-line, article"></v-skeleton-loader>
        </div>
      </template>
      <template v-else>
        <v-sheet max-width="550" class="mr-auto" v-if="filteredParts.length > 0">
          <v-slide-group show-arrows next-icon="mdi-chevron-right-circle" prev-icon="mdi-chevron-left-circle">
            <v-slide-item v-for="part in filteredParts" :key="part.id">
              <PartCard :value="part" @click="selectPart(part)"></PartCard>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
        <v-row v-else class="ma-4 mt-16 braap_grey--text" align="center" justify="center">
          Try refining your search or setting all the filters above to get parts for your machine.
        </v-row>
      </template>
    </template>
  </div>
</template>

<script>
  import moment from 'moment'
  import PartCard from './PartCard.vue'

  export default {
    name: 'PartSelector',
    components: {
      PartCard
    },
    props: {
      machineType: {
        type: String
      },
      make: {
        type: String
      },
      model: {
        type: String
      },
      year: {
        type: String
      },
      masterSystem: {
        type: String
      },
      disabled: {
        type: Boolean
      }
    },
    data: function() {
      return {
        loading: true,
        loadingPart: false,
        filters: [],
        parts: [],
        selectFilter: null,
        query: null
      }
    },
    created() {
      this.getFilters()
      this.getParts()
    },
    mounted() {},
    computed: {
      filteredParts() {
        if (this.query) {
          return this.parts.filter(
            x =>
              (x.part_name && x.part_name.toLowerCase().indexOf(this.query)) >= 0 ||
              (x.part_number && x.part_number.toLowerCase().indexOf(this.query)) >= 0
          )
        }
        return this.parts
      }
    },
    methods: {
      moment,
      getFilters() {
        this.$axios
          .post('/Timeline/GetPartFilters', { machineType: this.machineType, masterSystem: this.masterSystem })
          .then(result => {
            if (result && result.status === 200) {
              this.filters = result.data.map((x, index) => {
                return { id: index, name: x.GenericPart, selected: false }
              })
            }
          })
      },
      getParts() {
        this.$axios
          .post('/Timeline/GetParts', {
            machineType: this.machineType,
            make: this.make,
            model: this.model,
            year: this.year,
            masterSystem1: this.masterSystem,
            genericPart: this.selectFilter
          })
          .then(result => {
            if (result && result.status === 200) {
              this.parts = result.data
              this.$root.scrollTimelineToBottom()
              this.loading = false
              this.loadingPart = false
            }
          })
      },
      selectPart(part) {
        this.$emit('on-select', {
          partSystem: part.system,
          partName: part.part_name,
          partNumber: part.part_number,
          partPrice: part.decimalprice,
          partImage: part.thumbnail,
          partSupplierId: part.supplier_id,
          braapPartId: part.braap_part_id
        })
      },
      filterClick(filter) {
        this.filters.forEach(x => (x.selected = false))
        filter.selected = true
        this.query = ''
        if (this.selectFilter != filter.name) {
          this.selectFilter = filter.name
          this.loadingPart = true
          this.getParts()
        }
      },
      clearFilter() {
        if (this.selectFilter) {
          this.selectFilter = null
          this.query = ''
          this.loadingPart = true
          this.getParts()
        }
        this.filters.forEach(x => (x.selected = false))
      }
    }
  }
</script>

<style lang="scss">
  .part-selector {
    max-width: 100%;
    min-height: 400px;

    .v-text-field--rounded > .v-input__control > .v-input__slot {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }

    .part-filter {
      .v-item--active {
        background-color: #272727 !important;
      }
    }

    .v-slide-group__next,
    .v-slide-group__prev {
      min-width: 25px;
      flex-basis: 25px;
      .v-icon--disabled {
        opacity: 0.3 !important;
      }
    }

    .v-slide-group {
      max-width: none;
    }
  }
</style>
