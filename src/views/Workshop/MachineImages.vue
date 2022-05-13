<template>
  <v-card class="machine-images" flat color="transparent">
    <div class="d-flex flex-column flex-sm-row align-center px-0 mb-5">
      <v-btn color="primary" class="mr-2 rounded-10 px-6" large>
        <input
          ref="upload"
          :value="file"
          type="file"
          class="upload-bt"
          accept="image/jpeg,image/png"
          multiple
          @change="uploadFile"
        />
        Browse
      </v-btn>
      <span class="">Upload New Image</span>
      <v-spacer></v-spacer>
      <v-btn
        x-large
        class="rounded-10"
        :color="totalMarkerCount > 0 ? 'braap_orange' : ''"
        :dark="totalMarkerCount > 0"
        :disabled="totalMarkerCount <= 0"
        @click="sendToCart"
      >
        <span class="">Send Interactive Parts to Cart</span>
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
                <template v-if="image.markerCount === 0">
                  <v-hover v-slot="{ hover }">
                    <v-btn
                      absolute
                      style="top: -8px; right: -8px; z-index: 10; background-color: #f7f7f7"
                      icon
                      :color="hover ? 'braap_red' : 'primary'"
                      @click="deleteImage(image.id, index)"
                      x-small
                    >
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-hover>
                </template>
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
        <MachineImage
          ref="current"
          v-if="vehicleId && image.id"
          :vehicleId="vehicleId"
          :image="image"
          :count.sync="image.markerCount"
          class=""
          @marker-removed="markerRemoved"
        ></MachineImage>
      </v-scroll-x-reverse-transition>
    </v-card-text>
  </v-card>
</template>

<script>
  import MachineImage from './MachineImage.vue'

  export default {
    name: 'MachineImages',
    props: {
      vehicleId: {
        type: String,
        required: true
      }
    },
    components: {
      MachineImage
    },
    data: function() {
      return {
        query: null,
        selectedImage: 0,
        images: [],
        file: null,
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
    created() {},
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
        this.$axios.post(`/api/vehicle/${this.vehicleId}/images/list`).then(result => {
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
      uploadFile(e) {
        var formData = new FormData()
        for (var i = 0; i < e.target.files.length; i++) {
          formData.append('vehicleImage[' + i + ']', e.target.files[i])
        }
        formData.append('vehicleId', this.vehicleId)

        this.$axios
          .post(`/api/vehicle/${this.vehicleId}/images/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          .then(result => {
            if (result.success && result.data) {
              result.data.forEach(img => {
                this.images.splice(0, 0, img)
              })

              this.$nextTick(() => {
                this.selectedImage = this.images[0].id
              })
            } else this.$msg.error('Operation failed.')
            this.file = null
          })
      },
      deleteImage(imageId, indexToDelete) {
        this.$axios.post(`/api/vehicle/${this.vehicleId}/images/delete/${imageId}`).then(result => {
          if (result.success && result.data) {
            this.images.splice(indexToDelete, 1)
            if (imageId == this.selectedImage) {
              this.$nextTick(() => {
                this.selectedImage = this.images[0].id
              })
            }
          }
        })
      },
      reloadCurrentImage() {
        this.$refs.current.loadImage()
      },
      markerRemoved(id) {
        this.$emit('marker-removed', id)
      },
      sendToCart() {
        this.$axios.post(`/api/vehicle/${this.vehicleId}/works/addToCart`).then(result => {
          if (result.success && result.data) {
            this.$msg.success('Required works and related parts has been added to cart.')
            this.getImages()
            this.$emit('send-cart')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .machine-images {
    .v-slide-group__next,
    .v-slide-group__prev {
      min-width: 36px;
      flex-basis: 36px;
      .v-icon {
        font-size: 34px;
      }
      .v-icon--disabled {
        opacity: 0.3 !important;
      }
    }

    @media (min-width: 1280px) {
      .header {
        top: 90px;
        position: -webkit-sticky;
        position: sticky;
        z-index: 3;
      }
    }
    .upload-bt {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 5;
      cursor: pointer;
    }

    .v-slide-item--active {
      .v-icon.mdi-check-circle-outline {
        top: 50%;
        left: 50%;
        margin-top: -24px;
        margin-left: -24px;
        z-index: 1;
      }
    }
  }
</style>
