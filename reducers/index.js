import loadingReducer from './loading'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    loading: loadingReducer
})

export default allReducers