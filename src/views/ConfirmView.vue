<script setup>
import centralizer from '../components/centralizer.vue';
import router from '../router';
import { onMounted, ref, computed, reactive } from 'vue';
import useImage from '../scripts/imageStore'

let netlist = ref([])
let image = ref("")
let ready = ref(false)
let simulationType = ref("")
let starttime = ref(""), stoptime = ref(""), maxstep = ref('')
let selected = ref('')

onMounted( async () => {
    const imageStore = useImage();
    const id = imageStore.id;
    if (id == 0){
        router.push('/')
    }
    var response = await fetch(
      `http://192.168.206.81:5000/netlist/${id}`, 
      {
        method: 'GET',
      }
    )
    const status = response.status
    const r = await response.json()
    const data = await ({status: status, body: r})

    const netlistFiltered = []
    for (const line of data.body.netlist)
        if (line.length != 0)
            netlistFiltered.push(line)

    
    imageStore.netlist = netlistFiltered
    netlist.value = netlistFiltered
    image.value = data.body.debugImg

    ready.value = true
})

const components = computed ( () => {
    const comps = []
    for (const line of netlist.value)
        if (line[0])
            comps.push(line[0])
    return comps
})

const nodes = computed (() => {
    const uniques_nodes = new Set()
    for (const line of netlist.value){
        if (line[1]){
            uniques_nodes.add(line[1])
        }
        if (line[2]){
            uniques_nodes.add(line[2])
        }
    }

    if (uniques_nodes.has('0'))
        uniques_nodes.delete('0')

    return uniques_nodes
})

const simulationProblem = computed( () => {
    try {
        if (simulationType.value == '') return "tipo de simulação não selecionado"
        if (simulationType.value == "op") return ""
        if (simulationType.value == 'transient')
        { 
            if (selected.value == '') return "sem componente ou nó selecionado para análise"
            //const start = Number.parseFloat(starttime.value) 
            //const stop = Number.parseFloat(stoptime.value)
            //if (start >= stop) return "o tempo de início é posterior ao tempo final"
            //const step = Number.parseFloat(maxstep.value)
            //if (step >= (stop - start)) return "o passo máximo é maior do que o tempo de simulação"
            //if (step < (stop-start)/10000) return "o passo máximo é muito menor que o tempo de simulação"
        }
        return ""
    }
    catch{
        return "erro na netlist";
    }
})

const simulationLoaded = ref(false),
connectionError = ref('')
const simulationData = reactive({})
const simulationRequest = async () => {
    simulationLoaded.value = false
    connectionError.value = ''
    try
    {
      var response = await fetch(
        'http://192.168.206.81:5000/simulation', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            new_netlist: netlist.value,
            simulation_parameters: {
                simulationType: simulationType.value,
                startTime: starttime.value,
                stopTime: stoptime.value,
                maximumStep: maxstep.value,
                selected: selected.value 
            }
          }),
        }
      )
    const status = response.status
    const r = await response.json()
    const data = await ({status: status, body: r})

    if (status != 200) {} // tratar

    simulationData.type = simulationType.value

    if (data.body.netlistResponse){
        data.body.netlistResponse.reverse()
        simulationData.netlistResponse = data.body.netlistResponse.join ('\n');
    }

    simulationData.voltageImg = data.body.voltageImg
    simulationData.currentImg = data.body.currentImg
    simulationLoaded.value = true

    console.log (`volageImg : ${simulationData.voltageImg}\ncurrentImg: ${simulationData.currentImg}`)

    }
    catch (exception)
    {
      connectionError.value = `o seguinte erro nos impediu de prosseguir:\n${exception.message}`
    }
    
}
</script>

<template>
    <centralizer>
        <div class="pscard container p-3 m-5">
            <h2 class="text-center my-2">
                Confira a detecção do esquemático abaixo 
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
                <img v-bind:src="'data:image/jpeg;base64,'+image" class="img-fluid img-thumbnail my-4"/>

                <div class="m-3 p-5 rounded" style="background-color:seagreen;">
                    <h3 class="mb-4"> Correções na Netlist </h3>
                    <p> 
                        você pode ajustar o nome do componente e seu tipo (mudando a letra da primeira célula),
                        mudar os nós de cada componente (anodo[+] e catodo[-]) e também seu valor, se necessário
                    </p>
                    <form class="row d-sm-flex">
                        <div v-for="(line, lineIndex) in netlist" :key="lineIndex" style="background-color:#768"
                        class="justify-content-between d-md-inline-flex flex-row rounded my-2 align-items-center">
                            <h4>{{lineIndex}}</h4>
                            <label v-for="(field, fieldIndex) in line" class="column m-2"
                            :key="'sub-'+fieldIndex" >
                            <input type="text" v-model="netlist[lineIndex][fieldIndex]"
                             style="max-width:4rem;"><br/>
                            </label>
                        </div>   
                        <!--
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
                                <input type="text" id="starttime" v-model="starttime"/>
                                <label for="stoptime">tempo final</label>
                                <input type="text" id="stoptime" v-model="stoptime"/>
                                <label for="maxstep"></label>passo máximo
                                <input type="text" id="maxstep" v-model="maxstep"/>
                            </div>

                            <div class="row">
                                <p> Escolha um componente para obter corrente e tensão <b>ou</b> um nó, para tensão</p>
                                
                                    <label for="selectComponent">componente selecionado</label>
                                    <select class="mb-4" id="selectComponent" v-model="selected">
                                        <option disabled value="">Escolha um item</option>
                                        <option v-for="(component, index) in components" v-bind:key="index">{{component}}</option>
                                    </select>
                                    
                                    <label for="selectComponent">nó selecionado</label>
                                    <select id="selectComponent" v-model="selected">
                                        <option disabled value="0">0</option>
                                        <option v-for="(node, index) in nodes" v-bind:key="index">{{node}}</option>
                                    </select>
    
                            </div>
                        </div>
                        <button v-bind:disabled="simulationProblem != ''" type="button" class="btn btn-primary my-5" 
                        v-on:click="simulationRequest()"> 
                            {{(simulationProblem == '') ? "carregar simulação" : simulationProblem}}
                        </button>
                    </form>
                </div>
            </div>
            <slot></slot>
            <div v-if="simulationLoaded" class="pscard p-3 m-5" style="background-color:#feb">
                <textarea v-if="simulationData.type == 'op'" 
                v-model="simulationData.netlistResponse" rows="8" cols="33">
                </textarea>
                <div v-else>
                    <img v-if="simulationData.voltageImg"
                    v-bind:src="'data:image/jpeg;base64,'+simulationData.voltageImg" class="img-fluid img-thumbnail my-4"/>
                    <img v-if="simulationData.currentImg"
                    v-bind:src="'data:image/jpeg;base64,'+simulationData.currentImg" class="img-fluid img-thumbnail my-4"/>
                </div>
            </div>

            <div v-if="connectionError != ''" class="rounded border-white p-3 m-2 mt-5 text-justify"
            style="background-color:tomato; color:#500">

                <h3> Erro de conexão com a API photospice </h3>
                <p>{{connectionError}}</p>

            </div>
        </div>
        
    </centralizer>
</template>

<style scoped>
.pscard{
    background-color: rgb(203, 255, 238);
    border-radius: 8px;
    max-width: 850px;
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