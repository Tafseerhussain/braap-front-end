<template>
  <v-card class="machine-history-images" flat color="transparent">
    <div class="d-flex flex-column flex-sm-row align-center px-0 mb-5">
      <v-spacer></v-spacer>
      <v-btn x-large class="rounded-10" dark @click="backToWorkshop">
        <span class="subtitle-1 font-weight-medium">Reorder Parts</span>
      </v-btn>
    </div>
    <v-card-text class="pa-0">
      <v-scroll-x-reverse-transition>
        <v-sheet
          class="mx-auto my-4"
          style="background-color: transparent"
          v-if="images.length > 1"
          :max-width="slideMaxWidth"
        >
          <v-slide-group
            ref="slide"
            center-active
            show-arrows
            mandatory
            next-icon="mdi-chevron-right-circle-outline"
            prev-icon="mdi-chevron-left-circle-outline"
            v-model="selectedImage"
          >
            <v-slide-item
              v-for="(image, index) in images"
              :key="image.id"
              :value="image.id"
              v-slot="{ active, toggle }"
            >
              <v-card class="my-2 mx-2 relative" :width="slideItemWidth" @click="toggle">
                <v-scale-transition origin="center">
                  <v-icon
                    class="absolute"
                    v-if="active"
                    color="white"
                    size="48"
                    v-text="'mdi-check-circle-outline'"
                  ></v-icon>
                </v-scale-transition>
                <v-img
                  class="rounded-10"
                  aspect-ratio="1.38"
                  cover
                  :src="`/api/vehicle/${vehicleId}/images/${image.id}`"
                ></v-img>
              </v-card>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </v-scroll-x-reverse-transition>

      <v-scroll-x-reverse-transition>
        <HistoryImage
          ref="current"
          v-if="vehicleId && image.id"
          :vehicleId="vehicleId"
          :image="image"
          :count.sync="image.markerCount"
          class=""
        ></HistoryImage>
      </v-scroll-x-reverse-transition>
    </v-card-text>
  </v-card>
</template>

<script>
  import HistoryImage from './HistoryImage.vue'

  export default {
    name: 'HistoryImages',
    props: {
      vehicleId: {
        type: String,
        required: true
      }
    },
    components: {
      HistoryImage
    },
    data: function() {
      return {
        historyWorkId: null,
        selectedImage: 0,
        images: [],
        slideItemWidth: 0,
        slideMaxWidth: 0
      }
    },
    computed: {
      totalMarkerCount() {
        let sum = 0
        this.images.forEach(x => {
          sum += x.markerCount
        })
        return sum
      },
      image() {
        let img = this.images.find(x => x.id === this.selectedImage)
        return this.images.length > 0 && img ? img : {}
      }
    },
    created() {
      const {
        params: { workId }
      } = this.$route
      this.historyWorkId = workId
    },
    mounted() {
      this.slideMaxWidth = this.$el.offsetWidth
      this.slideItemWidth = Math.floor(this.slideMaxWidth - 72) / 5 - 16
      if (this.vehicleId) this.getImages()
    },
    watch: {
      vehicleId(val) {
        if (val) {
          this.getImages()
        }
      }
    },
    methods: {
      getImages() {
        this.$axios.post(`/api/vehicle/${this.vehicleId}/histories/${this.historyWorkId}/images/list`).then(result => {
          if (result.success && result.data) {
            this.images = result.data
            this.selectedImage = this.images[0].id

            this.$nextTick(() => {
              if (this.$refs.slide) {
                this.$refs.slide.setWidths()
              }
            })
          }
        })
      },
      backToWorkshop() {
        this.$router.push({ name: 'Workshop', query: { id: this.vehicleId } })
      }
    }
  }
</script>

<style lang="scss">
  .machine-history-images {
  }
</style>
