<template>
    <div v-if="item" class="hitTarget" @click="selectnode(section)">
     <h3>{{ item.title }}</h3>
     <div class="section">
    
     <div v-html="item.content"></div>
     </div>
  </div>
</template>
  
<script>

export default {
    name: "PageBlock",
    props: {
        section: Object
    },
    data() {
        return {
            item: this.$root.useObservable(this.$root.liveQuery(async () => await this.$root.db.Files.get(this.section.uuid)))
        };
    },
    methods: {
     selectnode(element) {
      this.$root.session.writer.file = element
    },
    }
};
</script>

<style scoped>
.hitTarget{
    cursor: pointer;
        border: 2px solid #ccc;
        margin-top: 10px;
        overflow-y: scroll;
        position: relative;
}

h3{
    text-align: center;
    margin:0px;
    padding: 10px;
  position: sticky;
  top:0px;
        background-color: var(--c1);
    color: var(--c1-f);
    border-bottom: 1px solid #ccc;
}
.section{
    padding: 8% 10%;
    background-color: var(--c0);
    color: var(--c0-f);

    margin-top: 0px;
    line-height: 2rem;
    font-size: 1.2rem;
}
.hitTarget:hover h3{
    background-color: #fff;
        background-color: var(--accent);
    color: var(--accent-f);
}
.hitTarget:hover{
    border: 2px solid var(--accent);
}
</style>

  