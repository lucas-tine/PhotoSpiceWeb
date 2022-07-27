<script setup>
  import {ref} from 'vue'
  import router from '../router';
  import useImage from '../scripts/imageStore'

  let receivedImage = null
  let isButtonDisabled = ref(true)
  let buttonNotClicked = ref(true)
  let connectionError = ref("")
  const receive_image = (event) => {
      console.log (event.target.files[0])
      receivedImage = event.target.files[0]
      isButtonDisabled.value = false
  }
  const analyse = async () => {
    try
    {
      buttonNotClicked.value = false;
      var response = await fetch(
        'http://192.168.206.81:5000/image', 
        {
          method: 'POST',
          body: receivedImage,
        }
      )
      const status = response.status
      const r = await response.json()
      const data = await ({status: status, body: r})
      const imageStore = useImage()
      imageStore.id = data.body.id
      console.log(`id: ${imageStore.id}, netlist: ${imageStore.netlist}`)
      router.push({path: 'confirm'})
    }
    catch (exception)
    {
      connectionError.value = `o seguinte erro nos impediu de prosseguir:\n${exception.message}`
    }
  }  
</script>

<template>
      <form class="d-md-flex justify-content-evenly text-center mt-5">

        <label for="imagefile" class="btn btn-secondary py-3 m-1">
          enviar imagem
          <input id="imagefile" accept="image/png, image/jpeg, image/jpg; capture=camera" 
        type="file" name="picture"
        v-on:change="event => receive_image(event)" style="max-width: 500px;"/>
        </label>

        <button v-if="buttonNotClicked" type="button" v-bind:disabled="isButtonDisabled" 
        class="btn btn-dark py-2 m-3 px-3" @click="_ => analyse()" style="max-width: 200px;">
          ANALISAR
        </button>
        <div v-else class="p-2">
          <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </form>  
      <div v-if="connectionError != ''" class="rounded border-white p-3 m-2 mt-5 text-justify"
      style="background-color:tomato; color:#500">
        <h3> Erro de conexão com a API photospice </h3>
        <p>{{connectionError}}</p>
      </div>

</template>

<style scoped>
input[type="file"] {
    display: none;
}
</style>
