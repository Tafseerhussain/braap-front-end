<template>
  <div class="google-map"></div>
</template>

<script>
  export default {
    name: 'GoogleMap',
    data: function() {
      return {
        map: null,
        marker: null
      }
    },
    computed: {},
    mounted() {},
    methods: {
      createMaker({ lat, lng }) {
        if (!this.map) {
          this.initMap({ lat, lng })
        } else {
          this.map.setCenter({ lat, lng })
        }
        if (this.marker) {
          this.marker.setMap(null)
        }
        this.marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          optimized: false,
          draggable: true
        })
        this.marker.addListener('drag', event => {
          this.$emit('position-updated', { lat: event.latLng.lat(), lng: event.latLng.lng() })
        })
      },
      initMap({ lat, lng }) {
        this.map = new window.google.maps.Map(this.$el, {
          zoom: 16,
          center: { lat, lng }
        })
      }
    }
  }
</script>

<style lang="scss">
  .google-map {
    height: 300px;
  }
</style>
