<template>
  <div class="feature-icon-card px-5 py-7 white rounded-10 fill-height">
    <AnchorLink :href="`#${id}`">
      <div class="d-flex justify-center top-icon">
        <!-- <v-icon class="top-icon braap_orange--text"> {{ icon }} </v-icon> -->
        <img :src="icon" alt="icon" />
        <!-- {{svg}} -->
      </div>
      <div class="feature-desc text-center mt-6 body-0">{{ title }}</div>
    </AnchorLink>
  </div>
</template>
<script>
  import AnchorLink from '@/components/Common/AnchorLink.vue'
  export default {
    name: 'FeatureIconCard',
    props: ['icon', 'title', 'id'],
    components: {
      AnchorLink
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .feature-icon-card {
    box-shadow: 0 4px 15px rgb(138 138 138 / 10%);
    transition: 0.3s;
    .top-icon {
      display: block;
      img {
        max-width: 50px;
        max-height: 50px;
      }
    }
    a {
      text-decoration: none;
      color: $braap_grey;
      height: '100%';
    }
    &:hover {
      background-color: $braap_orange !important;
      a {
        color: white;
        img {
          filter: saturate(0%) brightness(500%);
        }
      }
    }
  }
</style>