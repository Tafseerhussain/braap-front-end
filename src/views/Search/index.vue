<template>
  <div class="search-result">
    <ResultHeader ref="resultHeader" @search="search">
      <template #searchTab>
        <a class="white--text mr-7" :class="{ 'braap_orange--text': show === 0 }" @click.prevent="show = 0">All</a>
        <a class="white--text mr-7" :class="{ 'braap_orange--text': show === 1 }" @click.prevent="show = 1"
          >Diagnostics</a
        >
        <a
          v-if="isShowRecommendations"
          class="white--text mr-7"
          :class="{ 'braap_orange--text': show === 2 }"
          @click.prevent="show = 2"
          >Recommendation</a
        >
        <a class="white--text mr-7" :class="{ 'braap_orange--text': show === 3 }" @click.prevent="show = 3">Video</a>
        <a class="white--text mr-7" :class="{ 'braap_orange--text': show === 4 }" @click.prevent="show = 4">Parts</a>
      </template>
    </ResultHeader>
    <div id="resultSection">
      <ResultDiagnostics
        :filter="filter"
        v-show="!show || show === 1"
        @research="research"
        @on-get="addDiagnostic"
        :selected-diagnostics="selectedDiagnostics"
      ></ResultDiagnostics>
      <ResultRecommendation
        ref="resultRecommendation"
        :filter="filter"
        v-show="isShowRecommendations"
        :hasData.sync="hasRecommendations"
      ></ResultRecommendation>
      <ResultVideo ref="resultVideos" :filter="filter" v-show="!show || show === 3" :show="show"></ResultVideo>
      <ResultParts
        ref="resultParts"
        :filter="filter"
        v-show="!show || show === 4"
        @complete-filter="scrollToFilter"
        @on-get="addPart"
        :selected-parts="selectedParts"
      ></ResultParts>
    </div>

    <AddCartDrawer
      ref="addCartDrawer"
      @on-work-remove="onWorkRemove"
      @on-part-remove="onPartRemove"
      @on-work-added="onWorkAdded"
      @on-part-added="onPartAdded"
    ></AddCartDrawer>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import BackTop from '@/components/Common/BackTop'
  import ResultHeader from './ResultHeader'
  import ResultDiagnostics from './ResultDiagnostics.vue'
  import ResultRecommendation from './ResultRecommendation.vue'

  import ResultVideo from './ResultVideo.vue'
  import ResultParts from './ResultParts.vue'

  import AddCartDrawer from '@/components/Search/AddCartDrawer'

  export default {
    name: 'Search',
    props: {},
    components: {
      ResultHeader,
      ResultDiagnostics,
      ResultRecommendation,
      ResultVideo,
      ResultParts,
      BackTop,
      AddCartDrawer
    },
    data: function() {
      return {
        show: 0,
        filter: {
          query: null,
          timestamp: null
        },
        selectedDiagnostics: [],
        selectedParts: [],
        hasRecommendations: false
      }
    },
    mounted() {},
    computed: {
      filterApplied() {
        return !!(this.filter.make && this.filter.model && this.filter.year && this.filter.machineType)
      },
      isShowRecommendations() {
        return this.hasRecommendations || (!this.hasRecommendations && this.show === 2)
      }
    },
    watch: {
      show() {
        this.$nextTick(() => {
          this.$vuetify.goTo('#resultSection', { offset: 100 })
        })
      }
    },
    methods: {
      research(diagnostic) {
        this.search({ ...this.filter, query: diagnostic.title })
      },
      search(filter) {
        this.selectedDiagnostics = []
        this.selectedParts = []
        this.$vuetify.goTo('#resultSection', { offset: 100 }).then(() => {
          this.filter = { ...filter }
          this.$set(this.filter, 'timestamp', new Date().valueOf())
        })
      },
      scrollToFilter() {
        this.$vuetify.goTo(this.$refs.resultHeader.$el).then(() => {
          this.$refs.resultHeader.openSelect('type')
        })
        this.$msg.warning('Please complete filter to check fit.')
      },
      // add diagnostic
      addDiagnostic(diagnostic) {
        if (this.filterApplied) {
          var data = {
            make: this.filter.make,
            model: this.filter.model,
            type: this.filter.machineType,
            year: this.filter.year,
            data: {
              work: diagnostic.title,
              system: diagnostic.system
            }
          }
          this.$refs.addCartDrawer.add('DIAGNOSTIC', data)
        } else {
          this.scrollToFilter()
        }
      },
      onWorkRemove(work) {
        // remove selected diagnostic
        let index = this.selectedDiagnostics.findIndex(x => x === work.work)
        if (index >= 0) this.selectedDiagnostics.splice(index, 1)
        // remove selected parts
        work.workParts.forEach(part => {
          this.onPartRemove(part)
        })
      },
      onWorkAdded(work) {
        this.selectedDiagnostics.push(work)
      },
      addPart(part) {
        if (this.filterApplied) {
          var data = {
            make: this.filter.make,
            model: this.filter.model,
            type: this.filter.machineType,
            year: this.filter.year,
            data: {
              partName: part.part_name,
              partPrice: part.decimalprice,
              partImage: part.thumbnail,
              braap_PartId: part.id,
              braap_PartSupplierId: part.supplier_id,
              braap_PartNumber: part.part_number,
              filterApplied: `${this.filter.make} ${this.filter.model} ${this.filter.year}`,
              system: part.system
            }
          }
          this.$refs.addCartDrawer.add('PART', data)
        } else {
          this.scrollToFilter()
        }
      },
      onPartRemove(part) {
        let index = this.selectedParts.findIndex(x => x === part.braap_PartNumber)
        if (index >= 0) {
          this.selectedParts.splice(index, 1)
        }
      },
      onPartAdded(part) {
        this.selectedParts.push(part.braap_PartNumber)
      }
    }
  }
</script>

<style lang="scss">
</style>
