<script setup>
  import {ref} from 'vue'
  import router from '../router';
  import useImage from '../scripts/imageStore'

  let receivedImage = null
  let isButtonDisabled = ref(true)
  let buttonNotClicked = ref(true)

  const receive_image = (event) => {
      console.log (event.target.files[0])
      receivedImage = event.target.files[0]
      isButtonDisabled.value = false
  }
  const analyse = async () => {
    buttonNotClicked.value = false;
    var response = await fetch(
      'http://localhost:5000/image', 
      {
        method: 'POST',
        body: receivedImage,
      }
    )
    const status = response.status
    const r = await response.json()
    const data = await ({status: status, body: r})
    console.log(data);
    const imageStore = useImage()
    imageStore.id = data.body.id
    console.log(`id: ${imageStore.id}, netlist: ${imageStore.netlist}`)
    router.push({path: 'confirm'})
  }  
</script>

<template>
      <form class="d-sm-flex">

        <label for="imagefile"></label>
        <input id="imagefile" accept="image/png, image/jpeg, image/jpg; capture=camera" 
        type="file" class="btn btn-secondary py-3 m-3" name="picture"
        v-on:change="event => receive_image(event)" style="max-width: 500px;"/>

        <button v-if="buttonNotClicked" type="button" v-bind:disabled="isButtonDisabled" 
        class="btn btn-dark py-2 m-3 px-3" @click="_ => analyse()" style="max-width: 200px;">
          ANALISAR
        </button>
        <div v-else class="btn btn-dark m-3 p-3">
          <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </form>  
</template>
