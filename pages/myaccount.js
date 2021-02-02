import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import crypto from 'crypto'
import Navbar from './navbar'
import * as localForage from "localforage"
import {useSelector} from 'react-redux'
import {setLoadingCondition} from '../actions'
import Advpreview from './components/advpreview'
import Offlinepreview from './components/offlinepreview'
import styles from './css/account.module.css'
import { LinearProgress } from '@material-ui/core'

export default function Myaccount(){

    const router = useRouter()

    const [userName, setUserName] = useState("")
    const [userId, setUserId] = useState("")
    const [yourKey, setYourKey] = useState("")
    const [receivedKey, setReceivedKey] = useState("")
    const [projectsArray, setProjectsArray] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)
    const [offlineArray, setOfflineArray] = useState([])

    const loading = useSelector(state => state.loading)


    async function retreivingSavedCredentials(){
        var savedUsername = await localForage.getItem("userName").then(cred => cred)
        var savedKey = await localForage.getItem("yourKey").then(cred => cred)
        var savedId = await localForage.getItem("userId").then(cred => cred)

        console.log("savedUsername: ", savedUsername)
        console.log("savedKey: ", savedKey)
        console.log("savedId: ", savedId)

        setUserName(savedUsername)
        setYourKey(savedKey)
        setUserId(savedId)

        const res = await fetch("api/getYourProjects", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({creator: savedUsername})
        })
        let data = await res.json()
        setProjectsArray(data)
        setNetworkStatus(true)

        let offlineData = await localForage.setItem("userProjectList", data)

        const userRes = await fetch('api/checkUser', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: savedUsername}
            )
        })

        let userData = await userRes.json()
        setReceivedKey(userData.password)
    }

    useEffect(() => {
        retreivingSavedCredentials()
    }, [])

    async function deleteProject(event){
        var confirmDeletion = confirm("Are you sure you want to delete that project?");
            if (confirmDeletion == true) {
                const res = await fetch("api/deleteProject", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({id: event.target.id})
                })
                let data = await res.json()
                retreivingSavedCredentials()
                console.log("deletedProject: ", data)
                alert("This project has been deleted")
            }
    }

    async function updateName(event){

        var changeuserName = prompt("please update your username")

        if (changeuserName !== "" && changeuserName !== null) {
            var updatePassword = prompt("please enter your old password or change your password to continue")
            if(updatePassword !== "" && updatePassword !== null) {
                const hashedPassword = updatePassword + changeuserName
                const hash = crypto.createHash('sha256')
                hash.update(hashedPassword)
                const alphaPassword = hash.digest("hex")
                console.log("alphaPassword: " + alphaPassword)
                crypto.pbkdf2(alphaPassword, 'salt', 10, 64, 'sha512', async (err, derivedKey) => {
                    if (err) throw err;
                    let userRes = await fetch("api/updateAccount", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            id: userId,
                            changedUsername: changeuserName,
                            changedPassword: derivedKey.toString('hex')
                        })
                    })
                    let userData = await userRes.json()
                    console.log("newUserData: ", userData)
                    await localForage.setItem("userName", userData.data.username)
                    await localForage.setItem("yourKey", userData.data.password)
                    await localForage.setItem("userId", userData.ref['@ref'].id)
                    projectsArray.map(async (project) => {
                            let res = await fetch("api/updateProjects", {
                                method: "POST",
                                headers: {"Content-Type": "application/json"},
                                body: JSON.stringify({
                                    id: project.ref['@ref'].id,
                                    changedUsername: changeuserName
                                })
                            })
                            let data = await res.json()
                            console.log("updated Projects: ", data)
                        }
                        )
                    retreivingSavedCredentials()
                })
            } else {
                alert("username not changed")
            }
        } else {
            alert("username not changed")
        }
    }
    

    if(!networkStatus && offlineArray && offlineArray.length === 0) async () =>{
            let offlineData = await localForage.getItem("userProjectList").then(ret => ret)
            setOfflineArray(offlineData)
    }
    console.log(offlineArray)
    console.log("networkStatus: " + networkStatus)

    return(
        <>
        <Navbar />
        {yourKey === receivedKey && networkStatus ?
            <>
                {loading && <div className="loading"><LinearProgress /></div>}
                <div className={styles.head}>
                    <h1 className={styles.displaytitle}><strong>{userName}</strong></h1>
                    <img alt="edit" src="/edit.svg" className={styles.save} onClick={updateName}/>
                        
                </div>
                {projectsArray.map((project, index) =>
                        <Advpreview 
                            id={project.ref['@ref'].id}
                            project={project.data.Project_Title}
                            description={project.data.Description}
                            creator={project.data.Creator}
                            categories={project.data.Categories}
                            delete={deleteProject}
                        />
                )}
            </>
        : !networkStatus ? 
            <>
                <div className={styles.head}>
                    <h1 className={styles.displaytitle}><strong>{userName}</strong></h1>
                </div>
                {offlineArray && offlineArray.map((project, index) =>
                        <Offlinepreview 
                            id={project.ref['@ref'].id}
                            project={project.data.Project_Title}
                            description={project.data.Description}
                            creator={project.data.Creator}
                            categories={project.data.Categories}
                            delete={deleteProject}
                        />
                )}

                { projectsArray.length === 0 && offlineArray.length === 0 && <LinearProgress />}
            </>
        :
            <h1>sorry but no hackers are allowed to change another user's data</h1>
        }
        </>
    )
}