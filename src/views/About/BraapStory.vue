<template>
  <BraapBg3 class="braap-story white">
    <v-container class="story-container relative">
      <v-row>
        <v-col cols="12" md="6" class="py-0 mb-14 mb-md-0">
          <div class="story-img relative">
            <img class="story fade-in" src="/img/about/story.jpg" alt="story" />

            <div class="story-video-img absolute fade-right">
              <img src="/img/about/story-video.png" alt="story-video" />
              <a href="javascript:;" class="play-btn absolute">
                <img src="/img/about/play-btn.svg" />
              </a>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="py-0 mt-14 mb-md-0 braap-content">
          <div class="primary--text text-h3 font-weight-bold mt-14 mb-11">
            <span class="braap_orange--text">Our</span>
            Story
          </div>
          <p class="mb-5">
            Experience built Braap, along with a lifetime of knowledge. Over the past several decades, our team’s
            hands-on experience with parts, service, and advanced technology cumulated into a service platform that
            connects diagnostics to parts and customers to technicians in a highly automated yet flexible environment.
          </p>
          <p class="mb-5">
            Braap isn’t a couple of guys in a garage but is a vast network of suppliers, technicians, and technology
            that have a common interest in being the best and delivering an experience that gives simple solutions for
            fixing things when (or before) they break.
          </p>
          <p class="mb-5">
            Guided by our mission of making the mechanical things we rely on to be more dependable and safer; Braap is
            committed to building technology that makes diagnosing, maintaining, and servicing a lot easier.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </BraapBg3>
</template>

<script>
  import BraapBg3 from '../../components/layouts/BraapBg_3.vue'
  export default {
    name: 'BraapStory',
    components: {
      BraapBg3
    }
  }
</script>

<style lang="scss">
  .braap-story {
    @keyframes anim {
      from {
        margin: 0px;
        opacity: 1;
      }

      to {
        margin: -15px;
        opacity: 0;
      }
    }

    padding: 250px 0;

    .story-container {
      .story-img {
        .story {
          width: 75%;
        }
      }
    }
    .story-video-img {
      bottom: 0;
      right: 0;
      transform: translateY(40%);
      .play-btn {
        top: 50%;
        left: 50%;
        transform: translate((-50%, -50%));
        &:after {
          position: absolute;
          content: '';
          bottom: -7px;
          top: -7px;
          left: -7px;
          right: -7px;
          background-color: transparent;
          border-radius: 50%;
          border: 2px solid #e58a00;
          margin: 0px;
          opacity: 1;
          transform-origin: center;
          animation: anim 800ms linear infinite;
        }
        &:before {
          position: absolute;
          content: '';
          bottom: -7px;
          top: -7px;
          left: -7px;
          right: -7px;
          background-color: transparent;
          border-radius: 50%;
          border: 2px solid #e58a00;
          margin: 0px;
          opacity: 0.8;
          transform-origin: center;
          animation: anim 800ms linear 400ms infinite;
        }
        img {
          width: 60px;
        }
      }
    }
  }
</style>