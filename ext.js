// console.log('---- EXT init')

// setTimeout(() => {

//   const items = []

//   document.querySelectorAll('._4-u3._9zl').forEach(el => {
//     let id = el.id || null

//     let img = el.querySelector('img')
//     img = img ? img.src : null

//     let link = el.querySelector('a')
//     link = link ? link.href : null

//     let title = el.querySelector('._38m4 + span')
//     title = title ? title.textContent : null

//     let price = el.querySelector('._sz6')
//     let price_sym = null
//     let price_str = null
//     let price_num = null
//     if (price) {
//       price_sym = price.textContent[0]
//       price_str = price.textContent.substring(1)
//       let priceArr = []
//       for (let i = price_str.length - 1; i >= 0; i -= 1) {
//         ((price_str.length - i) % 4 !== 0) ? priceArr.push(price_str[i]) : null
//       }
//       price_num = parseInt(priceArr.reverse().join(''))
//     }

//     let location = el.querySelector('._2gqu')
//     location = location ? location.textContent : null

//     let description = el.querySelector('._5rfl')
//     description = description ? description.textContent : null

//     items.push({
//       id,
//       img,
//       title,
//       location,
//       price_num,
//       price_str,
//       price_sym,
//       description
//     })
//   })


//   function sortItemASC(a, b) {
//     // 1st (mandatory) comparison -> 'price_num'
//     // 2nd (optional)  comparison -> 'title'
//     // 3rd (optional)  comparison -> 'location'

//     // compare's return value:
//     // < 0 -> 'a' will be placed BEFORE 'b'
//     // > 0 -> 'a' will be placed AFTER 'b'
//     // = 0 -> same order (not necessarily, sort is not stable)

//     if (a.price_num < b.price_num) {
//       return -1

//     } else if (a.price_num > b.price_num) {
//       return 1

//     } else if (a.price_num === b.price_num) {

//       if (a.title.toUpperCase() < b.title.toUpperCase()) {
//         return -1

//       } else if (a.title.toUpperCase() > b.title.toUpperCase()) {
//         return 1

//       } else if (a.title.toUpperCase() === b.title.toUpperCase()) {

//         if (a.location.toUpperCase() < b.location.toUpperCase()) {
//           return -1

//         } else if (a.location.toUpperCase() > b.location.toUpperCase()) {
//           return 1

//         } else if (a.location.toUpperCase() === b.location.toUpperCase()) {
//           return 0

//         }
//       }
//     }
//   }


//   function filterByTitle(title) {
//     return items.filter(a => {
//       return a.title.includes(title)
//     })
//   }

//   function filterByLocation(location) {
//     return items.filter(a => {
//       return a.location.includes(location)
//     })
//   }

//   function filterByDescription(description) {
//     return items.filter(a => {
//       return a.description.includes(description)
//     })
//   }

//   // price distribution
//   // https://cloud.google.com/natural-language

//   // items.sort(sortItemASC)
//   // console.log('---- items AFTER SORT ASC', items.map(a => a.price_num))

//   // for (let j = 0; j < items.length; j += 1) {
//   //   let el = document.querySelector(`#${items[j].id}`)
//   //   el.parentNode.appendChild(el)
//   // }


//   // div._4bl9 append btn sort price > < input filter title|price|location
//   // or buttons / input @ position absolute

//   // [ Search by title... ]
//   // [ Search by price... ] << dropdown ?
//   // [ Seach by location... ] << dropdown ?
//   // [ Search for description... ]

//   // review UI / requisiti --> pensa MVP !! [...pagination? gestione scroll?]

//   // 'LOAD MORE' button
// // scrollTo(0, document.documentElement.scrollHeight)

// }, 5 * 1000)



// list
// #contentArea ._5pcb

// (() => ())()


// function centsToCurrency(symbol, cents) {
// 	// cents = 'int'
// 	cents = cents.toString()

// 	if (cents.length === 1) { cents = `00${cents}` }
// 	if (cents.length === 2) { cents = `0${cents}` }

// 	return symbol
// 		   + ' '
// 		   + cents.substring(0, cents.length - 2)
// 		     .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
// 		   + ','
// 		   + cents.substring(cents.length - 2, cents.length)
// }


(() => {


const ITEMS = {
  container: {
    dragStart: {
      clientX: null,
      clientY: null,
      offsetLeft: null,
      offsetTop: null
    },
    el: null,
    id: `group_forsale_mall_forsale_available_${window.location.href.replace('https://www.facebook.com/groups/', '').split('/')[0]}`,
    observeAddedNodes: observeItemsContainerAddedNodes,
    observer: null,
    set: setItemsContainer,
  },
  list: {
    add: addItemsToItemsList,
    currencySymbol: '',
    data: [],
    price: {
      max: null,
      min: null
    }
  },
  ui: {
    filters: {
      init: initFiltersUI,
      places: {},
      priceMax: null,
      priceMin: null,
      search: searchItemsByFilters,
      titleOrDescription: '',
    },
    currency: {
      format: {
        numToStr: num => `${ITEMS.ui.currency.symbol} ${num.toString().split('.')[0].replace(/(\d)(?=(\d{3})+(?!\d))/gi, '$1 ')}`,
        strToNum: str => Number(str.replace(new RegExp(ITEMS.ui.currency.symbol + '|\\s+|\\.+|\\,+', 'gi'), ''))
      },
      symbol: ''
    }
  }
}


ITEMS.container.set(() => {
  // init UI
  ITEMS.ui.filters.init()
  // will save new items when added to the DOM
  ITEMS.container.observeAddedNodes( ITEMS.list.add )
  // will save current items
  const currentItems = ITEMS.container.el.getElementsByClassName('_4-u3 _9zl')
  ITEMS.list.add( currentItems )
})


function addItemsToItemsList(elArr) {
  for (let i = 0; i < elArr.length; i += 1) {
    const el = elArr[i]

    const id = `${el.id}__clone`

    let img = el.getElementsByTagName('img')
    img = img.length > 0 ? img[0].src : ''

    let link = el.getElementsByTagName('a')
    link = link.length > 0 ? link[0].href : ''

    let title = el.querySelector('._38m4 + span')
    let title_html = ''
    let title_search = ''
    if (title !== null) {
      title_html = title.innerHTML
      title_search = title.textContent.toLowerCase()
    }

    let price = el.getElementsByClassName('_sz6')
    let price_html = ''
    let price_search = -1
    if (price.length > 0) {
      // update currency symbol (validate for price as string like 'FREE' or equivalent)
      if (ITEMS.ui.currency.symbol.length === 0 && !isNaN( price[0].textContent[1] )) {
        ITEMS.ui.currency.symbol = price[0].textContent[0]
      }
      // end
      const price_num = ITEMS.ui.currency.format.strToNum( price[0].textContent )
      price_html = isNaN(price_num) ? price[0].textContent : ITEMS.ui.currency.format.numToStr( price_num )
      price_search = isNaN(price_num) ? 0 : price_num
    }

    let place = el.getElementsByClassName('_2gqu')
    let place_html = ''
    let place_search = ''
    if (place.length > 0) {
      place_html = place[0].innerHTML
      place_search = place[0].textContent.toLowerCase()
    }

    let description = el.getElementsByClassName('_5rfl')
    let description_html = ''
    let description_search = ''
    if (description.length > 0) {
      description_html = description[0].innerHTML
      description_search = description[0].textContent.toLowerCase()
    }

    const clone = document.createElement('div')

    clone.setAttribute('id', id)
    clone.setAttribute('class', 'post')

    clone.innerHTML = `
      <div class="preview" ${img.length > 0 ? `style="background-image: url('${ img }'); background-size: cover;"` : '' }></div>
      <div class="content">
        <a class="title" href="${ link }">${ title_html }</a>
        <span class="price">${ price_html }</span>
        <span class="place">${ place_html }</span>
        <span class="description">${ description_html }</span>
      </div>
    `

    document.querySelector('.filterify .posts').appendChild(clone)

    ITEMS.list.data.push({
      order: ITEMS.list.data.length,
      el: clone,
      img,
      link,
      title_html,
      title_search,
      price_html,
      price_search,
      place_html,
      place_search,
      description_html,
      description_search
    })

    // update price MIN
    if (ITEMS.list.price.min !== null) {
      ITEMS.list.price.min = price_search < ITEMS.list.price.min ? price_search : ITEMS.list.price.min
    } else {
      ITEMS.list.price.min = price_search
    }

    // update price MAX
    if (ITEMS.list.price.max !== null) {
      ITEMS.list.price.max = price_search > ITEMS.list.price.max ? price_search : ITEMS.list.price.max
    } else {
      ITEMS.list.price.max = price_search
    }

    // update place
    if (place_search.length > 0) {
      ITEMS.ui.filters.places[place_search] = (ITEMS.ui.filters.places[place_search] || 0) + 1
    }
  } // for elArr

  // items qty label: update
  document.querySelector('.filterify .menu .header .qty').textContent = ITEMS.list.data.length
  // slider: update range
	document.querySelector('.filterify .menu .price .slider').noUiSlider.updateOptions({
		range: {
			'min': ITEMS.list.price.min || 0,
			'max': ITEMS.list.price.max || 1
		}
	})
  // slider: update range labels
  document.querySelector('.filterify .menu .price .min').textContent = ITEMS.ui.currency.format.numToStr(ITEMS.list.price.min || 0)
  document.querySelector('.filterify .menu .price .max').textContent = ITEMS.ui.currency.format.numToStr(ITEMS.list.price.max || 1)
  // slider: update handlers
  document.querySelector('.filterify .menu .price .slider').noUiSlider.set([
    ITEMS.list.price.min || 0,
    ITEMS.list.price.max || 1
  ])

  const ignoreScroll = true
  ITEMS.ui.filters.search(ignoreScroll)

  // const places = Object.keys(ITEMS.ui.filters.places).sort()
  // let uiFiltersPlacesHTML = ''
  // // for (let i = 0; i < places.length; i += 1) {
  // for (let i = 0; i < 100; i += 1) {
  //   uiFiltersPlacesHTML += `
  //       <div class="place">

  //         <div class="toggle">
  //           <input class="visibility" id="filterify-place-toggle-visibility-${ i }" type="checkbox">

  //           <label class="switch" for="filterify-place-toggle-visibility-${ i }">
  //             <span class="handler"></span>
  //           </label>
  //         </div>

  //         <label class="label" for="filterify-place-toggle-visibility-${ i }">
  //           <span class="description">${ places[i] } <span class="qty">(${ ITEMS.ui.filters.places[places[i]] })</span>
  //         </label>

  //       </div>
  //   `
  // }
  // document.querySelector('.filterify .menu .places .list').innerHTML = uiFiltersPlacesHTML

  // SELECT ALL
  // DESELECT ALL
  // for (let search_key in ITEMS.ui.filters.place) {
  //   `<div class="toggle">
  //     <input id="toggle-N" type="checkbox">
  //     <label class="label" for="toggle-N">
  //       <span class="handler"></span>
  //       <span class="place">${ search_key }</span>nbsp;(<span class="count">${ ITEMS.ui.filters.place[search_key] }</span>)
  //     </label>
  //   </div>
  //   `
  // }

} // addItemsToItemsList

function initFiltersUI() {
  const UIContainer = document.createElement('div')

  UIContainer.setAttribute('class', 'filterify')
  UIContainer.setAttribute('draggable', 'true')

  UIContainer.innerHTML = `
  <div class="menu">

    <div class="group"></div>

    <div class="header">
      <span class="match">${ITEMS.list.data.length}</span> of <span class="qty">${ITEMS.list.data.length}</span> items for sale match your filters
    </div>

    <div class="price">
      <!-- leave .min  and .max above .slider or the latter will break the layout -->
      <span class="min"></span><span class="max"></span>
      <div class="slider"></div>
    </div>

    <input class="title-or-description" type="text" placeholder="Seach for item...">

  </div>

  <div class="posts"></div>
  `
  // UIContainer.innerHTML = `
  // <div class="menu">

  //   <div class="group"></div>

  //   <div class="header">
  //     <span class="match">${ITEMS.list.data.length}</span> of <span class="qty">${ITEMS.list.data.length}</span> items for sale match your filters
  //   </div>

  //   <div class="price">
  //     <!-- leave .min  and .max above .slider or the latter will break the layout -->
  //     <span class="min"></span><span class="max"></span>
  //     <div class="slider"></div>
  //   </div>

  //   <input class="title-or-description" type="text" placeholder="Seach for item...">

  //   <div class="places">
  //     <div class="reset">
  //       <a href="javascript:void(0)" class="btn-flat-3d">none</a>
  //       <a href="javascript:void(0)" class="btn-flat-3d">all</a>
  //     </div>

  //     <div class="list">
  //     </div>
  //   </div>

  // </div>

  // <div class="posts"></div>
  // `

  document.body.style.overflow = 'hidden'
  document.body.appendChild(UIContainer)

  document.querySelector('.filterify .menu .group').textContent = document.getElementsByClassName('_19s-')[0].textContent

  // UIContainer.addEventListener('dragstart', e => {
  //   e.dataTransfer.dropEffect = 'move'
  //   e.dataTransfer.effectAllowed = 'move'

  //   ITEMS.container.dragStart = {
  //     clientX: e.clientX,
  //     clientY: e.clientY,
  //     offsetLeft: UIContainer.offsetLeft,
  //     offsetTop: UIContainer.offsetTop
  //   }
  // }, false) // dragstart

  // let dragEventCounter = 0

  // UIContainer.addEventListener('drag', e => {
  //   e.dataTransfer.dropEffect = 'move'
  //   e.dataTransfer.effectAllowed = 'move'

  //   dragEventCounter += 1

  //   // UI fix
  //   // if (dragEventCounter % 3 === 0) { return }

  //   let marginLeft = ITEMS.container.dragStart.offsetLeft + (e.clientX - ITEMS.container.dragStart.clientX)
  //   if (marginLeft < 0) {
  //     marginLeft = 0
  //   } else if (marginLeft > 2 * defaultMarginLeft) {
  //     marginLeft = 2 * defaultMarginLeft
  //   }

  //   let marginTop = ITEMS.container.dragStart.offsetTop + (e.clientY - ITEMS.container.dragStart.clientY)
  //   if (marginTop < 0) {
  //     marginTop = 0
  //   } else if (marginTop > 2 * defaultMarginTop) {
  //     marginTop = 2 * defaultMarginTop
  //   }

  //   UIContainer.style.left = `${marginLeft}px`
  //   UIContainer.style.top = `${marginTop}px`
  // }, false)

  // UIContainer.addEventListener('dragover', e => {
  //   e.dataTransfer.dropEffect = 'move'
  //   e.dataTransfer.effectAllowed = 'move'
  //   e.preventDefault()
  // }, false)

  // UIContainer.addEventListener('drop', e => {
  //   e.dataTransfer.dropEffect = 'move'
  //   e.dataTransfer.effectAllowed = 'move'
  //   e.preventDefault()
  // }, false)

  // slider: create
  noUiSlider.create(document.querySelector('.filterify .menu .price .slider'), {
    behaviour: 'drag',
    connect: true,
    format: {
      from: str => ITEMS.ui.currency.format.strToNum(str).toString(),
      to: ITEMS.ui.currency.format.numToStr
    },
    range: {
      'min': ITEMS.list.price.min || 0,
      'max': ITEMS.list.price.max || 1
    },
    start: [ITEMS.list.price.min || 0, ITEMS.list.price.max || 1],
    step: 5,
    tooltips: [true, true],
  })
  // slider: update range labels
  document.querySelector('.filterify .menu .price .min').textContent = ITEMS.ui.currency.format.numToStr(ITEMS.list.price.min || 0)
  document.querySelector('.filterify .menu .price .max').textContent = ITEMS.ui.currency.format.numToStr(ITEMS.list.price.max || 1)
  // slider: update handlers
  document.querySelector('.filterify .menu .price .slider').noUiSlider.on('change', (values, handle, unencoded, tap, positions) => {
    ITEMS.ui.filters.priceMin = unencoded[0]
    ITEMS.ui.filters.priceMax = unencoded[1]

    ITEMS.ui.filters.search()
  })

  document.querySelector('.filterify .menu .title-or-description').addEventListener('input', e => {
    ITEMS.ui.filters.titleOrDescription = e.target.value.toLowerCase().trim()
    ITEMS.ui.filters.search()
  }, false)
} // initFiltersUI

function observeItemsContainerAddedNodes(mutationAction) {
  ITEMS.container.observer = new MutationObserver(mutations => {
    for (let i = 0; i < mutations.length; i += 1) {
      mutationAction(mutations[i].addedNodes)
    }
  })

  ITEMS.container.observer.observe(ITEMS.container.el, {
    childList: true,
    attributes: false,
    characterData: false,
    subtree: false,
    attributeOldValue: false,
    characterDataOldValue: false
  })
} // observeItemsContainerAddedNodes

function searchItemsByFilters(ignoreScroll) {
  let didScrollTop = ignoreScroll ? ignoreScroll : false

  let hideCount = 0

  for (let i = 0; i < ITEMS.list.data.length; i += 1) {
    const item = ITEMS.list.data[i]

    // will hide items for which filters do not apply
    let hideEl = false

    if ( item.price_search < (ITEMS.ui.filters.priceMin || ITEMS.list.price.min)
    ||   item.price_search > (ITEMS.ui.filters.priceMax || ITEMS.list.price.max)
    || ( ITEMS.ui.filters.titleOrDescription.length > 0
    &&   item.title_search.indexOf(ITEMS.ui.filters.titleOrDescription) === -1
    &&   item.description_search.indexOf(ITEMS.ui.filters.titleOrDescription) === - 1) )
    {
      hideEl = true
      hideCount += 1
    }

    // hide item if filters do not apply
    item.el.style.display = hideEl ? 'none' : ''

    // scroll to top if at least one filter applies
    if (!didScrollTop && hideEl) {
      didScrollTop = true
      document.querySelector('.filterify .posts').scrollTop = 0
    }
  }

  document.querySelector('.filterify .menu .header .match').textContent = ITEMS.list.data.length - hideCount
} // searchItemsByFilters

function setItemsContainer(callback) {
  const interval = setInterval(() => {
    ITEMS.container.el = document.getElementById(ITEMS.container.id)
    if (ITEMS.container.el !== null) {
      clearInterval(interval)
      callback()
    }
  }, 10)
} // setItemsContainer

// function a() {
//   ITEMS.list.data

//   const place = {}

//   for (let i = 0; i < elArr.length; i += 1) {
//     let key = elArr[i].place_search

//     place[key] = (place[key] || 0) + 1

//   }

// }

})()
