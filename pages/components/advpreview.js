import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import * as localForage from "localforage"
import {useSelector, useDispatch} from 'react-redux'
import {setLoadingCondition} from '../../actions'
import styles from '../css/preview.module.css'

export default function Advpreview(props) {

    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()

    function settingSelection(){
        localForage.setItem("Selection", "categories")
        localForage.setItem("foundStatus", true)
    }

    return (
        <div className={styles.display}>
            <Link href={`/project?title=${props.id}`}><h1 onClick={() => dispatch(setLoadingCondition())} className={styles.displaytitle}><strong>{props.project}</strong></h1></Link>
            <div className={styles.descriptionDiv}><strong >{props.description}</strong></div>
            <br />
            <br />
            
            <Link href={`/account?title=${props.creator}`}><strong onClick={() => dispatch(setLoadingCondition())} className={styles.creatorName}>{props.creator}</strong></Link>
            <br />
            <div className={styles.tagDiv}>{props.categories && props.categories.map(category =>                 
                <Link href={`/found?title=${category}`}>
                    <p onClick={settingSelection} className={styles.tags}><strong>{category}</strong></p>
                </Link>
            )}</div>
            <div className={styles.projectFooter}>
                <img 
                    alt="alt"
                    name={props.project} 
                    src="/delete.svg" 
                    className={styles.delete} 
                    onClick={props.delete}
                    id={props.id}
                />
                <Link href={`/update?title=${props.id}`}>
                    <img 
                        alt="edit"
                        id={props.id} 
                        title={props.description} 
                        name={props.project} 
                        className={styles.edit} 
                        src='/edit.svg' 
                    />
                </Link>
            </div>
        </div>
    )
}