import {createStore} from 'redux'
import allReducer from '../reducers'
import {Provider} from 'react-redux'
import './css/styles.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/mdn-like.css'
import './css/prism.css'
import 'highlight.js/styles/atelier-forest-light.css'
import './css/bootstrap.min.css'

export default function MyApp({ Component, pageProps }) {

    const store = createStore(allReducer);


    return <Provider store={store}><Component {...pageProps} /></Provider>
}