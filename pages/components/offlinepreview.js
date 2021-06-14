import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import * as localForage from "localforage"
import styles from '../css/preview.module.css'

export default function Offlinepreview(props) {

    function settingSelection(){
        localForage.setItem("Selection", "categories")
        localForage.setItem("foundStatus", true)
    }

    return (
        <div className={styles.display}>
            <Link href={`/project?title=${props.id}`}><a><h1 className={styles.displaytitle}><strong>{props.project}</strong></h1></a></Link>
            <div className={styles.descriptionDiv}><strong >{props.description}</strong></div>
            <br />
            <br />
            
            <Link href={`/account?title=${props.creator}`}><a className={styles.creatorName}><strong>{props.creator}</strong></a></Link>
            <br />
            <div className={styles.tagDiv}>{props.categories && props.categories.map(category => 
                    <p onClick={settingSelection} className={styles.tags}><strong>{category}</strong></p>
            )}</div>
            <img 
                alt="offlineindicator"
                src="/offlineprojare.svg"
                className={styles.offline}
            />
        </div>
    )
}