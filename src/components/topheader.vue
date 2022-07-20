<script setup>
import router from '../router';
const reload = () => {
    if (router.currentRoute.value.name == 'home')
        router.go()
}
</script>

<template>
    <header class="container-fluid justify-content-center" style="background-color: black; color:azure">
        <div class="d-md-flex justify-content-evenly p-3 text-center">
            <h1> 
                <router-link v-on:click="reload()" to="/" class="link">
                PhotoSpice   
                </router-link>
            </h1>
            
            <p class="pt-3"> Circuit analisys on the fly </p>
        </div>
    </header>
    <div class="container-fluid" style="height: 5px; background: linear-gradient(to left, #050,cyan, #3e8);"></div>
</template>

<style>
</style>