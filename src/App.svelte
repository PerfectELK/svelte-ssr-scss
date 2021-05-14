<script>
    export let test;
</script>

<div class="app">
    <div class="app-inner">
        {test}
    </div>
</div>

<style lang="scss">
    .app {
        &-inner {
            background-color: red;
        }
    }
</style>