<template>
  <div>
    <v-snackbar
      v-model="showValue"
      :bottom="y === 'bottom'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :right="x === 'right'"
      :timeout="timeout"
      :top="y === 'top'"
      :color="color"
      :vertical="mode === 'vertical'"
      max-width="300"
      :class="{ vertical: vertical }"
    >
      <span class="body-0">{{ text }}</span>
      <template v-slot:action="{ attrs }">
        <v-btn v-if="showOk" color="white" text v-bind="attrs" @click="onOkClick"> {{ okText }} </v-btn>
        <v-btn v-if="showCancel" color="white" text v-bind="attrs" @click="onCancelClick"> {{ cancelText }} </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
  import { VBtn, VSnackbar } from 'vuetify/lib'
  export default {
    name: 'm-snackbar',
    components: {
      VBtn,
      VSnackbar
    },
    props: {
      color: {
        default: 'green',
        type: String
      },
      mode: {
        default: 'multi-line',
        type: String
      },
      show: {
        default: false,
        type: Boolean
      },
      text: {
        default: "Hello, I'm a snackbar",
        type: String
      },
      timeout: {
        default: 5000,
        type: Number
      },
      x: {
        type: String,
        default: null
      },
      y: {
        type: String,
        default: 'top'
      },
      showOk: {
        default: false,
        type: Boolean
      },
      showCancel: {
        default: false,
        type: Boolean
      },
      okText: {
        default: 'OK',
        type: String
      },
      cancelText: {
        default: 'CLOSE',
        type: String
      },
      onOk: {},
      onCancel: {},
      vertical: {
        default: false,
        type: Boolean
      }
    },
    data() {
      return {
        showValue: false
      }
    },
    watch: {
      show: {
        handler(val) {
          this.showValue = val
        },
        immediate: true
      }
    },
    methods: {
      onOkClick() {
        if (this.onOk) this.onOk()
      },
      onCancelClick() {
        if (this.onCancel) this.onCancel()
        else {
          this.showValue = false
        }
      }
    }
  }
</script>
<style lang="scss">
  .v-snack {
    &.vertical {
      .v-snack__wrapper {
        flex-direction: column;
        .v-snack__action {
          align-self: flex-end;
        }
      }
    }
  }
</style>