<template>
  <div class="menu" v-bind:class="$root.rhspin ? 'rhspinned' : ''">
    <!--<div class="title">
      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </svg>
    </div>
    -->
    <button class="pinBtn" @click="$root.rhspin = !$root.rhspin">
      <svg style="width: 18px; height: 18px" viewBox="0 0 24 24" v-if="$root.rhspin">
        <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" />
      </svg>

      <svg style="width: 18px; height: px" viewBox="0 0 24 24" v-if="!$root.rhspin">
        <path
          d="M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z" />
      </svg>
    </button>
    <div class="scrollpanel scroll-lhs">
      <div class="scroll-inside">
        <div v-if="item">
          <VueDraggableNext :list="item.notes" tag="transition-group" handle=".handle" :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null,
          }" v-bind="dragOptions" @start="drag = true" @end="drag = false" item-key="order" @change="updateDatabase">
            <template v-for="(element, index) in item.notes" :key="index">
              <div class="list-group-item" tabindex="0">
                <div style="padding-left:0px;">
                  <div :class="(element.completed) ? 'completedcard' : ''">
                    <CardViewer :cardid="element.uuid" :allowlink="true" @linkcard="linkCard" :key="element.uuid" />
                    <button class="togglecomplete" @click="element.completed = !element.completed; updateDatabase()">
                      <svg style="width:16px;height:16px" viewBox="0 0 24 24">
                        <path
                          d="M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />
                      </svg>
                    </button>
                  </div>


                  <div class="handle">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M1.88,0.46L0.46,1.88L5.59,7H2V9H9V2H7V5.59M11,7V9H21V15H23V9A2,2 0 0,0 21,7M7,11V21A2,2 0 0,0 9,23H15V21H9V11M15.88,14.46L14.46,15.88L19.6,21H17V23H23V17H21V19.59" />
                    </svg>
                  </div>


                  <button class="deleteIconButton" @click="deleteNote(index, element)" tabindex="0">
                    <svg style="width:18px;height:18px" viewBox="0 0 24 24">
                      <path
                        d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </VueDraggableNext>

        </div>

      </div>

    </div>
    <div class="addbar" v-if="item">

      <button @click="$root.openInNew('planningboard')" class="popBtn">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path
            d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
        </svg>
      </button>

      <button @click="addCard" class="addBtn">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path
            d="M13.09 20H4C2.9 20 2 19.11 2 18V6C2 4.89 2.9 4 4 4H20C21.11 4 22 4.89 22 6V13.81C21.12 13.3 20.09 13 19 13C15.69 13 13 15.69 13 19C13 19.34 13.04 19.67 13.09 20M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script>
import { useObservable } from "@vueuse/rxjs";
import { liveQuery } from "dexie";
import { db } from "@/db.js";
import { VueDraggableNext } from "vue-draggable-next";
import CardViewer from "@/components/universal/CardViewer.vue"

export default {
  name: "WriterRightSide",
  display: "Transitions",
  order: 7,
  components: {
    VueDraggableNext,
    CardViewer
  },
  data() {
    return {
      drag: false,
      item: useObservable(liveQuery(async () => await db.Files.get(this.$root.session.writer.file.uuid))),
    };
  },
  methods: {
    linkCard(newuuid, uuid) {
      var element = this.item.notes.find(x => x.uuid === uuid);
      element.uuid = newuuid
      this.updateDatabase()
    },
    deleteNote(index) {

      this.$swal(
        {
          title: 'Are you sure?',
          text: "You won't be able to undo this!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {

            this.item.notes.splice(index, 1)
            this.updateDatabase();

            this.$swal(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        }
        );


    },
    addCard() {
      let obj = {}
      obj.uuid = this.$root.uuid()
      this.item.notes.push(obj)
      this.updateDatabase();
    },
    updateDatabase() {
      this.$root.UpdateRecord("Files", this.item.uuid, this.item)
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
.pinBtn {
  position: absolute;
  top: 0px;
  left: 0px;
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

.chosen {
  background-color: var(--accent);
  color: var(--accent-f);

}

.chosen svg {
  fill: var(--accent-f);
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


.handle {
  position: absolute;
  left: 0px;
  top: -4px;
  margin-bottom: 5px;
  cursor: move;
}

.itemText {
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 10px;
  padding-left: 10px;
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

.list-group-item:hover .deleteIconButton,
.list-group-item:focus .deleteIconButton,
.list-group-item:active .deleteIconButton {
  display: block
}


.list-group-item .handle {
  position: absolute;
  top: 0px;
  left: 0px;
  display: none;
  background-color: var(--accent);
  height: 30px;
  width: 30px;
  padding: 5px;
  border-radius: 15px;
  ;
}

.list-group-item .handle svg {
  width: 18px;
  fill: var(--accent-f)
}

.list-group-item:hover .handle,
.list-group-item:focus .handle,
.list-group-item:active .handle {
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
  right: -260px;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
}

.menu:hover,
.menu:focus,
.rhspinned {
  transform: translate3d(-260px, 0, 0);
  animation-timing-function: 1s ease-in;
}

.togglecomplete {
  border: 0px;
  background: none;
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: var(--accent);
  color: var(--accent-f);
  fill: var(--accent-f);
  cursor: pointer;
}

.togglecomplete svg {
  fill: inherit
}

.togglecomplete:hover,
.togglecomplete:active,
.togglecomplete:focus {
  background-color: var(--primary);
  color: var(--primary-f);
  fill: var(--primary-f);

}

.completedcard {
  opacity: 0.2;
}

.scrollpanel {
  overflow-y: scroll;
  position: absolute;
  top: 40px;
  bottom: 0px;
  width: 100%;
  padding: 0px;
  padding-bottom: 200px;

  background-color: var(--writer-side-panels);
}

.scroll-lhs {
  transform: rotateY(180deg);
}

.scroll-inside {
  transform: rotateY(-180deg)
}

.addbar {
  position: absolute;
  top: 0px;
  right: 0px;

  width: calc(100% - 40px);
  height: 40px;

}





.popBtn {
  position: absolute;
  right: 40px;
  border: 0px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin: 5px;
  background-color: var(--writer-side-nav);
}

.popBtn svg {
  fill: var(--writer-side-nav-f);
    width:20px !important;
}

.popBtn:hover,
.popBtn:active,
.popBtn:focus {
  background-color: var(--accent);
  color: var(--accent-f);
}

.popBtn:hover svg,
.popBtn:active svg,
.popBtn:focus svg {
  fill: var(--accent-f);
}


@media only screen and (max-width: 1000px) {
  .popBtn {
    display: none;
  }

}









.addBtn {
  position: absolute;
  right: 0px;
  border: 0px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  margin: 5px;
  background-color: var(--writer-side-nav);
}

.addBtn svg {
  fill: var(--writer-side-nav-f);
    width:20px !important;
}

.addBtn:hover,
.addBtn:active,
.addBtn:focus {
  background-color: var(--accent);
  color: var(--accent-f);
}

.addBtn:hover svg,
.addBtn:active svg,
.addBtn:focus svg {
  fill: var(--accent-f);
}
</style>
