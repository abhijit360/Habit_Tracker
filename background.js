import { INCREMENT_KEY } from "./common"
async function incrementTimer(){
    let currentValue = await chrome.storage.sync.get(INCREMENT_KEY)
    currentValue[INCREMENT_KEY] = Date.now - currentValue[INCREMENT_KEY]
    await chrome.storage.sync.set(currentValue)
}

incrementTimer()