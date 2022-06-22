console.log('content runs')

const selectFilterParameters = () => {


}

const filterButton = document.createElement('button')
filterButton.id = 'filterButton'
filterButton.onclick = selectFilterParameters
filterButton.innerHTML = 'Count Rows'
'position: absolute; z-index: 999; height: 50px; width: 60px; bottom: 50px; border-radius: 5px; left: calc(50% - 30px); background-color: #3a67aa; color: #fff;'

document.body.appendChild(filterButton)
