import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from './navbar'
import Link from 'next/link'
import {useSelector, useDispatch} from 'react-redux'
import styles from './css/project.module.css'
import * as localForage from "localforage"
import faunadb, { query as q } from "faunadb"
import { LinearProgress } from '@material-ui/core'
import hljs from 'highlight.js'
import 'markdown-it'
import MarkdownIt from 'markdown-it'
import { setLoadingCondition } from '../actions'

export default function Project({data, id}) {

    /*     
    const [projectData, setProjectData] = useState({})
    const [linkList, setLinkList] = useState([])
    const [roadmap, setRoadmap] = useState([])
    const [Categories, setCategories] = useState([])
    const [update, setUpdate] = useState([])
    const [creator, setCreator] = useState("") */
    
    const projectData = data
    const linkList = data.Links
    const roadmap = data.roadmap
    const Categories = data.Categories
    const update = data.Update
    const creator = data.Creator
    const [receivedKey, setReceivedKey] = useState("")
    const [yourKey, setYourKey] = useState("")

    const router = useRouter()

    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()

    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

    const md = new MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre class="hljs"><code>' +
                     hljs.highlight(lang, str, true).value +
                     '</code></pre>';
            } catch (err) {console.log(err)}
          }
      
          return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        }
      });

    hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));

    async function getProject(){

        try{
            /* const res = await fetch("api/getSingleProject", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: theId})
            })
            let data = await res.json()
    
            console.log(data)
            setProjectData(data)
            setLinkList(data.Links)
            setRoadmap(data.Roadmap)
            setCategories(data.Categories)
            setUpdate(data.Update)
            setCreator(data.Creator) */

            const userRes = await fetch('api/checkUser', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: data.Creator}
                )
            })
    
            let userData = await userRes.json()
            console.log("userData", userData.password)
            setReceivedKey(userData.password)
            
            let theKey = await localForage.getItem("yourKey").then(key => key).catch(err => console.log("yourKey error:", err))
            console.log("theKey", theKey)
            setYourKey(theKey)
            console.log("yourkey:", yourKey)
        } catch(error) {
            console.log("getProjectError", error)
        }

    }

/*     async function checkUser(){

        try{
            const userRes = await fetch('api/checkUser', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: creator}
                )
            })
    
            let userData = await userRes.json()
            console.log("userData", userData.password)
            console.log("yourkey:", yourKey)
            setReceivedKey(userData.password)
        } catch(error){
            console.log("checkUserError", error)
        }
    } */

/*     async function settingYourKey(){
        try{
            let theKey = await localForage.getItem("yourKey").then(key => key).catch(err => console.log("yourKey error:", err))
            console.log("theKey", theKey)
            setYourKey(theKey)
        } catch(error) {
            console.log("settingYourKeyError", error)
        }
    } */
    
    useEffect(() => {
        getProject()
        
    }, [])
    
    /* creator && creator.length !== 0 && (settingYourKey(), checkUser())
    creator && creator.length !== 0 && console.log("creator: ", creator) */
    const changeLog = update.map(change => change.Changes)

    async function settingSelection(){
        try{
            localForage.setItem("Selection", "categories").catch(error => console.log(error))
            localForage.setItem("foundStatus", true).catch(error => console.log(error))
        } catch(error){
            console.log("settingSelectionError", error)
        }
    }

    async function deleteProject() {
        dispatch(setLoadingCondition())
        const res = await fetch("api/deleteProject", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id: id})
        })
        let data = await res.json()
        console.log(data)
        router.push("/")
    }

    


    return(
        <>
            <Head>
                <title>{projectData.Project_Title.length >= 15 && projectData.Project_Title.length <= 65 ? projectData.Project_Title :
                        projectData.Project_Title.length < 15 ? projectData.Project_Title + "| project by " + projectData.Creator :
                        projectData.Project_Title.length > 65 ? projectData.Project_Title.slice(0, 65) : projectData.Project_Title
                       }
                </title>
                <meta name="Description" content={projectData.Description.length >= 15 && projectData.Description.length <= 65 ? projectData.Description :
                        projectData.Description.length < 15 ? projectData.Description + "| project by " + projectData.Creator :
                        projectData.Description.length > 65 ? projectData.Description.slice(0, 65) : "Projare"
                } />
            </Head>
            <Navbar />
        {receivedKey && receivedKey === "" && <LinearProgress />}
        {loading && <div className="loading"><LinearProgress /></div>}
            <div className={styles.userDisplay}>
                <h1 className={styles.displaytitle}>
                    <strong>{projectData.Project_Title}</strong>
                </h1>
                <p className={styles.description}><strong>{projectData.Description}</strong></p>
                {yourKey && receivedKey && yourKey === receivedKey && projectData && <div className={styles.control}>
                    <Link href={`/update?title=${id}`}><a onClick={(() => dispatch(setLoadingCondition()))}>
                        <svg id={styles.svg} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                    </a></Link>
                        <svg id={styles.svg} onClick={deleteProject} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path onClick={deleteProject} fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                        </svg>
                </div>}
                <div className={styles.inquisite}>
                    <svg className={styles.withininquisite} id="inquisiting" width="3em" height="3em" viewBox="0 0 16 16" class="bi bi-eye-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path fill-rule="evenodd" d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                    </svg>
                    <label className={styles.withininquisite} type="text">become an inquisitor</label>
                </div>
                <br />
                <br />
                <Link href={`/account?title=${projectData.Creator}`}><a onClick={(() => dispatch(setLoadingCondition()))} className={styles.creatorName}><strong>{projectData.Creator}</strong></a></Link>
                <br />
                <a className={styles.repository} href={projectData.Repository}>{projectData.Repository}</a>
                <br />
                {linkList.length > 0 && linkList.map(each => 
                    <a 
                        className={styles.repository} 
                        href={each}>{each}
                    </a>
                ) }
                <br />
                {roadmap && roadmap.length > 0 && <div>
                    <h2 className={styles.textHead}><strong>Roadmap</strong></h2>
                    <br />
                    {roadmap.map(each => <p className={styles.goal}><strong>{each}</strong></p>)}
                    <br />
                    <br />
                    <br />
                </div>}
                <h2 className={styles.textHead}><strong>Categories</strong></h2>
                <br />
                {Categories.length > 0 && Categories.map(category => 
                    <Link href={`/found?title=${category}`}>
                        <p onClick={settingSelection} className={styles.tags}><strong>{category}</strong></p>
                    </Link>)
                }
                <br />
                {<div className={styles.updateList}>{update.length > 0 && 
                    update.map((current, index) => {return (
                        <div className={styles.update}>
                            <h2 className={styles.textHead}>Version {current.Version}</h2>
                            <br />
                            <h3 className={styles.changelogLabel}>Changelog</h3>
                            <br />
                            <div className={styles.changeDiv}>{changeLog[index].map(one => 
                                <p className={styles.change}><strong>{one}</strong></p>
                            )}</div></div>)})}
                        </div>
                }
                {projectData.Devlog && <div>
                    <div id={styles.devLog} dangerouslySetInnerHTML={{__html: md.render(projectData.Devlog, 'javascript')}}></div>
                </div>}
            </div>
            {projectData === {} && 
                <div>
                    <h2>Either it's loading or you are not connected to the internet</h2>
                </div>
            }
        </>
    )
}

export async function getServerSideProps(context){
    var client = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });
        const dbs = await client.query(
            q.Get(
                q.Ref(
                    q.Collection("Projects"), 
                    context.query.title
                )
            )
        )
        return {
            props: {
                data: dbs.data,
                id: context.query.title
            }
        }
        res.status(200).json(dbs.data)
}


/* export async function getServerSideProps(context){
    
    return {props: {
        id: context.query.title
    }}
} */