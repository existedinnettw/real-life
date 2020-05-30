//const electron = window.require('electron');
//const fs = electron.remote.require('fs');
//const ipcRenderer = electron.ipcRenderer;
//const currentWindow = electron.remote.getCurrentWindow()

//alias
let rm

class Safe_el{
    static el

    static check(func){
        if(this.el !== undefined){
            console.log('el function executed')
            func()
        }else{
            console.log('the browser is not electron')
            return
        }
    }
    
}

if(window.require){
    Safe_el.el= window.require('electron');
    rm=Safe_el.el.remote
    console.log("el inited")
}else{
    console.log("el doesn't init")
}

export {Safe_el,rm}