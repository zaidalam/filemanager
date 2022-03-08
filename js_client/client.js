const contentContainer = document.getElementById('content-container')
const loginForm = document.getElementById('login-form')
const uploadForm = document.getElementById('upload-form')
const inpFile =  document.getElementById('inp-file')
const baseEndpoint = "http://localhost:8000/api"
if (loginForm) {
    // handle this login form
    loginForm.addEventListener('submit', handleLogin)
}
if (uploadForm) {
    // handle this login form
    uploadForm.addEventListener('submit', handleFileUpload)
}


function handleLogin(event) {
    event.preventDefault()
    const loginEndpoint = `${baseEndpoint}/auth/token/`
    let loginFormData = new FormData(loginForm)
    let loginObjectData = Object.fromEntries(loginFormData)
    let bodyStr = JSON.stringify(loginObjectData)
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: bodyStr
    }
    fetch(loginEndpoint, options) //  Promise
        .then(response => {
            return response.json()
        })
        .then(authData => {
            handleAuthData(authData, getFileList)
        })
        .catch(err => {
            console.log('err', err)
        })
}

// Stores Auth Data in Javascript localStorage
function handleAuthData(authData, callback) {
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)
    localStorage.setItem('user_id',  parseJwt(authData.access)['user_id'])
    getUser()
    if (callback) {
        callback()
    }
}

// Get File List from API endpoint
function getFileList() {
    const endpoint = `${baseEndpoint}/files/`
    const options = getFetchOptions()
    fetch(endpoint, options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            const validData = isTokenNotValid(data)
            if (validData) {
                writeToContainer(data)
            }

        })
}

// Get User information from API endpoint
function getUser() {
    const endpoint = `${baseEndpoint}/users/${localStorage.getItem('user_id')}`
    const options = getFetchOptions()
    fetch(endpoint, options)
        .then(response => {
            return response.json()
        })
        .then(data => {
            const validData = isTokenNotValid(data)
            if (validData) {
                localStorage.setItem('organization', data['organization'])
            }

        })
}

// Get download file from API endpoint
function downloadFile(fileId,fileName) {
    const endpoint = `${baseEndpoint}/files/${fileId}`
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        }
    }
    fetch(endpoint, options)
    .then((res) => { return res.blob(); })
    .then((data) => {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(data);
    a.download = fileName;
    a.click();
    });
}

// Create dynamic HTML and event handlers for file listing
function createFileListing(data,parentContainer){
    for (i in data) {
        const divContainer = document.createElement("div");
        const name = document.createElement("span");
        const linkSpan = document.createElement("span");
        const link = document.createElement("a");
        name.innerText = data[i].name
        link.innerText = "Download";
        link.href = "#";
        link.addEventListener('click',function () {
            downloadFile(data[i].id,data[i].name)
        })

        linkSpan.append(link)
        divContainer.append(name,linkSpan)
        parentContainer.append(divContainer)
    }
}

// Writes data to HTML container div
function writeToContainer(data) {
    if (contentContainer) {
        createFileListing(data,contentContainer)
    }
}

// Generic function for setting options for header request to API
function getFetchOptions(method, body, contentType) {
    return {
        method: method === null ? "GET" : method,
        headers: {
            "Content-Type": contentType ? contentType : "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        body: body ? body : null
    }
}

// Check to see if the token still still valid
function isTokenNotValid(jsonData) {
    if (jsonData.code && jsonData.code === "token_not_valid") {
        // run a refresh token fetch
        alert("Please login again")
        return false
    }
    return true
}

// Validate token through API
function validateJWTToken() {
    // fetch
    const endpoint = `${baseEndpoint}/token/verify/`
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token: localStorage.getItem('access')
        })
    }
    fetch(endpoint, options)
        .then(response => response.json())
        .then(x => {
            // refresh token
        })
}

// Upload file to backend using API endpoint
function handleFileUpload(event) {
    event.preventDefault()
    const uploadEndpoint = `${baseEndpoint}/files/`
    let uploadFormData = new FormData()
    uploadFormData.append("file", inpFile.files[0])
    uploadFormData.append("organization", localStorage.getItem('organization'))
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        body: uploadFormData
    }
    fetch(uploadEndpoint, options)
    .then(response => {
        return response.json()
    })
    .then(data => {
        const validData = isTokenNotValid(data)
        if (validData) {
            getFileList()
        }

    })

}

// Parse JWT token to get user id 
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// Get all files from backend and render them in HTML
getFileList()