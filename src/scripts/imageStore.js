import { defineStore } from 'pinia'

const useImage = defineStore('image', {
    state: () =>{
        return {
            id: 0,
            netlist: [] 
        }
    }
  
})

export default useImage;