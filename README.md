# Codenshare

Codenshare first started off as a react project called **Codetake**. When starting off, I thought that a single page app refers to an app without routing. With that in mind, I tried to build Codetake without the use of any routing. 

![routing example](https://firebasestorage.googleapis.com/v0/b/alonzoaustin-8314b.appspot.com/o/codenshare%2Fcodetake%2Fnavigation_between_projects.gif?alt=media&token=34bf8565-3855-4d05-8365-85bfcbebf49b)

Codetake worked this way because the Code behind the Navbar looked like this:

```javascript
import React, {useState} from 'react'
import zeit from './bullet.ico'
import takes from './book.svg'
import user from './user.svg'
import favorites from './favorite.svg'
import updates from './notification.svg'
import settings from './settings.svg'
import add from './plus.svg'
import Enter from './enter'
import Newprojects from './newProject'
import Display from './projectdisplay'


function Components(){

    const [currentPage, setcurrentPage] = useState("takes")

    function Navprop(props){

    function changePage(event){
        sessionStorage.setItem("page", event.target.title)
        setcurrentPage(event.target.title)
        console.log("name: " + event.target.title)
        var pageTest = sessionStorage.getItem("page")
        console.log("pageTest: " + pageTest)
    }

    function changePage1(event){
        sessionStorage.setItem("page", event.target.innerText)
        setcurrentPage(event.target.innerText)
        console.log("name: " + event.target.innerText)
        var pageTest = sessionStorage.getItem("page")
        console.log("pageTest: " + pageTest)
    }

    return(
        <div title={props.description} onClick={changePage}>
            <img style={{
                width: '48px', 
                height: '48px',
                marginRight: '20px',
                }} title={props.description} className="navpic" src={props.pic} />
            <div style={{
                display: 'inline-block',
                fontSize: "16px",
                position: 'relative',
                bottom: '15px',
                backgroundColor: "#2f3e46",
                borderRadius: "6px",
                color: "white"
                }} onClick={changePage1} title={props.description}><strong title={props.description}>{props.description}</strong></div>
        </div>
    )
    }


        function Navbar(){
            var NavbarStyle = {
        backgroundColor: "#cad2c5",
        border: "none",
        borderRadius: "12px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        position: "fixed",
        right: "0",
        top: "0",
        zIndex: "2",
        display: "inline-block",
            }

            var prevScrollPos = window.pageYOffset;
            const [currentScrollPos, setCurrentScrollPos] = useState("")
            const [hasMoved, setHasMoved] = useState(true)
            window.onscroll = function() {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        setHasMoved(current => false);
      } else {
        setHasMoved(true)
      }
      prevScrollPos = currentScrollPos;
            } 

            hasMoved && (NavbarStyle.display = "none")
            !hasMoved && (NavbarStyle.display = "inline-block")



            const page = sessionStorage.getItem("page")

            return(
                <div className="navbar" style={NavbarStyle}>
                    <Navprop pic={takes} description="takes" />
                    <Navprop pic={add} description="add" />
                    <Navprop pic={user} description="my account" />
                    <Navprop pic={favorites} description="favorites" />
                    <Navprop pic={updates} description="updates" />
                    <Navprop pic={settings} description="settings" />
                </div>


            )
        }
    return(
        <div>
            <Navbar />
            {currentPage === "" && <Display />}
            {currentPage === "takes" && <Display />}
            {currentPage === "add" && <Newprojects />}
        </div>
    )
}

export default Components
```

If a user were to add a project, the user would not be able to see it alongside the other projects until the user refreshed the page.

![adding project](https://firebasestorage.googleapis.com/v0/b/alonzoaustin-8314b.appspot.com/o/codenshare%2Fcodetake%2Fadding_project.gif?alt=media&token=dfde70b5-7d7c-47bf-89a3-5b8e1ded1607)

# Codentake

After realizing that a single page app had multiple links, I decided to shift from regular reactjs to a framework I dabbled with for some time-**Nextjs**-because of their simplistic routing methods.

Codentake was an upgraded version of Codetake that maintained similar file names but with routing, making navigation easier for users. Though it was better than Codetake, the file names and the link names did not exactly make sense. For example, the starting point that displayed all of the projects was called "projectdisplay." This name did not reflect the page at all as the name "projectdisplay" would describe a singular project rather than multiple projects.

Nextjs had a module called useRouter that allowed users to pull the dynamic id to be used to collect data; however, I did not actually understand what routes were. To make use of dynamic urls, I literally typed out "url" in Visual Studio Code in hope that there would be some obsure module that would allow me to make use of the dynamic urls. Thankfully, there was. It was called **getURL**. In order for me to use it, I usually typed the following: 

```javascript
const [urlName, seturlName] = useState("")
const [altId, setaltId] = useState("")

useEffect(() => {
	seturlName(getURL())
}

const userId = urlName.slice(19, urlName.length)

//the number often represented the start of the dynamic url that represented an id or data

userId.includes("%20") ? (setaltId(userId.split("%20").join(" "))) : console.log("all good")

```

# Codenshare

In addition to cleaner code, Codenshare saw file names and link names that actually made sense. getUrl would no longer be used as I finally understood what **useRouter** actually did. It also solved a problem that prevented new projects to be shown when added to database. This was because instead of using `<Link></Link>` to go to a different page as data is being updated/created, I was able to use `router.push()` at the end of functions to move to the new page after data has been updated/created.
