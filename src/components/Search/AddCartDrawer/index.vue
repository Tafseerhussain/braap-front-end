<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    :width="width"
    right
    class="rounded-0 rounded-tl-10 rounded-bl-10 addtocart-drawer"
  >
    <MachineRequiredWork
      ref="workplace"
      v-if="currentMachine"
      :machine="currentMachine"
      @on-close="drawer = false"
      @on-work-remove="onWorkRemove"
      @on-part-remove="onPartRemove"
      @on-work-added="onWorkAdded"
      @on-part-added="onPartAdded"
    ></MachineRequiredWork>
    <MachineSelector
      ref="selector"
      v-else
      :machines="machines"
      :item="item"
      @on-select="onSelectMachine"
      @on-close="drawer = false"
    ></MachineSelector>
  </v-navigation-drawer>
</template>

<script>
  import MachineSelector from './MachineSelector.vue'
  import MachineRequiredWork from './MachineRequiredWork.vue'

  export default {
    name: 'AddCartDrawer',
    components: {
      MachineSelector,
      MachineRequiredWork
    },
    data: function() {
      return {
        drawer: false,
        currentMachine: null,
        machines: [],
        data: null,
        filter: null
      }
    },
    computed: {
      width() {
        return this.currentMachine ? 640 : 600
      },
      item() {
        return this.data ? this.data.work || this.data.partName : null
      }
    },
    created() {},
    watch: {
      drawer(val) {
        if (val) this.$chat.hide()
        else this.$chat.show()
      }
    },
    methods: {
      add(action, { make, model, year, type, data }) {
        // cache the data
        this.data = { ...data, action }

        // check if the filter changed.
        let filter = type.trim() + make.trim() + model.trim() + year.trim()

        if (this.filter === filter) {
          // filter not change
          this.drawer = true
          if (this.currentMachine) {
            this.addToWorkplace()
          }
        } else {
          // filter changed
          this.filter = filter
          this.drawer = false

          this.getMachineByFilter({ make, model, year, type }).then(result => {
            this.drawer = true
            if (result.length > 1) {
              this.machines = result
              this.currentMachine = null
            } else {
              this.onSelectMachine(result[0])
            }
          })
        }
      },
      getMachineByFilter({ make, model, year, type }) {
        return new Promise(resolve => {
          this.$axios.post('/api/vehicle/list/byFilter', { make, model, year, type }).then(result => {
            if (result.success && result.data) {
              resolve(result.data)
            }
          })
        })
      },
      onSelectMachine(machine) {
        this.currentMachine = machine
        this.addToWorkplace()
      },
      addToWorkplace() {
        this.$nextTick(() => {
          this.$refs.workplace.addToWorkplace(this.data)
        })
      },
      onWorkAdded(work) {
        this.$emit('on-work-added', work)
      },
      onWorkRemove(work) {
        this.$emit('on-work-remove', work)
      },
      onPartRemove(part) {
        this.$emit('on-part-remove', part)
      },
      onPartAdded(part) {
        this.$emit('on-part-added', part)
      }
    }
  }
</script>

<style lang="scss">
  .addtocart-drawer {
    z-index: 100;
    box-shadow: var(--theme-shadow) !important;
    background-color: transparent !important;
    .v-navigation-drawer__border {
      display: none;
    }
    .ps:hover > .ps__rail-y {
      opacity: 0;
    }
    .ps.ps--scrolling-y:hover > .ps__rail-y {
      opacity: 0.6;
    }
  }
</style>
