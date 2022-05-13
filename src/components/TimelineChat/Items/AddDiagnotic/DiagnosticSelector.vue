<template>
  <v-autocomplete
    outlined
    rounded
    solo
    flat
    dense
    placeholder="Search for diagnostics"
    prepend-inner-icon="mdi-magnify"
    hide-no-data
    no-filter
    hide-details
    :items="diagnostics"
    v-model="selectedDiagnostic"
    :search-input.sync="searchQuery"
    item-text="Title"
    item-value="Title"
    return-object
    class="diagnostic-selector"
    :disabled="disabled"
    :menu-props="{ contentClass: 'diagnostic' }"
  >
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.Title"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.System"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'DiagnosticSelector',
    components: {},
    props: {
      machineType: {
        type: String
      }
    },
    data: function() {
      return {
        diagnostics: [],
        selectedDiagnostic: null,
        searchQuery: null,
        timerId: null,
        disabled: false
      }
    },
    mounted() {},
    watch: {
      searchQuery(val) {
        this.getDiagnostics(val)
      },
      selectedDiagnostic(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.$emit('change', { system: newVal.System, work: newVal.Title })
          this.disabled = true
        }
      }
    },
    methods: {
      moment,
      getDiagnostics(query) {
        clearTimeout(this.timerId)

        this.timerId = setTimeout(() => {
          this.$axios
            .post('/Timeline/GetDiagnosticAutocomplete', { machineType: this.machineType, query })
            .then(result => {
              if (result && result.status === 200) {
                this.diagnostics = result.data
              }
            })
        }, 300)
      }
    }
  }
</script>

<style lang="scss">
  .diagnostic-selector {
    &.v-text-field--rounded > .v-input__control > .v-input__slot {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  }
  .v-autocomplete__content.diagnostic {
    max-width: 500px;
    .v-list-item__title {
      white-space: normal;
    }
  }
</style>
