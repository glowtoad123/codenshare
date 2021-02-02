import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as localForage from "localforage"
import {useSelector, useDispatch} from 'react-redux'
import {setLoadingCondition} from "../../actions"
import styles from '../css/search.module.css'
import dynamic from 'next/dynamic'
import 'react-bootstrap'
import {Button, Dropdown, DropdownButton, FormControl, InputGroup } from 'react-bootstrap'

export default function Search() {

    const router = useRouter()

    const thisUrl = router.pathname

    const loading = useSelector(state => state.loading)

    const dispatch = useDispatch()

    const [searchValue, setsearchValue] = useState("")
    const [searchTagsList, setsearchTagsList] = useState([])
    const [queriedList, setQueriedList] = useState([])
    const [selection, setSelection] = useState("title")

    console.log("selection", selection)

    
    
    function settingSelection(event){
        setSelection(event.target.innerText)
        localForage.setItem("Selection", event.target.innerText)
    }

    function settingsearchValue(event){
        setsearchValue(event.target.value)
        selection === "title" && localForage.setItem("Selection", "title")
        selection === "categories" && localForage.setItem("Selection", "categories")
        selection === "description" && localForage.setItem("Selection", "description")
    }

    function settingsearchList(){
            setsearchTagsList(none => {return [...none, searchValue]})
            setsearchValue("")
    }

    function settingFoundStatus(){
        dispatch(setLoadingCondition())
        localForage.setItem("foundStatus", true)
    }
    const categorySearchList = searchTagsList.join(" ")
    console.log("categorySearchList: " + categorySearchList)

    return (
        thisUrl === '/found' ? <div className={styles.search}>
            {loading && <div className="loading"><LinearProgress /></div>}
            <div className={styles.searchContainer}>
                {/* <input 
                    type="search" 
                    placeholder="search" 
                    className={styles.searchfield} 
                    value={searchValue} 
                    onChange={settingsearchValue}
                /> */}
            {(selection === "title" || selection === "description" || selection === "") && <InputGroup>
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={searchValue} 
                  onChange={settingsearchValue}
                />

                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={selection}
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item data onClick={settingSelection} href="#" value="categories">categories</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="title">title</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="description">description</Dropdown.Item>
                </DropdownButton>
                <InputGroup.Append>
                    <Link href={`discovered?title=${searchValue}`}>
                        <Button onClick={settingFoundStatus} variant="outline-secondary">Search</Button> 
                    </Link>
                </InputGroup.Append>
            </InputGroup>}
            {selection === "categories" && <InputGroup>
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  value={searchValue} 
                  onChange={settingsearchValue}
                />

                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title={selection}
                  id="input-group-dropdown-2"
                >
                  <Dropdown.Item data onClick={settingSelection} href="#" value="categories">categories</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="title">title</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item data onClick={settingSelection} href="#" value="description">description</Dropdown.Item>
                </DropdownButton>
                <InputGroup.Append>
                <Button onClick={settingsearchList} variant="outline-secondary">Add</Button>
                    <Link href={`discovered?title=${searchTagsList.join(" ")}`}>
                        <Button onClick={settingFoundStatus} variant="outline-secondary">Search</Button> 
                    </Link>
                </InputGroup.Append>
            </InputGroup>}
            </div>
            <br />
            {selection === "categories" &&
                <div className="searchdiv">
                    <div className={styles.list}>
                        <label className="searchLabel">Categories: </label>
                        {searchTagsList.map(each => <p className={styles.tags}><strong>{each}</strong></p>)}
                    </div>
                </div> 
            }   
        </div> : 

<div className={styles.search}>
<div className={styles.searchContainer}>
    {/* <input 
        type="search" 
        placeholder="search" 
        className={styles.searchfield} 
        value={searchValue} 
        onChange={settingsearchValue}
    /> */}
{(selection === "title" || selection === "description" || selection === "") && <InputGroup>
    <FormControl
      placeholder="Search"
      aria-label="Search"
      aria-describedby="basic-addon2"
      value={searchValue} 
      onChange={settingsearchValue}
    />

    <DropdownButton
      as={InputGroup.Append}
      variant="outline-secondary"
      title={selection}
      id="input-group-dropdown-2"
    >
      <Dropdown.Item data onClick={settingSelection} href="#" value="categories">categories</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item data onClick={settingSelection} href="#" value="title">title</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item data onClick={settingSelection} href="#" value="description">description</Dropdown.Item>
    </DropdownButton>
    <InputGroup.Append>
        <Link href={`found?title=${searchValue}`}>
            <Button onClick={settingFoundStatus} variant="outline-secondary">Search</Button> 
        </Link>
    </InputGroup.Append>
</InputGroup>}
{selection === "categories" && <InputGroup>
    <FormControl
      placeholder="Search"
      aria-label="Search"
      aria-describedby="basic-addon2"
      value={searchValue} 
      onChange={settingsearchValue}
    />

    <DropdownButton
      as={InputGroup.Append}
      variant="outline-secondary"
      title={selection}
      id="input-group-dropdown-2"
    >
      <Dropdown.Item data onClick={settingSelection} href="#" value="categories">categories</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item data onClick={settingSelection} href="#" value="title">title</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item data onClick={settingSelection} href="#" value="description">description</Dropdown.Item>
    </DropdownButton>
    <InputGroup.Append>
    <Button onClick={settingsearchList} variant="outline-secondary">Add</Button>
        <Link href={`found?title=${searchTagsList.join(" ")}`}>
            <Button onClick={settingFoundStatus} variant="outline-secondary">Search</Button> 
        </Link>
    </InputGroup.Append>
</InputGroup>}
</div>
<br />
{selection === "categories" &&
    <div className="searchdiv">
        <div className={styles.list}>
            <label className="searchLabel">Categories: </label>
            {searchTagsList.map(each => <p className={styles.tags}><strong>{each}</strong></p>)}
        </div>
    </div> 
}   
</div>
    );
}