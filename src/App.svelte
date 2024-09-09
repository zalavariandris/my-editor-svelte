<script lang="ts">
	import { marked } from 'marked';
	let source = `Oliver Sacks író és neurológus, a magyar nyelven is elérhető 
_A férfi, aki kalapnak nézte a feleségét_ és az _Antropológus a Marson_ című 
könyveiben pácienseinek különös neurológiai zavaraival foglalkozik.
`
import {example, fetchCSLStyle, fetchReferences, getBibliography, type Citation} from "./bibliography"

example()

</script>

<main>
	<textarea bind:value={source}></textarea>
	<div>
		{@html marked(source)}
	</div>
	<div>
		<h2>Citations</h2>
		<!-- {#await Promise.all([fetchReferences("./ref.bib"), fetchCSLStyle("apa")])}
			<p>...loading</p>
		{:then [references, style]}

		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await} -->
	</div>
	<div id="bibliography">
		<h2>Bibliography</h2>
		{#await Promise.all([fetchReferences("./ref.bib"), fetchCSLStyle("apa")])}
			<p>...loading</p>
		{:then [references, style]}
			{#each getBibliography(references, style)[1] as item}
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
