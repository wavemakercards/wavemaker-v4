const fileManage = {
  data() {
    return {
    }
  },
  created() {
    if ("launchQueue" in window && "files" in window.LaunchParams.prototype) {
      console.log("PWA file launch support enabled");

      window.launchQueue.setConsumer(async (launchParams) => {
           
        if (!launchParams.files.length) {
          return;
        }
         if(confirm("You are opening a file from your device, this will replace your current project.")){
        console.log("Launch params files:", launchParams.files);
        this.$root.fileHandle = launchParams.files[0];

        const file = await this.$root.fileHandle.getFile();
        console.log("File loaded:", file);
        await this.importDatabaseFile(file);
            }else{
      //close the window 
      window.close();
    }
      });


    }
  },
  methods: {
    file_loadDB() {
      document.getElementById("wavemakerHiddenPicker").click();
    },
    async file_load(event) {
      const file = event.target.files.item(0)
      if (!file) return

      try {
        await this.importDatabaseFile(file)
      } finally {
        event.target.value = ""
      }
    },

    async importDatabaseFile(file) {
      try {
        const mydata = new Blob([await file.text()], {
          type: "application/json",
        })
        await this.$root.databaseImport(mydata)
        console.log("import complete")
        await this.$root.getSettings()
      } catch (error) {
        console.error("Database import failed:", error)
        this.$swal("Import failed", "This file could not be imported as a Wavemaker project.", "error")
      }
    },

    async file_downloadDB() {

      this.$swal(
        {
          title: this.$root.setlang.confirm.sure,
          text: this.$root.setlang.confirm.downloadfile,
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: this.$root.setlang.confirm.filecancel,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: this.$root.setlang.confirm.fileexport
        }).then(async (result) => {
          if (result.isConfirmed) {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            var time =
              today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

            let tempname = this.$root.session.settings.ProjectName
            tempname = tempname.replace(/[\W_]+/g, "-");
            let filename = tempname + "[" + yyyy + "-" + mm + "-" + dd + "-" + time + "].wm4";

            let blob = await this.$root.databaseExport()



            const blobConfig = new Blob([blob], {
              type: "text/json;charset=utf-8",
            });
            const blobUrl = URL.createObjectURL(blobConfig);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.target = "_blank";
            anchor.download = filename;

            // Auto click on a element, trigger the file download
            anchor.click();

            // This is required
            URL.revokeObjectURL(blobUrl);

            this.$swal(
              this.$root.setlang.confirm.exportedsuccess,
              this.$root.setlang.confirm.exportedmessage,
              'success'
            )
          }
        }
        )











    }
  }
}
export default fileManage