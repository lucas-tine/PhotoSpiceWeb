<script setup>
import centralizer from '../components/centralizer.vue';
import router from '../router';
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
                <centralizer class="spinner-border my-5" role="status">
                <span class="visually-hidden">Loading...</span>
                </centralizer>
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
    font-size: 23px;
}
</style>