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
                    <svg  className={styles.save} onClick={updateName} alt="edit" width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
                     <path onClick={updateName} transform="scale(.26458)" d="m14.768-0.24414-0.0078 2.6484 5.4375 0.015625 0.0078-2.6484zm-0.01172 4.1641-0.07031 22.176 5.4336 0.01758-2e-3 0.69336-0.89648-2e-3 0.89648 1.5273 0.07617-24.395zm5.3613 24.412-1.8125 0.01367-1.8145 0.0098-1.8105 0.01172c0.96842 1.3075 1.6468 2.4878 2.5352 3.6328zm-5.4375 0.03516 0.89453-1.5742-0.89062-2e-3zm0.89453-1.5742 0.91602 1.5625 0.88672-1.5586zm2.7305 1.5527 0.87695-1.543-1.7852-0.0059zm-0.92773-23.908c0.01592-1.688e-4 0.028 0.00446 0.03906 0.015625 0.0114 0.011159 0.01741 0.025093 0.01758 0.041016 1.65e-4 0.015591-0.0045 0.029618-0.01563 0.041016-0.01083 0.011394-0.02509 0.017409-0.04102 0.017578-0.01592 1.687e-4 -0.02962-0.00642-0.04102-0.017578-0.01107-0.011162-0.01546-0.023472-0.01563-0.039062-1.68e-4 -0.015923 0.0048-0.029621 0.01563-0.041016 0.01116-0.011398 0.02509-0.017409 0.04102-0.017578zm-1.4473 0.046875c0.08359-8.86e-4 0.14065 0.00278 0.16992 0.00977 0.04191 0.00984 0.07664 0.030604 0.10352 0.0625 0.02688 0.031564 0.0405 0.07071 0.04102 0.11914 5.16e-4 0.048763-0.01157 0.088974-0.03711 0.12109-0.02554 0.031788-0.06209 0.054978-0.10742 0.066406-0.03309 0.00831-0.09465 0.012709-0.18555 0.013672h-0.05273l0.0039 0.33984-0.07226 0.00195-0.0078-0.73242zm0.05859 0.070312-0.12891 0.00195 2e-3 0.24805h0.12305c0.05009-5.309e-4 0.0882-0.00447 0.11133-0.013672 0.02312-0.00953 0.03968-0.024546 0.05273-0.044922 0.01305-0.020707 0.0198-0.043149 0.01953-0.068359-2.6e-4 -0.024547-6e-3 -0.048265-0.01953-0.068359-0.01349-0.020426-0.0327-0.034576-0.05469-0.042969-0.02165-0.0084-0.05604-0.012243-0.10547-0.011719zm2.8262 0.076172c0.09222-9.774e-4 0.1649 0.032153 0.2207 0.10156 0.03967 0.049011 0.06105 0.11158 0.0625 0.18555l-0.48633 0.00586c2e-3 0.063013 0.02131 0.11424 0.06055 0.1543 0.03924 0.039727 0.08748 0.059198 0.14453 0.058594 0.02753-2.919e-4 0.05431-0.00573 0.08008-0.015625 0.0261-0.0099 0.04833-0.022947 0.06641-0.039063 0.01807-0.016116 0.03774-0.042406 0.05859-0.078125l0.05859 0.03125c-0.01884 0.03802-0.03949 0.068309-0.06445 0.091797-0.02497 0.023488-0.05455 0.04208-0.08594 0.054687-0.03139 0.012276-0.06566 0.017156-0.10547 0.017578-0.08824 9.352e-4 -0.15862-0.026793-0.20898-0.083984-0.05037-0.057524-0.0754-0.12233-0.07617-0.19531-7.27e-4 -0.068666 0.01899-0.12941 0.06055-0.18359 0.05268-0.0689 0.12528-0.10452 0.21484-0.10547zm-0.37305 0.00391c0.01924-2.039e-4 0.04048 0.00554 0.0625 0.017578l-0.03711 0.058594c-0.01466-0.00615-0.02716-0.00792-0.03711-0.00781-0.02322 2.461e-4 -0.04505 0.00983-0.06641 0.029297-0.02136 0.019137-0.03797 0.047633-0.04883 0.087891-0.0083 0.030941-0.01076 0.093623-0.0098 0.1875l2e-3 0.18359h-0.07227l-0.0059-0.54102h0.07227v0.078125c0.0209-0.031407 0.04302-0.054804 0.06641-0.070312 0.02339-0.01584 0.04868-0.023167 0.07422-0.023437zm-0.62695 0.00586c0.04445-4.711e-4 0.08507 0.00882 0.12109 0.027344 0.03636 0.018525 0.0681 0.046457 0.0957 0.083984l-2e-3 -0.099609h0.07031l0.0059 0.54102h-0.07031v-0.091797c-0.02882 0.035803-0.06136 0.061778-0.09766 0.080078-0.03597 0.018296-0.07602 0.02884-0.11914 0.029297-0.07663 8.122e-4 -0.14228-0.027211-0.19726-0.082031-0.05466-0.055156-0.08314-0.12156-0.08398-0.20117-8.26e-4 -0.077954 0.02593-0.14519 0.08008-0.20117 0.05415-0.055977 0.12031-0.085122 0.19726-0.085937zm-0.87305 0.00977c0.08326-8.825e-4 0.15166 0.028098 0.20703 0.087891 0.05034 0.054538 0.07733 0.12001 0.07812 0.19531 8.02e-4 0.075632-0.02598 0.14194-0.07812 0.19922-0.05181 0.056948-0.11857 0.087015-0.20117 0.087891-0.08293 8.79e-4 -0.15174-0.028151-0.20508-0.083984-0.05301-0.056169-0.07928-0.12163-0.08008-0.19727-7.94e-4 -0.074969 0.02309-0.13972 0.07227-0.19531 0.05409-0.061285 0.12344-0.092864 0.20703-0.09375zm-0.37695 0.00391c0.01924-2.039e-4 0.04048 0.00554 0.0625 0.017578l-0.03711 0.058594c-0.01466-0.00615-0.02716-0.00792-0.03711-0.00781-0.02322 2.462e-4 -0.04505 0.00983-0.06641 0.029297-0.02136 0.019137-0.03797 0.049586-0.04883 0.089844-0.0083 0.030941-0.01076 0.09167-0.0098 0.18555l2e-3 0.18359-0.07227 0.00195-0.0059-0.54297h0.07227v0.080066c0.0209-0.031407 0.04302-0.056757 0.06641-0.072266 0.02339-0.015841 0.04868-0.023167 0.07422-0.023437zm0.7793 0.00586h0.07031l0.0078 0.62305c4.82e-4 0.045446-0.0071 0.076914-0.02344 0.097656-0.01603 0.021071-0.03983 0.032901-0.06836 0.033203-0.02355 2.496e-4 -0.05044-0.00466-0.08008-0.015625v-0.0625c0.01868 0.00942 0.03585 0.01383 0.05078 0.013672 0.01891-2.004e-4 0.03189-0.0097 0.04102-0.025391 0.0055-0.010011 0.0081-0.029033 0.0078-0.060547zm1.4727 0.037109c-0.05307 5.626e-4 -0.09893 0.018163-0.13672 0.052734-0.0276 0.025174-0.04876 0.063372-0.0625 0.11328l0.40234-0.00586c-0.0097-0.037054-0.02287-0.065855-0.04102-0.087891-0.01782-0.022039-0.04098-0.039443-0.07031-0.052734s-0.05962-0.019872-0.0918-0.019531zm-0.99609 0.011719c-0.03881 4.113e-4 -0.07479 0.00971-0.10742 0.029297-0.03264 0.019256-0.05697 0.045372-0.07617 0.080078-0.01887 0.034703-0.0297 0.072849-0.0293 0.11133 4.04e-4 0.038148 0.01131 0.074752 0.03125 0.10938s0.04703 0.060855 0.08008 0.080078c0.03338 0.018888 0.06765 0.027745 0.10547 0.027344 0.03815-4.044e-4 0.07541-0.0097 0.10938-0.029297 0.03396-0.019602 0.06023-0.047045 0.07813-0.080078 0.01823-0.033037 0.02583-0.070195 0.02539-0.11133-6.64e-4 -0.062695-0.02059-0.11456-0.0625-0.15625-0.04158-0.041692-0.09392-0.061187-0.1543-0.060547zm-0.87891 0.00977c-0.05772 6.118e-4 -0.10547 0.023175-0.14648 0.066406-0.04101 0.043231-0.06119 0.093592-0.06055 0.1543 4.15e-4 0.039143 0.01003 0.07574 0.0293 0.10938s0.0438 0.05989 0.07617 0.078125c0.03237 0.017904 0.06894 0.027752 0.10742 0.027344 0.03848-4.079e-4 0.07349-0.010711 0.10547-0.029297 0.03198-0.018917 0.05762-0.046042 0.07617-0.080078s0.02776-0.070232 0.02734-0.10938c-6.43e-4 -0.060705-0.0222-0.11195-0.06445-0.1543-0.04192-0.042352-0.093-0.063108-0.15039-0.0625z" fill-opacity=".84516"/>
                     <path onClick={updateName} d="m2.2914 7.0503 0.95504-0.35086 0.20811 0.99594-1.1632-0.64508" fill="none"/>
                    </svg>
                    {/* <img alt="edit" src="/pencilprojare.svg" className={styles.save} onClick={updateName}/> */}
                        
                </div>
                <br />
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