import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import faunadb, { query as q } from "faunadb"
import Navbar from '../navbar'
import * as localForage from "localforage"
import {useSelector, useDispatch} from 'react-redux'
import {setLoadingCondition} from '../../actions'
import Preview from '../components/preview'
import styles from '../css/account.module.css'
import { LinearProgress } from '@material-ui/core'
import Head from 'next/head'

export default function Account({data, id}){

    /* const [projectsArray, setProjectsArray] = useState([]) */

    const projectsArray = JSON.parse(data)

    const router = useRouter()

    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()

    /* async function getYourProjects(){
        const res = await fetch("api/getYourProjects", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({creator: id})
        })
        let data = await res.json()

        console.log(data)
        setProjectsArray(data)
    } */

    useEffect(() => {
        /* getYourProjects() */
        localForage.getItem("userName").then(ret =>
            ret === id && router.push("/myaccount")
        )
    }, [])



    return(
        <>
            <Head>
                <title>{id} | Projare accounts</title>
            </Head>
            <Navbar />
            {loading && <div className="loading"><LinearProgress /></div>}
            <div className={styles.heading}>
                <h1 className={styles.headingText}><strong>{id}</strong></h1>
            </div>
            {projectsArray.map((project, index) =>
                <Preview 
                    id={project.ref['@ref'].id}
                    project={project.data.Project_Title}
                    description={project.data.Description}
                    creator={project.data.Creator}
                    categories={project.data.Categories}
                />)}
            {projectsArray.length === 0 && <LinearProgress />}
        </>
    )
}

export async function getServerSideProps(context){
    var client = new faunadb.Client({ secret: process.env.NEXT_FAUNA_KEY });

        const dbs = await client.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index("creatorsworks"),
                        context.params.account
                    )
                ),
                (ref) => q.Get(ref)
            )
        )

        console.log("dbs", dbs.data)

        return {
            props: {
                data: JSON.stringify(dbs.data),
                id: context.params.account
            }
        }
}

/* export async function getServerSideProps(context){
    return {props: {
        id: context.query.title
    }}
} */