<template>
  <div class="hour-input">
    <v-btn elevation="0" outlined class="pl-2 pr-2 rounded-10" @click="showInput" v-show="!show">
      {{ innerValue == 1 ? innerValue + ' hour' : innerValue + ' hours' }}
    </v-btn>
    <v-text-field
      ref="input"
      @keypress.enter="enter"
      v-model="innerValue"
      color="braap_orange"
      outlined
      class="rounded-10"
      v-show="show"
      @blur="onBlur"
    ></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'HourInput',

    props: {
      value: {
        type: Number
      }
    },

    data() {
      return {
        show: false,
        innerValue: null,
        originalValue: null
      }
    },
    created() {
      if (this.value) {
        this.innerValue = this.value
        this.originalValue = this.value
      }
    },
    watch: {
      value(val) {
        this.innerValue = val
        this.originalValue = val
      },
      innerValue(val, oldVal) {
        if (val && !/^[1-9]\d?$/.test(val.toString())) {
          this.$nextTick(() => {
            this.innerValue = oldVal
          })
        }
      }
    },
    mounted: function() {},
    methods: {
      enter() {
        this.$refs.input.blur()
      },
      showInput() {
        this.show = true
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      },
      onBlur() {
        this.show = false
        if (!this.innerValue) {
          this.innerValue = this.originalValue
        }
        if (parseInt(this.innerValue) > 40) {
          this.innerValue = 40
        }
        this.originalValue = this.innerValue
        this.$emit('on-change', this.innerValue * 1)
      }
    }
  }
</script>
<style  lang="scss">
  .hour-input {
    .v-btn {
      width: 100px;
      min-height: 40px;
    }
    .v-input {
      width: 100px;
      input {
        text-align: center;
        max-height: 40px;
      }
    }
    .v-text-field--outlined > .v-input__control > .v-input__slot {
      // background: #fff;
      min-height: 40px;
      margin-bottom: 0px;
    }
    .v-text-field.v-text-field--enclosed .v-text-field__details {
      display: none;
    }
  }
</style>