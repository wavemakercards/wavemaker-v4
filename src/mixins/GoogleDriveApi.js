const GoogleDriveApi = {
    data() {
        return {
            GoogleDriveApi: {
                CLIENT_ID: "451112835343-dfdk5iglpkorfmt3ouu5puogmvmvn22p.apps.googleusercontent.com",
                API_KEY: "AIzaSyAq4C0VCC3I88n7GdW1VilDmcZdYle-UoU",
                DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                SCOPES: 'https://www.googleapis.com/auth/drive.file',
                gapiInited: false,
                gisInited: false,
                tokenClient: null,
                tokenRefreshPromise: null,
                loggedin: false,
                files: [],
                CURRENT_FILE_OBJ: null,
                CURRENT_FILE_NAME: "",
                CURRENT_FILE_CONTENTS: "",
                loading: false,
                searching: false,
                error: null
            }
        }
    },
    methods: {
        async GoogleDriveInitializeGapi() {
            try {
                await window.gapi.client.init({
                    apiKey: this.GoogleDriveApi.API_KEY,
                    discoveryDocs: [this.GoogleDriveApi.DISCOVERY_DOC],
                });
                this.GoogleDriveApi.gapiInited = true;
                this.GoogleDriveApi.error = null;
                this.GoogleDriveCheckAuthStatus();
            } catch (error) {
                this.GoogleDriveApi.error = "Google Drive could not be initialized.";
                console.error("Google Drive initialization failed:", error);
            }
        },
        async GoogleDrivegisLoaded() {
            //console.log("GoogleDrivegisLoaded")
            this.GoogleDriveApi.tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: this.GoogleDriveApi.CLIENT_ID,
                scope: this.GoogleDriveApi.SCOPES,
                callback: '', // defined later
            });
            this.GoogleDriveApi.gisInited = true;
            this.GoogleDriveCheckAuthStatus();
        },
        GoogleDriveCheckAuthStatus() {
            //console.log("GoogleDriveCheckAuthStatus")
            if (this.GoogleDriveApi.gapiInited && this.GoogleDriveApi.gisInited) {
                this.GoogleDriveAuthStart()
            }
        },
        /**
         *  Sign in the user upon button click.
         */
        async GoogleDriveAuthStart() {
            try {
                const prompt = window.gapi.client.getToken() === null ? 'consent' : '';
                await this.GoogleDriveRequestAccessToken(prompt);
                this.GoogleDriveApi.loggedin = true;
                await this.GoogleDriveListFiles();
            } catch (error) {
                this.GoogleDriveApi.loggedin = false;
                this.GoogleDriveApi.error = "Google Drive sign-in failed.";
                console.error("Google Drive sign-in failed:", error);
            }
        },
        GoogleDriveRequestAccessToken(prompt = '') {
            if (this.GoogleDriveApi.tokenRefreshPromise) return this.GoogleDriveApi.tokenRefreshPromise;

            const tokenClient = this.GoogleDriveApi.tokenClient;
            this.GoogleDriveApi.tokenRefreshPromise = new Promise((resolve, reject) => {
                tokenClient.callback = (response) => {
                    this.GoogleDriveApi.tokenRefreshPromise = null;
                    if (response.error) {
                        reject(response);
                        return;
                    }
                    window.gapi.client.setToken(response);
                    resolve(response);
                };
                tokenClient.requestAccessToken({ prompt });
            }).catch((error) => {
                this.GoogleDriveApi.tokenRefreshPromise = null;
                throw error;
            });
            return this.GoogleDriveApi.tokenRefreshPromise;
        },
        async GoogleDriveWithTokenRefresh(operation) {
            try {
                return await operation();
            } catch (error) {
                const status = Number(error?.status || error?.code || error?.result?.error?.code || error?.error?.code);
                if (status !== 401) throw error;

                try {
                    await this.GoogleDriveRequestAccessToken();
                } catch (refreshError) {
                    this.GoogleDriveApi.loggedin = false;
                    throw refreshError;
                }
                try {
                    return await operation();
                } catch (retryError) {
                    const retryStatus = Number(retryError?.status || retryError?.code || retryError?.result?.error?.code || retryError?.error?.code);
                    if (retryStatus === 401) this.GoogleDriveApi.loggedin = false;
                    throw retryError;
                }
            }
        },
        /**
         *  Sign out the user upon button click.
         */
        GoogleDriveSignOut() {
            const token = window.gapi.client.getToken();
            if (token !== null) {
                window.google.accounts.oauth2.revoke(token.access_token);
            }
            window.gapi.client.setToken('');
            this.GoogleDriveApi.loggedin = false
            this.GoogleDriveApi.files = []
            this.GoogleDriveApi.CURRENT_FILE_OBJ = null
            this.GoogleDriveApi.error = null
            this.$root.$data.popup.name = null
        },
        async GoogleDriveListFiles() {
            this.GoogleDriveApi.searching = true
            this.GoogleDriveApi.error = null
            try {
                const response = await this.GoogleDriveWithTokenRefresh(() => window.gapi.client.drive.files.list({
                    pageSize: 100,
                    orderBy: 'modifiedTime desc',
                    fields: 'nextPageToken, files(id, name, size, modifiedTime)',
                    q: "name contains '.wm4' and trashed = false"
                }));
                this.GoogleDriveApi.files = response.result.files || []
                this.GoogleDriveApi.nextPageToken = response.result.nextPageToken || null
            } catch (err) {
                this.GoogleDriveApi.files = []
                this.GoogleDriveApi.error = "Google Drive files could not be loaded."
                console.error("Google Drive file listing failed:", err)
            } finally {
                this.GoogleDriveApi.searching = false
            }
        },
        async GoogleDriveReadFile(fileObj = this.GoogleDriveApi.CURRENT_FILE_OBJ) {
            if (!fileObj) return false

            try {
                const response = await this.GoogleDriveWithTokenRefresh(() => window.gapi.client.drive.files.get({
                    fileId: fileObj.id,
                    alt: 'media'
                }))
                const mydata = new Blob([response.body], {
                    type: "application/json",
                });
                await this.$root.databaseImport(mydata)
                await this.$root.getSettings()
                this.GoogleDriveApi.CURRENT_FILE_OBJ = fileObj
                this.GoogleDriveApi.CURRENT_FILE_NAME = fileObj.name
                this.GoogleDriveApi.error = null
                this.$root.$data.popup.name = null
                return true
            } catch (error) {
                this.GoogleDriveApi.error = "The Google Drive file could not be opened."
                console.error("Google Drive file read failed:", error)
                return false
            }
        },
        async GoogleDriveFindFile(name) {
            const escapedName = name.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
            const response = await this.GoogleDriveWithTokenRefresh(() => window.gapi.client.drive.files.list({
                pageSize: 10,
                orderBy: 'modifiedTime desc',
                fields: 'files(id, name, size, modifiedTime)',
                q: `name = '${escapedName}' and trashed = false`
            }))
            return response.result.files?.[0] || null
        },
        async GoogleDriveWriteFile(callback) {
            this.GoogleDriveApi.loading = true;
            try {
                this.GoogleDriveApi.CURRENT_FILE_NAME = this.$root.session.settings.ProjectName
                const blob = await this.$root.databaseExport()
                const currentFileContents = await blob.text()
                let existingFile = this.GoogleDriveApi.CURRENT_FILE_OBJ
                if (!existingFile) {
                    existingFile = await this.GoogleDriveFindFile(`${this.GoogleDriveApi.CURRENT_FILE_NAME}.wm4`)
                    if (existingFile) this.GoogleDriveApi.CURRENT_FILE_OBJ = existingFile
                }
                const filePath = existingFile?.id || ""
                const boundary = '-------314159265358979323846';
                const delimiter = "\r\n--" + boundary + "\r\n";
                const closeDelim = "\r\n--" + boundary + "--";
                const contentType = 'application/json';
                const metadata = { name: this.GoogleDriveApi.CURRENT_FILE_NAME + '.wm4', mimeType: contentType };
                const multipartRequestBody = delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) + delimiter + 'Content-Type: ' + contentType + '\r\n\r\n' + currentFileContents + closeDelim;
                const file = await this.GoogleDriveWithTokenRefresh(() => new Promise((resolve, reject) => {
                    const request = window.gapi.client.request({
                        path: filePath ? '/upload/drive/v3/files/' + filePath : '/upload/drive/v3/files',
                        method: filePath ? 'PATCH' : 'POST',
                        params: { uploadType: 'multipart' },
                        headers: { 'Content-Type': 'multipart/related; boundary="' + boundary + '"' },
                        body: multipartRequestBody
                    });
                    request.execute((response) => response?.error ? reject(response.error) : resolve(response.result || response))
                }))
                this.GoogleDriveApi.CURRENT_FILE_OBJ = file
                this.GoogleDriveApi.error = null
                this.GoogleDriveListFiles()
                if (callback) callback(file)
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Uploaded to Google Drive',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true
                })
                this.$root.$data.popup.name = null
            } catch (error) {
                const status = Number(error?.status || error?.code || error?.result?.error?.code || error?.error?.code)
                if (status === 401) {
                    this.GoogleDriveApi.loggedin = false
                    this.GoogleDriveApi.files = []
                    this.GoogleDriveApi.error = "Google Drive needs you to sign in again before saving."
                    this.$root.$data.popup.name = 'GoogleDrive'
                } else {
                    this.GoogleDriveApi.error = "The project could not be saved to Google Drive."
                }
                console.error("Google Drive file write failed:", error)
            } finally {
                this.GoogleDriveApi.loading = false
            }
        },

        GoogleDriveSignIn() {
            this.GoogleDriveApi.error = null
            window.gapi.load('client', () => this.GoogleDriveInitializeGapi());
            this.GoogleDrivegisLoaded()
        }
    },
}
export default GoogleDriveApi