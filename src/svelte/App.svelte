<script>
    import { testFunc } from './../helpers';
    import Nested from './components/Nested';
    export let test;
</script>

<div class="app">
    <div class="app-inner">
        {test}
    </div>
    <div class="app-inner2">
        {testFunc()}
    </div>
    <div class="app-inner3">
        <Nested testNested="test2" />
    </div>
</div>

<style lang="scss">
    .app {
        &-inner {
            background-color: red;
        }
    }
</style>