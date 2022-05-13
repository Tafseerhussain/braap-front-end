<template>
  <div class="result-parts braap_bg_grey pt-15 pb-13">
    <v-container class="py-0">
      <v-row>
        <v-col col="5">
          <div class="section-title font-weight-bold primary--text">Parts</div>
        </v-col>
        <v-col col="7">
          <div class="showing-results braap_orange--text body-0">
            <span class="primary--text font-weight-bold">Showing Results for</span> {{ filter.query }}.
          </div>
        </v-col>
      </v-row>

      <!-- Filters -->
      <template v-if="filterApplied && filters.length > 0">
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
      <!-- Filters -->

      <div ref="container" class="d-flex flex-wrap card-container mt-2">
        <template v-if="loading">
          <PartSkeleton v-for="index in pageSize" :key="index"> </PartSkeleton>
        </template>
        <template v-else-if="parts.length == 0">
          <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
            <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
            <p class="mb-0">No parts were found for your search.</p>
          </div>
        </template>
        <template v-else>
          <PartCard
            @open-detail="openProduct"
            :value="p"
            v-for="p in parts"
            :key="p.id"
            :selected="selectedParts.indexOf(p.part_number) >= 0"
          >
            <template #action>
              <v-btn dark color="primary" class="rounded-10 body-2" large block @click="getPart(p)">Get Part</v-btn>
              <template v-if="filterApplied">
                <v-btn
                  dark
                  color="braap_orange"
                  class="rounded-0 body-2 mt-2 ml-n4 mb-n4"
                  large
                  block
                  absolute
                  bottom
                  @click="$chat.start()"
                  style="height: 48px"
                  >Ask Technician for Help</v-btn
                >
              </template>
              <template v-else>
                <v-btn
                  dark
                  color="braap_orange"
                  class="rounded-0 body-2 mt-2 ml-n4 mb-n4"
                  large
                  block
                  absolute
                  bottom
                  @click="completeFilter"
                  style="height: 48px"
                  >Complete filter to check fit</v-btn
                ></template
              >
            </template>
          </PartCard>
        </template>
      </div>
    </v-container>
    <ProductDialog ref="productDialog"></ProductDialog>
  </div>
</template>

<script>
  import PartCard from '@/components/Search/PartCard.vue'
  import PartSkeleton from '@/components/Search/PartSkeleton.vue'
  import ProductDialog from '@/components/Search/ProductDialog'
  import mixins from '@/components/Search/mixins'
  import { mapState } from 'vuex'

  export default {
    name: 'ResultParts',
    props: {
      filter: {
        type: Object,
        default() {
          return {}
        }
      },
      selectedParts: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      PartCard,
      PartSkeleton,
      ProductDialog
    },
    mixins: [mixins],
    data: function() {
      return {
        loading: false,
        selectedFilter: '',
        filters: [],
        parts: []
      }
    },
    watch: {
      'filter.timestamp'() {
        if (this.filter.query) {
          this.getFilters()
          this.loadParts()
        }
      }
    },
    created() {
      if (this.filter.query) {
        this.getFilters()
        this.loadParts()
      }
    },
    computed: {
      filterApplied() {
        return !!(this.filter.make && this.filter.model && this.filter.year && this.filter.machineType)
      },
      ...mapState({
        isAuth: state => state.userId > 0
      })
    },
    methods: {
      filterClick(filter) {
        this.filters.forEach(x => (x.selected = false))
        filter.selected = true

        if (this.selectFilter != filter.name) {
          this.selectedFilter = filter.name

          this.loadParts()
        }
      },
      clearFilter() {
        if (this.selectedFilter) {
          this.selectedFilter = null
          this.loadParts()
        }
        this.filters.forEach(x => (x.selected = false))
      },
      loadParts() {
        this.loading = true
        this.$axios
          .post('/api/search/getParts', {
            ...this.filter,
            genericpart: this.selectedFilter
          })
          .then(result => {
            if (result) {
              this.parts = result.data
            }
            this.loading = false
          })
      },
      getFilters() {
        this.$axios.post('/api/search/getPartsFilter', this.filter).then(result => {
          if (result) {
            this.selectedFilter = result.data.matchedSystem ? result.data.matchedSystem.genericPart : null
            this.filters = result.data.genericParts.map((x, index) => {
              return { id: index, name: x.genericPart, selected: this.selectedFilter === x.genericPart }
            })
          }
        })
      },
      completeFilter() {
        this.$emit('complete-filter')
      },
      getPart(part) {
        if (this.isAuth) {
          this.$emit('on-get', part)
        } else {
          var redirect = window.location.pathname
          if (window.location.search) {
            redirect += `/${window.location.search}`
          }
          this.$router.push({ name: 'Login', query: { redirect } })
        }
      },
      openProduct(part) {
        this.$refs.productDialog.openProduct({ braap_part_number: part.part_number, price: part.braap_price })
      }
    }
  }
</script>

<style lang="scss">
  .result-parts {
    .showing-results {
      text-align: right;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
