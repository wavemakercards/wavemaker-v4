<template>
  <div class="wavemaker_info_box">

    <table style="width:100%">
      <tbody>
      <tr>
        <td></td>
        <td style="width:40px;">
          <button @click="gettingStartedPopup" class="interfaceBtn helpBtn">
            <svg viewBox="0 0 24 24">
              <path
                d="M15.07,11.25L14.17,12.17C13.45,12.89 13,13.5 13,15H11V14.5C11,13.39 11.45,12.39 12.17,11.67L13.41,10.41C13.78,10.05 14,9.55 14,9C14,7.89 13.1,7 12,7A2,2 0 0,0 10,9H8A4,4 0 0,1 12,5A4,4 0 0,1 16,9C16,9.88 15.64,10.67 15.07,11.25M13,19H11V17H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
            </svg>
          </button>
        </td>
      </tr>
      </tbody>
    </table>


    <label>{{ this.$root.setlang.start.projectlabel }}</label>
    <input class="projectName" v-model="this.$root.session.settings.ProjectName" @change="update" />



    <button class="interfaceBtn" @click="setTool('writer')">
      <svg version="1.1" viewBox="0 0 24 24">
        <path
          d="M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z" />
      </svg>
      {{ this.$root.setlang.tools.writer }}
    </button>

    <button class="interfaceBtn " @click="setTool('mindmap')">

      <svg version="1.1" viewBox="0 0 24 24">
        <path
          d="M21 16V13C21 11.89 20.11 11 19 11H13V8H15V2H9V8H11V11H5C3.89 11 3 11.89 3 13V16H1V22H7V16H5V13H11V16H9V22H15V16H13V13H19V16H17V22H23V16H21M11 4H13V6H11V4M5 20H3V18H5V20M13 20H11V18H13V20M21 20H19V18H21V20Z" />
      </svg>

      {{ this.$root.setlang.tools.mindmap }}
    </button>
    <button class="interfaceBtn " @click="setTool('snowflake')">

      <svg version="1.1" viewBox="0 0 24 24">
        <path
          d="M14.25,12L16.27,11H23L22,9H18.03L20.42,5.83L19.43,3.83L15.37,9.2L13.35,10.21L13.75,8L17.83,2.62L15.64,2.22L12,7L8.4,2.2L6.2,2.6L10.26,8L10.66,10.21L8.82,9.29L8.66,9.21L4.6,3.8L3.6,5.8L6,9H2L1,11H7.77L9.75,12L7.73,13H1L2,15H5.97L3.58,18.17L4.57,20.17L8.63,14.8L10.65,13.79L10.25,16L6.17,21.38L8.36,21.79L12,17L15.6,21.8L17.8,21.4L13.74,16L13.34,13.79L15.34,14.79L19.4,20.2L20.4,18.2L18,15H22L23,13H16.23" />
      </svg>
      {{ this.$root.setlang.tools.snowflake }}
    </button>

    <button class="interfaceBtn " @click="setTool('timeline')">
      <svg version="1.1" viewBox="0 0 24 24">
        <path
          d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z" />
      </svg>
      {{ this.$root.setlang.tools.timeline }}
    </button>

    <button class="interfaceBtn " @click="setTool('gridplanner')">
      <svg version="1.1" viewBox="0 0 24 24">
        <path
          d="M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z" />
      </svg>
      {{ this.$root.setlang.tools.gridplanner }}
    </button>

    <button class="interfaceBtn " @click="setTool('cardsdatabase')">
      <svg version="1.1" viewBox="0 0 24 24">
        <path
          d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
      </svg>
      {{ this.$root.setlang.tools.cardsdatabase }}
    </button>


    <!--

     <button @click="$root.$data.popup.name = 'SettingsPopup'" class="interfaceBtn">
      <svg viewBox="0 0 24 24">
        <path
          d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
      </svg>
      <span>{{ this.$root.setlang.settings.title }}</span>
    </button>
-->


  </div>
</template>

<script>
export default {
  name: "ProjectInfo",
  methods: {
    update() {
      let uuid = this.$root.session.settings.uuid
      this.$root.UpdateRecord("Settings", uuid, this.$root.session.settings);
    },
    setTool(me) {
      if (me) {
        this.$root.session.writer = {}
        this.$root.session[me] = {}
      }
      this.$root.session.selectedTool = me;
      this.navbar = false


    },
    gettingStartedPopup() {
      this.$root.openInNew("help/index.html");
    }
  }
};
</script>

<style scoped>
.interfaceBtn {
  text-align: left;
  width: 100%;
}


.projectName {

  font-size: 1.6rem;
  font-weight: 400;
  background: none;
  border: none;
  color: inherit;
  outline: none;
  width: 100%;
  padding: 10px;
  border-radius: 0px;
  transition: all 0.5s ease;
  font-family: var(--sysfont);
  background-color: var(--window);
  box-shadow: var(--box-shadow);
  color: var(--window-f);
  border-bottom: 1px solid var(--window-f);
  margin-top: 4px;
  letter-spacing: 0.8px;
  text-size-adjust: 100%;
}

.projectName:hover,
.projectName:focus,
.projectName:active {
  background: var(--forminput);
  color: var(--forminput-f);
}

.helpBtn {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  padding: 5px;
}

.helpBtn svg {
  top: 5px;
  left: 5px;
  width: 30px;
  height: 30px;
}
</style>