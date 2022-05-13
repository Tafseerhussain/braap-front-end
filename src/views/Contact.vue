<template>
  <BraapBg5 class="braap-contact white">
    <v-container class="relative">
      <div class="text-center">
        <div class="primary--text font-weight-bold page-title">
          <span class="braap_orange--text">CONTACT</span>
          US
        </div>
      </div>
      <div class="contact-content d-flex mx-n3">
        <div class="flex-item-half mx-3 text-center">
          <div class="left-img relative">
            <img src="/img/contact/contact.jpg" />
            <img src="/img/contact/top-left.png" class="top-left fade-left-delay" />
            <img src="/img/contact/bottom-right.png" class="bottom-right fade-right-delay-600" />
          </div>
        </div>
        <div class="flex-item-half mx-3">
          <div class="braap-content px-3">
            <div class="contact-subtitle primary--text font-weight-bold">Get In Touch</div>
            <p class="mb-0 mt-4">Our team is always here to answer questions. <br />Let us know how can we help.</p>
          </div>
          <div id="zsfeedbackwidgetdiv" class="px-3 py-0 pt-6">
            <div class="d-flex align-center justify-center mt-16">
              <v-progress-circular indeterminate color="braap_orange"></v-progress-circular>
            </div>
          </div>
        </div>
      </div>
      <div class="contact-icons d-flex mx-n3">
        <div class="icon-item mx-3 text-center fade-bottom">
          <img src="/img/contact/phone.png" />
          <div class="icon-name mt-2 mb-7 braap_orange--text">Call Us</div>
          <div class="text-h5 primary--text">1.607.327.4050</div>
        </div>
        <div class="icon-item mx-3 text-center fade-bottom-delay">
          <img src="/img/contact/email.png" />
          <div class="icon-name mt-2 mb-7 braap_orange--text">Email Us</div>
          <div class="text-h5 primary--text">support@braap.io</div>
        </div>
        <div class="icon-item mx-3 text-center fade-bottom-delay-600">
          <img src="/img/contact/location.png" />
          <div class="icon-name mt-2 mb-7 braap_orange--text">Find Us</div>
          <div class="text-h5 primary--text">314 E State St, Ithaca, New York 14850</div>
        </div>
      </div>
    </v-container>
  </BraapBg5>
</template>

<script>
  import BraapBg5 from '../components/layouts/BraapBg_5.vue'
  export default {
    name: 'Contact',
    props: {},
    components: {
      BraapBg5
    },
    data: function() {
      return {
        zohoScript: null
      }
    },
    watch: {},
    mounted() {
      this.$initSr()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.initForm()
      })
    },
    beforeRouteUpdate() {
      console.log('ssss')
    },
    beforeRouteLeave(to, from, next) {
      this.removeForm()
      next()
    },
    methods: {
      initForm() {
        let src = 'https://desk.zoho.com/portal/api/feedbackwidget/620501000000350001?orgId=754798867&displayType=embeded'
        this.zohoScript = document.createElement('script')
        this.zohoScript.src = src
        this.zohoScript.id = 'zoho_feedbackwidget'
        document.body.appendChild(this.zohoScript)

        // this.initLabel()
        document.removeEventListener('click', this.initLables)
        document.addEventListener('click', this.initLables)
      },
      removeForm() {
        if (this.zohoScript) {
          document.body.removeChild(this.zohoScript)
          let zohoFeedbackUser = document.querySelector('#zsFeedbackUser')
          if (zohoFeedbackUser) document.body.removeChild(zohoFeedbackUser)
        }
      },
      floatLabel(e) {
        if (e.target.value) {
          e.target.parentNode.classList.add('float-label')
        } else {
          e.target.parentNode.classList.remove('float-label')
        }
      },
      initLables(e) {
        if (
          e.target.name === 'email' ||
          e.target.name === 'subject' ||
          e.target.name === 'description' ||
          e.target.name === 'name' ||
          e.target.name === 'captchaWord'
        ) {
          e.target.removeEventListener('blur', this.floatLabel)
          e.target.addEventListener('blur', this.floatLabel)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .braap-contact {
    padding: 50px 0;
    .contact-content {
      margin-top: 100px;
      .left-img {
        width: 75%;
        margin: 0 auto;
      }
      .flex-item-half {
        flex-basis: calc(50% - 24px) !important;
        .top-left {
          position: absolute;
          left: -15%;
          top: 6%;
          width: auto !important;
        }
        .bottom-right {
          position: absolute;
          bottom: 5%;
          right: -18%;
          width: auto !important;
        }
        .contact-subtitle {
          font-size: 32px;
        }
      }
    }

    #zsfeedbackwidgetdiv {
      #advwebForm {
        max-width: none;
        padding: 0 !important;
        background: transparent;

        .zsfeedbkrpanel {
          border: none;
          max-width: none;
          background: transparent;
          z-index: 0 !important;
        }
        .fbfpoptitle {
          display: none;
        }
        .mt15 {
          margin-top: 0 !important;
        }

        .feedbackformmdiv {
          padding-top: 30px;
          padding-left: 0px;
          padding-right: 0px;
          .ml15 {
            margin-left: 30px;
          }
          .redtxt {
            font-family: 'axiforma';
            font-size: 12px !important;
            line-height: 14px !important;
            margin-top: -42px !important;
          }
          input.fbtxtnf,
          input.feedbtxtfield#feedbackSubject,
          textarea.feedtxtarea,
          .fbfcaptchaDivinput {
            font-family: 'axiforma';
            font-size: 18px;
            margin-bottom: 50px;
            padding: 6.5px 13.5px !important;
            padding-left: 0 !important;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            border: none !important;
            border-bottom: 1px solid $braap_light_grey !important;
            color: $braap_grey !important;
            border-radius: 0 !important;
            background: transparent !important;
            &:focus {
              border: none !important;
              border-bottom: 1px solid $braap_orange !important;
              box-shadow: none !important;
            }
            &::placeholder {
              color: transparent !important;
            }
          }
          input.fbtxtnf {
            height: 42px;
          }
          textarea.feedtxtarea,
          .fbfcaptchaDivinput {
            margin-bottom: 10px;
          }

          // Float label: Name, Email
          .WF_NameEmailDiv {
            & > div {
              position: relative;
              &::before {
                content: ' ';
                position: absolute;
                top: 8px;
                z-index: -1;
                font-family: 'axiforma';
                font-size: 18px;
                color: $braap_grey;
                transition: 0.2s;
              }

              &:focus-within,
              &.float-label {
                &::before {
                  top: -20px;
                  font-size: 12px;
                }
              }
              &:focus-within {
                &::before {
                  color: $braap_orange;
                }
              }
            }
          }
          .WF_NameEmailDiv {
            & > div:first-child {
              &::before {
                content: 'Name*';
              }
            }
            & > div:last-child {
              &::before {
                content: 'Email*';
              }
            }
          }
          // Float lable: Subject, How can we help you?
          .mt15,
          .FBWordVerify {
            position: relative;
            &::before {
              content: ' ';
              position: absolute;
              top: 8px;
              z-index: -1;
              font-family: 'axiforma';
              font-size: 18px;
              color: $braap_grey;
              transition: 0.2s;
            }

            &:focus-within,
            &.float-label {
              &::before {
                top: -20px;
                font-size: 12px;
              }
            }
            &:focus-within {
              &::before {
                color: $braap_orange;
              }
            }
          }
          & > .mt15:nth-child(2) {
            &::before {
              content: 'Subject';
            }
          }
          & > .mt15:nth-child(3) {
            &::before {
              content: 'How can we help you?';
            }
          }

          // captcha
          #captchaDiv,
          .zsfdwordveribdr {
            border: none !important;
          }
          .FBWordVerify {
            width: 250px;
            &::before {
              content: 'Word Verification';
            }
          }
          .fbfcaptchaDivimg {
            background: transparent !important;
            margin-left: 0 !important;
          }
          #fbPopupEmptyCaptchaErrMsg {
            margin-left: 270px;
            margin-top: 0px !important;
          }
        }

        // submit
        .zspreattscreendiv {
          padding-left: 0px;
          .fright.mt5 {
            float: left;
            position: relative;

            &:after {
              content: 'Send';
              z-index: -1;
              position: absolute;
              bottom: 0;
              left: 0px;
              font-size: 18px;
              background-image: url(/icons/paper-right.svg);
              background-position: 90px center;
              padding-right: 30px;
              font-family: 'axiforma';
              color: #fff;
              background-color: #000;
              border-radius: 10px !important;
              padding: 13px 64px 12px 32px !important;
            }
          }

          .dt-blue-btn {
            border-radius: 10px !important;
            box-shadow: 0 3px 6px rgb(0 0 0 / 15%) !important;
            padding: 12px 44px 12px 32px !important;
            background: transparent;
            color: transparent;
            transition: 0.3s;
            border: none !important;
            font-size: 18px;
            font-family: 'axiforma';
            margin-top: 30px;
          }
        }
      }

      .zs-alertmain {
        font-family: 'axiforma';
        .zsFeedbackPopupTitle {
          font-family: 'axiforma';
        }
        .blue-btn {
          border-radius: 10px !important;
          box-shadow: 0 3px 6px rgb(0 0 0 / 15%) !important;
          background-color: #000;
          border: none !important;
          font-family: 'axiforma';
        }
      }
    }

    .contact-icons {
      padding: 100px 0;
      .icon-item {
        flex-basis: calc(33.3% - 24px);
        .icon-name {
          font-size: 20px;
        }
      }
    }
  }
</style>
