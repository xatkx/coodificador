// inputs
const form = document.querySelector('#formulario');
const box = document.querySelector('.cajita');
const textArea = document.querySelector('.area')
// var
let list = []
// regex
const allMayus = /[A-Z]{1,}/
const emcriptTrue = /enter{1,}|imes{1,}|ai{1,}|ober{1,}|ufat{,1}/
const listBlank = /[a-z0-9]/

// funt
const init = () => {
    localStorage.getItem('emcript') ? console.log('local store initializada...') : localStorage.setItem('emcript', '[]');

    listRender(getLocal())
}
const msjToObj = msj => {
    return { messeger: msj, id: Date.now() }
}
// crud
const getLocal = () => JSON.parse(localStorage.getItem('emcript'))
const saveLocal = obj => {
    const list = getLocal()
    localStorage.setItem('emcript', JSON.stringify([...list, obj]))
}
const delOneLocal = id => {
    let list = getLocal()
    list = list.filter(obj => {
        if (obj.id !== Number(id)) {
            return obj
        }
    })
    localStorage.setItem('emcript', JSON.stringify([...list]))
}
////
const msjHTML = obj => {
    const messeger = document.createElement('div')
    messeger.innerHTML = `
    <div class="msj">
    <p>
        ${obj.messeger}
    </p>
    <div class="botonera">
        <input type="button" value="desemcript"  class="desemcript"/>
        <input type="button" value="delete" class="delete" id="${obj.id}">
    </div>
</div>
    `
    return messeger
}
const listRender = list => {

    while (box.firstChild) {
        box.firstChild.remove()
    }


    list.forEach(element => {
        box.appendChild(msjHTML(element))
    });
}
/// codificador
const codificador = ({ text, buscar, remplace }) => {
    return text.replace(RegExp(`${buscar}`, 'g'), () => remplace)
}
const emcript = msj => {
    let cript = msj
    const llave = [
        { buscar: 'e', remplace: 'enter' },
        { buscar: 'i', remplace: 'imes' },
        { buscar: 'a', remplace: 'ai' },
        { buscar: 'o', remplace: 'ober' },
        { buscar: 'u', remplace: 'ufat' },
    ]

    for (let i = 0; i < llave.length; i++) {
        cript = codificador({ ...llave[i], text: cript })
    }
    return cript
}
const desemcript = msj => {
    let cript = msj
    const llave = [
        { remplace: 'e',buscar: 'enter' },
        { remplace: 'i', buscar: 'imes' },
        { remplace: 'a', buscar: 'ai' },
        { remplace: 'o', buscar: 'ober' },
        { remplace: 'u', buscar: 'ufat' },
    ]
    for (let i = 0; i < llave.length; i++) {
        cript = codificador({ ...llave[i], text: cript })
    }
    return cript
}
///
const submitHandle = event => {
    event.preventDefault()
    const doc = textArea.value
    let emcriptado;
    if (allMayus.test(doc))
    {
        return
    } else if(!listBlank.test(doc))
    {
        form.reset()
        textArea.placeholder = 'char invalid'
        setTimeout(() => textArea.placeholder = 'Message...',3000)
        return
    }
    
    if(emcriptTrue.test(doc))
    {
         emcriptado = doc
    } else {

        emcriptado = emcript(doc)
    }


    // crea una funcion que tranforme el msj en un obj
    //console.log(msjToObj(textArea.value))
    saveLocal(msjToObj(emcriptado))
    listRender(getLocal())

    form.reset()
}
let pass = true
const boxHandle = event => {
    let button = event.target
    const text = event.target.parentElement.parentElement.querySelector('p')  
    if (button.classList.contains('desemcript') && pass) {
        text.innerText = desemcript(text.innerText)
        pass = false
        setTimeout(() => {
            text.innerText = emcript(text.innerText)
            pass = true
        }, 5000)
    } else if (button.classList.contains('delete')) {
        let id = button.getAttribute('id')
        delOneLocal(id)
        listRender(getLocal())
    }
}
// handler
const app = () => {
    document.addEventListener('DOMContentLoaded', init)
    form.addEventListener('submit', submitHandle)
    box.addEventListener('click', boxHandle)
}
app() // application