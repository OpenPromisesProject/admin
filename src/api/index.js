import { firebase } from '@/config'
import axios from 'axios'
import {
  getSomething,
  postSomething,
  updateSomething
} from './utils'

const provider = new firebase.auth.GoogleAuthProvider()

const PROMISES_PATH = '/promises/'
const PROMISE_UPDATES_PATH = '/promiseUpdates/'
const POLITICIANS_PATH = '/politicians/'

axios.interceptors.response.use(
  function (response) {
    return response
  }, function (error) {
    if (!error.response) {
      alert('no response from API')
    }
    if (error.response.status === 401) {
      alert(`${error.response.data} [401] Try logging out then logging back in.`)
    }
    return Promise.reject(error)
  })

function googleSignIn () {
  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        const raw = result.user
        let user = {}

        user.name = raw.displayName
        user.email = raw.email
        user.photoURL = raw.photoURL

        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(idToken => {
            user.token = idToken
            localStorage.setItem('openpromises_token', idToken)
            localStorage.setItem('openpromises_email', user.email)
            localStorage.setItem('openpromises_name', user.name)
            localStorage.setItem('openpromises_photo', user.photoURL)
            resolve(user)
          })
          .catch(error => {
            reject(error)
          })
      })
      .catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

function googleLogout () {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut().then(function () {
      resolve()
    }, function (error) {
      reject(error)
    })
  })
}

const getContributor = email => getSomething(`/contributors/?email=${email}`)
const getPolitician = id => getSomething(`/politicians/${id}`)
const getPromise = id => getSomething(PROMISES_PATH + id)
const getPromiseUpdate = id => getSomething(PROMISE_UPDATES_PATH + id)

const listContributors = () => getSomething('/contributors/')

const postPromise = data => postSomething(PROMISES_PATH, data)
const postPromiseUpdate = data => postSomething(PROMISE_UPDATES_PATH, data)
const postPolitician = data => postSomething(POLITICIANS_PATH, data)

const listPoliticians = () => getSomething(POLITICIANS_PATH + 'all?orderBy=name')
const listPromises = query => getSomething(PROMISES_PATH + 'all?' + query)
const listPromiseUpdates = query => getSomething(PROMISE_UPDATES_PATH)
const listPoliticianPromises = id => getSomething(PROMISES_PATH + 'all?politician_id=' + id)

const updatePromise = data => updateSomething(`${PROMISES_PATH}${data.id}`, data)
const updatePromiseUpdate = data => updateSomething(`${PROMISE_UPDATES_PATH}${data.id}`, data)
const updatePolitician = data => updateSomething(`${POLITICIANS_PATH}${data.id}`, data)

const getGeneralStats = () => getSomething('/stats/general_stats')

export {
  googleSignIn,
  googleLogout,
  getContributor,
  getPolitician,
  listContributors,
  listPoliticians,
  postPromise,
  postPromiseUpdate,
  postPolitician,
  listPromises,
  listPromiseUpdates,
  listPoliticianPromises,
  getPromise,
  getPromiseUpdate,
  updatePromise,
  updatePromiseUpdate,
  updatePolitician,
  getGeneralStats
}
