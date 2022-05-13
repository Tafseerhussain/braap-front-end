<template>
  <div>
    <v-text-field
      outlined
      hide-details
      placeholder="Search shop by name, location, VIN, or asset ID"
      prepend-inner-icon="$svg-search"
      class="rounded-10 test"
    >
      <template #append>
        <v-menu offset-y nudge-bottom="12" bottom left nudge-right="12" content-class="menu-dropdown">
          <template v-slot:activator="{ attrs, on }">
            <v-icon color="primary" v-bind="attrs" v-on="on">$svg-settings</v-icon>
          </template>
          <v-list>
            <v-list-item-group color="#000" :mandatory="true">
              <v-list-item v-for="option in filterOptions" :key="option.value" link :value="option.value" class="px-3">
                <v-checkbox
                  hide-details
                  :ripple="false"
                  v-model="option.checked"
                  color="braap_orange"
                  class="ma-0 py-0 font-weight-medium"
                  small
                >
                  <template #label>
                    <span class="body-2 primary--text">{{ option.text }}</span>
                  </template>
                </v-checkbox>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </template>
    </v-text-field>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        filterOptions: [
          { value: 'recently_added', text: 'Recently added', checked: false },
          { value: 'recent_diagnostics', text: 'Recent diagnostics', checked: false },
          { value: 'require_response', text: 'Require Response', checked: false },
          { value: 'favourite', text: 'Favorites', checked: false },
          { value: 'scheduled_jobs', text: 'Scheduled Jobs', checked: false },
          { value: 'deleted', text: 'Recycling bin', checked: false },
          { value: 'reset', text: 'Show All', checked: true }
        ]
      }
    }
  }
</script>

<style lang="scss">
  .test {
    .v-input__slot {
      min-height: 49px !important;
    }
    .v-input__prepend-inner {
      margin-top: 14px !important;
    }
    .v-input__append-inner {
      margin-top: 14px !important;
    }
  }
  // .v-list-item {
  //     min-height: 32px !important;
  // }
</style>