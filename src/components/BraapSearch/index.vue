
<template>
  <v-combobox
    ref="autocomplete"
    :dark="dark"
    hide-details
    outlined
    class="braap-search rounded-8 mr-auto"
    :class="{ 'large body-0': large, 'body-2': !large }"
    :items="items"
    :attach="attach"
    :menu-props="{ contentClass: 'elevation-1', maxHeight: '590px', transition: 'v-menu-transition' }"
    :style="{ '--border-color': dark ? 'transparent' : '#ced4da' }"
    v-model="innerValue"
    :readonly="readonly"
    :placeholder="placeholder"
    :search-input.sync="search"
    no-filter
    @keydown.enter="onEnter"
    :hide-no-data="!showTrendingSearch"
  >
    <template #prepend-inner>
      <v-icon class="px-1" :class="{ 'icon-20': !large, 'pr-4': large }">$svg-search</v-icon>
      <!-- <v-icon class="px-1" :class="{ 'icon-20': !large, 'pr-4': large }">mdi-magnify</v-icon> -->
    </template>
    <template #append>
      <span class="input-group-text px-3 d-flex align-center">
        <v-tooltip left color="primary" content-class="left" :disabled="readonly">
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on" class="d-flex ml-1 mr-4">
              <MicIcon :style="{ color: dark ? 'white' : '' }"></MicIcon>
            </div>
          </template>
          <span>Comming soon</span>
        </v-tooltip>
        <v-tooltip right color="primary" content-class="right" :disabled="readonly">
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on" class="d-flex">
              <CameraIcon :style="{ color: dark ? 'white' : '' }"></CameraIcon>
            </div>
          </template>
          <span>Comming soon</span>
        </v-tooltip>
      </span>
    </template>
    <template v-slot:item="data">
      <v-list-item-content class="pa-0" @click="$emit('search', data.item)">
        <div class="d-flex align-center py-2 pl-1">
          <v-icon small>$svg-search</v-icon>
          <span v-html="data.item" class="ml-4 body-2 text-wrap"></span>
        </div>
      </v-list-item-content>
    </template>
    <template #no-data>
      <v-list-item v-for="text in trendingList" :key="text" link @click="$emit('search', text)">
        <v-list-item-content class="pa-0">
          <div class="d-flex align-center py-2 pl-1">
            <v-icon class="icon-20">$svg-trending</v-icon>
            <span class="ml-4 body-2">{{ text }}</span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
  import MicIcon from '../../assets/icons/mike.svg'
  import CameraIcon from '../../assets/icons/camera.svg'

  export default {
    name: 'BraapSearch',
    props: {
      dark: {
        type: Boolean
      },
      large: {
        type: Boolean
      },
      placeholder: {
        type: String,
        default: 'Search diagnostics, parts, and connect to a technician...'
      },
      value: {
        type: String
      },
      readonly: {
        type: Boolean
      },
      showTrendingSearch: {
        type: Boolean
      }
    },
    components: {
      MicIcon,
      CameraIcon
    },
    data: function() {
      return {
        attach: null,
        innerValue: null,
        search: null,
        timerId: null,
        items: [],
        trending: []
      }
    },
    watch: {
      value(val) {
        this.innerValue = val
      },
      innerValue(val) {
        this.$emit('input', val)
      },
      search(val) {
        this.getAutoSuggest(val)
      }
    },
    created() {
      this.innerValue = this.value
    },
    computed: {
      trendingList() {
        if (!this.search) return this.trending
        else return []
      }
    },
    mounted() {
      this.attach = this.$el
      if (!this.readonly && this.showTrendingSearch) {
        this.getTrendingSearch()
      }
    },
    methods: {
      hideMenu() {
        this.$refs.autocomplete.isMenuActive = false
      },
      onEnter() {
        setTimeout(() => {
          this.$emit('search', this.search)
          this.$refs.autocomplete.$refs.input.blur()
          this.hideMenu()
        }, 100)
      },
      getAutoSuggest(query) {
        if (this.timerId) clearTimeout(this.timerId)
        if (query && query != this.innerValue) {
          this.timerId = setTimeout(() => {
            this.$axios.post('/api/search/getAutoSuggest', {}, { params: { query } }).then(result => {
              if (result && result.success) {
                this.items = result.data.map(x => x.search_word)
              } else {
                this.items = []
              }
            })
          }, 300)
        }
        if (query) {
          this.items = []
        }
      },
      getTrendingSearch() {
        this.$axios.get('/api/search/GetTrendingSearch').then(result => {
          if (result && result.success) {
            this.trending = result.data.map(x => x.searchquery)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .braap-search {
    .v-input__slot {
      min-height: 50px !important;
    }
    .v-input__prepend-inner {
      margin-top: 14px !important;
      padding-right: 0px !important;
    }
    .v-input__append-inner {
      margin-top: 6px !important;
    }
    &.large {
      .v-input__slot {
        min-height: 65px !important;
      }
      .v-input__prepend-inner {
        margin-top: 20px !important;
      }
      .v-input__append-inner {
        margin-top: 10px !important;
      }
    }
    &.v-text-field--outlined {
      fieldset {
        border-color: var(--border-color) !important;
      }
    }
    &.theme--light.v-text-field--outlined {
      &.v-input--is-focused fieldset {
        border-color: $braap_orange !important;
      }
    }
    &.theme--light.v-text-field--outlined.v-input--is-readonly {
      &.v-input--is-focused fieldset {
        border: 1px solid var(--border-color) !important;
      }
    }

    .input-group-text {
      padding-top: 6px;
      padding-bottom: 6px;
      border-left: 1px solid var(--border-color);
      svg {
        height: 26px;
      }
    }
    &.large {
      .input-group-text {
        border-left: 1px solid $braap_grey;
        svg {
          height: 32px;
        }
      }
    }

    .v-autocomplete__content {
      margin-top: 4px;
      margin-bottom: 4px;
      border-radius: 10px !important;

      .v-list {
        padding: 0;

        .v-list-item {
          transition: 0.2s;
          .body-2 {
            line-height: 22px !important;
            padding: 2px 0;
          }
          &:hover {
            padding-left: 20px;
          }
        }
        .v-list-item + .v-list-item {
          border-top: 1px solid rgba(0, 0, 0, 0.125);
        }
      }
    }

    &.large {
      .v-autocomplete__content {
        .v-list {
          .v-list-item {
            .body-2 {
              padding: 5px 0;
            }
          }
        }
      }
    }
  }
</style>
