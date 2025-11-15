<template>
  <div class="writer" v-bind:class="
  [
    $root.lhspin ? 'lhspin' : '',
    $root.rhspin ? 'rhspin' : ''
  ]">
    <div v-if="!$root.session.writer.file">
      <div class="wavemaker_info_box" v-if="this.$root.session.writer.selected">
        <div style="text-align:center">
          <svg id="wavemaker_logo" version="1.1" viewBox="0 0 24 24" height="50" width="50">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <g transform="matrix(0.046875,0,0,0.04604639,-1.951887,-3.0598516)">
              <g id="_921457168">
                <path class="wavemaker_logo-top"
                  d="M 464.632,212.901 337.566,83.292 c -22.014,-22.454 -57.758,-22.454 -79.771,0 l -126.63,129.386 c -7.411,7.559 -7.411,19.563 0,27.122 l 38.359,39.127 25.5,24.232 c 7.628,7.114 19.18,7.114 26.808,0 l 51.219,-48.242 c 14.167,-13.338 35.744,-13.338 49.693,0 l 51.219,48.242 c 7.629,7.114 19.18,7.114 26.809,0 l 25.501,-24.232 38.359,-38.904 c 7.193,-7.337 7.193,-19.563 0,-27.122 z" />
                <path class="wavemaker_logo-bottom"
                  d="m 58.804,367.853 198.991,202.973 c 22.013,22.452 57.757,22.452 79.771,0 L 536.557,367.853 c 34.437,-35.125 10.244,-45.574 -15.039,-70.029 L 490.35,267.59 c -7.409,-7.336 -19.18,-7.113 -26.808,0 l -51.218,48.242 c -14.169,13.339 -35.744,13.339 -49.694,0 L 311.411,267.59 c -7.575,-7.113 -19.233,-7.113 -26.809,0 l -51.219,48.242 c -14.167,13.339 -35.744,13.339 -49.693,0 L 132.471,267.59 c -7.576,-7.113 -19.233,-7.113 -26.809,0 l -28.77,27.123 c -26.37,24.899 -54.05,36.236 -18.088,73.14 z" />
              </g>
            </g>
          </svg>
        </div>
        <table style="width:100%">
          <tbody>
          <tr>
            <!--
      <td style="max-width: 200px;">
              <img src="img/placeholder.png" style="max-width:200px" />
              <p>(1600px X 2500px) (coming soon)</p>
            </td>

            -->

            <td>
              <label>{{ this.$root.setlang.tools.name }}</label>
              <input type="text" class="formInput mantitle" v-model="this.$root.session.writer.selected.title"
                @change="updateDatabase" :placeholder="this.$root.setlang.tools.name" />
              <hr />
              <label>{{ this.$root.setlang.tools.description }}</label>
              <input type="text" class="formInput mandesc" v-model="this.$root.session.writer.selected.description"
                @change="updateDatabase" :placeholder="this.$root.setlang.tools.description" />
              <hr />
              {{ this.$root.fullWordCount }} {{ this.$root.setlang.writer.words }}
            </td>

          </tr>
          </tbody>
        </table>


        <div>

          <!--
 <button class="clearInterfaceIconButton" @click="calcFullWordCount()">
            <svg style="width:18px;height:18px" viewBox="0 0 24 24">
              <path
                d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2M18 11H13L14.81 9.19A3.94 3.94 0 0 0 12 8A4 4 0 1 0 15.86 13H17.91A6 6 0 1 1 12 6A5.91 5.91 0 0 1 16.22 7.78L18 6Z" />
            </svg>
          </button>
          -->

        </div>
        <p>
          {{ this.$root.setlang.writer.intro }}
        </p>
        <button @click="exportDoc(this.$root.session.writer.selected.files)" class="interfaceBtn">

          <svg viewBox="0 0 24 24">
            <path
              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.2,20H13.8L12,13.2L10.2,20H8.8L6.6,11H8.1L9.5,17.8L11.3,11H12.6L14.4,17.8L15.8,11H17.3L15.2,20M13,9V3.5L18.5,9H13Z" />
          </svg>
          {{ this.$root.setlang.writer.docdownload }}</button>

        <BarChart />
      </div>
    </div>
    <div v-if="$root.session.writer.file">

      <div v-if="$root.session.writer.file.type === 'file'">
        <transition name="fade">
          <div class="pageHolder" :key="$root.session.writer.file.uuid">
            <PageEditor :pageuuid="$root.session.writer.file.uuid" @blur="$root.calcFullWordCount()" />
          </div>
        </transition>
      </div>

      <div v-if="$root.session.writer.file.type === 'folder'" @change="updateDatabase">

        <div class="titleBar">
          <input type="text" :placeholder="this.$root.setlang.writer.newfile" v-model="$root.session.writer.file.title"
            @change="updateDatabase" />
        </div>

        <div class="wavemaker_info_box">
          <button @click="exportDoc($root.session.writer.file.children)" class="interfaceBtn">
            <svg viewBox="0 0 24 24">
              <path
                d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.2,20H13.8L12,13.2L10.2,20H8.8L6.6,11H8.1L9.5,17.8L11.3,11H12.6L14.4,17.8L15.8,11H17.3L15.2,20M13,9V3.5L18.5,9H13Z" />
            </svg>
            Export this folder to word</button>

            <div v-for="item in $root.session.writer.file.children">
        <PageBlock :section="item"  />
            </div>
        </div>

      </div>



    </div>


  </div>

  <WriterRightSide v-if="this.$root.session.writer.file" :key="this.$root.session.writer.file.uuid" />
  <WriterLeftSide />
</template>

<script>

import BarChart from "./BarChart.vue"
import WriterLeftSide from "./leftpanel/WriterLeftSide.vue";
import WriterRightSide from "./rightpanel/WriterRightSide.vue";
import PageEditor from "./PageEditor.vue";
import PageBlock from "./PageBlock.vue";

export default {
  name: "WriterTool",
  components: {
    WriterLeftSide,
    WriterRightSide,
    PageEditor,
    PageBlock,
    BarChart
  },
  data() {
    return {
      exportHTML: null,
      exportObject: {}
    }
  },
  methods: {
    async getPage(uuid){
      return this.$root.db.Files.get(uuid)
    },
    async exportDoc(exportArray) {
      if (!exportArray) {
        exportArray = this.$root.session.writer.selected.files
      }
      this.exportObject = {}
      let arr = await this.$root.db.Files.where({ writerid: this.$root.session.writer.selected.uuid }).toArray()
      arr.forEach(file => {
        this.exportObject[file.uuid] = file
      })
      this.exportHTML = ''
      this.getfileexport(exportArray)
      window.Export2Word(this.exportHTML)
      //clear up
      this.exportHTML = ''
      this.exportObject = {}
    },
    getfileexport(arr) {
      arr.forEach(file => {
        let currentfile = this.exportObject[file.uuid]
        if (file.type === 'file') {
          this.exportHTML = this.exportHTML + "<h1>" + currentfile.title + "</h1>" + currentfile.content
        } else {
          this.exportHTML = this.exportHTML + "<h1>" + file.title + "</h1>"
        }
        if (file.children) {
          if (file.children.length) {
            this.getfileexport(file.children)
          }
        }
      })
    },
    updateDatabase() {
      this.$root.UpdateRecord(
        "Writer",
        this.$root.session.writer.selected.uuid,
        JSON.parse(JSON.stringify(this.$root.session.writer.selected))
      );
    }
  },
  mounted() {
    this.$root.calcFullWordCount()
  }
}
</script>
<style scoped>
.chartbar {
  background-color: red;
  width: 25px;
}

.writer {
  position: absolute;
  left: 40px;
  right: 40px;
  padding: 0px;
  bottom: 0px;
  top: 0px;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.pageHolder {
  position: absolute;
  left: 0px;
  right: 0px;
  padding: 0px;
  bottom: 0px;
  top: 0px;
  overflow: hidden;
}

.lhspin {
  left: 300px;
}

.rhspin {
  right: 300px;

}

.mantitle,
.mandesc {
  background-color: inherit;
  border: 0px;
  color: inherit;
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: bold;
  outline: none;
  margin: 0px;

}

.mantitle:focus,
.mandesc:focus {
  border-bottom: 1px solid var(--accent);
}

.mantitle {
  font-size: 2rem;
}


.titleBar {
  position: absolute;
  top: 0px;
  background-color: var(--writer-title-bar);
  color: var(--writer-title-bar-f);
  height: 40px;
  width: 100%;

}

.titleBar input {
  width: 100%;
  background-color: inherit;
  color: inherit;
  outline: none;
  height: 40px;
  border: 0px;
  padding-left: 20px;
  padding-right: 20px;
  font-family: inherit;
  font-size: 1.5rem;
}
</style>