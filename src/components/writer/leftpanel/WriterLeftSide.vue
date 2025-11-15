<template>
  <div
    class="menu"
    v-bind:class="$root.lhspin ? 'lhspinned' : ''"
    v-if="this.$root.session.writer.selected"
  >
    <!--<div class="title">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </svg>
    </div>
    -->
    <button class="pinBtn" @click="$root.lhspin = !$root.lhspin">
      <svg
        style="width: 18px; height: 18px"
        viewBox="0 0 24 24"
        v-if="$root.lhspin"
      >
        <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
      </svg>

      <svg
        style="width: 18px; height: px"
        viewBox="0 0 24 24"
        v-if="!$root.lhspin"
      >
        <path
          d="M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z"
        />
      </svg>
    </button>
    <div class="scrollpanel">
      <button
        class="settingsBtn"
        style="border: 0; outline: none"
        @click="this.$root.session.writer.file = null"
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            d="M17.5 14.33C18.29 14.33 19.13 14.41 20 14.57V16.07C19.38 15.91 18.54 15.83 17.5 15.83C15.6 15.83 14.11 16.16 13 16.82V15.13C14.17 14.6 15.67 14.33 17.5 14.33M13 12.46C14.29 11.93 15.79 11.67 17.5 11.67C18.29 11.67 19.13 11.74 20 11.9V13.4C19.38 13.24 18.54 13.16 17.5 13.16C15.6 13.16 14.11 13.5 13 14.15M17.5 10.5C15.6 10.5 14.11 10.82 13 11.5V9.84C14.23 9.28 15.73 9 17.5 9C18.29 9 19.13 9.08 20 9.23V10.78C19.26 10.59 18.41 10.5 17.5 10.5M21 18.5V7C19.96 6.67 18.79 6.5 17.5 6.5C15.45 6.5 13.62 7 12 8V19.5C13.62 18.5 15.45 18 17.5 18C18.69 18 19.86 18.16 21 18.5M17.5 4.5C19.85 4.5 21.69 5 23 6V20.56C23 20.68 22.95 20.8 22.84 20.91C22.73 21 22.61 21.08 22.5 21.08C22.39 21.08 22.31 21.06 22.25 21.03C20.97 20.34 19.38 20 17.5 20C15.45 20 13.62 20.5 12 21.5C10.66 20.5 8.83 20 6.5 20C4.84 20 3.25 20.36 1.75 21.07C1.72 21.08 1.68 21.08 1.63 21.1C1.59 21.11 1.55 21.12 1.5 21.12C1.39 21.12 1.27 21.08 1.16 21C1.05 20.89 1 20.78 1 20.65V6C2.34 5 4.18 4.5 6.5 4.5C8.83 4.5 10.66 5 12 6C13.34 5 15.17 4.5 17.5 4.5Z"
          />
        </svg>
        <div>
          <span v-if="!this.$root.session.writer.selected.title"
            ><i>{{ this.$root.setlang.writer.settings }}</i></span
          >
          <span v-if="this.$root.session.writer.selected.title">
            {{ this.$root.session.writer.selected.title }}</span
          >
        </div>
      </button>

      <WriterNode
        :list="$root.session.writer.selected.files"
        @updateDatabase="updateDatabase"
        :key="this.$root.session.writer.selected.lastupdated"
      />
    </div>

    <div class="addbar">
      <button @click="addNode('folder')">
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            d="M13 19C13 19.34 13.04 19.67 13.09 20H4C2.9 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.1 6 22 6.89 22 8V13.81C21.12 13.3 20.1 13 19 13C15.69 13 13 15.69 13 19M20 18V15H18V18H15V20H18V23H20V20H23V18H20Z"
          />
        </svg>
      </button>

      <button @click="addNode('file')" style="left: 50px">
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.81C13.28 21.09 13 20.05 13 19C13 18.67 13.03 18.33 13.08 18H6V16H13.81C14.27 15.2 14.91 14.5 15.68 14H6V12H18V13.08C18.33 13.03 18.67 13 19 13S19.67 13.03 20 13.08V8L14 2M13 9V3.5L18.5 9H13M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import WriterNode from "./WriterNode.vue";
export default {
  name: "WriterLeftSide",
  components: {
    WriterNode,
  },
  data() {
    return {
      drag: false,
      pinme: false,
      defaultFileStructure: {
        type: "file",
      },
      defaultFolderStructure: {
        type: "folder",
        open: true,
        title: this.$root.setlang.writer.newfolder,
        children: [],
      },
    };
  },
  methods: {
    previewText(str) {
      if (str) {
        str = str.replace(/(<([^>]+)>)/gi, " ");
        let app = "...";
        if (str.length < 100) {
          app = "";
        }
        return str.substring(0, 75) + app;
      }
    },
    searchForFileandParent(file, parent) {
      // find the index and parent of the selected node so we can insert afterwards
      let output = {
        index: null,
        parent: null,
      };
      for (let i = 0; i < parent.length; i++) {
        if (parent[i].uuid === file.uuid) {
          output.index = i;
          output.parent = parent;
          return output;
        } else {
          if (parent[i].children) {
            if (parent[i].children.length) {
              return this.searchForFileandParent(file, parent[i].children);
            }
          }
        }
      }
      //return false
    },
    searchForFolder(folderid, list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid === folderid) {
          return list[i];
        } else {
          if (list[i].children) {
            console.log("childs", list[i].children);
            let x = this.searchForFolder(folderid, list[i].children);
            if (x) {
              return x;
            }
          }
        }
      }
    },

    async addNode(type) {
      let obj = null;
      if (type === "file") {
        obj = JSON.parse(JSON.stringify(this.defaultFileStructure));
        obj.uuid = this.$root.uuid();
        // create the new file first!!
        let file = {};
        file.title = this.$root.setlang.writer.newfile;
        file.writerid = this.$root.session.writer.selected.uuid;
        file.uuid = obj.uuid;
        file.content = "";
        file.notes = [];
        // we need to create a new file here
        await this.$root.AddRecord("Files", file);
      }
      if (type === "folder") {
        obj = JSON.parse(JSON.stringify(this.defaultFolderStructure));
        obj.uuid = this.$root.uuid();
      }

      let WriterNewObj = JSON.parse(
        JSON.stringify(this.$root.session.writer.selected)
      );
      console.log("WriterNewObj", WriterNewObj);
      if (!this.$root.session.writer.file) {
        WriterNewObj.files.push(obj);
      } else {
        if (this.$root.session.writer.file.type === "folder") {
          let folder = this.searchForFolder(
            this.$root.session.writer.file.uuid,
            WriterNewObj.files
          );
          console.log("folder", folder);
          if (folder) {
            folder.children.push(obj);
          }
        } else {
          let found = this.searchForFileandParent(
            this.$root.session.writer.file,
            WriterNewObj.files
          );
          if (found) {
            found.parent.splice(found.index + 1, 0, obj);
          }
        }
      }
      this.$root.UpdateRecord("Writer", WriterNewObj.uuid, WriterNewObj);
    },
    async updateDatabase() {
      //      this.$root.session.writer.selected.windowid = this.$root.windowID
console.log(
        "updating writer database",
        this.$root.session.writer.selected
      );

      await this.$root.UpdateRecord(
        "Writer",
        this.$root.session.writer.selected.uuid,
        this.$root.session.writer.selected
      );
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
};
</script>

<style scoped>
.miniwordcount {
  font-weight: bold;
  text-align: right;
}

.itemBox {
  padding-right: 25px;
}

.settingsBtn {
  height: 40px;
  width: 100%;
  background-color: inherit;
  color: inherit;
  text-align: left;
  padding-left: 40px;
  cursor: pointer;
}

.settingsBtn svg {
      fill: var(--button-hover-f);
  position: absolute;
  left: 5px;
  top: 5px;
}

.settingsBtn:hover,
.settingsBtn:focus,
.settingsBtn:active {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}

.settingsBtn:hover svg,
.settingsBtn:focus svg,
.settingsBtn:active svg {
  fill: var(--button-hover-f);
}

.pinBtn {
  position: absolute;
  top: 0px;
  right: 0px;
  border: 0px;
  background: none;
  padding: 5px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin: 5px;
  background-color: var(--accent);
  border-radius: 50%;
}

.pinBtn svg {
  fill: var(--writer-side-nav-f);
}

.pinBtn:hover,
.pinBtn:active,
.pinBtn:focus {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}

.pinBtn:hover svg,
.pinBtn:active svg,
.pinBtn:focus svg {
  fill: var(--button-hover-f);
}

.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: var(--hover-ghost);
}

.list-group {
  min-height: 20px;
}

.list-group-item svg {
  fill: var(--writer-side-panels-f);
}

.menu {
  font-weight: 100;
  background: var(--writer-side-panels);
  color: var(--writer-side-panels-f);
  width: 300px;
  height: 100%;
  padding: 0px;
  padding-right: 40px;
  padding-top: 0px;
  position: fixed;
  top: 50px;

  -webkit-box-shadow: 3px 0px 5px 0px rgba(0, 0, 0, 0.2);
  box-shadow: 3px 0px 5px 0px rgba(0, 0, 0, 0.2);
  left: -260px;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
}

.menu:hover,
.menu:focus,
.lhspinned {
  transform: translate3d(260px, 0, 0);
  animation-timing-function: 1s ease-in;
}

.scrollpanel {
  overflow-y: auto;
  position: absolute;
  top: 40px;
  bottom: 0px;
  width: 100%;
  padding: 0px;
  background-color: inherit;
  padding-bottom: 140px;
}

.addbar {
  position: absolute;
  top: 0px;

  width: calc(100% - 40px);
  height: 40px;
}

.addbar button {
  border: 0px;

  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin: 5px;
  background-color: var(--writer-side-nav);
  color: var(--writer-side-nav-f);
}

.addbar button svg {
  fill: var(--writer-side-nav-f);
  width:20px !important;
}

.addbar button:hover,
.addbar button:active,
.addbar button:focus {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}

.addbar button:hover svg,
.addbar button:active svg,
.addbar button:focus svg {
  fill: var(--button-hover-f);
}

.chosen {
  background-color: var(--accent);
  color: var(--accent-f);
}

.chosen > svg {
  fill: var(--accent-f);
}
</style>
