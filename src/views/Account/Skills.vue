<template>
  <v-card class="skills section-wrapper rounded-10 pa-10 mb-5">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
      <div class="d-flex align-center mb-3">
        <v-icon color="braap_orange" size="30" class="mr-2">mdi-head-cog-outline</v-icon>
        <span class="mt-1">Skills</span>
      </div>

      <v-tooltip v-if="!showNewForm" left color="primary" open-delay="100" content-class="left">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            ref="addBtn"
            fab
            v-on="on"
            v-bind="attrs"
            color="primary"
            style="height: 48px; width: 48px"
            class="ml-auto"
            @click="addNew"
            transition="scale-transition"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        Add skills and experience
      </v-tooltip>
    </v-card-title>

    <v-card-text class="pa-0 pt-4">
      <div class="d-flex align-center">
        <v-icon>mdi-chevron-right</v-icon>
        <span class="ml-1 flex-grow-1 body-2">We assign jobs based on your technical skills and experience level.</span>
      </div>

      <div v-show="!showNewForm" class="mt-5">
        <v-slide-x-transition group tag="div" class="d-flex align-center flex-wrap">
          <div v-for="skill in skills" :key="skill.id" class="skill-item d-flex align-center ma-1 mr-4 ml-0">
            <div class="system rounded d-flex align-center primary caption mr-1">
              <span class="mr-1">{{ skill.type + ' | ' + skill.system }}</span>
              <v-btn icon x-small @click="removeSkill(skill.id)"><v-icon color="#FFF">mdi-close-circle</v-icon></v-btn>
            </div>
            <v-menu offset-y>
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  v-if="skill.level"
                  color="braap_orange"
                  elevation="0"
                  class="rounded"
                  dark
                  style="height: 40px; min-width: 40px"
                  v-bind="attrs"
                  v-on="on"
                  >{{ skill.level }}</v-btn
                >
                <v-btn
                  v-else
                  outlined
                  color="braap_grey"
                  elevation="0"
                  class="rounded"
                  dark
                  style="height: 40px; min-width: 40px; border-style: dotted"
                  v-bind="attrs"
                  v-on="on"
                  >{{ skill.level }}</v-btn
                >
              </template>
              <v-list>
                <v-list-item-group :mandatory="!!skill.level" v-model="skill.level" @change="updateSkill(skill)">
                  <v-list-item link value="E">Expert</v-list-item>
                  <v-list-item link value="I">Intermediate</v-list-item>
                  <v-list-item link value="B">Beginner</v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </div>
        </v-slide-x-transition>
      </div>
      <div
        class="new-form"
        v-show="showNewForm"
        v-click-outside="{
          handler: () => (showNewForm = false),
          closeConditional: () => showNewForm,
        }"
      >
        <v-autocomplete
          ref="input"
          light
          color="braap_orange"
          hide-no-data
          auto-select-first
          :items="items"
          v-model="system"
          :search-input.sync="search"
          placeholder="Enter to search system"
        >
          <template v-slot:item="data">
            <v-list-item-content class="pa-0">
              <div class="d-flex align-center py-2 pl-1">
                <v-icon small>mdi-cog-outline</v-icon>
                <span v-html="data.item" class="ml-4 body-2 text-wrap"></span>
              </div>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <div v-show="showTypeOptions">
          <div class="d-flex flex-wrap">
            <v-hover v-slot="{ hover }" v-for="(type, index) in allowedTypes" :key="index">
              <v-btn
                dark
                :color="type.selected ? 'primary' : 'braap_orange'"
                :outlined="!hover && !type.selected"
                class="body-2 mr-2 mb-2"
                elevation="0"
                style="transition: 0.3s"
                :style="{ borderWidth: '2px', borderStyle: 'solid' }"
                @click="type.selected = !type.selected"
                >{{ type.type }}</v-btn
              >
            </v-hover>
          </div>
          <div class="d-flex">
            <v-btn
              large
              :dark="!saveBtnDisabled"
              color="braap_orange"
              class="mt-2 ml-auto rounded-10"
              @click="addSkill"
              :disabled="saveBtnDisabled"
            >
              Add
            </v-btn>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'Skills',
    components: {},
    data: function() {
      return {
        skills: [],
        types: [],
        showAll: false,
        min: 5,
        showNewForm: false,
        showTypeOptions: false,
        items: [],
        system: null,
        search: null,
        timerId: null
      }
    },
    watch: {
      search(val) {
        this.getSystems(val)
      },
      system(newVal, oldVal) {
        if (newVal && !oldVal) {
          this.showTypeOptions = true
        }
      }
    },
    computed: {
      allowedTypes() {
        let skillOfSystem = this.skills.filter(x => x.system === this.system)
        return this.types.filter(x => skillOfSystem.filter(s => s.type === x.type).length === 0)
      },
      saveBtnDisabled() {
        return this.allowedTypes.filter(x => x.selected).length === 0
      }
    },
    created() {
      this.getSkills()
      this.getGetMachineTypes()
    },
    methods: {
      getSkills() {
        this.$axios.post('/api/account/userTechSkills').then(result => {
          if (result.success && result.data) {
            this.skills = result.data
          }
        })
      },
      updateSkill(skill) {
        this.$axios.post('/api/account/userTechSkills/addOrUpdate', skill).then(result => {
          if (result.success && result.data) {
            // if (!result.data.Status) {
            //   this.$msg.error(result.data.Message)
            // }
          }
        })
      },
      removeSkill(id) {
        this.$axios.post(`/api/account/userTechSkills/delete/${id}`).then(result => {
          if (result.success && result.data) {
            var index = this.skills.findIndex(x => x.id === id)
            if (index >= 0) {
              this.skills.splice(index, 1)
            }
          }
        })
      },
      addNew() {
        this.system = ''
        this.showNewForm = true
        this.showTypeOptions = false
        this.types.forEach(x => (x.selected = false))
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      },
      getGetMachineTypes() {
        this.$axios.get('/api/account/getMachineTypes').then(result => {
          if (result.success) {
            this.types = result.data.map(x => {
              return { type: x, selected: false }
            })
          }
        })
      },
      getSystems(query) {
        clearTimeout(this.timerId)

        // delay new call 500ms
        this.timerId = setTimeout(() => {
          this.$axios.get('/api/account/getAutoCompleteSystem', { params: { query } }).then(result => {
            if (result.success) {
              this.items = result.data
            }
          })
        }, 300)
      },
      addSkill() {
        this.showNewForm = false
        this.allowedTypes
          .filter(x => x.selected)
          .forEach(x => {
            let data = {
              system: this.system,
              type: x.type
            }
            this.$axios.post('/api/account/userTechSkills/addOrUpdate', data).then(result => {
              if (result.success && result.data) {
                this.skills.push({ ...data, id: result.data.id })
              }
            })
          })
      }
    }
  }
</script>

<style lang="scss">
  .skills {
    .v-card__text {
      .wrapper {
        background-color: #fff;
        border-radius: 8px;
        .new-form {
          // min-height: 180px;
        }
      }

      span {
        font-size: 14px;
        line-height: 28.8px;
        @media (max-width: 450px) {
          font-size: 12px;
        }
      }
    }

    // .v-text-field.v-text-field--solo .v-input__control {
    //   min-height: 38px;
    //   padding: 0;
    // }
    // .v-text-field--enclosed .v-input__prepend-inner {
    //   margin-top: 7px;
    // }
    // .v-text-field.v-text-field--enclosed .v-text-field__details {
    //   display: none;
    // }

    .skill-item {
      .system {
        color: #fff;
        line-height: 16px;
        height: 40px;
        padding: 6px 10px;
        // span {
        //   transform: translateX(8px);
        //   transition: all 350ms;
        //   white-space: nowrap;
        // }
        // .v-btn {
        //   opacity: 0;
        // }
        // &:hover {
        //   span {
        //     transform: translateX(0px);
        //   }
        //   .v-btn {
        //     opacity: 1;
        //   }
        // }
      }

      .v-btn--fab.v-size--x-small {
        width: 28px;
        height: 28px;

        .v-btn__content {
          font-size: 14px;
        }
      }
    }
  }
</style>
