import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import * as localForage from "localforage"
import {useSelector, useDispatch} from 'react-redux'
import {setLoadingCondition} from '../actions'
import styles from './css/nav.module.css'
import Search from './components/search'

export default function Navbar(){
    const [userId, setUserId] = useState("")
    const [navCheck, setNavCheck] = useState(false)
    const [searchStatus, setSearchStatus] = useState(false)

    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()

    function toggleNav() {
        setNavCheck(current => !current)
    }

    async function getData(){
        let theKey = await localForage.getItem("yourKey").then(ret => ret)
        setUserId(theKey)
    }

    function switchToSearch(){
        setNavCheck(false)
        setSearchStatus(current => !current)
    }

    useEffect(() => {
        getData()
    }, [])

    return(
        <>
            {navCheck && 
                <>
                    <div className={styles.navbar}>
                        <Link href="/">
                            <a onClick={() => dispatch(setLoadingCondition())} href="/">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-collection-fill" viewBox="0 0 16 16">
                                  <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7z"/>
                                  <path fill-rule="evenodd" d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1z"/>
                                </svg>
                            </a>
                        </Link>
                        <Link href="/new">
                            <a onClick={() => dispatch(setLoadingCondition())} href="/new">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                </svg>
                            </a>
                        </Link>
                        {userId && userId.length > 0 && 
                            <Link href="myaccount">
                                <a onClick={() => dispatch(setLoadingCondition())}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                                      <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                    </svg>
                                </a>
                            </Link>
                        }
                        <Link href="/enter">
                            <a onClick={() => dispatch(setLoadingCondition())} href="/enter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-door-open-fill" viewBox="0 0 16 16">
                                  <path fill-rule="evenodd" d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2v13h1V2.5a.5.5 0 0 0-.5-.5H11zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                                </svg>
                            </a>
                        </Link>
                        <div className={styles.search} onClick={switchToSearch}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
                              <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
                            </svg>
                        </div>
                        
                    </div>
                </>
                }   
                {searchStatus && <Search />}
                <img alt="toggle navbar" onClick={toggleNav} src="/navpreview.svg" className={styles.navtoggle} />
        </>
    )
}