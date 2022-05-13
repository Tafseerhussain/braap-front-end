<template>
  <div class="align-self-stretch add-part my-3">
    <!-- Add part form -->
    <div class="add-form" v-if="!part">
      <div class="d-flex align-center">
        <Bubble align="left" color="braap_grey">
          <span class="body-1 d-block white--text"> Adding a part to the maintenance job </span>
        </Bubble>
        <v-btn icon elevation="0" small class="ml-2" @click="exitAdding">
          <v-icon color="braap-grey">mdi-close-circle</v-icon>
        </v-btn>
      </div>
      <PartSelector @on-select="add" v-bind="{ make, model, machineType, year, masterSystem: 'Engine' }"></PartSelector>
    </div>
    <!-- part result section -->
    <div class="result-section d-flex flex-column" v-if="part">
      <v-scroll-x-transition>
        <div v-if="oldPart">
          <Bubble
            align="right"
            color="braap_light_part"
            :editable="false"
            width="280"
            class="mt-1 mb-1"
            :timestamp="oldPart.timestamp"
          >
            <div class="body-1 d-block white--text text-decoration-line-through"><b>PART:</b> {{ oldPart.name }}</div>
          </Bubble>
        </div>
      </v-scroll-x-transition>
      <Bubble
        ref="bubble"
        align="right"
        color="braap_part"
        :editable="!disabled && !removed"
        width="280"
        class="mt-1 mb-1"
        @toggle-action="toggleAction"
        :timestamp="activity.timestamp"
      >
        <div class="body-1 d-block white--text" :class="{ 'text-decoration-line-through': removed }">
          <b>PART:</b> {{ part.name }}
        </div>
        <template #action><a @click="enterEditing">Modify</a> | <a @click="remove">Remove</a></template>
      </Bubble>
      <!-- edit part form -->
      <template v-if="inEditingPart">
        <div class="add-form mt-1 d-flex align-start mt-4">
          <PartSelector
            @on-select="update"
            v-bind="{ make, model, machineType, year, masterSystem: 'Engine' }"
          ></PartSelector>
          <v-btn icon elevation="0" small class="ml-n4 mt-1" @click="exitEdit">
            <v-icon color="braap-grey">mdi-close-circle</v-icon>
          </v-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import Bubble from '../Bubble.vue'
  import moment from 'moment'
  import PartSelector from '../../Components/PartSelector.vue'

  export default {
    name: 'AddPart',
    components: {
      Bubble,
      PartSelector
    },
    props: {
      value: {
        type: Object
      },
      vehicleId: {
        type: String
      },
      machineType: {
        type: String
      },
      make: {
        type: String
      },
      model: {
        type: String
      },
      year: {
        type: String
      },
      activity: {
        type: Object
      },
      disabled: {
        type: Boolean
      }
    },
    data: function() {
      return {
        part: null,
        oldPart: null,
        willEditPart: false,
        inEditingPart: false,
        removed: false
      }
    },
    created() {
      this.part = this.value
    },
    computed: {
      inEditing() {
        return this.inEditingPart || this.willEditPart
      }
    },
    watch: {
      inEditing(val) {
        if (!this.disabled) this.$root.updateTimelineAddBtn(val)
      }
    },
    methods: {
      moment,
      add(part) {
        // ajax to add part
        this.$axios
          .post('/Timeline/AddMaintenancePart', {
            vehicleId: this.vehicleId,
            activityId: this.activity.disabledId,
            ...part
          })
          .then(result => {
            // remove the tempary activity
            this.$emit('change', {
              event: '',
              action: 'remove',
              activity: this.activity
            })
            if (result && result.status === 200) {
              this.$emit('change', {
                event: 'part-added',
                action: 'add',
                activity: result.data
              })
            }
          })
      },
      update(part) {
        this.$axios
          .post('/Timeline/ModifyMaintenancePart', {
            vehicleId: this.vehicleId,
            activityId: this.activity.id,
            partId: this.value.id,
            ...part
          })
          .then(result => {
            if (result && result.status === 200) {
              this.oldPart = { ...this.part }
              this.oldPart.timestamp = this.activity.timestamp
              this.part.name = part.partName
              this.exitEdit()
              this.$refs.bubble.closeAction()

              this.$emit('change', {
                action: 'update',
                activity: result.data
              })

              setTimeout(() => {
                this.oldPart = null
              }, 2000)
            }
          })
      },
      remove() {
        this.$axios
          .post('/Timeline/RemoveMaintenancePart', {
            vehicleId: this.vehicleId,
            activityId: this.activity.id,
            partId: this.value.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.removed = true
              setTimeout(() => {
                this.$emit('change', {
                  event: 'part-canceled',
                  action: 'remove',
                  activity: this.activity
                })
              }, 1000)
              this.exitEdit()
            }
          })
      },
      // adding ui control
      exitAdding() {
        this.$emit('change', {
          event: 'part-canceled',
          action: 'remove',
          activity: this.activity
        })
      },
      enterEditing() {
        this.inEditingPart = true
        this.$refs.bubble.closeAction()
        this.$root.scrollTimelineToBottom()
      },
      toggleAction(val) {
        this.willEditPart = val
        this.inEditingPart = false
      },
      exitEdit() {
        this.willEditPart = false
        this.inEditingPart = false
        this.$root.scrollTimelineToBottom()
      }
    }
  }
</script>

<style lang="scss">
  .add-part {
  }
</style>
