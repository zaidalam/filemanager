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


function handleAuthData(authData, callback) {
    localStorage.setItem('access', authData.access)
    localStorage.setItem('refresh', authData.refresh)
    localStorage.setItem('user_id',  parseJwt(authData.access)['user_id'])
    if (callback) {
        callback()
    }
}
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
                writeToContainer(data)
            }

        })
}

function writeToContainer(data) {
    if (contentContainer) {
        contentContainer.innerHTML = "<pre>" + JSON.stringify(data, null, 4) + "</pre>"
    }
}

function getFetchOptions(method, body) {
    return {
        method: method === null ? "GET" : method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('access')}`
        },
        body: body ? body : null
    }
}

function isTokenNotValid(jsonData) {
    if (jsonData.code && jsonData.code === "token_not_valid") {
        // run a refresh token fetch
        alert("Please login again")
        return false
    }
    return true
}

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

function handleFileUpload(event) {
    event.preventDefault()
    const uploadEndpoint = `${baseEndpoint}/files/`
    let uploadFormData = new FormData()
    uploadFormData.append("file", inpFile.files[0])
    uploadFormData.append("organization", inpFile.files[0])
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
            writeToContainer(data)
        }

    })

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
getFileList()