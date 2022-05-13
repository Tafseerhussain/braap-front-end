<template>
  <div class="part-selector-card d-flex flex-column pa-2">
    <div class="d-flex justify-space-between mb-2">
      <v-img :src="part.thumbnail" height="80" max-width="100" contain position="left center">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0 grey lighten-2 rounded" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <div class="d-flex flex-column align-end">
        <span class="part-price">{{ part.decimalprice | currency }}</span>
        <small
          class="part-status d-flex align-center rounded pl-2 pr-2 pt-1 pb-1 font-weight-medium"
          v-if="part.origin || part.part_condition"
        >
          {{ getPartStatus(part) }}
        </small>
        <a class="part-used mt-2" v-if="false && part.available_as_used_part"><small>Used part available</small></a>
      </div>
    </div>
    <div class="part-stock-staus d-flex align-center font-weight-medium mb-1">
      <v-icon color="braap_green" small>mdi-check-circle</v-icon>
      <small class="ml-1">
        {{ getStockStatus(part) }}: ships in {{ part.expected_ship_time ? part.expected_ship_time : '1-2' }} days
      </small>
    </div>
    <v-tooltip bottom left color="primary" max-width="200" nudge-left="20" open-delay="300">
      <template v-slot:activator="{ on, attrs }">
        <div class="part-title mb-8 font-weight-medium" v-bind="attrs" v-on="on">
          {{ part.part_name }}
        </div>
      </template>
      <span>{{ part.part_name }}</span>
    </v-tooltip>

    <div class="mb-2 font-weight-medium d-flex">
      <v-icon small style="margin-top: 2px">$svg-doc</v-icon>
      <a class="part-details-bt ml-1"
        ><small>See part details, related parts, recommendations, and price comparison</small></a
      >
    </div>
    <div class="d-flex">
      <v-btn color="braap_green" elevation="0" dark class="flex-grow-1" @click="getPart">Get Part</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PartCard',
    components: {},
    props: {
      value: {
        type: Object,
        default: () => {}
      }
    },
    data: function() {
      return {
        part: {}
      }
    },
    created() {
      this.part = this.value
    },
    watch: {
      value(val) {
        this.part = val
      }
    },
    computed: {},
    methods: {
      getPartStatus(part) {
        var status = []
        if (part.part_condition) status.push(part.part_condition)
        if (part.origin) status.push(part.origin)
        return status.join(': ')
      },
      getStockStatus(part) {
        if (part.inventory_level && part.inventory_level < 5) {
          return 'Only ' + part.inventory_level + ' left in stock'
        } else return part.stock_status || 'In Stock'
      },
      getPart() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .part-selector-card {
    width: 250px;
    white-space: normal;

    .fill-height {
      height: 100%;
    }
    small {
      font-size: 12px;
    }
    .part-price {
      font-size: 30px;
      font-weight: 600;
    }
    .part-status {
      color: #fff;
      background: #000;
    }
    .part-used {
      color: $braap_deep_blue;
    }
    .part-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .part-details-bt {
      line-height: 13px;
    }
  }
</style>
