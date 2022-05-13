<template>
  <div class="bubble-wrapper flex-grow-0 flex-column" :class="wrapperClass">
    <div v-if="timestamp" class="timestamp pl-1 pr-1">
      <span class="time mr-1">{{ moment(timestamp.time).format('MMM D, YYYY h:mm A') }}</span>
      <span class="user">Updated by {{ timestamp.name }}</span>
    </div>
    <v-card :color="color" dark :elevation="elevation">
      <v-card-text
        class="pa-3 white--text"
        :style="{ maxWidth: maxWidth + 'px', width: width ? width + 'px' : 'auto' }"
      >
        <slot></slot>
        <v-icon v-if="editable" light small class="edit-bt" @click="toggleAction">mdi-cog-outline</v-icon>
      </v-card-text>
    </v-card>

    <v-expand-transition>
      <div class="actions body-2 align-self-start ml-1" v-show="showAction" v-if="editable">
        <slot name="action" v-bind:showAction="showAction"></slot>
      </div>
    </v-expand-transition>

    <slot name="bottom"></slot>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'Bubble',
    props: {
      color: {
        type: String,
        default: 'braap_grey'
      },
      elevation: {
        type: Number,
        default: 3
      },
      maxWidth: {
        type: Number,
        default: 400
      },
      width: {
        type: String
      },
      timestamp: {
        type: Object
      },
      align: {
        type: String,
        default: 'right'
      },
      editable: {
        type: Boolean,
        default: false
      },
      visible: {
        type: Boolean,
        default: true
      }
    },
    components: {},
    data: function() {
      return {
        showAction: false
      }
    },
    computed: {
      wrapperClass() {
        return {
          'd-none': !this.visible,
          'd-flex': this.visible,
          'align-end': this.align === 'right',
          'align-start': this.align === 'left',
          'align-self-end': this.align === 'right',
          'align-self-start': this.align === 'left'
        }
      }
    },
    methods: {
      moment,
      closeAction() {
        this.showAction = false
      },
      toggleAction() {
        this.showAction = !this.showAction
        this.$emit('toggle-action', this.showAction)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .bubble-wrapper {
    // width: 100%;
    margin-top: 12px;
    margin-bottom: 12px;

    .edit-bt {
      position: absolute !important;
      top: 50%;
      margin-top: -8px;
    }

    &.align-start {
      .edit-bt {
        right: -20px;
      }
    }

    &.align-end {
      .edit-bt {
        left: -20px;
      }
    }

    .timestamp {
      font-size: 12px;
      color: $braap_grey;
    }
  }
</style>
