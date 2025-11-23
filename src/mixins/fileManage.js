const fileManage = {
  data() {
    return {
    }
  },
  methods: {
        created() {
      if ("launchQueue" in window && "files" in window.LaunchParams.prototype) {
          window.launchQueue.setConsumer(async (launchParams) => {
            if (!launchParams.files.length) {
              return;
            }
            this.$root.fileHandle = launchParams.files[0];
            const file = await this.$root.fileHandle.getFile();
            const contents = await file.text();
            this.$root.jsonData = JSON.parse(contents);
            await this.$root.dbImport(this.$root.jsonData);
          });
        }

    },
    file_loadDB() {
      document.getElementById("wavemakerHiddenPicker").click();
    },
    file_load(event) {
      console.log(event.target.files);

      var fr = new FileReader();

      fr.onload = async (event) => {

        const mydata = new Blob([event.target.result], {
          type: "text/json;charset=utf-8",
        });
        await this.$root.databaseImport(mydata)
        console.log("import complete")
        this.$root.getSettings()
        //this.$root.databaseImport(mydata)
        //  this.$root.DBimport(JSON.parse(event.target.result));
      };

      fr.readAsText(event.target.files.item(0));


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
  },
  mounted() {
    let hiddenInput = document.createElement("input")
    hiddenInput.type = "file"
    hiddenInput.id = "wavemakerHiddenPicker"
    hiddenInput.accept = ".wm4"
    hiddenInput.style = "display:none"
    document.body.appendChild(hiddenInput)

  }
}
export default fileManage