export function getKeyMap () {
  const defaultMapping = {
    36: 'Return',
    38: 'Up',
    40: 'Down',
    37: 'Left',
    39: 'Right',
    13: 'Enter',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    8: 'Back',
    179: 'Play',
    227: 'FastForward',
    228: 'Rewind'
  }

  const samsungMapping = {
    29460: 'Up',
    29461: 'Down',
    4: 'Left',
    5: 'Right',
    29443: 'Enter',
    108: 'A',
    20: 'B',
    21: 'C',
    22: 'D',
    88: 'Back',
    71: 'Play',
    72: 'FastForward',
    69: 'Rewind',
    70: 'Stop'
  }

  const tizenMapping = {
    38: 'Up',
    40: 'Down',
    37: 'Left',
    39: 'Right',
    13: 'Enter',
    403: 'A',
    404: 'B',
    405: 'C',
    406: 'D',
    10009: 'Back',
    415: 'Play',
    417: 'FastForward',
    412: 'Rewind',
    413: 'Stop',
    19: 'Pause'
  }

  const webOSMapping = {
    461: 'Back',
    36: 'Return',
    38: 'Up',
    40: 'Down',
    37: 'Left',
    39: 'Right',
    13: 'Enter',
    8: 'Return',
    413: 'Stop',
    417: 'FastForward',
    412: 'Rewind',
    415: 'Play',
    19: 'Pause'
  }

  var LGMapping = {
    36: 'Return',
    38: 'Up',
    40: 'Down',
    37: 'Left',
    39: 'Right',
    13: 'Enter',
    65: 'Red',
    66: 'Green',
    67: 'Yellow',
    68: 'Blue',
    461: 'Back',
    415: 'Play',
    19: 'Pause',
    417: 'FastForward',
    412: 'Rewind',
    413: 'Stop'
  }

  var operaMapping = {
    [window.VK_UP || 38]: 'Up',
    [window.VK_DOWN || 40]: 'Down',
    [window.VK_LEFT || 37]: 'Left',
    [window.VK_RIGHT || 39]: 'Right',
    [window.VK_ENTER || 13]: 'Enter',
    [window.VK_BACK_SPACE || 8]: 'Back',
    [window.VK_PLAY || 81]: 'Play',
    [window.VK_PAUSE || 10]: 'Pause',
    [window.VK_FAST_FWD || 73]: 'FastForward',
    [window.VK_REWIND || 89]: 'Rewind',
    [window.VK_STOP || 82]: 'Stop'
  }

  var mapping = defaultMapping
  const agent = navigator.userAgent
  if (agent.search(/Maple/) > -1) {
    mapping = samsungMapping
  } else if (agent.search(/Tizen/) > -1) {
    mapping = tizenMapping
  } else if (agent.search(/LG Browser/) > -1) {
    mapping = LGMapping
  } else if (agent.search(/web0s/i) > -1) {
    mapping = webOSMapping
  } else if (agent.search(/opera/i) > -1) {
    mapping = operaMapping
  }
  return mapping
}
const mapping = getKeyMap()

const map = (code) => mapping[code]
export default map
