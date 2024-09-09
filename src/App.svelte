<script lang="ts">
	import { marked } from 'marked';
	let source = `Oliver Sacks író és neurológus, a magyar nyelven is elérhető 
_A férfi, aki kalapnak nézte a feleségét_ és az _Antropológus a Marson_ című 
könyveiben pácienseinek különös neurológiai zavaraival foglalkozik.
`
import {example, fetchReferences, getBibliography} from "./bibliography"

const references = fetchReferences("./ref.bib");

// async function fetchBibliography(){
	
//     console.log("references:", references);
//     const bibliography = getBibliography(references);
//     console.log("bibliography:", bibliography);
// 	return bibliography;
// }


</script>

<main>
	<textarea bind:value={source}></textarea>
	<div>
		{@html marked(source)}
	</div>
	<div id="bibliography">
		<h2>Bibliography</h2>
		{#await fetchReferences("./ref.bib")}
			<p>...loading</p>
		{:then references}
			{#each getBibliography(references)[1] as item}
				{@html item}
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</main>

<style>
	textarea{
		width: 64ch;
		field-sizing: content;
	}
</style>
