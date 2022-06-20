let nameInput = document.getElementById('name-input')
let nameBtn = document.getElementById('name-btn')


nameBtn.addEventListener('click', () => {
  let name = nameInput.value
  chrome.storage.sync.set({ name }, () => { console.log(`Name saved: ${name}`) })
})

chrome.storage.sync.get('name', (res) => {
  let name = res.name
  nameInput.value = name ?? 'User'
})