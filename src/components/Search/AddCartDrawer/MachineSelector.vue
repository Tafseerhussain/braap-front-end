<template>
  <div class="machine-selector d-flex pa-0">
    <v-card class="d-flex flex-column flex-grow-1" color="transparent">
      <div class="header px-8 mb-6 pt-8">
        <v-btn icon class="mb-6" @click="closeDrawer">
          <v-icon color="white">$svg-arrow-left</v-icon>
        </v-btn>

        <div class="d-flex align-start mb-4">
          <v-icon color="white">$svg-select</v-icon>
          <div class="ml-2 white--text" style="line-height: 28.8px">
            <span ref="first" :class="{ 'hide-more': hideMore && !showFullText }">
              Relate the
              <b class="item braap_orange--text">{{ item }}</b>
            </span>
            <span>
              to the correct machine or asset.
              <template v-if="hideMore">
                <a class="braap_orange--text" @click="showMoreText">{{ showFullText ? 'Show less' : 'Show More' }} </a>
                <img
                  class="ml-1"
                  width="18"
                  v-show="!showFullText"
                  src="/icons/arrow-right-orange.svg"
                  alt="right arrow"
                />
              </template>
            </span>
          </div>
        </div>
        <v-text-field
          outlined
          flat
          placeholder="Search VIN | Asset ID or address"
          prepend-inner-icon="$svg-search"
          hide-details
          class="mt-2 mb-0 rounded-10 braap-filter-search white"
          v-model="query"
        ></v-text-field>
      </div>
      <perfect-scrollbar
        ref="ps"
        class="machine-container flex-grow-1 pl-8 pr-8 mb-8"
        :options="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <div ref="psContent" class="d-flex flex-wrap card-container">
          <MachineAsset
            v-for="machine in filteredMachines"
            :key="machine.id"
            :value="machine"
            :selected="machine.id === selectedMachine"
            readonly
            @select="select"
            style="padding-bottom: 20px !important"
          >
            <template v-slot:action="{ machine }">
              <div class="d-flex flex-column align-center">
                <div class="body-1 primary--text" style="line-height: 24px">{{ machine.location }}</div>
              </div>
            </template>
          </MachineAsset>
        </div>
      </perfect-scrollbar>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import MachineAsset from '@/components/Vehicle/MachineAsset'

  export default {
    name: 'MachineSelector',
    props: {
      machines: {
        type: Array,
        default: () => []
      },
      item: {
        type: String
      }
    },
    components: {
      MachineAsset
    },
    data: function() {
      return {
        innerMachines: [],
        hideMore: false,
        showFullText: false,
        query: null,
        selectedMachine: null
      }
    },
    created() {
      this.innerMachines = this.machines
        ? this.machines.map(x => {
            return { ...x, selected: false }
          })
        : []
    },
    computed: {
      filteredMachines() {
        var data = this.innerMachines
        if (this.query) {
          data = data.filter(x => {
            let temp = x.vind && x.vin.toLowerCase().indexOf(this.query) >= 0
            temp = temp || (x.fullName && x.fullName.toLowerCase().indexOf(this.query) >= 0)
            temp = temp || (x.location && x.location.toLowerCase().indexOf(this.query) >= 0)
            return temp
          })
        }
        return data
      }
    },
    watch: {
      item() {
        this.$nextTick(() => {
          var height = this.$refs.first.offsetHeight
          if (height > 58) {
            this.hideMore = true
          } else {
            this.hideMore = false
          }
          this.showFullText = false
        })
      },
      machines(val) {
        this.innerMachines = val
          ? val.map(x => {
              return { ...x, selected: false }
            })
          : []
      }
    },
    methods: {
      moment,
      select(machine) {
        this.selectedMachine = machine.id
        setTimeout(() => {
          this.$emit('on-select', machine)
        }, 300)
      },
      showMoreText() {
        this.showFullText = !this.showFullText
      },
      closeDrawer() {
        this.$emit('on-close')
      }
    }
  }
</script>

<style lang="scss">
  .machine-selector {
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: #1d1919cc !important;
    backdrop-filter: blur(15px);

    .hide-more {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    a {
      text-decoration: underline;
    }

    .machine-container {
      // min-height: 300px;
      max-height: calc(100vh - 144px);
      overflow: auto;

      & > div {
        min-height: 100%;
      }

      .card-wrapper {
        flex-basis: calc(100% - 20px) !important;
      }
    }
  }
</style>

