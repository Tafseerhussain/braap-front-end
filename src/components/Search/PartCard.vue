<template>
  <v-card
    class="card-wrapper px-4 pt-4 pb-14 rounded-10 part-card relative overflow-hidden d-flex flex-column"
    :class="{ selected: selected }"
  >
    <div class="d-flex align-center justify-space-between">
      <div class="part-price primary white--text body-2 px-2 mx-n4 py-2 rounded rounded-tl-0 rounded-bl-0">
        {{ part.decimalprice | currency }}
      </div>
      <div v-if="part.search_count >= 1000" class="search-times caption">
        Searched {{ part.search_count | number }} times
      </div>
      <div v-else class="search-times caption">Searched &lt; 1,000 times</div>
    </div>

    <div class="relative">
      <div
        v-if="part.origin || part.part_condition"
        class="
          absolute
          part-type
          braap_light_grey
          primary--text
          body-2
          px-2
          mx-n4
          py-2
          mt-4
          rounded rounded-tl-0 rounded-bl-0
        "
      >
        {{ getPartStatus() }}
      </div>
      <v-img
        :src="part.thumbnail"
        aspect-ratio="1.93"
        max-height="138"
        contain
        position="center center"
        class="my-5 mx-7"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="braap_light_grey"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </div>
    <v-spacer></v-spacer>
    <v-tooltip top color="primary" content-class="top" max-width="210">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on" class="part-name pb-2 body-2 primary--text">
          <span ref="partName">{{ part.part_name }}</span>
        </div>
      </template>
      <div class="text-center">{{ part.part_name }}</div>
    </v-tooltip>

    <div class="d-flex align-center justify-end caption py-1" :class="[stockIsLow ? 'error--text' : 'success--text']">
      <v-icon :color="stockIsLow ? 'error' : 'success'" size="18" class="mr-1">mdi-check</v-icon
      >{{ getStockStatus() }} & Ships in {{ part.expected_ship_time ? part.expected_ship_time : '1-2' }} days
    </div>
    <a class="open-details-bt d-block" @click="openDetail">
      <v-row dense>
        <v-col cols="2">
          <img src="/icons/parts-details.svg" alt="detail" />
        </v-col>
        <v-col cols="10"><span>See part details, related parts, recommendations, and price comparison</span> </v-col>
      </v-row>
    </a>

    <slot name="action"></slot>
  </v-card>
</template>

<script>
  export default {
    name: 'PartCard',
    props: {
      value: {
        type: Object
      },
      selected: {
        type: Boolean
      }
    },
    components: {},
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
    computed: {
      stockIsLow() {
        return this.part.inventory_level && this.part.inventory_level < 5
      }
    },
    mounted() {},
    methods: {
      getPartStatus() {
        var status = []
        if (this.part.part_condition) status.push(this.part.part_condition)
        if (this.part.origin) status.push(this.part.origin)
        return status.join(': ')
      },
      getStockStatus() {
        if (this.stockIsLow) {
          return 'Only ' + this.part.inventory_level + ' left in stock'
        } else return this.part.stock_status || 'In Stock'
      },
      openDetail() {
        this.$emit('open-detail', this.part)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  @import './style.scss';

  .part-card {
    .part-name {
      min-height: 48px;
      span {
        display: -webkit-box;
        line-height: 20px;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .part-type {
      z-index: 1;
    }
    .open-details-bt {
      border-top: 1px solid $braap_light_grey;
      border-bottom: 1px solid $braap_light_grey;
      font-size: 12px;
      line-height: 20px;
      padding: 10px 0;
      margin: 6px 0 10px;
      text-decoration: none;
      transition: 0.2s;
      color: $braap_grey;

      &:hover {
        border-color: $braap_grey;
      }
    }
  }
</style>
