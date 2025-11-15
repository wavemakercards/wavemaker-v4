<template>
  <VueDraggableNext :list="list" tag="transition-group" handle=".handle" :component-data="{
    tag: 'div',
    type: 'transition-group',
    name: !drag ? 'flip-list' : null,
  }" v-bind="dragOptions" @start="drag = true" @end="drag = false" item-key="order" @change="updateDatabase"
    :emptyInsertThreshold="30">
    <template v-for="(element, index) in list" :key="index">
      <div class="childbox">
        <div class="list-group-item" tabindex="0">
          <div class="itemBox" v-if="element.type === 'file'">

            <div class="itemTitle" :class="isSelected(element.uuid) ? 'chosen' : ''" @click="selectNode(element)">
              <span class="handle">

                <svg style="width: 24px; height: 24px" viewBox="0 0 24 24" v-if="isSelected(element.uuid)">
                  <path
                    d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
                </svg>

                <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-if="!isSelected(element.uuid)">
                  <path
                    d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
                </svg>
              </span>
              <div class="title">
                <NodeTemplate :nodeElement="element" :key="element.title" />
              </div>

            </div>

            <button class="deleteIconButton" @click="deleteFile(index, element)" tabindex="0">
              <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                <path
                  d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
              </svg>
            </button>
          </div>
          <div class="itemBox" v-if="element.type === 'folder'">
            <div class="itemTitle" :class="isSelected(element.uuid) ? 'chosen' : ''" @click="selectNode(element)">
              <span class="handle" @click="toggleOpen(element)">
                <span v-if="isSelected(element.uuid)">
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24" v-if="!element.open">
                    <path
                      d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
                  </svg>
                  <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-if="element.open">
                    <path
                      d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" />
                  </svg>
                </span>
                <span v-if="!isSelected(element.uuid)">
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24" v-if="!element.open">
                    <path
                      d="M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z" />
                  </svg>
                  <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-if="element.open">
                    <path
                      d="M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z" />
                  </svg>
                </span>
              </span>
              <div class="title">
               {{ element.title }}
              </div>
            </div>
            <button class="deleteIconButton" @click="deleteFile(index, element)" tabindex="0">
              <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                <path
                  d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
              </svg>
            </button>
          </div>

          <template v-if="element.open">
            <WriterNode :list="element.children" @updateDatabase="updateDatabase" @selectNode="selectNode(element)" />
          </template>

        </div>
      </div>
    </template>
  </VueDraggableNext>
</template>

<script>

import { VueDraggableNext } from "vue-draggable-next";
import NodeTemplate from "./NodeTemplate.vue"
export default {
  name: "WriterNode",
  components: {
    VueDraggableNext,
    NodeTemplate
  },
  emits: ["updateDatabase"],
  props: {
    list: Array
  },
  data() {
    return {
      drag: false,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "filestystem",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  methods: {
    toggleOpen(element) {
      element.open = !element.open
      this.updateDatabase()
    },
    deleteFile(index, element) {


      this.$swal(
        {
          title: this.$root.setlang.confirmmodal.confirmdelete,
          text: this.$root.setlang.confirmmodal.noundo,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.$root.setlang.confirmmodal.confirmbtn,
          cancelButtonText: this.$root.setlang.confirmmodal.cancelbtn
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.$root.session.writer.file) {
              if (this.$root.session.writer.file.uuid === element.uuid) {
                this.$root.session.writer.file = null
              }
            }
            if (element.type === 'folder') {
              if (element.children.length) {
                this.recursiveDelete(element.children)
              }
            }

            //eslint-disable-next-line
            this.list.splice(index, 1)
            this.updateDatabase()
            this.$root.DeleteRecord("Files", element.uuid)

            this.$swal(
              this.$root.setlang.confirmmodal.success,
              this.$root.setlang.confirmmodal.successfeedback,
              'success'
            )
          }
        }
        );

    },
    recursiveDelete(list) {
      list.forEach(element => {
        if (this.$root.session.writer.file) {
          if (this.$root.session.writer.file.uuid === element.uuid) {
            this.$root.session.writer.file = null
          }
        }
        if (element.type === "folder") {
          if (element.children.length) {
            this.recursiveDelete(element.children)
          }
        } else {
          this.$root.DeleteRecord("Files", element.uuid)
        }
      })
    },
    updateDatabase() {
      this.$emit("updateDatabase")
    },
    selectNode(element) {
      this.$root.session.writer.file = element
    },
    isSelected(id) {
      if (this.$root.session.writer.file) {
        if (this.$root.session.writer.file.uuid === id) {
          return true
        }
      }
      return false
    },
  }
}

</script>



<style scoped>
.itemBox {
  padding-right: 25px;
}




.settingsBtn {
  height: 40px;
  width: 100%;
  background-color: var(--writer-side-nav);
  color: var(--writer-side-nav-f);
  text-align: left;
  padding-left: 40px;
  cursor: pointer;
}

.settingsBtn svg {
  position: absolute;
  left: 5px;
  top: 5px;
  fill: var(--writer-side-nav-f);
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
  fill: var(--button-hover-f)
}

.pinBtn {
  position: absolute;
  top: 0px;
  right: 0px;
  border: 0px;
  background: none;
  padding: 5px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: var(--writer-side-nav);

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

.list-group-item {
  position: relative;
  display: block;
  cursor: pointer;
  padding: 5px;
  padding-top: 10px;
  min-height: 40px;
  background-color: var(--writer-side-panels);
  color: var(--writer-side-panels-f);
}

.list-group-item svg {
  fill: var(--writer-side-panels-f);
}

/*
.list-group-item:hover,
.list-group-item:focus,
.list-group-item:active  {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}
*/
.childbox {
  padding-left: 10px;
}

.itemBox:hover .deleteIconButton,
.itemBox:focus .deleteIconButton,
.itemBox:active .deleteIconButton {
  display: block
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
  background-color: inherit
}

.addbar {
  position: absolute;
  top: 0px;
  background-color: var(--writer-side-nav);
  width: calc(100% - 40px);
  height: 40px;
}

.addbar button {
  border: 0px;
  padding: 5px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: var(--writer-side-nav);
  color: var(--writer-side-nav-f);
}

.addbar button svg {
  fill: var(--writer-side-nav-f);
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



/*
same as node - will nee to srot this
*/

.itemTitle {
  position: relative;
  font-weight: bold;
  padding-left: 30px;
  padding-right: 10px;
  margin-bottom: 10px;
}


.itemTitle .title {
  font-family: inherit;
  background-color: inherit;
  color: inherit;
  border: 0px;
  width: calc(100% - 20px);
  outline: none;
  height: 20px;
  margin: 0px;
  font-weight: normal;
}

.itemTitle input {
  font-family: inherit;
  background-color: inherit;
  color: inherit;
  border: 0px;
  width: 100%;

}

.handle {
  position: absolute;
  left: 0px;
  top: -4px;
  margin-bottom: 5px;
  cursor: move;
}

.itemText {
  font-size: 0.9rem;
  color: inherit;
  font-style: italic;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}


.chosen .title {
  font-weight: bold;

}
</style>

