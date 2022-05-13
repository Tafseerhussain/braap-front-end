<template>
  <div class="marker-wrapper" :style="style">
    <div
      ref="marker_bt"
      class="marker-bt d-flex align-center justify-center"
      :class="{ pulse: isNew, primary: !isNew, braap_orange: isNew }"
      @click="onMarkerClick"
    >
      <v-icon color="white" size="36" :x-large="isNew">{{
        opened || isNew ? 'mdi-arrow-expand-all' : 'mdi-navigation-variant'
      }}</v-icon>
    </div>
    <div v-show="opened && !isNew" ref="marker_info" class="marker-info white--text obstacle elevation-1">
      <v-hover v-slot="{ hover }">
        <div class="d-flex align-item">
          <div class="text-clamp">
            {{ data.markerHead }}
          </div>
          <v-scroll-x-reverse-transition>
            <div class="d-flex align-center btn-wrapper" v-if="hover">
              <v-btn x-small dark icon class="mr-1"> <v-icon>mdi-eye</v-icon></v-btn>
            </div>
          </v-scroll-x-reverse-transition>
        </div>
      </v-hover>
      <div class="caption" style="line-height: 1.1" v-if="data.markerNote">{{ data.markerNote }}</div>
    </div>

    <div
      v-if="isNew"
      class="marker-info-1 obstacle elevation-1 braap_orange rounded-10 white--text d-flex align-center"
    >
      <div class="py-4 px-4">
        <div class="text-nowrap">Drag to part location</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MachineImageMarker',
    props: {
      vehicleId: {
        type: String,
        required: true
      },
      container: {
        type: String,
        required: true
      },
      data: {
        type: Object,
        required: true,
        default: () => {}
      },
      expanded: {
        type: Boolean,
        default: false
      },
      newTag: {
        type: Boolean
      }
    },
    components: {},
    data: function() {
      return {
        opened: false,
        dragging: false,
        percentTop: 0,
        percentLeft: 0,
        infoTop: 40,
        infoLeft: 40,
        isNew: false,
        $bt: null,
        $info: null,
        $element: null,
        $line: null,
        temp: {}
      }
    },
    computed: {
      style() {
        return {
          left: this.percentLeft + '%',
          top: this.percentTop + '%',
          zIndex: this.opened ? 10 : null
        }
      },
      infoStyle() {
        return {
          left: this.isNew ? '0px' : this.infoLeft + 'px',
          top: this.isNew ? '70px' : this.infoTop + 'px',
          'max-width': this.isNew ? 'none' : '200px'
        }
      }
    },
    created() {
      if (this.data) {
        if (this.data.markerPosition) {
          this.percentLeft = this.data.markerPosition.left
          this.percentTop = this.data.markerPosition.top
          this.infoTop = this.data.markerPosition.infoTop || 40
          this.infoLeft = this.data.markerPosition.infoLeft || 40
        }
        this.opened = this.data.opened
        this.isNew = this.data.isNew
      }
    },
    mounted() {
      this.$element = window.$(this.$el)
      this.$info = window.$(this.$refs.marker_info)
      this.$bt = window.$(this.$refs.marker_bt)
      this.$line = window.$(this.$refs.marker_line)
    },
    watch: {
      data: {
        handler(val) {
          if (val) {
            if (val.markerPosition) {
              this.percentLeft = val.markerPosition.left
              this.percentTop = val.markerPosition.top
              this.infoTop = val.markerPosition.infoTop || 40
              this.infoLeft = val.markerPosition.infoLeft || 40
              this.temp = { ...val.markerPosition }
            }
          }
        },
        deep: true
      },
      expanded(val) {
        this.opened = val
      },
      newTag(val) {
        this.isNew = val
      }
    },
    methods: {
      onMarkerClick() {
        if (!this.dragging) {
          this.opened = !this.opened
          this.$emit('update:expanded', this.opened)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .marker-wrapper {
    position: absolute;
    z-index: 2;

    .marker-bt {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      z-index: 2;
      position: relative;
      box-shadow: 0 4px 15px 0 #8a8a8a;
      cursor: move;
    }
    .marker-info {
      display: flex;
      align-items: center;
      position: absolute;
      left: 29px;
      top: 29px;
      max-width: 300px;
      min-width: 240px;
      height: 60px;
      background: radial-gradient(66px at top left, #0000 50%, #000 50%);
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      overflow: hidden;
      cursor: move;
      font-size: 14px;
      line-height: 20px;
      padding: 0 10px 0 40px;
    }
    @keyframes blink {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    .marker-info-1 {
      left: 69px;
      top: 0px;
      position: absolute;
      max-width: 300px;
      height: 60px;
      font-size: 14px;
      line-height: 20px;
      opacity: 0;
      transition: 0.3s;
      white-space: nowrap;
      animation: blink 1s;
      animation-iteration-count: 4;
    }
    .marker-bt:hover,
    .marker-bt:focus {
      & + .marker-info + .marker-info-1 {
        opacity: 1;
      }
    }

    .text-clamp {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .marker-line {
      display: none;
      position: absolute;
      height: 2px;
      background-color: black;
    }
  }
</style>
