<template>
        <div class="container p-3 mb-4">
            <h2 class="text-center my-2">
                utilize o formulário abaixo para 
                enviar seu esquemático
            </h2>
            <p class="text-justify px-3"> 
                 <br/> Após o upload, basta
                utilizar o botão <emp>analisar</emp>.

                Para um melhor desempenho, tente tirar uma
                foto bem ajustada e enquadrada ao esquemático. 
            </p>
        <slot></slot>
        </div>
</template>

<style scoped>
div{
    background-color: rgb(172, 255, 230);
    border-radius: 8px;
    max-width: 600px;
}
emp{
    font-weight: bold;
}
h2 {
    font-size: 21px;
}
</style>