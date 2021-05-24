import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import * as localForage from "localforage"
import {useSelector, useDispatch} from 'react-redux'
import {setLoadingCondition} from '../../actions'
import styles from '../css/preview.module.css'

export default function Preview(props) {

    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()

    function settingSelection(){
        localForage.setItem("Selection", "categories")
        localForage.setItem("foundStatus", true)
    }

    return (
        <div className={styles.display}>
            <Link href={`/project/${props.id}`}><h1 onClick={() => dispatch(setLoadingCondition())} className={styles.displaytitle}><strong>{props.project}</strong></h1></Link>
            <div className={styles.descriptionDiv}><strong >{props.description}</strong></div>
            {/* <Link href={`/test?title=${props.id}`}>Test</Link> */}
            <br />
            <br />
            
            <Link href={`/account/${props.creator}`}><strong onClick={() => dispatch(setLoadingCondition())} className={styles.creatorName}>{props.creator}</strong></Link>
            <br />
            <div className={styles.tagDiv}>{props.categories && props.categories.map(category => 
                    <p onClick={settingSelection} className={styles.tags}><strong>{category}</strong></p>
            )}</div>
        </div>
    )
}