<template>
  <v-menu v-model="dp_open" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
    <template v-slot:activator="{ on, slotAttrs }">
      <v-text-field
        v-model="dp_formatted"
        v-bind="{ ...slotAttrs, ...$attrs }"
        :class="classNames"
        v-on="on"
        readonly
        clearable
        append-icon="mdi-calendar-month-outline"
        :color="color"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="innerValue"
      @input="input"
      :allowed-dates="allowedDates"
      no-title
      show-adjacent-months
      :color="color"
    ></v-date-picker>
  </v-menu>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'VDatePickerInput',

    props: {
      value: {
        type: String
      },
      classNames: {
        type: String
      },
      allowedDates: {
        type: Function,
        default: () => true
      },
      color: {
        type: String
      }
    },

    data() {
      return {
        dp_open: false,
        dp_formatted: null,
        innerValue: ''
      }
    },
    created() {
      if (this.value) {
        this.innerValue = moment(this.value).format('YYYY-MM-DD')
      }
    },
    watch: {
      value(val) {
        this.innerValue = val ? moment(val).format('YYYY-MM-DD') : val
      },
      innerValue(val) {
        if (val) {
          this.dp_formatted = moment(val).format('MM-DD-YYYY')
        } else {
          this.dp_formatted = val
        }
        this.$emit('input', val)
      },
      dp_formatted(val) {
        if (!val) {
          this.innerValue = ''
        }
      }
    },
    mounted: function() {},
    methods: {
      input() {
        this.dp_open = false
        this.$emit('date-input', this.innerValue)
      }
    }
  }
</script>
<style  lang="scss">
</style>