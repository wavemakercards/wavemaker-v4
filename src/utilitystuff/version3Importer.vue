<template>
  <div class="backdrop">
    <div class="window">
      <table style="width: 100%">
        <tbody>
          <tr>
            <td style="width: 75%"></td>
            <td>
              <button
                @click="$root.v3import = false"
                class="interfaceBtn fullw text-left"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"
                  />
                </svg>
                {{ this.$root.setlang.wm3import.close }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <hr />
      <div v-html="this.$root.setlang.wm3import.info"></div>
      <button
        @click="file_loadDB"
        v-if="!wm3file"
        class="interfaceBtn fullw text-left"
      >
        <svg viewBox="0 0 24 24">
          <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
        </svg>
        {{ this.$root.setlang.wm3import.upload }}
      </button>

      <div v-if="wm3file">
        <label>Choose a Project to import</label>
        <button
          v-for="(project, index) in wm3file.projects"
          :key="index"
          @click="startimport(index)"
          class="interfaceBtn fullw text-left"
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M6 2C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H12V20H6V4H13V9H18V12H20V8L14 2M18 14C17.87 14 17.76 14.09 17.74 14.21L17.55 15.53C17.25 15.66 16.96 15.82 16.7 16L15.46 15.5C15.35 15.5 15.22 15.5 15.15 15.63L14.15 17.36C14.09 17.47 14.11 17.6 14.21 17.68L15.27 18.5C15.25 18.67 15.24 18.83 15.24 19C15.24 19.17 15.25 19.33 15.27 19.5L14.21 20.32C14.12 20.4 14.09 20.53 14.15 20.64L15.15 22.37C15.21 22.5 15.34 22.5 15.46 22.5L16.7 22C16.96 22.18 17.24 22.35 17.55 22.47L17.74 23.79C17.76 23.91 17.86 24 18 24H20C20.11 24 20.22 23.91 20.24 23.79L20.43 22.47C20.73 22.34 21 22.18 21.27 22L22.5 22.5C22.63 22.5 22.76 22.5 22.83 22.37L23.83 20.64C23.89 20.53 23.86 20.4 23.77 20.32L22.7 19.5C22.72 19.33 22.74 19.17 22.74 19C22.74 18.83 22.73 18.67 22.7 18.5L23.76 17.68C23.85 17.6 23.88 17.47 23.82 17.36L22.82 15.63C22.76 15.5 22.63 15.5 22.5 15.5L21.27 16C21 15.82 20.73 15.65 20.42 15.53L20.23 14.21C20.22 14.09 20.11 14 20 14M19 17.5C19.83 17.5 20.5 18.17 20.5 19C20.5 19.83 19.83 20.5 19 20.5C18.16 20.5 17.5 19.83 17.5 19C17.5 18.17 18.17 17.5 19 17.5Z"
            />
          </svg>

          {{ project.title }}
        </button>
      </div>
    </div>

    <input
      type="file"
      id="wavemaker3HiddenPicker"
      name="upload"
      accept=".wmdata"
      @change="file_load"
      style="display: none"
    />
  </div>
</template>

<script>
import showdown from "showdown";
export default {
  name: "App",
  data() {
    return {
      wm3file: null,
      proj: null,
      filearray: [],
      copysettings: {},
    };
  },
  methods: {
    file_loadDB() {
      document.getElementById("wavemaker3HiddenPicker").click();
    },
    file_load(event) {
      var fr = new FileReader();
      fr.onload = async (event) => {
        this.wm3file = JSON.parse(event.target.result);
        console.log("Data File Recieved", this.wm3file);
        //this.$root.databaseImport(mydata)
        //  this.$root.DBimport(JSON.parse(event.target.result));
      };
      fr.readAsText(event.target.files.item(0));
    },
    startimport(key) {
      // clear the tables
      this.$root.clearDatabase();
      this.proj = this.wm3file.projects[key];
      // first job - get the settings
      let obj = JSON.parse(JSON.stringify(this.$root.SettingsTemplate));
      obj.uuid = this.$root.uuid();
      obj.ProjectName = this.proj.title;
      this.copysettings = obj;
      this.$root.AddRecord("Settings", obj);

      /*Process the writer inot the files and notecerd into the cards datsbase */
      let writerid = this.$root.uuid();
      this.filearray = [];

      this.loopfiles(this.proj.data.writer, this.filearray, writerid);

      let writerobj = {};
      writerobj.title = this.proj.title;
      writerobj.description = "";
      writerobj.files = JSON.parse(JSON.stringify(this.filearray));
      writerobj.uuid = writerid;
      this.$root.AddRecord("Writer", writerobj);

      this.processCards();
      this.processSnowflakes();
      this.processgridplanner();
      this.processmindmaps();
      this.processtimeline();

      // finish up and restart with the new project loaded
      this.$root.v3import = false;

      this.$root.getSettings();
    },
    loopfiles(arr, parent, writerid) {
      // this does all the work for the files creation etc and building the array

      arr.forEach((f) => {
        if (!f.data) {
          console.log("odd error ", f);
        } else {
          let file = {
            uuid: this.$root.uuid(),
            type: "file",
          };
          // create and add the FILE
          let o = {};
          o.uuid = file.uuid;
          o.writerid = writerid;
          /// needs to be converted to html here
          if (f.data.content) {
            let converter = new showdown.Converter();
            let html = converter.makeHtml(f.data.content);
            o.content = html;
            o.wordcount = this.$root.wordCounter(html);
          } else {
            o.content = "";
            o.wordcount = 0;
          }
          o.title = f.title;
          o.notes = [];
if(f.data.notes){
          if (f.data.notes.length) {
            f.data.notes.forEach((card) => {
              //fix for duff colourn on default
              if (parseInt(card.backgroundColor) === 0) {
                card.backgroundColor = 1;
              }
              if (parseInt(card.backgroundColor) === 6) {
                card.backgroundColor = 5;
              }
              if (!card.backgroundColor) {
                card.backgroundColor = 1;
              }
              let cardobj = {};
              cardobj.uuid = this.$root.uuid();
              cardobj.title = card.title;
              cardobj.description = card.content;
              cardobj.showdesc = true;
              cardobj.content = "";
              cardobj.labels = [];
              cardobj.images = [];
              cardobj.style = "";
              cardobj.options = {};
              cardobj.color = "--card" + card.backgroundColor;

              let crd = { uuid: cardobj.uuid };
              if (card.completed) {
                crd.completed = true;
              }
              o.notes.push(crd);

              this.$root.AddRecord("Cards", cardobj);
            });
          }}
          this.$root.AddRecord("Files", o);

          // if its a folder then we need to add a folder to the structure and push to that
          if (f.children) {
            let folder = {
              uuid: this.$root.uuid(),
              type: "folder",
              title: f.title,
              children: [],
              open: true,
            };
            parent.push(folder); // create the folder
            folder.children.push(file); // add the contetns of this as a file
            if (f.children.length) {
              this.loopfiles(f.children, folder.children, writerid);
            }
          } else {
            parent.push(file); // add the file to the file structure
          }
        }
      });
    },
    processCards() {
      if (!this.proj.data.cards || !this.proj.data.cards.length) {
        return false;
      }

      this.proj.data.cards.forEach((card) => {
        //fix for duff colourn on default
        // HANDLE images
        let imagearray = [];
        if (card.images) {
          card.images.forEach((image) => {
            let newImageId = this.$root.uuid();
            let newImage = {};
            let b64string = image.slice(22);
            newImage.uuid = newImageId;
            newImage.title = "imported";
            newImage.base64 = b64string;
            this.$root.AddRecord("ImageLibrary", newImage);
            imagearray.push(newImageId);
          });
        }

        if (card.backgroundColor === 0) {
          card.backgroundColor = 1;
        }
        if (card.backgroundColor === 6) {
          card.backgroundColor = 5;
        }
        let cardcontent = this.nl2br(card.content);
        let cardobj = {};
        cardobj.uuid = this.$root.uuid();
        cardobj.title = card.title;
        cardobj.description = cardcontent;
        cardobj.showdesc = true;
        cardobj.content = "";
        cardobj.labels = JSON.parse(JSON.stringify(card.tags));
        cardobj.images = imagearray;
        cardobj.style = "";
        cardobj.options = {};
        cardobj.color = "--card1";

        if (imagearray.length) {
          cardobj.showimage = imagearray[0];
        }

        this.$root.AddRecord("Cards", cardobj);
      });
    },
    nl2br(str, is_xhtml) {
      if (typeof str === "undefined" || str === null) {
        return "";
      }
      var breakTag =
        is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>";
      return (str + "").replace(
        /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
        "$1" + breakTag + "$2"
      );
    },
    processSnowflakes() {
      if (!this.proj.data.snowflake) {
        console.log("no snowflake");
        return false;
      }
      let uuid = this.$root.uuid();
      let newsnowflake = {};
      newsnowflake.uuid = uuid;
      newsnowflake.title = "Imported Snowflake";

      newsnowflake.content = [];

      this.proj.data.snowflake.forEach((flake) => {
        let o = {};
        o.title = flake.title;
        o.content = flake.content;
        o.children = [
          {
            title: flake.subcard1.title,
            content: flake.subcard1.content,
            children: [],
          },
          {
            title: flake.subcard2.title,
            content: flake.subcard2.content,
            children: [],
          },
          {
            title: flake.subcard3.title,
            content: flake.subcard3.content,
            children: [],
          },
        ];
        newsnowflake.content.push(o);
      });

      this.$root.AddRecord("Snowflake", newsnowflake);
    },
    processgridplanner() {
      if (!this.proj.data.gridplanner) {
        return false;
      }

      let newGrid = {};
      newGrid.uuid = this.$root.uuid();
      newGrid.title = "Imported";

      let grid = this.proj.data.gridplanner;
      let columns = null;
      let rows = [];
      grid.forEach((r, i) => {
        if (i === 0) {
          columns = r;
        } else {
          rows.push(r);
        }
      });
      newGrid.content = {};
      newGrid.content.headers = [];
      columns.forEach((item, c) => {
        if (c != 0) {
          newGrid.content.headers.push({
            uuid: this.$root.uuid(),
            title: item.title,
          });
        }
      });
      newGrid.content.rows = [];
      rows.forEach((row) => {
        let rowobj = {};
        row.forEach((item, c) => {
          if (c === 0) {
            rowobj.title = item.title;
            rowobj.cells = {};
          } else {
            let coluuid = newGrid.content.headers[c - 1].uuid;
            rowobj.cells[coluuid] = [];
            item.content.forEach((card) => {
              let cardcontent = this.nl2br(card);
              let cardobj = {};
              cardobj.uuid = this.$root.uuid();
              cardobj.title = "Grid import";
              cardobj.description = cardcontent;
              cardobj.showdesc = true;
              cardobj.content = "";
              cardobj.labels = [];
              cardobj.images = [];
              cardobj.style = "";
              cardobj.options = {};
              cardobj.color = "--card1";
              rowobj.cells[coluuid].push({ uuid: cardobj.uuid });
              this.$root.AddRecord("Cards", cardobj);
            });
          }
        });
        newGrid.content.rows.push(rowobj);
      });

      this.$root.AddRecord("Gridplanner", JSON.parse(JSON.stringify(newGrid)));
    },
    processmindmaps() {
      if (!this.proj.data.mindmaps) {
        return false;
      }

      let mindmap = this.proj.data.mindmaps;

      mindmap.forEach((map) => {
        let newmap = {};
        newmap.title = map.title;
        newmap.uuid = this.$root.uuid();
        newmap.content = {};
        newmap.content.links = [];
        newmap.content.nodes = {};

        // ok so links
        map.links.forEach((link) => {
          let o = {};
          o.from = link.start;
          o.to = link.end;
          o.type = "solid";
          newmap.content.links.push(o);
        });

        map.items.forEach((item) => {
          newmap.content.nodes[item.id] = {
            x: item.left,
            y: item.top,
            w: "auto",
            type: item.type,
          };

          if (item.type != "image") {
            newmap.content.nodes[item.id].text = this.nl2br(item.content);
          } else {
            // its an image so insert ot db
            let newImageId = this.$root.uuid();
            let newImage = {};
            let b64string = item.content.slice(22);
            newImage.uuid = newImageId;
            newImage.title = "imported";
            newImage.base64 = b64string;
            this.$root.AddRecord("ImageLibrary", newImage);
            newmap.content.nodes[item.id].text = newImageId;
          }
        });
        this.$root.AddRecord("Mindmap", JSON.parse(JSON.stringify(newmap)));
      });
    },
    processtimeline() {
      if (!this.proj.data.timeline) {
        return false;
      }
      let timeline = this.proj.data.timeline;
      console.log(">>>>", timeline);

      let newtimeline = {};
      newtimeline.uuid = this.$root.uuid();
      newtimeline.title = "Imported";
      newtimeline.description = "Your WM3 timeline";
      newtimeline.content = [];
      timeline.forEach((tl) => {
        newtimeline.content.push({
          title: tl.title,
          text: tl.content,
          event: "Your Event",
        });
      });
      this.$root.AddRecord("Timeline", JSON.parse(JSON.stringify(newtimeline)));
    },
  },
};
</script>

<style scoped>
.backdrop {
  background-color: var(--window);
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow-y: auto;
}

.window {
  max-width: 500px;
  padding: 20px;
  background-color: var(--window);
  color: var(--window-f);

  margin: 0 auto;
  margin-top: 5%;
}
</style>
