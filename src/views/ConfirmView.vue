<script setup>
import centralizer from '../components/centralizer.vue';
import router from '../router';
import { onMounted, ref } from 'vue';
import useImage from '../scripts/imageStore'

let netlist = ref([])
let image = ref("")
let ready = ref(false)
let simulationType = ref("")
let starttime = ref(0), stoptime = ref(0), maxstep = ref(0)
let components = ref([])
let nodes = ref([])
let componentSelected = ref('')
let nodeSelected = ref(0)

onMounted( async () => {
    const imageStore = useImage();
    var response = await fetch(
      `http://localhost:5000/netlist/${imageStore.id}`, 
      {
        method: 'GET',
      }
    )
    const status = response.status
    const r = await response.json()
    const data = await ({status: status, body: r})
    console.log(data);

    const netlistFiltered = []
    for (const line of data.body.netlist)
        if (line)
            netlistFiltered.push(line)

    
    imageStore.netlist = netlistFiltered
    netlist.value = netlistFiltered
    image.value = data.body.debugImg

    console.log(netlist.value)
    for (const line of netlist.value)
        if (line[0])
            components.value.push(line[0])
    
    ready.value = true
})
</script>

<template>
    <centralizer>
        <div class="pscard container p-3 m-5">
            <h2 class="text-center my-2">
                Confira seu esquemático
            </h2>
            <p class="text-justify px-3"> 
                Observe as informações que foram 
                identificadas, faça os ajustes necessários e 
                então utilize o botão <strong class="emp">enviar</strong>. 
            </p>
            <centralizer v-if="!ready" class="spinner-border my-5" role="status">
                <span class="visually-hidden">Loading...</span>
            </centralizer>
            <div v-else>
                <img v-bind:src="'data:image/jpeg;base64,'+image" class="img-fluid img-thumbnail"/>

                <div class="m-3 p-5 rounded" style="background-color:seagreen;">
                    <h3 class="row mb-4"> Correções na Netlist </h3>
                    <form class="row d-sm-flex">
                        <!--<div class="form-check">
                            <label for="op" class="form-check-label"> ponto de operação </label>
                            <input type="radio" id="op" name="simulationType" value="op" class="form-check-input"><br/>
                        </div>   
                        <div class="form-check">
                            <label for="transient" class="form-check-label"> temporal transiente </label>
                            <input type="radio" id="transient" name="simulationType" value="transient" class="form-check-input"><br/>
                        </div> -->
                    </form>
                </div>

                <div class="m-3 p-5 rounded" style="background-color:seagreen;">
                    <h3 class="row mb-4"> parâmetros de simulação </h3>
                    <form class="row d-sm-flex">
                        <div class="form-check">
                            <label for="op" class="form-check-label"> ponto de operação </label>
                            <input type="radio" v-model="simulationType" id="op" name="simulationType" 
                            value="op" class="form-check-input"><br/>
                        </div>   
                        <div class="form-check">
                            <label for="transient" class="form-check-label"> temporal transiente </label>
                            <input type="radio" v-model="simulationType" id="transient" 
                            name="simulationType" value="transient" class="form-check-input"><br/>
                        </div>

                        <div v-if="simulationType == 'transient'">
                            <div class="row my-3">
                                <label for="starttime">tempo inicial</label>
                                <input type="number" id="starttime" v-model="starttime"/>
                                <label for="stoptime">tempo final</label>
                                <input type="number" id="stoptime" v-model="stoptime"/>
                                <label for="maxstep"></label>passo máximo
                                <input type="number" id="maxstep" v-model="maxstep"/>
                            </div>

                            <div class="row">
                                <p> Escolha um componente para obter corrente e tensão <b>ou</b> um nó, para tensão</p>
                                
                                    <label for="selectComponent">componente selecionado</label>
                                    <select class="mb-4" id="selectComponent" v-model="componentSelected">
                                        <option disabled value="">Escolha um item</option>
                                        <option v-for="component in components">{{component}}</option>
                                    </select>
                                    
                                    <label for="selectComponent">nó selecionado</label>
                                    <select id="selectComponent" v-model="componentSelected">
                                        <option disabled value="">Escolha um item</option>
                                        <option v-for="component in components">{{component}}</option>
                                    </select>
    
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>

            <slot></slot>
        </div>
    </centralizer>
</template>

<style scoped>
.pscard{
    background-color: rgb(203, 255, 238);
    border-radius: 8px;
    max-width: 600px;
}
.emp{
    font-weight: bold;
}
h2 {
    font-size: 2rem;
}
h3 {
    font-size: 1.5rem;
}
</style>