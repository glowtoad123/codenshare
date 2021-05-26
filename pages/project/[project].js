import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../navbar'
import Link from 'next/link'
import {useSelector, useDispatch} from 'react-redux'
import styles from '../css/project.module.css'
import * as localForage from "localforage"
import faunadb, { query as q } from "faunadb"
import { LinearProgress } from '@material-ui/core'
import hljs from 'highlight.js'
import 'markdown-it'
import MarkdownIt from 'markdown-it'
import { setLoadingCondition } from '../../actions'

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

            const userRes = await fetch('../api/checkUser', {
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
        const res = await fetch("../api/deleteProject", {
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
                        <svg  id={styles.svg} alt="edit" width="32" height="32" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                         <path transform="scale(.26458)" d="m14.768-0.24414-0.0078 2.6484 5.4375 0.015625 0.0078-2.6484zm-0.01172 4.1641-0.07031 22.176 5.4336 0.01758-2e-3 0.69336-0.89648-2e-3 0.89648 1.5273 0.07617-24.395zm5.3613 24.412-1.8125 0.01367-1.8145 0.0098-1.8105 0.01172c0.96842 1.3075 1.6468 2.4878 2.5352 3.6328zm-5.4375 0.03516 0.89453-1.5742-0.89062-2e-3zm0.89453-1.5742 0.91602 1.5625 0.88672-1.5586zm2.7305 1.5527 0.87695-1.543-1.7852-0.0059zm-0.92773-23.908c0.01592-1.688e-4 0.028 0.00446 0.03906 0.015625 0.0114 0.011159 0.01741 0.025093 0.01758 0.041016 1.65e-4 0.015591-0.0045 0.029618-0.01563 0.041016-0.01083 0.011394-0.02509 0.017409-0.04102 0.017578-0.01592 1.687e-4 -0.02962-0.00642-0.04102-0.017578-0.01107-0.011162-0.01546-0.023472-0.01563-0.039062-1.68e-4 -0.015923 0.0048-0.029621 0.01563-0.041016 0.01116-0.011398 0.02509-0.017409 0.04102-0.017578zm-1.4473 0.046875c0.08359-8.86e-4 0.14065 0.00278 0.16992 0.00977 0.04191 0.00984 0.07664 0.030604 0.10352 0.0625 0.02688 0.031564 0.0405 0.07071 0.04102 0.11914 5.16e-4 0.048763-0.01157 0.088974-0.03711 0.12109-0.02554 0.031788-0.06209 0.054978-0.10742 0.066406-0.03309 0.00831-0.09465 0.012709-0.18555 0.013672h-0.05273l0.0039 0.33984-0.07226 0.00195-0.0078-0.73242zm0.05859 0.070312-0.12891 0.00195 2e-3 0.24805h0.12305c0.05009-5.309e-4 0.0882-0.00447 0.11133-0.013672 0.02312-0.00953 0.03968-0.024546 0.05273-0.044922 0.01305-0.020707 0.0198-0.043149 0.01953-0.068359-2.6e-4 -0.024547-6e-3 -0.048265-0.01953-0.068359-0.01349-0.020426-0.0327-0.034576-0.05469-0.042969-0.02165-0.0084-0.05604-0.012243-0.10547-0.011719zm2.8262 0.076172c0.09222-9.774e-4 0.1649 0.032153 0.2207 0.10156 0.03967 0.049011 0.06105 0.11158 0.0625 0.18555l-0.48633 0.00586c2e-3 0.063013 0.02131 0.11424 0.06055 0.1543 0.03924 0.039727 0.08748 0.059198 0.14453 0.058594 0.02753-2.919e-4 0.05431-0.00573 0.08008-0.015625 0.0261-0.0099 0.04833-0.022947 0.06641-0.039063 0.01807-0.016116 0.03774-0.042406 0.05859-0.078125l0.05859 0.03125c-0.01884 0.03802-0.03949 0.068309-0.06445 0.091797-0.02497 0.023488-0.05455 0.04208-0.08594 0.054687-0.03139 0.012276-0.06566 0.017156-0.10547 0.017578-0.08824 9.352e-4 -0.15862-0.026793-0.20898-0.083984-0.05037-0.057524-0.0754-0.12233-0.07617-0.19531-7.27e-4 -0.068666 0.01899-0.12941 0.06055-0.18359 0.05268-0.0689 0.12528-0.10452 0.21484-0.10547zm-0.37305 0.00391c0.01924-2.039e-4 0.04048 0.00554 0.0625 0.017578l-0.03711 0.058594c-0.01466-0.00615-0.02716-0.00792-0.03711-0.00781-0.02322 2.461e-4 -0.04505 0.00983-0.06641 0.029297-0.02136 0.019137-0.03797 0.047633-0.04883 0.087891-0.0083 0.030941-0.01076 0.093623-0.0098 0.1875l2e-3 0.18359h-0.07227l-0.0059-0.54102h0.07227v0.078125c0.0209-0.031407 0.04302-0.054804 0.06641-0.070312 0.02339-0.01584 0.04868-0.023167 0.07422-0.023437zm-0.62695 0.00586c0.04445-4.711e-4 0.08507 0.00882 0.12109 0.027344 0.03636 0.018525 0.0681 0.046457 0.0957 0.083984l-2e-3 -0.099609h0.07031l0.0059 0.54102h-0.07031v-0.091797c-0.02882 0.035803-0.06136 0.061778-0.09766 0.080078-0.03597 0.018296-0.07602 0.02884-0.11914 0.029297-0.07663 8.122e-4 -0.14228-0.027211-0.19726-0.082031-0.05466-0.055156-0.08314-0.12156-0.08398-0.20117-8.26e-4 -0.077954 0.02593-0.14519 0.08008-0.20117 0.05415-0.055977 0.12031-0.085122 0.19726-0.085937zm-0.87305 0.00977c0.08326-8.825e-4 0.15166 0.028098 0.20703 0.087891 0.05034 0.054538 0.07733 0.12001 0.07812 0.19531 8.02e-4 0.075632-0.02598 0.14194-0.07812 0.19922-0.05181 0.056948-0.11857 0.087015-0.20117 0.087891-0.08293 8.79e-4 -0.15174-0.028151-0.20508-0.083984-0.05301-0.056169-0.07928-0.12163-0.08008-0.19727-7.94e-4 -0.074969 0.02309-0.13972 0.07227-0.19531 0.05409-0.061285 0.12344-0.092864 0.20703-0.09375zm-0.37695 0.00391c0.01924-2.039e-4 0.04048 0.00554 0.0625 0.017578l-0.03711 0.058594c-0.01466-0.00615-0.02716-0.00792-0.03711-0.00781-0.02322 2.462e-4 -0.04505 0.00983-0.06641 0.029297-0.02136 0.019137-0.03797 0.049586-0.04883 0.089844-0.0083 0.030941-0.01076 0.09167-0.0098 0.18555l2e-3 0.18359-0.07227 0.00195-0.0059-0.54297h0.07227v0.080066c0.0209-0.031407 0.04302-0.056757 0.06641-0.072266 0.02339-0.015841 0.04868-0.023167 0.07422-0.023437zm0.7793 0.00586h0.07031l0.0078 0.62305c4.82e-4 0.045446-0.0071 0.076914-0.02344 0.097656-0.01603 0.021071-0.03983 0.032901-0.06836 0.033203-0.02355 2.496e-4 -0.05044-0.00466-0.08008-0.015625v-0.0625c0.01868 0.00942 0.03585 0.01383 0.05078 0.013672 0.01891-2.004e-4 0.03189-0.0097 0.04102-0.025391 0.0055-0.010011 0.0081-0.029033 0.0078-0.060547zm1.4727 0.037109c-0.05307 5.626e-4 -0.09893 0.018163-0.13672 0.052734-0.0276 0.025174-0.04876 0.063372-0.0625 0.11328l0.40234-0.00586c-0.0097-0.037054-0.02287-0.065855-0.04102-0.087891-0.01782-0.022039-0.04098-0.039443-0.07031-0.052734s-0.05962-0.019872-0.0918-0.019531zm-0.99609 0.011719c-0.03881 4.113e-4 -0.07479 0.00971-0.10742 0.029297-0.03264 0.019256-0.05697 0.045372-0.07617 0.080078-0.01887 0.034703-0.0297 0.072849-0.0293 0.11133 4.04e-4 0.038148 0.01131 0.074752 0.03125 0.10938s0.04703 0.060855 0.08008 0.080078c0.03338 0.018888 0.06765 0.027745 0.10547 0.027344 0.03815-4.044e-4 0.07541-0.0097 0.10938-0.029297 0.03396-0.019602 0.06023-0.047045 0.07813-0.080078 0.01823-0.033037 0.02583-0.070195 0.02539-0.11133-6.64e-4 -0.062695-0.02059-0.11456-0.0625-0.15625-0.04158-0.041692-0.09392-0.061187-0.1543-0.060547zm-0.87891 0.00977c-0.05772 6.118e-4 -0.10547 0.023175-0.14648 0.066406-0.04101 0.043231-0.06119 0.093592-0.06055 0.1543 4.15e-4 0.039143 0.01003 0.07574 0.0293 0.10938s0.0438 0.05989 0.07617 0.078125c0.03237 0.017904 0.06894 0.027752 0.10742 0.027344 0.03848-4.079e-4 0.07349-0.010711 0.10547-0.029297 0.03198-0.018917 0.05762-0.046042 0.07617-0.080078s0.02776-0.070232 0.02734-0.10938c-6.43e-4 -0.060705-0.0222-0.11195-0.06445-0.1543-0.04192-0.042352-0.093-0.063108-0.15039-0.0625z" fill-opacity=".84516"/>
                         <path d="m2.2914 7.0503 0.95504-0.35086 0.20811 0.99594-1.1632-0.64508" fill="none"/>
                        </svg>
                        {/* <svg id={styles.svg} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg> */}
                    </a></Link>
                        {/* <svg id={styles.svg} onClick={deleteProject} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path onClick={deleteProject} fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                        </svg> */}
                        <svg id={styles.svg} onClick={deleteProject} width="32" height="32" fill="currentColor" version="1.1" viewBox="0 0 8.4667 8.4667" xmlns="http://www.w3.org/2000/svg">
                         <path onClick={deleteProject} transform="scale(.26458)" d="m16.402 2.457c-5.7302 0.072325-6.4174 4.0425-6.5 4.875h13.627c-0.0871-0.83855-0.80804-4.8214-6.8125-4.875-0.1066-9.521e-4 -0.21116-0.0012997-0.31445 0zm0.2832 3.5254h0.095703v0.087891h-0.095703v-0.087891zm-1.5664 0.0039062h0.18359c0.040296 0 0.073597 0.0028493 0.10156 0.0097657 0.027966 0.0066156 0.052567 0.018769 0.074219 0.033203 0.02556 0.01714 0.044761 0.03694 0.058593 0.0625 0.014134 0.02556 0.021485 0.058564 0.021485 0.097656 0 0.02977-0.0051 0.056471-0.015625 0.082031-0.010224 0.02526-0.024325 0.047762-0.042969 0.066406-0.023155 0.023155-0.050457 0.041007-0.082031 0.052734-0.031575 0.011427-0.071027 0.017578-0.11914 0.017578h-0.089844v0.25h-0.089843v-0.67188zm0.089843 0.076172v0.26953h0.076172c0.036086 1e-7 0.065338-0.0034506 0.087891-0.0097656 0.022553-0.0066156 0.040554-0.017117 0.054687-0.03125 0.014134-0.014434 0.023584-0.028984 0.029297-0.044922 0.006014-0.015938 0.009766-0.034841 0.009766-0.054688 0-0.023155-0.005553-0.043406-0.013672-0.060547-0.008119-0.017141-0.018617-0.03019-0.035156-0.041016-0.014434-0.0093221-0.032137-0.015622-0.050781-0.019531-0.018344-0.00421-0.042046-0.0078125-0.070313-0.0078125h-0.087891zm1.0527 0.078125c0.070667 0 0.12587 0.024453 0.16797 0.072266 0.042099 0.047512 0.064453 0.11127 0.064453 0.19336s-0.022354 0.1478-0.064453 0.19531c-0.0421 0.047512-0.097302 0.070312-0.16797 0.070312-0.071269 0-0.12782-0.0228-0.16992-0.070312-0.041799-0.047512-0.0625-0.11322-0.0625-0.19531s0.020701-0.14585 0.0625-0.19336c0.042099-0.047813 0.098653-0.072266 0.16992-0.072266zm1.8398 0c0.067961 0 0.11956 0.0189 0.15625 0.058594 0.036988 0.039694 0.056641 0.096849 0.056641 0.16992v0.044922h-0.37109c0 0.030973 0.00435 0.058876 0.013672 0.082031 0.009322 0.022854 0.020871 0.041906 0.03711 0.056641 0.015637 0.014434 0.03529 0.025986 0.05664 0.033203 0.021651 0.0072171 0.044452 0.0097656 0.070313 0.0097656 0.034281 0 0.068934-0.0059992 0.10352-0.019531 0.034883-0.013833 0.059484-0.027784 0.074219-0.041016h0.00586v0.091797c-0.028568 0.012028-0.058121 0.023131-0.087891 0.03125-0.029771 0.0081192-0.060973 0.011719-0.09375 0.011719-0.083598 0-0.1484-0.023253-0.19531-0.068359-0.046911-0.045407-0.072265-0.11006-0.072265-0.19336 0-0.082395 0.023553-0.1469 0.068359-0.19531 0.045107-0.048414 0.10436-0.072266 0.17773-0.072266zm-0.98633 0.0019531c0.035484 0 0.065635 0.0017983 0.091797 0.0078125 0.026463 0.0057135 0.049114 0.017117 0.06836 0.03125 0.018944 0.013833 0.034998 0.030782 0.044921 0.052734 0.009924 0.021952 0.013672 0.049554 0.013672 0.082031v0.3418h-0.083984v-0.054688c-0.007518 0.0051121-0.018319 0.014116-0.03125 0.023438-0.01263 0.0090214-0.025081 0.016072-0.037109 0.021484-0.014134 0.0069164-0.028532 0.011114-0.046875 0.015625-0.018344 0.0048114-0.041748 0.0078125-0.066407 0.0078125-0.045407 0-0.083659-0.014851-0.11523-0.044922s-0.046875-0.068624-0.046875-0.11523c0-0.03819 0.009152-0.068342 0.025391-0.091797 0.016539-0.023756 0.03994-0.043109 0.070312-0.056641 0.030673-0.013532 0.066373-0.022532 0.10938-0.027344s0.089355-0.0073599 0.13867-0.0097656v-0.013672c0-0.019246-0.002849-0.036198-0.009766-0.048828-0.006615-0.01263-0.016667-0.02208-0.029296-0.029297-0.012029-0.0069164-0.026129-0.011266-0.042969-0.013672s-0.034391-0.0039062-0.052735-0.0039062c-0.022252 0-0.046854 0.0037514-0.074218 0.0097656-0.027365 0.0057135-0.056769 0.014264-0.085938 0.025391h-0.003906v-0.085938c0.016539-0.0045106 0.040992-0.010212 0.072266-0.015625 0.031273-0.0054128 0.061425-0.0078125 0.091796-0.0078125zm-1.4453 0.011719h0.085937v0.074219c0.03368-0.027064 0.062331-0.045514 0.087891-0.056641 0.025861-0.011427 0.051362-0.017578 0.078125-0.017578 0.014735 0 0.026587 0.001051 0.033203 0.0019531 0.006616 6.014e-4 0.016066 0.0018013 0.029297 0.0039062v0.085938h-0.003906c-0.01263-0.0030072-0.025081-0.0046566-0.03711-0.0058594-0.011727-0.0015036-0.02673-0.0019532-0.042968-0.0019532-0.026162 0-0.049862 0.0058504-0.074219 0.017578-0.024358 0.011427-0.047759 0.026578-0.070313 0.044922v0.35742h-0.085937v-0.50391zm0.91602 0h0.19141v0.51562c0 0.058939-0.014851 0.10469-0.044922 0.13477s-0.070574 0.044922-0.12109 0.044922c-0.012028 0-0.028981-0.0015006-0.048828-0.0039063-0.019546-0.0024057-0.035597-0.0061571-0.048828-0.0097656v-0.080078h0.003906c0.00842 0.0033078 0.021023 0.0075088 0.035156 0.011719 0.014435 0.00421 0.027484 0.0058594 0.041016 0.0058594 0.021651 0 0.039503-0.0037514 0.052734-0.0097656 0.013232-0.0060142 0.022682-0.015315 0.029297-0.027344 0.006616-0.012028 0.011868-0.025828 0.013672-0.042969 0.002105-0.01684 0.001953-0.038142 0.001953-0.0625v-0.40625h-0.10547v-0.070312zm0.91211 0h0.083984v0.074219c0.03368-0.027064 0.064284-0.045514 0.089844-0.056641 0.025861-0.011427 0.051362-0.017578 0.078125-0.017578 0.014735 0 0.026587 0.001051 0.033203 0.0019531 0.006616 6.014e-4 0.016066 0.0018013 0.029297 0.0039062v0.085938h-0.003906c-0.01263-0.0030072-0.025081-0.0046566-0.03711-0.0058594-0.011727-0.0015036-0.02673-0.0019532-0.042968-0.0019532-0.026162 0-0.051815 0.0058504-0.076172 0.017578-0.024358 0.011427-0.047759 0.026578-0.070313 0.044922v0.35742h-0.083984v-0.50391zm0.59961 0.056641c-0.045407 0-0.082311 0.012299-0.10938 0.039062-0.026763 0.026763-0.041313 0.059916-0.044922 0.099609h0.28711c-3.01e-4 -0.044505-0.010951-0.079158-0.033203-0.10352-0.021952-0.024358-0.054503-0.035156-0.09961-0.035156zm-1.8359 0.0019531c-0.046009 0-0.081862 0.016953-0.10742 0.048828-0.02526 0.031575-0.039063 0.079277-0.039063 0.14453 0 0.063149 0.013502 0.11175 0.039063 0.14453 0.02556 0.032477 0.061714 0.048828 0.10742 0.048828 0.045106 0 0.079908-0.016652 0.10547-0.048828 0.025861-0.032477 0.039062-0.08078 0.039062-0.14453 0-0.065254-0.013502-0.11296-0.039062-0.14453-0.025561-0.031875-0.060062-0.048828-0.10547-0.048828zm0.98828 0.18164c-0.025861 0.0015036-0.056614 0.0028523-0.091797 0.0058594-0.034882 0.0030071-0.061583 0.0079584-0.082031 0.013672-0.024358 0.0069164-0.045511 0.016515-0.060547 0.03125-0.015036 0.014434-0.021484 0.034986-0.021484 0.060547 0 0.028868 0.007949 0.051671 0.02539 0.066406 0.017441 0.014434 0.044294 0.021484 0.080078 0.021484 0.029771 0 0.057373-0.0061511 0.082032-0.017578 0.024658-0.011728 0.047309-0.02673 0.068359-0.042969v-0.13867zm-7.3594 3.8633v18.861h13.652v-18.861h-13.652zm3.9375 2.7461a1.7772 1.7772 0 0 1 1.7773 1.7773 1.7772 1.7772 0 0 1-1.7773 1.7773 1.7772 1.7772 0 0 1-1.7773-1.7773 1.7772 1.7772 0 0 1 1.7773-1.7773zm6.6875 0.97656c0.099108 0.006528 0.19145 0.038285 0.26953 0.097656 0.27764 0.2111 0.26755 0.68822-0.021484 1.0684l-7.0898 9.3262c-0.28903 0.38014-0.7458 0.51578-1.0234 0.30469-0.27764-0.2111-0.2695-0.68822 0.019531-1.0684l7.0918-9.3242c0.18065-0.23759 0.42551-0.3806 0.65234-0.40234 0.034026-0.003262 0.068527-0.004129 0.10156-0.001953zm-0.44531 7a1.7772 1.7772 0 0 1 1.7773 1.7773 1.7772 1.7772 0 0 1-1.7773 1.7773 1.7772 1.7772 0 0 1-1.7773-1.7773 1.7772 1.7772 0 0 1 1.7773-1.7773z" fill="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width=".037795"/>
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
                <Link href={`/account/${projectData.Creator}`}><a onClick={(() => dispatch(setLoadingCondition()))} className={styles.creatorName}><strong>{projectData.Creator}</strong></a></Link>
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
                    context.params.project
                )
            )
        )
        return {
            props: {
                data: dbs.data,
                id: context.params.project
            }
        }
        res.status(200).json(dbs.data)
}


/* export async function getServerSideProps(context){
    
    return {props: {
        id: context.query.title
    }}
} */