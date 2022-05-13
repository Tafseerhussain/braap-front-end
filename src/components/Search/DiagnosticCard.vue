<template>
  <v-card
    class="card-wrapper px-4 pt-3 pb-5 rounded-10 diagnostic-card d-flex flex-column relative overflow-hidden"
    :class="{ selected: selected }"
  >
    <div class="d-flex align-center justify-space-between">
      <v-tooltip top color="primary" content-class="top">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
            class="diagnostic-system primary white--text body-2 px-2 mx-n4 py-2 rounded rounded-tl-0 rounded-bl-0"
          >
            {{ diagnostic.system }}
          </div>
        </template>
        {{ diagnostic.system }}
      </v-tooltip>
      <div class="search-times caption ml-auto">
        <template v-if="diagnostic.count >= 1000"> Searched {{ diagnostic.count | number }} times</template>
        <template v-else> Searched &gt; 1000 times</template>
      </div>
    </div>

    <!-- <v-tooltip top color="primary" content-class="top" max-width="210" :disabled="!systemToolEnabled">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
          class="diagnostic-system primary pa-2 white--text rounded body-2 d-flex align-center justify-center"
        >
          <span class="text-center" ref="system">{{ diagnostic.system }}</span>
        </div>
      </template>
      <div class="text-center">{{ diagnostic.system }}</div>
    </v-tooltip> -->

    <v-row dense class="my-4" align="center">
      <v-col cols="3">
        <div class="diagnostic-icon d-flex">
          <img src="/img/search/parts-icon.png" class="w-100" alt="part icon" />
        </div>
      </v-col>
      <v-col cols="9">
        <div class="diagnostic-name ml-3 body-2">
          <span ref="title" :class="{ 'clamp-text': !showFullText }">{{ diagnostic.title }} </span>
          <template v-if="showMoreArrow">
            <a href="#!" class="show-more caption braap_orange--text mt-1 d-flex" @click="showFullText = !showFullText"
              >{{ showFullText ? 'Show Less' : 'Show More'
              }}<img class="ml-1" width="18" src="/icons/arrow-right-orange.svg" alt="right arrow"
            /></a>
          </template>
        </div>
      </v-col>
    </v-row>
    <a class="research" @click.prevent="research">
      <v-icon color="primary">mdi-magnify-plus-outline</v-icon>Click To Research Diagnostics</a
    >
    <slot name="action"> </slot>
  </v-card>
</template>

<script>
  export default {
    name: 'DiagnosticCard',
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
        diagnostic: {},
        showMoreArrow: false,
        showFullText: true
        // systemToolEnabled: false
      }
    },
    created() {
      this.diagnostic = this.value
    },
    watch: {
      value(val) {
        this.diagnostic = val
      }
    },
    mounted() {
      this.$nextTick(() => {
        var height = this.$refs.title.offsetHeight
        this.showMoreArrow = height > 40
        this.showFullText = height < 40

        // var height1 = this.$refs.system.offsetHeight
        // this.systemToolEnabled = height1 > 55
      })
    },
    methods: {
      research() {
        this.$emit('research', this.diagnostic)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  @import './style.scss';

  .diagnostic-card {
    padding: 10px 15px 20px;

    .diagnostic-system {
      max-width: 45%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // padding: 10px;
      // height: 75px;

      // span {
      //   display: -webkit-box;
      //   -webkit-line-clamp: 2;
      //   -webkit-box-orient: vertical;
      //   overflow: hidden;
      //   text-overflow: ellipsis;
      //   line-height: 27.5px;
      // }
    }

    .diagnostic-icon {
      transition: 0.5s;

      img {
        max-width: 100%;
        max-height: 100vh;
      }
    }
    &:hover {
      .diagnostic-icon {
        transform: rotate(360deg);
      }
    }

    .diagnostic-name {
      // min-height: 84px;
      span {
        display: -webkit-box;
        line-height: 20px;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        &.clamp-text {
          -webkit-line-clamp: 2;
        }
      }
    }

    .research {
      text-align: center;
      border-top: 1px solid $braap_light_grey;
      border-bottom: 1px solid $braap_light_grey;
      font-size: 12px;
      padding: 10px 0;
      margin: 5px 0 10px;
      text-decoration: none;
      transition: 0.2s;
      color: $braap_grey;

      &:hover {
        border-color: $braap_grey;
      }
    }
  }
</style>
