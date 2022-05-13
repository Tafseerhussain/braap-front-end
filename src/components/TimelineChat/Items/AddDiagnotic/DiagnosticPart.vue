<template>
  <div class="align-self-stretch add-part">
    <!-- part result section -->
    <div class="result-section d-flex flex-column" v-if="part">
      <v-scroll-x-transition>
        <div v-if="oldPart">
          <Bubble align="right" color="braap_light_part" :editable="false" width="280" class="mt-1 mb-1">
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
      >
        <div class="body-1 d-block white--text" :class="{ 'text-decoration-line-through': removed }">
          <b>PART:</b> {{ part.name }}
        </div>
        <template #action><a @click="enterEditing">Modify</a> | <a @click="remove">Remove</a></template>
      </Bubble>
      <!-- edit diagnostic form -->
      <template v-if="inEditing">
        <div class="add-form mt-1 d-flex align-start mt-4">
          <PartSelector
            @on-select="update"
            v-bind="{ make, model, machineType, year, masterSystem: diagnostic.system }"
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
    name: 'DiagnosticPart',
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
      diagnostic: {
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
        inEditing: false,
        removed: false
      }
    },
    created() {
      this.part = this.value
    },
    methods: {
      moment,
      update(part) {
        this.$axios
          .post('/Timeline/ModifyDiagnosticPart', {
            vehicleId: this.vehicleId,
            workId: this.diagnostic.id,
            activityId: this.activity.id,
            partId: this.value.id,
            ...part
          })
          .then(result => {
            if (result && result.status === 200) {
              this.oldPart = { ...this.part }
              this.part.name = part.partName
              this.$emit('update', this.part)
              this.exitEdit()
              this.$refs.bubble.closeAction()

              setTimeout(() => {
                this.oldPart = null
              }, 2000)
            }
          })
      },
      remove() {
        this.$axios
          .post('/Timeline/RemoveDiagnosticPart', {
            vehicleId: this.vehicleId,
            workId: this.diagnostic.id,
            activityId: this.activity.id,
            partId: this.value.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.removed = true
              setTimeout(() => {
                this.$emit('remove')
              }, 1000)
              this.exitEdit()
            }
          })
      },
      enterEditing() {
        this.inEditing = true
        this.$refs.bubble.closeAction()
        this.$root.scrollTimelineToBottom()
      },
      toggleAction(val) {
        this.inEditing = false
        this.$emit('editing', val ? this.part.id : null)
      },
      exitEdit() {
        this.inEditing = false
        this.$emit('editing', null)
        this.$root.scrollTimelineToBottom()
      }
    }
  }
</script>

<style lang="scss">
  .add-part {
  }
</style>
