<script setup>
  import {ref} from 'vue'
import router from '../router';

  let receivedImage = null
  let isButtonDisabled = ref(true)

  const receive_image = (event) => {
      console.log (event.target.files[0])
      receivedImage = event.target.files[0]
      isButtonDisabled.value = false
  }
  const analyse =  async () => {
    var data = new FormData()
    data.append('image', receive_image)
    const response = await fetch(
      '/image', 
      {
        method: 'POST',
        body: data
      }
    )
    router.push({path: 'confirm'})
    
  }  
</script>

<template>
      <form class="d-flex">
        <input accept="image/png, image/jpeg, image/jpg; capture=camera" 
        type="file" class="btn btn-secondary py-3 m-3" v-on:change="event => receive_image(event)" style="max-width: 500px;"/>
        <button type="button" v-bind:disabled="isButtonDisabled" class="btn btn-dark py-2 m-3 px-3" @click="_ => analyse()" style="max-width: 200px;">
          ANALISAR
        </button>
      </form>  
</template>