import gt from 'lodash/get'

export const getNode = (state, props) => {
    let out = gt(props,'summary.description', '')
    const key = out.split('/').pop()
    return state.music.nodes[key]
}