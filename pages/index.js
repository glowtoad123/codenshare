import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import * as localForage from "localforage"
import {useSelector} from 'react-redux'
import Preview from './components/preview'
import Offlinepreview from './components/offlinepreview'
import Navbar from './navbar'
import { LinearProgress } from '@material-ui/core'

export default function Home(){
    const [projectArray, setProjectArray] =  useState([])
    const [offlineArray, setOfflineArray] = useState([])
    const [networkStatus, setNetworkStatus] = useState(false)

    const loading = useSelector(state => state.loading)

    console.log('loading', loading)
    console.log('opposite of loading', !loading)
    
    async function getProjects(){
        try {
            const res = await fetch("api/getProjects", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            })
    
            let data = await res.json()
            console.log("data: ", data)
            setProjectArray(data)
            localForage.setItem('projectList', data)
            setNetworkStatus(true)
        } catch(error) {
            console.log("error: ", error)
        }
    }

    useEffect(() => {
        getProjects()
    }, [])

    console.log("projectArray", projectArray)
    console.log("networkStatus", networkStatus)
    console.log("!networkStatus", !networkStatus)

    !networkStatus && console.log("conditioned", networkStatus)

    async function getOfflineData(){

        var data = await localForage.getItem("projectList").then(project => project).catch(error => console.log({error: error}))
        setOfflineArray(data)
        console.log("offline data", data)
        setNetworkStatus(true)
    }

    if (!networkStatus && offlineArray && offlineArray.length === 0) {
        getOfflineData()
        console.log("this is not offline")
    }
    
    
    return(
        <>
            <Head>
                <meta name="google-site-verification" content="TloKq3MlBeJNgquYIRGjnWw5v8k4DesIKBCuNUIcLJc" />
                <meta name="Description" content="this is a project that allows users to share their projects, what they used to create their projects, and the status of their projects." />
                <title>Projare</title>
            </Head>
            <Navbar />
            {projectArray && offlineArray && projectArray.length === 0 && offlineArray.length === 0 && <LinearProgress />}
            {loading && <div className="loading"><LinearProgress /></div>}
            {projectArray && projectArray.length !== 0 ? projectArray.map(
                (project, index) => <Preview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />
            ) : offlineArray && offlineArray.length !== 0 && offlineArray.map(
                (project, index) => <Offlinepreview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />)
            }
            <p>Favicon made by <a style={{color: '#2F3E46'}} href="https://www.fiverr.com/pesendesen">Pesendesen</a></p>
        </>
    )
}