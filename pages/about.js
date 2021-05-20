import Link from 'next/link'
import React from 'react'
import styles from './css/about.module.css'

export default function About() {
    return (
        <div>
            <div className={styles.titleContainer}>
                <img className={styles.titlePic} src="/projareexp.svg" alt="Projare icon" />
                <h1 className={styles.titleText}>Projare</h1>
            </div>
            <div className={styles.featureContainerContainer}>
                <div className={styles.featureContainer}>
                    <img className={styles.carouselPic} src="/cards.jpeg" />
                    <p className={styles.description}>share your projects, what you're using to create their projects, and the status of your projects</p>
                </div>
                <Link href="/enter"><div className={styles.enter}><button className={styles.enterText}>Enter</button></div></Link>
            </div>

            <br />
            <br />

            <div className={styles.footerContainer}>
                <h1 className={styles.footerText}>Made using NextJS + MongoDB + Vercel</h1>
            </div>
        </div>
    )
}
