<template>
  <div class="machine-history-image">
    <div class="img-wrapper my-2 relative overflow-hidden">
      <ImageMarker
        v-for="m in filteredMarkers"
        :key="m.id"
        :vehicleId="vehicleId"
        container=".img-wrapper"
        :data="m"
        :expanded.sync="m.opened"
        :newTag.sync="m.isNew"
        @change="onMarkerChange"
      ></ImageMarker>
      <img
        :src="`/api/vehicle/${vehicleId}/images/${imageId}`"
        class="rounded-10"
        style="width: 100%; max-width: 940px"
      />
    </div>
    <div class="filter-wrapper">
      <div class="d-flex align-center justify-center" v-if="systems.length > 0">
        <v-btn-toggle class="mb-1" v-model="filter" dense background-color="transparent" multiple>
          <v-btn
            :outlined="filter.indexOf(0) < 0"
            :style="{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#000 !important' }"
            color="primary"
            :class="[filter.indexOf(0) >= 0 ? 'white--text' : '']"
            class="mx-1 mb-1 rounded px-4"
          >
            All
          </v-btn>
          <v-btn
            v-for="(system, index) in systems"
            :key="index"
            :outlined="filter.indexOf(index + 1) < 0"
            :style="{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#000 !important' }"
            color="primary"
            :class="[filter.indexOf(index + 1) >= 0 ? 'white--text' : '']"
            class="mx-1 mb-1 rounded px-4"
          >
            {{ system }}
          </v-btn>
        </v-btn-toggle>
      </div>
      <div class="d-flex flex-column flex-sm-row align-center justify-center">
        <span class="mr-4" v-if="lastUpdated">Last updated on {{ moment(lastUpdated).format('MMM DD, YYYY') }}</span>
        <v-btn
          plain
          text
          style="letter-spacing: 0.2px"
          class="primary--text"
          @click="openAllClick"
          v-if="markers.length > 0"
        >
          Click to {{ allOpend ? 'close' : 'open' }} all tags
        </v-btn>
      </div>
      <div class="text-center" v-if="isSample">This is a sample image upload your own</div>
    </div>
  </div>
</template>

<script>
  import ImageMarker from './ImageMarker.vue'
  import moment from 'moment'

  export default {
    name: 'HistoryImage',
    props: {
      vehicleId: {
        type: String,
        required: true
      },
      image: {
        type: Object,
        required: true
      },
      count: {
        type: Number
      }
    },
    components: {
      ImageMarker
    },
    data: function() {
      return {
        filter: [0],
        systems: [],
        markers: [],
        lastUpdated: null,
        isSample: false,
        imageId: null,
        historyWorkId: null
      }
    },
    computed: {
      filteredMarkers() {
        let data = []
        if (this.filter.indexOf(0) >= 0) {
          data = this.markers
        } else {
          let systems = this.systems.filter((x, index) => this.filter.indexOf(index + 1) >= 0)
          data = this.markers.filter(m => systems.indexOf(m.system) >= 0)
        }
        return data
      },
      allOpend() {
        return this.filteredMarkers.filter(x => x.opened).length === this.filteredMarkers.length
      }
    },
    created() {
      const {
        params: { workId }
      } = this.$route
      this.historyWorkId = workId
      if (this.image) {
        this.imageId = this.image.id
        this.lastUpdated = this.image.lastUpdated
        this.isSample = this.image.isSample
        this.loadImage()
      }
    },
    mounted() {},
    watch: {
      image(val) {
        if (val) {
          this.$nextTick(() => {
            this.imageId = val.id
            this.lastUpdated = val.lastUpdated
            this.isSample = val.isSample
            this.loadImage()
          })
        }
      },
      filter(newVal, oldVal) {
        var newAdded = newVal.find(x => oldVal.indexOf(x) < 0)
        if (newAdded != undefined) {
          if (newAdded === 0) this.filter = [0]
          else if (newVal.indexOf(0) >= 0) {
            this.filter.splice(0, 1)
          }
        }
      }
    },
    methods: {
      moment,
      loadImage() {
        this.filter = [0]
        this.getMarkers()
        this.getMarkerSystems()
      },
      getMarkers() {
        this.$axios
          .post(`/api/vehicle/${this.vehicleId}/histories/${this.historyWorkId}/images/${this.imageId}/markers/list`)
          .then(result => {
            if (result.success && result.data) {
              result.data.forEach(x => (x.opened = false))
              this.markers = result.data
              this.$emit('update:count', this.markers.length)
            }
          })
      },
      getMarkerSystems() {
        this.$axios
          .post(`/api/vehicle/${this.vehicleId}/histories/${this.historyWorkId}/images/${this.imageId}/markers/system`)
          .then(result => {
            if (result.success && result.data) {
              this.systems = result.data
            }
          })
      },
      openAllClick() {
        let opened = !this.allOpend
        this.markers.forEach(x => {
          if (this.filteredMarkers.find(y => x.id === y.id)) x.opened = opened
        })
      },
      onMarkerChange(marker) {
        var item = this.markers.find(x => x.id == marker.id)
        if (item) {
          item.markerPosition = { ...marker.markerPosition }
          item.markerNote = marker.markerNote
        }
      }
    }
  }
</script>

<style lang="scss">
  .machine-history-image {
    .img-wrapper {
      z-index: 0;
    }
    .v-btn-toggle > .v-btn.v-btn:not(:first-child) {
      border-left-width: 1px !important;
    }
    .filter-all {
      border-color: rgba(0, 0, 0, 0.12) !important;
    }
  }
</style>
