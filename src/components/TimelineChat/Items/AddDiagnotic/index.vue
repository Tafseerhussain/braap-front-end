<template>
  <div class="align-self-stretch add-diagnostic my-3">
    <!-- Add diagnostic form -->
    <div class="add-form" v-if="!diagnostic">
      <div class="d-flex align-center">
        <Bubble align="left" color="braap_grey">
          <span class="body-1 d-block white--text"> Adding new diagnostic </span>
        </Bubble>
        <v-btn icon elevation="0" small class="ml-2" @click="exitAdding">
          <v-icon color="braap-grey">mdi-close-circle</v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center mb-4 max-width-400">
        <DiagnosticSelector @change="add" :machineType="machineType"></DiagnosticSelector>
      </div>
    </div>
    <!-- Diagnostic result section -->
    <div class="result-section d-flex flex-column" v-if="diagnostic">
      <v-scroll-x-transition>
        <div v-if="oldDiagnostic">
          <Bubble
            align="right"
            color="braap_light_blue"
            :editable="false"
            width="300"
            class="mt-1 mb-1"
            :timestamp="oldDiagnostic.timestamp"
          >
            <div class="body-1 d-block white--text text-decoration-line-through">
              <div>
                <b>JOB:</b> {{ oldDiagnostic.type }} | {{ oldDiagnostic.make }} {{ oldDiagnostic.model }}
                {{ oldDiagnostic.year }}
              </div>
              <div><b>DIAGNOSTIC:</b> {{ oldDiagnostic.work }}</div>
            </div>
          </Bubble>
        </div>
      </v-scroll-x-transition>
      <Bubble
        ref="bubble"
        align="right"
        color="braap_blue"
        :editable="!disabled"
        width="300"
        class="mt-1 mb-1"
        @toggle-action="toggleAction"
        :timestamp="activity.timestamp"
      >
        <div class="body-1 d-block white--text">
          <div>
            <b>JOB:</b> {{ diagnostic.type }} | {{ diagnostic.make }} {{ diagnostic.model }} {{ diagnostic.year }}
          </div>
          <div><b>DIAGNOSTIC:</b> {{ diagnostic.work }}</div>
        </div>
        <template #action><a @click="enterEditing">Modify</a> | <a @click="remove">Remove</a></template>
      </Bubble>
      <!-- edit diagnostic form -->
      <template v-if="willEditDiag">
        <div class="add-form mt-1 d-flex align-center mt-3 mb-4 max-width-400" v-if="inEditingDiag">
          <DiagnosticSelector @change="update" :machineType="machineType"></DiagnosticSelector>
          <v-btn icon elevation="0" small class="ml-2" @click="exitEditing">
            <v-icon color="braap-grey">mdi-close-circle</v-icon>
          </v-btn>
        </div>
      </template>
      <!-- parts section -->
      <template v-else>
        <template v-if="inAddingPart">
          <div class="d-flex align-center">
            <Bubble align="left" color="braap_grey">
              <span class="body-1 d-block white--text"> Adding a part to the diagnostic </span>
            </Bubble>
            <v-btn icon elevation="0" small class="ml-2" @click="exitAddingPart">
              <v-icon color="braap-grey">mdi-close-circle</v-icon>
            </v-btn>
          </div>
          <PartSelector
            @on-select="addPart"
            v-bind="{ make, model, machineType, year, masterSystem: diagnostic.system }"
          ></PartSelector>
        </template>
        <template v-else>
          <DiagnosticPart
            v-for="part in filterParts"
            :key="part.id"
            :value="part"
            v-bind="{ vehicleId, make, model, machineType, year, disabled, activity, diagnostic }"
            @update="partUpdate"
            @remove="partRemove(part)"
            @editing="partEditing"
          >
          </DiagnosticPart>
          <v-btn
            v-if="!disabled"
            v-show="!partInEdit"
            color="braap_green"
            :disabled="disabled"
            :dark="!disabled"
            class="mt-1 mb-1 ml-auto"
            small
            @click="addingPart"
            >+ Add Part
          </v-btn>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import Bubble from '../Bubble.vue'
  import moment from 'moment'
  import DiagnosticSelector from './DiagnosticSelector.vue'
  import DiagnosticPart from './DiagnosticPart'
  import PartSelector from '../../Components/PartSelector.vue'

  export default {
    name: 'AddDiagnostic',
    components: {
      Bubble,
      DiagnosticSelector,
      DiagnosticPart,
      PartSelector
    },
    props: {
      value: {
        type: Object
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
      vehicleId: {
        type: String
      },
      activity: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean
      }
    },
    data: function() {
      return {
        diagnostic: null,
        oldDiagnostic: null,
        parts: [],
        willEditDiag: false,
        inEditingDiag: false,
        partInEdit: null,
        inAddingPart: false
      }
    },
    created() {
      this.diagnostic = this.value ? this.value.diagnostic : null
      this.parts = this.value ? this.value.parts : []
    },
    mounted() {},
    computed: {
      filterParts() {
        if (this.partInEdit) return this.parts.filter(x => x.id == this.partInEdit)
        else return this.parts
      },
      inEditing() {
        return this.inEditingDiag || this.inAddingPart || this.willEditDiag || !!this.partInEdit
      }
    },
    watch: {
      inEditing(val) {
        if (!this.disabled) this.$root.updateTimelineAddBtn(val)
      }
    },
    methods: {
      moment,
      add({ system, work }) {
        this.$axios
          .post('/Timeline/AddDiagnostic', {
            vehicleId: this.vehicleId,
            system,
            work,
            activityId: this.activity.disabledId
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
                event: 'diagnostic-added',
                action: 'add',
                activity: result.data
              })
            }
          })
      },
      update({ system, work }) {
        this.$axios
          .post('/Timeline/ModifyDiagnostic', {
            vehicleId: this.vehicleId,
            system,
            work,
            workId: this.diagnostic.id,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.oldDiagnostic = { ...this.diagnostic }
              this.oldDiagnostic.timestamp = this.activity.timestamp
              this.diagnostic.work = work
              this.diagnostic.system = system
              this.exitEditing()
              this.$refs.bubble.closeAction()
              this.$root.scrollTimelineToBottom()

              this.$emit('change', {
                action: 'update',
                activity: result.data
              })

              setTimeout(() => {
                this.oldDiagnostic = null
              }, 2000)
            }
          })
      },
      remove() {
        this.$axios
          .post('/Timeline/RemoveDiagnostic', {
            vehicleId: this.vehicleId,
            workId: this.diagnostic.id,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('change', {
                event: 'diagnostic-canceled',
                action: 'remove',
                activity: this.activity
              })
            }
          })
      },
      // editing ui control
      enterEditing() {
        this.inEditingDiag = true
        this.$refs.bubble.closeAction()
        this.$root.scrollTimelineToBottom()
      },
      toggleAction(val) {
        this.willEditDiag = val
        this.inEditingDiag = false
        this.partEditing(null)
        this.inAddingPart = false
      },
      exitEditing() {
        this.inEditingDiag = false
        this.willEditDiag = false
        this.$root.scrollTimelineToBottom()
      },
      // adding ui control
      exitAdding() {
        this.$emit('change', {
          event: 'diagnostic-canceled',
          action: 'remove',
          activity: this.activity
        })
      },
      // adding part
      addingPart() {
        this.inAddingPart = true
        this.$root.scrollTimelineToBottom()
      },
      exitAddingPart() {
        this.inAddingPart = false
        this.$root.scrollTimelineToBottom()
      },
      addPart(part) {
        this.$axios
          .post('/Timeline/AddPartToDiagnostic', {
            vehicleId: this.vehicleId,
            workId: this.diagnostic.id,
            activityId: this.activity.id,
            ...part
          })
          .then(result => {
            if (result && result.status === 200) {
              this.exitAddingPart()
              this.$emit('change', {
                event: '',
                action: 'update',
                activity: result.data
              })
              this.parts = result.data.props.value.parts
            }
          })
      },
      // part in edit ui control
      partEditing(val) {
        this.partInEdit = val
      },
      partUpdate(part) {
        var index = this.parts.findIndex(x => x.id == part.id)
        if (index >= 0) {
          this.parts.splice(index, 1, part)
          this.$root.scrollTimelineToBottom()
        }
      },
      partRemove(part) {
        var index = this.parts.findIndex(x => x.id == part.id)
        if (index >= 0) {
          this.parts.splice(index, 1)
          this.$root.scrollTimelineToBottom()
        }
      }
    }
  }
</script>

<style lang="scss">
  .add-diagnostic {
  }
</style>
