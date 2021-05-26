import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Navbar from './navbar'
import styles from './css/edit.module.css'
import * as localForage from "localforage"
import { LinearProgress } from '@material-ui/core'
import dynamic from 'next/dynamic'

const CodeMirror = dynamic(() => {
    import('codemirror/mode/xml/xml')
    import('codemirror/mode/javascript/javascript')
    import('codemirror/mode/css/css')
    import('codemirror/mode/markdown/markdown')
    return import('react-codemirror')
}, {ssr: false})

export default function Update({projectId}){

    const [yourKey, setYourKey] = useState("")
    const [receivedKey, setReceivedKey] = useState("")
    const [projectData, setProjectData] = useState({})
    const [creator, setCreator] = useState("")
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState([])
    const [link, setLink] = useState("")
    const [linkList, setLinkList] = useState([])
    const [goal, setGoal] = useState("")
    const [roadmap, setRoadmap] = useState([])
    const [change, setChange] = useState("")
    const [changeLog, setChangeLog] = useState([])
    const [updateList, setUpdateList] = useState([])
    const [version, setVersion] = useState("")
    const [versionButtonStatus, setVersionButtonStatus] = useState(false)
    const [devLog, setDevLog] = useState('Create a devlog using markdown')

    const router = useRouter()

    async function getInfo(){
        let savedKey = await localForage.getItem("yourKey").then(cred => cred)
        setYourKey(savedKey)
        let res = await fetch('api/getSingleProject', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: projectId})
        })
        let data = await res.json()
        setProjectData(data)
        setCreator(data.Creator)
        setCategories(data.Categories)
        setLinkList(data.Links)
        setRoadmap(data.Roadmap)
        setUpdateList(data.Update)
        setDevLog(data.Devlog)

        console.log('changeLog: ', data.Changes)

        let userRes = await fetch('api/checkUser', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: data.Creator})
        })
        let userData = await userRes.json()
        setReceivedKey(userData.password)
    }

    useEffect(() => {
        getInfo()
    }, [])

    function settingData(event){
        const name = event.target.name
        console.log(event.target.name)
        const value = event.target.value
        setProjectData((current) => ({...current, [name]: value}))
    }

    function settingCategory(event){
        setCategory(event.target.value)
    }

    function settingCategories(){
        setCategories(prev => {return [...prev, category]})
        setCategory("")
    }

    function removeCategory(id){
        setCategories(prev => {
            return prev.filter((categories, index) => {return index !== id})
        })
    }

    function settingGoal(event){
        setGoal(event.target.value)
    }

    function settingRoadmap(){
        setRoadmap(current => {return [...current, goal]})
        setGoal("")
    }

    function removeGoal(id){
        setRoadmap(prev => {
            return prev.filter((roadmap, index) => {return index !== id})
        })
    }

    function settingLink(event){
        setLink(event.target.value)
    }

    function settingLinkList(){
        setLinkList(current => {return [...current, link]})
        setLink("")
    }

    function removeLink(id){
        setLinkList(prev => {
            return prev.filter((linkList, index) => {return index !== id})
        })
    }

    function settingChange(event){
        setChange(event.target.value)
    }

    function settingChangeLog(){
        setChangeLog(current => {return [...current, change]})
        setChange("")
    }

    function removeChange(id){
        setChangeLog(prev => {
            return prev.filter((changeLog, index) => {return index !== id})
        })
    }

    function removeUpdate(id){
        setUpdateList(prev => {
            return prev.filter((changeLog, index) => {return index !== id})
        })
    }

    function settingVersion(event){
        setVersion(event.target.value)
    }

    function checkVersionButtonStatus(){
        setVersionButtonStatus(true)
    }

    async function addData(event){
        projectData.Categories = categories
        projectData.Roadmap = roadmap
        projectData.Links = linkList
        version.length > 0 && updateList.push({
            Version: version,
            Changes: changeLog
        })
        projectData.Update = updateList
        projectData.Creator = creator;
        projectData.Devlog = devLog;
        
        let res = await fetch('api/updateSingleProject', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                id: projectId,
                projectData: projectData
            })
        })
        let data = await res.json()
        console.log("updated Project: ", data)
        router.push(`/project?title=${projectId}`)
    }

    var versionList 
    updateList ? versionList = updateList.map(update => update.Version) : versionList = []
    var fullChangeLog 
    updateList ? fullChangeLog = updateList.map(update => update.Changes) : fullChangeLog = []

    return(
        <>
        <Navbar />
        {receivedKey === "" && <LinearProgress />}
        {yourKey !== receivedKey ?
            <h1>Sorry but you are not the creator. Therefore you cannot edit this project</h1>
        : 
            <div id={styles.npform}>
                    <input 
                        className={styles.newProjectItem} 
                        onChange={settingData} 
                        name="Project_Title"     
                        value={projectData.Project_Title}   
                        placeholder=" Project Title"   
                        id={styles.Project_Title}    
                    />
                    <textarea 
                        className={styles.newProjectItem} 
                        onChange={settingData} 
                        name="Description"       
                        value={projectData.Description}     
                        placeholder=" Description"     
                        id={styles.Description}      
                    />
                    {<CodeMirror
                        className="editor"
                        value={devLog}
                        name= "Devlog"
                        options={{
                          theme: 'mdn-like',
                          lineNumbers: true,
                          mode: 'markdown'
                        }}
                        onChange={devLog => setDevLog(devLog)}
                    />}
                    <input 
                        className={styles.newProjectItem} 
                        onChange={settingData} 
                        name="Repository"       
                        value={projectData.Repository}     
                        placeholder=" Repository"     
                        id={styles.Repository}
                    />
                    <div>
                        <input
                            className={styles.newProjectItem} 
                            onChange={settingCategory} 
                            name="Categories"        
                            value={category}      
                            placeholder="Categories"      
                            id={styles.Categories}
                        />
                        <button 
                            onClick={settingCategories} 
                            id={styles.addCategory} 
                            type="submit"
                        >Add Category
                        </button>
                        <div 
                            className={styles.tagsDiv}
                        >   
                            {categories.map((current, index) => 
                            <p
                                onClick={() => removeCategory(index)}
                                className={styles.tags}
                            >
                                <strong>{current}</strong>
                            </p>)}
                        </div>
                    </div>
                    <br />
                    <div>
                        <input
                            className={styles.newProjectItem} 
                            onChange={settingLink} 
                            name="Link"        
                            value={link}      
                            placeholder="Link"      
                            id={styles.Repository}       
                        />
                        <button 
                            onClick={settingLinkList} 
                            id={styles.addCategory} 
                            type="submit"
                        >Add Link
                        </button>
                        <div 
                            className={styles.tagsDiv}
                        >   
                            {linkList.map((current, index) => 
                            <p 
                                onClick={() => removeLink(index)} 
                                className={styles.tags}
                            >
                                <strong>{current}</strong>
                            </p>)}
                        </div>
                    </div>
                    <br />
                    <input 
                        className={styles.newProjectItem} 
                        onChange={settingGoal} 
                        name="Roadmap"           
                        value={goal}         
                        placeholder="Roadmap"         
                        id={styles.Categories}
                    />
                    <button 
                        onClick={settingRoadmap} 
                        id={styles.addCategory} 
                        type="submit"
                    >Add Goal
                    </button>
                        <div 
                            className={styles.tagsDiv}
                        >
                            {roadmap.map((current, index) => 
                                <p 
                                    onClick={() => removeGoal(index)} 
                                    className={styles.tags}
                                >
                                    <strong>{current}</strong>
                                </p>)}
                        </div>
                        <button onClick={checkVersionButtonStatus} id={styles.addUpdate} type="submit">Add Version</button>
                        {versionButtonStatus === true && (
                            <div 
                                className={styles.versionDiv}
                            >
                                <input 
                                    className={styles.newProjectItem}
                                    onChange={settingVersion} 
                                    name="Version"       
                                    value={version}     
                                    placeholder=" Version #"     
                                    id={styles.Version_num}      
                                />
                                <textarea 
                                    className={styles.newProjectItem} 
                                    onChange={settingChange} 
                                    name="Changes"           
                                    value={change}         
                                    placeholder=" Changes"         
                                    id={styles.Changes}          
                                />
                                <button 
                                    onClick={settingChangeLog} 
                                    id={styles.addCategory} 
                                    type="submit"
                                >Add Change</button>
                                <div 
                                    className={styles.tagsDiv}
                                >
                                    {changeLog.map((current, index) => 
                                        <p 
                                            onClick={() => removeChange(index)} 
                                            className={styles.tags}
                                        >
                                            <strong>{current}</strong>
                                        </p>)}
                                </div>
                            </div>

                        )}
                        <div className={styles.updateList}>
                            {updateList && updateList.map((current, index) => {return (
                                <div className={styles.update}>
                                    <img 
                                        alt="delete"
                                        src="/trashprojare.svg"
                                        className={styles.delete}
                                        onClick={() => removeUpdate(index)}
                                    />
                                    <h2>Version {current.Version}</h2>
                                    <h3 className={styles.changelogLabel}>Changelog</h3>
                                    <br />
                                    {fullChangeLog[index].map(one => 
                                        <p className={styles.tags}><strong>{one}</strong></p>)
                                    }
                                </div>
                            )})}
                        </div>
                        
                    <button 
                                onClick={addData} 
                                id={styles.submit} 
                                type="submit"
                    >Save</button>
                </div>
        }
        </>

    )
}

export async function getServerSideProps(context){
    return {props: {
        projectId: context.query.title
    }}
}