<template>
  <v-card class="timezone section-wrapper rounded-10 pa-10 mb-5">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0 mb-3">
      <v-icon color="braap_orange" size="36" class="mr-2">mdi-map-clock-outline</v-icon>
      <span class="mt-1">Timezone</span>
    </v-card-title>
    <v-card-text class="pa-0 pt-4">
      <v-autocomplete
        ref="input"
        label="Select Timezone"
        color="braap_orange"
        :items="cities"
        v-model="timezone"
        item-text="text"
        item-value="name"
        @change="updateTimezone"
      ></v-autocomplete>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'Timezone',
    components: {},
    props: {
      value: {
        type: String
      }
    },
    data: function() {
      return {
        timezone: null
      }
    },
    watch: {
      value(val) {
        if (val) this.timezone = val
      }
    },
    computed: {
      cities() {
        if (!moment.tz) return []
        var names = moment.tz.names()
        var data = []
        for (var c in names) {
          let name = names[c]
          let tz = moment.tz(names[c])
          let utcOffset = tz.utcOffset()
          let offset = tz.format('Z')

          data.push({
            name: names[c],
            text: '(GMT ' + offset + ') ' + name,
            offset,
            utcOffset
          })
        }
        return data.sort(function(a, b) {
          return a.utcOffset - b.utcOffset
        })
      }
    },
    created() {
      this.timezone = moment.tz.guess()
    },
    methods: {
      updateTimezone() {
        if (this.timezone) {
          let tz = this.cities.find(x => x.name == this.timezone)
          if (tz) {
            this.$axios
              .post('/api/user/profile/update', {
                timezone: tz.name,
                utcOffset: tz.utcOffset
              })
              .then(result => {
                if (result.success) {
                  this.$store.commit('setTimezone', tz.name)
                  this.$refs.input.blur()
                }
              })
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .timezone {
  }
</style>
